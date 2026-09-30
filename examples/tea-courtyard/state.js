export const safeId = s => typeof s==='string' && /^[a-z0-9][a-z0-9-]{2,70}$/.test(s);
export const storageKey = id => {if(!safeId(id))throw Error('世界 ID 无效');return `littleWorld.${id}.v1`;};
export const inDecorArea=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&((x>=-5.4&&x<=1.7&&z>=.5&&z<=5)||(x>=-5.5&&x<=-.9&&z>=-4.2&&z<=-1));
export function newState(){return {version:1,night:false,placements:{},memories:[],photos:[]};}
export function normalizeState(raw){
 if(!raw||raw.version!==1||!Array.isArray(raw.memories)||!Array.isArray(raw.photos)||typeof raw.placements!=='object'||raw.placements===null)throw Error('存档格式不正确');
 const s=newState();s.night=raw.night===true;
 for(const [id,p] of Object.entries(raw.placements)){if(!safeId(id)||!p||!inDecorArea(p.x,p.z)||!Number.isFinite(p.rotation)||typeof p.hidden!=='boolean')throw Error('布置数据无效');s.placements[id]={x:p.x,z:p.z,rotation:p.rotation%(Math.PI*2),hidden:p.hidden};}
 if(raw.memories.length>100||raw.photos.length>12)throw Error('存档数量超出上限');
 s.memories=raw.memories.map(m=>{if(!m||typeof m.text!=='string'||m.text.length>240||typeof m.date!=='string'||isNaN(Date.parse(m.date)))throw Error('回忆记录无效');return {text:m.text,date:m.date};});
 s.photos=raw.photos.map(p=>{if(!p||!safeId(p.id)||typeof p.caption!=='string'||p.caption.length>60||typeof p.date!=='string'||isNaN(Date.parse(p.date))||typeof p.image!=='string'||p.image.length>700000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.image))throw Error('照片数据无效');return {id:p.id,caption:p.caption,date:p.date,image:p.image};});return s;
}
export function parseBackup(text,id){const b=JSON.parse(text);if(b.format!=='little-world-backup'||b.worldId!==id)throw Error('这份备份不属于当前世界');return normalizeState(b.state);}
export function openStore(id,storage=localStorage){
 const key=storageKey(id);let state=newState(),warning='',unreadable=null;
 try{const raw=storage.getItem(key);if(raw){unreadable=raw;state=normalizeState(JSON.parse(raw));unreadable=null;}}catch{warning='旧存档暂时无法读取；原数据保留。请先导出或联系 Codex。';}
 return {get state(){return state;},get warning(){return warning;},
 commit(change){if(warning)throw Error(warning);const next=structuredClone(state);change(next);const valid=normalizeState(next);storage.setItem(key,JSON.stringify(valid));state=valid;return state;},
 replace(next){const valid=normalizeState(next);storage.setItem(key,JSON.stringify(valid));state=valid;warning='';unreadable=null;return state;},
 backup(){return JSON.stringify({format:unreadable?'little-world-recovery':'little-world-backup',worldId:id,exportedAt:new Date().toISOString(),...(unreadable?{originalData:unreadable}:{state})},null,2);}
 };
}
export function addMemory(s,text){s.memories.unshift({text:text.slice(0,240),date:new Date().toISOString()});s.memories=s.memories.slice(0,100);}
