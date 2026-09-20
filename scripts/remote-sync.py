"""One-way source sync. Runtime data and environment files never leave their host."""
import argparse
import hashlib
import io
import json
import pathlib
import subprocess
import tarfile
import time

ROOT = pathlib.Path(__file__).resolve().parents[1]
HOST = "zhumirov@136.112.254.16"
DEST = "/mnt/sb2dev/sb2"
STATE = ROOT / ".data/remote-dev/sync-state.json"
FILE_CACHE = {}


def command(args, **kwargs):
    return subprocess.run(args, cwd=ROOT, check=True, **kwargs)


def source_files():
    raw = command(["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"], capture_output=True).stdout
    result = {}
    for name in set(raw.decode().split("\0")):
        p = pathlib.PurePosixPath(name)
        if not name or any((part.startswith(".env") and part != ".env.example") or part in {".git", ".data", "node_modules", "generated", "dist", "ref", ".local-postgres"} or part.startswith(".next") for part in p.parts):
            continue
        local = ROOT / name
        if local.is_file():
            stamp = (local.stat().st_mtime_ns, local.stat().st_size)
            cached = FILE_CACHE.get(name)
            if not cached or cached[0] != stamp:
                cached = (stamp, hashlib.sha256(local.read_bytes()).hexdigest())
                FILE_CACHE[name] = cached
            result[name] = cached[1]
    return result


def sync():
    current = source_files()
    old = json.loads(STATE.read_text()) if STATE.exists() else {}
    changed = [name for name, digest in current.items() if old.get(name) != digest]
    removed = [name for name in old if name not in current]
    if not changed and not removed:
        return
    archive = io.BytesIO()
    with tarfile.open(fileobj=archive, mode="w:gz") as tar:
        for name in changed:
            tar.add(ROOT / name, arcname=name, recursive=False)
    # The receiving script checks every path and hash before overwriting/deleting.
    plan = {"expected": {name: old[name] for name in changed + removed if name in old}, "removed": removed}
    STATE.parent.mkdir(parents=True, exist_ok=True)
    (STATE.parent / "sync-plan.json").write_text(json.dumps(plan))
    command(["scp", "-q", str(STATE.parent / "sync-plan.json"), HOST + ":/mnt/sb2dev/backups/sync-plan.json"])
    receiver = r'''
import hashlib,io,json,pathlib,sys,tarfile
root=pathlib.Path('/mnt/sb2dev/sb2').resolve()
plan=json.loads(pathlib.Path('/mnt/sb2dev/backups/sync-plan.json').read_text())
data=sys.stdin.buffer.read()
with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as tar:
    members=tar.getmembers()
    incoming={m.name:tar.extractfile(m).read() for m in members if m.isfile()}
    for name in list(incoming)+plan['removed']:
        target=(root/name).resolve()
        if not target.is_relative_to(root) or any((p.startswith('.env') and p != '.env.example') or p in {'.git','.data','node_modules','generated','dist','.local-postgres'} for p in pathlib.PurePosixPath(name).parts):
            raise RuntimeError('Unsafe sync path: '+name)
        expected=plan['expected'].get(name)
        if expected and target.exists():
            actual=hashlib.sha256(target.read_bytes()).hexdigest()
            same= name in incoming and actual==hashlib.sha256(incoming[name]).hexdigest()
            if actual!=expected and not same: raise RuntimeError('Remote file changed; reconcile first: '+name)
    for name,content in incoming.items():
        target=root/name
        target.parent.mkdir(parents=True,exist_ok=True)
        temporary=target.with_name(target.name+'.sync-tmp')
        temporary.write_bytes(content)
        temporary.replace(target)
    for name in plan['removed']:
        target=root/name
        if target.is_file(): target.unlink()
print('Synced %s files; removed %s source files' % (len(incoming),len(plan['removed'])))
'''
    receiver_path = STATE.parent / "receive.py"
    receiver_path.write_text(receiver, encoding="utf-8")
    command(["scp", "-q", str(receiver_path), HOST + ":/mnt/sb2dev/backups/receive.py"])
    command(["ssh", "-o", "BatchMode=yes", HOST, "python3 /mnt/sb2dev/backups/receive.py"], input=archive.getvalue())
    STATE.write_text(json.dumps(current, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--watch", action="store_true")
    options = parser.parse_args()
    while True:
        try:
            sync()
        except (subprocess.CalledProcessError, OSError) as error:
            print("Sync failed; no state advanced:", error, flush=True)
            if not options.watch:
                raise
        if not options.watch:
            break
        time.sleep(3)
