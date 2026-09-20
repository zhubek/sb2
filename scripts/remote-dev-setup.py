"""Run on the development host after source sync. Preserves existing live services."""
from pathlib import Path
import os
import subprocess

ROOT = Path('/mnt/sb2dev/sb2')
if not ROOT.is_dir():
    raise SystemExit('Development checkout missing')


def env_file(path):
    values = {}
    for line in path.read_text().splitlines():
        if '=' in line and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            values[key] = value.strip().strip('"').strip("'")
    return values


web = env_file(ROOT / '.env.local')
backend_path = ROOT / 'backend/.env'
text = backend_path.read_text()
lines = [line for line in text.splitlines() if not line.startswith('CMS_AUTH_SECRET=')]
lines.append('CMS_AUTH_SECRET=' + web['AUTH_SECRET'])
backend_path.write_text('\n'.join(lines) + '\n')
os.chmod(backend_path, 0o600)

for name, cwd, command, memory in [
    ('api', ROOT / 'backend', '/usr/local/bin/npm run dev', '1024'),
    ('web', ROOT, '/usr/local/bin/npm run dev -- --hostname 0.0.0.0 --port 3025', '1536'),
]:
    unit = f'''[Unit]
Description=SB2 isolated development {name}
RequiresMountsFor=/mnt/sb2dev
After=network.target sb2-dev-db.service
Requires=sb2-dev-db.service
[Service]
Type=simple
User=zhumirov
WorkingDirectory={cwd}
Environment=PATH=/usr/local/bin:/usr/bin:/bin
Environment=NODE_ENV=development
Environment=NODE_OPTIONS=--max-old-space-size={memory}
Environment=NEXT_TELEMETRY_DISABLED=1
Environment=npm_config_cache=/mnt/sb2dev/cache/npm
ExecStart={command}
Restart=on-failure
RestartSec=5
KillMode=control-group
TimeoutStopSec=30
[Install]
WantedBy=multi-user.target
'''
    temp = Path('/mnt/sb2dev/backups') / f'sb2-dev-{name}.service'
    temp.write_text(unit)
    subprocess.run(['sudo', '-n', 'cp', str(temp), f'/etc/systemd/system/sb2-dev-{name}.service'], check=True)
subprocess.run(['sudo', '-n', 'systemctl', 'daemon-reload'], check=True)
subprocess.run(['sudo', '-n', 'systemctl', 'enable', 'sb2-dev-api', 'sb2-dev-web'], check=True)
print('Development units configured; start after migrations and builds pass')
