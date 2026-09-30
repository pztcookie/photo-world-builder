#!/usr/bin/env python3
"""Copy the offline starter; interpreting photographs is a separate agent step."""
import argparse,copy,json,shutil,uuid
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def create_world(output,name,preset='coast',photos=()):
    output=Path(output).expanduser().resolve()
    if output.exists():raise ValueError('目标已存在，不会覆盖。继续编辑已有世界或选择新目录。')
    if not name.strip() or len(name)>60:raise ValueError('名称需 1–60 字。')
    sources=[Path(p).expanduser().resolve() for p in photos]
    for p in sources:
        if not p.is_file() or p.suffix.lower() not in {'.jpg','.jpeg','.png','.webp'}:raise ValueError(f'请提供存在的 JPG/PNG/WebP：{p}')
    config=copy.deepcopy(json.loads((ROOT/'assets/presets.json').read_text())[preset])
    for values in config.get('i18n',{}).values():values.pop('name',None)
    config.update(id='world-'+uuid.uuid4().hex[:16],name=name.strip())
    shutil.copytree(ROOT/'assets/starter',output)
    (output/'world.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
    (output/'references').mkdir(exist_ok=True);refs=[]
    for n,p in enumerate(sources,1):
        filename=f'ref-{n:02d}{p.suffix.lower()}';shutil.copy2(p,output/'references'/filename)
        refs.append(dict(id=f'ref-{n:02d}',file=f'references/{filename}',status='pending-review',observed=[],preserve=[],mappedTo=[],inferred=[],userMeaning=''))
    (output/'references.json').write_text(json.dumps({'schemaVersion':1,'items':refs},ensure_ascii=False,indent=2)+'\n')
    (output/'WORLD.md').write_text(f'# {name}\n\n模板起点：{preset}。照片待助手查看并转化，初始化不代表照片已经变成3D。\n\n世界ID：{config["id"]}（扩建与改名保持不变）。\n\n接下来查看 references.json 和实际照片，完成建模、互动及浏览器验证。\n')
    print(str(output));return output
if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--output',required=True);ap.add_argument('--name',required=True);ap.add_argument('--preset',choices=['coast','tea','garden'],default='coast');ap.add_argument('--photos',nargs='*',default=[]);a=ap.parse_args()
    try:create_world(a.output,a.name,a.preset,a.photos)
    except (ValueError,OSError) as e:ap.exit(1,str(e)+'\n')
