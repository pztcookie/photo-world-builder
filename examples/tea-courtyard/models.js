import * as T from 'three';
import {RoundedBoxGeometry} from './vendor/RoundedBoxGeometry.js';
const cache=new Map();
const material=color=>{if(!cache.has(color))cache.set(color,new T.MeshStandardMaterial({color,roughness:.86}));return cache.get(color);};
export function group(parent,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
export function mesh(parent,geo,color,x=0,y=0,z=0){const o=new T.Mesh(geo,typeof color==='string'?material(color):color);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
export function box(p,w,h,d,c,x=0,y=0,z=0,r=.08){return mesh(p,new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)),c,x,y+h/2,z);}
export function ball(p,r,c,x=0,y=0,z=0,sx=1,sy=1,sz=1){const o=mesh(p,new T.SphereGeometry(r,20,14),c,x,y,z);o.scale.set(sx,sy,sz);return o;}
export function cyl(p,rt,rb,h,c,x=0,y=0,z=0,n=24){return mesh(p,new T.CylinderGeometry(rt,rb,h,n),c,x,y+h/2,z);}
function rod(p,a,b,r,c){const v=new T.Vector3(...b).sub(new T.Vector3(...a)),m=mesh(p,new T.CylinderGeometry(r,r,v.length(),10),c);m.position.copy(new T.Vector3(...a).addScaledVector(v,.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
function ring(p,r,t,c,x,y,z){return mesh(p,new T.TorusGeometry(r,t,10,30),c,x,y,z);}
function label(p,text,w,h,x,y,z,bg='#fff4d9',ink='#477c7c'){
 const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*h/w);const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);g.fillStyle=ink;g.textAlign='center';g.textBaseline='middle';let size=Math.min(150,c.height*.65);g.font=`${size}px WorldRound, sans-serif`;while(g.measureText(text).width>940&&size>18){size-=2;g.font=`${size}px WorldRound, sans-serif`;}g.fillText(text,512,c.height/2+3);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return mesh(p,new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tex,roughness:.9}),x,y,z);
}
export function plant(p,color='#91b28a',x=0,y=0,z=0,flower=false){const g=group(p,x,y,z);cyl(g,.21,.16,.35,'#d9a992');cyl(g,.23,.23,.07,'#e4b69f',0,.28);for(let i=0;i<5;i++){const a=i*2.4;rod(g,[0,.3,0],[Math.sin(a)*.2,.65+i*.035,Math.cos(a)*.17],.025,'#709c72');if(flower){const f=group(g,Math.sin(a)*.2,.65+i*.035,Math.cos(a)*.17);ball(f,.075,'#efcf7c');for(let k=0;k<5;k++)ball(f,.085,color,Math.sin(k*1.256)*.105,0,Math.cos(k*1.256)*.105,1,.55,1);}else{const leaf=ball(g,.18,color,Math.sin(a)*.23,.58+i*.05,Math.cos(a)*.19,1,.4,.6);leaf.rotation.z=Math.sin(a)*.6;}}return g;}
function tree(p,x,z,scale=1){const g=group(p,x,.14,z);g.scale.setScalar(scale);cyl(g,.12,.19,1.65,'#bb9477');ball(g,.78,'#93b990',0,2,0,1,1.1,1);ball(g,.64,'#b2cc9c',-.43,1.65,.12);ball(g,.58,'#a1c598',.5,1.78,.1);for(let i=0;i<4;i++)ball(g,.095,'#efb094',Math.sin(i*2)*.64,1.8+Math.cos(i*2)*.4,.55);}
export function buildHome(scene,c){
 const root=group(scene,-3.2,.18,-2.5),w=c.palette.wall,r=c.palette.roof;
 box(root,5.4,.24,4.4,'#d6c0a0',0,0,0);for(let i=0;i<10;i++)box(root,.5,.022,4.05,i%2?'#efddbf':'#f3e3cb',-2.34+i*.52,.25,0);
 box(root,5.4,2.7,.18,w,0,.25,-2.08);box(root,.18,2.7,4.2,w,-2.6,.25,0);box(root,.18,2.7,4.2,w,2.6,.25,0);
 const front=group(root);box(front,1.75,2.7,.18,w,-1.72,.25,2.08);box(front,2,2.7,.18,w,1.6,.25,2.08);box(front,1.15,.48,.18,w,-.25,2.47,2.08);
 const door=box(front,.97,2.05,.13,r,-.25,.27,2.19);box(front,.7,.75,.04,'#d8eaf0',-.25,1.45,2.28);ball(front,.055,'#d3a760',.08,1.12,2.29);
 for(const x of [-1.8,1.65]){box(front,1.14,1.08,.12,'#fff9e9',x,1.23,2.23);box(front,.92,.9,.04,'#a8ced7',x,1.32,2.31);box(front,.07,.95,.055,'#fff9e9',x,1.29,2.35);box(front,1,.06,.055,'#fff9e9',x,1.73,2.35);box(front,1.24,.18,.36,'#dcad92',x,1.08,2.31);for(let n=-1;n<=1;n++)ball(front,.19,'#96b88b',x+n*.29,1.27,2.4,1,.6,1);}
 const roof=group(root,0,3,0);for(const s of [-1,1]){const plate=box(roof,3.15,.19,4.9,r,s*1.37,.4,0);plate.rotation.z=-s*.37;for(let j=0;j<12;j++){const tile=box(roof,.08,.04,4.86,'#a6cbd1',s*(.08+j*.248),1.02-j*.09,0);tile.rotation.z=-s*.37;}}
 box(roof,.17,.13,5,'#e7e6ce',0,1.13,0);box(roof,.56,.95,.6,'#edc7ac',1.62,.57,-.8);box(roof,.68,.13,.72,'#fff0d4',1.62,1.52,-.8);
 label(front,c.house.name,1.9,.28,-.25,2.7,2.21);
 box(root,2.2,.13,1,'#e5ccac',-.2,.02,2.75);box(root,2.6,.09,.38,'#dfc8a7',-.2,-.03,3.25);
 // Living room stays usable when the roof and front wall open.
 box(root,2.4,.43,.85,c.palette.accent,-1,.25,-1.25);box(root,2.4,.75,.23,c.palette.accent,-1,.42,-1.67);for(const x of [-2.1,.1])box(root,.25,.66,.95,c.palette.accent,x,.25,-1.25);
 for(const x of [-1.55,-.55])box(root,.68,.24,.58,'#fff0d3',x,.66,-1.17);
 box(root,1.7,.02,1.35,'#bbcec4',-1,.28,.05);cyl(root,.62,.62,.1,'#f1d8b5',-1,.75,.1);cyl(root,.075,.1,.44,'#c8aa86',-1,.3,.1);plant(root,'#9fc091',-.94,.85,.1);
 box(root,.88,.95,2.2,'#adbfab',1.8,.25,-.85);box(root,.99,.1,2.3,'#fff0d6',1.8,1.2,-.85);box(root,.5,.04,.55,'#a2b9b4',1.8,1.3,-1.3);cyl(root,.14,.14,.2,'#f2cd9b',1.8,1.32,-.35);
 label(root,'Home, sweet little home',2,.58,-.7,2.13,-1.969,'#faf3df','#789a87');plant(root,'#8eae83',-2.1,.25,.75);
 root.userData.hit='home';return {root,roof,front,door};
}
function icecream(p,color,x,y,z,scale=1){const g=group(p,x,y,z);g.scale.setScalar(scale);cyl(g,.15,.035,.4,'#e9bc77');ball(g,.205,color,0,.51,0);ball(g,.17,color,0,.67,0);ball(g,.12,color,.025,.8,0);return g;}
export function buildShop(scene,c){
 const root=group(scene,3.6,.18,-2.7),col=c.shop.color;box(root,3.8,.18,3,'#e6cfad');box(root,3.45,2.5,2.5,col,0,.18,0);box(root,3.1,1.25,.05,'#436e72',0,.78,1.28);box(root,3.12,.13,.65,'#fff0d1',0,.73,1.57);for(const x of [-1.6,1.6])box(root,.12,1.3,.08,'#fff4dd',x,.78,1.32);
 for(let i=0;i<10;i++){const a=box(root,.37,.11,.95,i%2?col:'#fff3d7',-1.665+i*.37,2.14,1.48);a.rotation.x=.18;box(root,.37,.26,.08,i%2?col:'#fff3d7',-1.665+i*.37,1.88,1.97);}
 label(root,c.shop.name,2.9,.47,0,2.61,1.29);box(root,3.9,.18,2.95,c.palette.roof,0,2.87,0);box(root,4.03,.08,3.07,'#e6dfbd',0,2.81,0);
 if(c.shop.kind==='icecream'){
  // Reference anchors: blue frontage, golden sunburst and oversized soft-serve.
  const sun=group(root,0,3.02,.35);ball(sun,.43,'#f4d07e',0,.48,0,1,1,.3);for(let i=0;i<7;i++){const a=i*Math.PI/6,ray=box(sun,.12,.43,.15,'#f4d07e',Math.cos(a)*.72,.48+Math.sin(a)*.7,0);ray.rotation.z=a-Math.PI/2;}
  cyl(root,.32,.37,.18,'#fff1d6',2.04,0,1.02);icecream(root,'#fff3df',2.04,.16,1.02,1.65);for(let i=0;i<3;i++)icecream(root,c.menu[i%c.menu.length].color,-.8+i*.8,.9,1.55,.45);
 }else if(c.shop.kind==='tea'){
  for(const x of [-1.7,1.7]){rod(root,[x,2.83,1.13],[x,2.18,1.13],.018,'#835e4a');ball(root,.27,'#e4a68a',x,2.2,1.13,1,1.2,1);cyl(root,.11,.11,.07,'#f2d695',x,1.85,1.13);rod(root,[x,1.9,1.13],[x,1.63,1.13],.028,'#d49177');}
  for(const x of [-1,0,1]){cyl(root,.21,.22,.09,'#fff3db',x,.91,1.5);box(root,.24,.13,.24,c.menu[(x+1)%c.menu.length].color,x,1,1.5);}
 }else{for(let i=0;i<3;i++){cyl(root,.3,.3,.07,'#fff1d8',-.9+i*.9,.9,1.5);ball(root,.19,c.menu[i%c.menu.length].color,-.9+i*.9,1.13,1.5,1,.6,.85);}plant(root,'#d8a2bc',-1.7,3.07,0,true);plant(root,'#e8bd91',1.7,3.07,0,true);}
 root.userData.hit='shop';plant(root,'#9ebc8e',2.07,0,.9);return root;
}
export function buildTable(scene,c){const root=group(scene,3.5,.18,2.35);cyl(root,1.05,1.05,.12,'#edd8b7',0,.82);cyl(root,.12,.21,.84,'#b99577');const seats=[[-1.22,.12],[.48,-1.16],[1.06,.68]];for(const [x,z]of seats){cyl(root,.36,.34,.16,c.palette.accent,x,.33,z);cyl(root,.08,.1,.32,'#b89778',x,.02,z);}const snacks=group(root,0,.94,0);root.userData.hit='table';return {root,snacks,seats};}
export function setTableFood(table,c,menu){table.snacks.traverse(o=>{if(o.isMesh)o.geometry.dispose();});table.snacks.clear();for(let i=0;i<3;i++){const x=(i-1)*.53;cyl(table.snacks,.23,.25,.04,'#fff5e4',x,.01,0);if(c.shop.kind==='icecream')icecream(table.snacks,menu.color,x,.05,0,.5);else {box(table.snacks,.3,.14,.3,menu.color,x,.06,0);for(let j=0;j<3;j++)ball(table.snacks,.018,'#cfa55d',x+(j-1)*.07,.22,.04);}}}
export function heldFood(friend,kind,color){
 const g=group(friend.arms[1],0,-.15,.06);
 if(kind==='icecream')icecream(g,color,0,0,0,.32);
 else box(g,.15,.1,.15,color,0,0,0);
 g.visible=false;return g;
}
export function makeFriend(scene,d){const root=group(scene),body=group(root),fur=d.color;ball(body,.28,fur,0,.55,0,1,1.25,.8);ball(body,.32,fur,0,1,0);if(d.kind==='bunny'){for(const s of [-1,1]){ball(body,.115,fur,s*.16,1.4,0,.8,2.5,.75);ball(body,.065,'#e5b6b0',s*.16,1.42,.079,.75,2.8,.22);}}else if(d.kind==='cat'){for(const s of [-1,1]){const ear=mesh(body,new T.ConeGeometry(.16,.28,3),fur,s*.23,1.24,0);ear.rotation.y=Math.PI/6;}}else for(const s of [-1,1])ball(body,.13,fur,s*.26,1.22,0);
 for(const s of [-1,1]){ball(body,.035,'#463b35',s*.11,1.02,.289,.85,1.1,.55);ball(body,.044,'#e3ada7',s*.2,.927,.27,1,.45,.35);}ball(body,.03,'#9b7664',0,.927,.316,1,.65,.7);const smile=ring(body,.043,.009,'#89614f',0,.893,.31);smile.scale.y=.5;
 box(body,.47,.28,.43,'#f6e6c5',0,.5,.007,.09);const arms=[-1,1].map(s=>{const a=group(body,s*.27,.71,0);ball(a,.1,fur,0,-.14,0,.85,1.8,.9);return a;});const legs=[-1,1].map(s=>ball(root,.115,fur,s*.14,.16,.02,1,.65,1.5));
 const held=group(arms[1],0,-.19,.05);cyl(held,.09,.075,.16,'#fff2d6',0,0);ring(held,.047,.018,'#fff2d6',.1,.085,0);held.visible=false;
 return {root,body,arms,legs,held,def:d};}
export function makeDecor(scene,d){const g=group(scene);if(d.kind==='plant'||d.kind==='flower')plant(g,d.color,0,0,0,d.kind==='flower');else if(d.kind==='cushion'){box(g,.7,.19,.65,d.color,0,0,0,.09);ball(g,.033,'#f5e9d3',0,.202,0,1,.3,1);}else {box(g,.53,.08,.42,d.color);box(g,.46,.055,.39,'#fff0d5',.017,.015,.01);box(g,.53,.02,.43,d.color,0,.07,0);}g.userData.decor=d.id;return g;}
export function buildEnvironment(scene,c){
 const base=group(scene);box(base,15,.62,12,'#d8c7a4',0,-.62,0,.2);box(base,14.8,.14,11.8,c.palette.ground,0,-.05,0,.15);
 const sea=mesh(scene,new T.CircleGeometry(95,100),c.environment==='coast'?'#accfd4':'#dbe1cd',0,-.63);sea.rotation.x=-Math.PI/2;
 for(let i=0;i<9;i++){const stone=box(base,.86,.055,.6,'#ebe5cf',.07+Math.sin(i*1.6)*.2,.08,-4.1+i*1.03);stone.rotation.y=Math.sin(i*3)*.17;}
 for(let i=0;i<6;i++)box(base,.78,.045,.66,'#e8dec5',.95+i*.83,.09,.62+Math.sin(i)*.13);
 for(const [x,z,s]of [[-6.2,-4.3,1.1],[6.2,-4.3,.9],[-6.3,2.8,.85],[6.2,3.8,.7],[-.1,-5,.82]])tree(base,x,z,s);
 for(let i=0;i<18;i++){const x=-6.4+(i%6)*2.52,z=i<6?5.3:i<12?-5.3:4.55;for(let k=0;k<3;k++)ball(base,.10,['#f3d590','#edb3aa','#f9edd2'][k],x+(k-1)*.14,.17,z+Math.sin(i)*.14,1,.4,1);}
 for(let i=0;i<9;i++){box(base,.1,.67,.11,'#f7e9cb',-6.6+i*.75,.05,5.48);box(base,.68,.09,.09,'#f7e9cb',-6.26+i*.75,.23,5.48);box(base,.68,.09,.09,'#f7e9cb',-6.26+i*.75,.53,5.48);}
 const clouds=[];for(const[x,y,z]of [[-8,7,-9],[6,8,-12],[11,5,-3]]){const g=group(scene,x,y,z);for(let j=0;j<3;j++)ball(g,.65,'#fffbef',(j-1)*.65,Math.sin(j)*.22,0,1.3,.72,.6).castShadow=false;clouds.push(g);}
 if(c.environment==='tea'){for(const x of [1.1,6.4])cyl(base,.055,.065,3,'#a98969',x,.05,1.1);rod(base,[1.1,3,1.1],[6.4,3,1.1],.016,'#94785f');for(let i=0;i<5;i++){const x=1.5+i*1.12;ball(base,.19,'#e5ad8a',x,2.77,1.1,1,1.15,1);rod(base,[x,2.6,1.1],[x,2.4,1.1],.02,'#d39778');}}
 return {clouds,sea};
}
