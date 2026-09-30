#!/usr/bin/env python3
"""Validate the portable world's content contract, references and dependencies."""
import argparse,json,math,re
from pathlib import Path
ID=re.compile(r'^[a-z0-9][a-z0-9-]{2,70}$');COLOR=re.compile(r'^#[0-9a-fA-F]{6}$')
def validate(root):
    root=Path(root).resolve();errors=[];warnings=[]
    for f in ['index.html','style.css','world.js','models.js','state.js','i18n.js','world.json','references.json','vendor/three.module.js','vendor/OrbitControls.js','vendor/RoundedBoxGeometry.js','vendor/THREE-LICENSE.txt','vendor/Chewy-Regular.ttf','vendor/Chewy-LICENSE.txt']:
        if not (root/f).is_file():errors.append('缺少 '+f)
    try:c=json.loads((root/'world.json').read_text())
    except (OSError,ValueError) as e:return [str(e)],warnings
    if c.get('schemaVersion')!=1:errors.append('schemaVersion 必须为1')
    if not ID.fullmatch(str(c.get('id',''))):errors.append('world.id 无效')
    if not isinstance(c.get('name'),str) or not 1<=len(c['name'])<=60:errors.append('名称需1–60字')
    if c.get('environment') not in ['coast','tea','garden']:errors.append('environment 无效')
    for key in ['sky','ground','wall','roof','accent']:
        if not COLOR.fullmatch(str(c.get('palette',{}).get(key,''))):errors.append('palette.'+key+' 无效')
    if c.get('shop',{}).get('kind') not in ['icecream','tea','bakery']:errors.append('shop.kind 无效')
    for key in ['house','shop']:
        if not isinstance(c.get(key,{}).get('name'),str) or not c[key]['name']:errors.append(key+'.name 缺少')
    if not COLOR.fullmatch(str(c.get('shop',{}).get('color',''))):errors.append('shop.color 无效')
    for key,maximum,kinds in [('characters',3,['bunny','bear','cat']),('menu',6,None),('decor',16,['plant','flower','cushion','book'])]:
        values=c.get(key)
        if not isinstance(values,list) or not (0 if key=='decor' else 1)<=len(values)<=maximum:errors.append(key+' 数量不正确');continue
        ids=set()
        for item in values:
            if not isinstance(item,dict):errors.append(key+' 非对象');continue
            ident=item.get('id','')
            if not isinstance(ident,str) or not ID.fullmatch(ident) or ident in ids:errors.append(key+' ID无效或重复');continue
            ids.add(ident)
            if not isinstance(item.get('name'),str) or not item['name']:errors.append(ident+' 缺少名称')
            if not COLOR.fullmatch(str(item.get('color',''))):errors.append(ident+' 颜色无效')
            if kinds and item.get('kind') not in kinds:errors.append(ident+' kind 无效')
            if key=='decor':
                x,z=item.get('x'),item.get('z')
                if not all(type(v) in (int,float) and math.isfinite(v) for v in [x,z]):errors.append(ident+' 位置无效')
                elif not ((-5.4<=x<=1.7 and .5<=z<=5)or(-5.5<=x<=-.9 and -4.2<=z<=-1)):errors.append(ident+' 超出布置区')
    try:
        refs=json.loads((root/'references.json').read_text())
        if refs.get('schemaVersion')!=1 or not isinstance(refs.get('items'),list):raise ValueError('references.json 格式无效')
        for r in refs['items']:
            f=r.get('file','');target=(root/f).resolve()
            if not re.fullmatch(r'references/[a-zA-Z0-9._-]+',f) or root not in target.parents or not target.is_file():errors.append('参考图片不存在或路径无效：'+f)
            if r.get('status')!='reviewed':warnings.append(f+' 待实际查看与定制')
            elif not all(isinstance(r.get(k),list) and r[k] for k in ['observed','preserve','mappedTo','inferred']):errors.append(f+' 审阅记录不完整')
    except (OSError,ValueError,TypeError,AttributeError) as e:errors.append(str(e))
    for src in root.glob('*.js'):
        for dep in re.findall(r"from\s+['\"](\./[^'\"]+)['\"]",src.read_text()):
            if not (root/dep).is_file():errors.append(src.name+' 缺少导入 '+dep)
    return errors,warnings
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('directory');a=p.parse_args();errors,warnings=validate(a.directory)
    for w in warnings:print('WARNING:',w)
    for e in errors:print('ERROR:',e)
    print('VALID' if not errors else 'INVALID');raise SystemExit(bool(errors))
