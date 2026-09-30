import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolveLanguage,localizeConfig,translate} from '../photo-world-builder/assets/starter/i18n.js';
import {openStore,storageKey} from '../photo-world-builder/assets/starter/state.js';
const presets=JSON.parse(await readFile(new URL('../photo-world-builder/assets/presets.json',import.meta.url)));
test('share link overrides saved/browser preferences, with regional and unknown fallbacks',()=>{
 assert.equal(resolveLanguage('ja','zh','en-US'),'ja');assert.equal(resolveLanguage('xx','zh','en-US'),'zh');assert.equal(resolveLanguage(null,null,'zh-TW'),'zh');assert.equal(resolveLanguage(null,null,'fr-FR'),'en');
});
test('translated displays preserve custom names, IDs, source data and saved placements',()=>{
 const raw=structuredClone(presets.coast);raw.id='world-language-test';raw.name='Mimi の家';delete raw.i18n.en.name;delete raw.i18n.ja.name;
 const source=JSON.stringify(raw);const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 const store=openStore(raw.id,storage);store.commit(s=>s.placements['plant-one']={x:-2,z:2,rotation:0,hidden:false});
 for(const lang of ['zh','en','ja']){const c=localizeConfig(raw,lang);assert.equal(c.name,raw.name);assert.equal(c.id,raw.id);assert.deepEqual(c.decor.map(x=>x.id),raw.decor.map(x=>x.id));assert.equal(storageKey(c.id),storageKey(raw.id));assert.equal(openStore(c.id,storage).state.placements['plant-one'].x,-2);}
 assert.equal(JSON.stringify(raw),source);assert.equal(localizeConfig(raw,'en').menu[0].name,'Vanilla scoop');
});
test('variable translation preserves user text literally without recursive substitution',()=>{
 const caption='Mimi {photos} <3';assert.equal(translate('{name}的纪念照','en',{name:caption}),'A keepsake from '+caption);
});
