"""Build the CMS usage index from frontend source imports and content calls."""
import json, pathlib, re
root = pathlib.Path(__file__).resolve().parents[1]
files = {p.relative_to(root).as_posix(): p.read_text(encoding='utf-8') for folder in ('app', 'components', 'lib') for p in (root/folder).rglob('*') if p.suffix in ('.tsx', '.ts') and '/admin/' not in p.as_posix() and '/api/' not in p.as_posix()}
graph = {}; refs = {}
for name, text in files.items():
    imports=[]
    text=re.sub(r"import\s+type\s+[\s\S]*?;", "", text)
    for dep in re.findall(r'(?:from\s*|import\s*)[\"\']([^\"\']+)[\"\']', text):
        path=root/dep[2:] if dep.startswith('@/') else (root/name).parent/dep if dep.startswith('.') else None
        if path:
            for candidate in (path,path.with_suffix('.tsx'),path.with_suffix('.ts'),path/'index.tsx',path/'index.ts'):
                try: key=candidate.resolve().relative_to(root).as_posix()
                except ValueError: continue
                if key in files: imports.append(key);break
    graph[name]=imports
    ids=set(re.findall(r'(?:useContent|getContent|useCopy|getCopy)\s*\(\s*[\"\']([^\"\']+)[\"\']',text))
    ids.update(x.rsplit('.',1)[0] for x in re.findall(r'<ContentText\s+id=[\"\']([^\"\']+)',text))
    refs[name]=ids
def route(name):
    path=re.sub(r'/\([^/]+\)', '', '/'+name[4:-9]).rstrip('/') or '/'
    special={'/teacher/analytics/student/[id]':'/teacher/analytics/student/st1','/teacher/analytics/class/[id]':'/teacher/analytics/class/9a','/teacher/handbook/[id]':'/teacher/handbook/0','/verify/[id]':'/verify/PRF-PREVIEW','/universities/[id]':'/universities/0','/universities/industry/[id]':'/universities/industry/0','/universities/gop/[code]':'/universities/gop/B001','/universities/college/[code]':'/universities/college/01120100','/universities/program/[id]':'/universities/program/program.0.0'}
    return special.get(path,path)
index={}
for name in files:
    if not name.startswith('app/') or not name.endswith('/page.tsx'): continue
    path=route(name)
    if '[' in path or path.startswith(('/admin','/api','/design')): continue
    seen=set(); pending=[name]
    parent=(root/name).parent
    while parent!=root:
        layout=(parent/'layout.tsx').relative_to(root).as_posix()
        if layout in files:pending.append(layout)
        parent=parent.parent
    while pending:
        current=pending.pop()
        if current in seen: continue
        seen.add(current);pending.extend(graph.get(current,[]))
        for ident in refs.get(current,[]):
            index.setdefault(ident,set()).add(path)
# Preserve metadata for standalone copy/inline components too.
for filename,field in [('copy-defaults.json','values'),('inline-defaults.json','value')]:
    for ident,meta in json.loads((root/'lib/cms'/filename).read_text(encoding='utf-8')).items():
        if meta['file'].startswith('app/'):
            original=meta['file']; page=original if original.endswith('/page.tsx') else original.rsplit('/',1)[0]+'/page.tsx'
            path=route(page)
            if '[' not in path:index.setdefault(ident,set()).add(path)
result={key:sorted(paths,key=lambda x:(x.count('/'),len(x),x)) for key,paths in sorted(index.items())}
(root/'lib/cms/usage-index.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Indexed content references:',len(result))
