import {content} from './guide-content.js';
import {lang,localeTag,changeLanguage} from './photo-world-builder/assets/starter/i18n.js';
const d=content[lang], $=s=>document.querySelector(s);
document.documentElement.lang=localeTag[lang];document.title=d.title;$('#brand').textContent=d.brand;$('#version').textContent=d.version;$('#language').value=lang;$('#language').onchange=e=>changeLanguage(e.target.value);
const paths=['seaside','tea-courtyard','flower-garden'], symbols=['☀','♧','✿'];
const demo=(i)=>`examples/${paths[i]}/?lang=${lang}`;
// All markup below comes from the maintained translation file; user inputs are never interpolated here.
$('#content').innerHTML=`<section class="hero"><div><p class="eyebrow">LITTLE PLACES, PERSONAL STORIES</p><h1>${d.hero}</h1><p class="intro">${d.intro}</p><div class="cta"><a class="button" href="#start">${d.start}</a><a class="button secondary" href="${demo(0)}">${d.play}</a></div><p class="small">${d.how}</p></div><a class="photo" href="${demo(0)}"><img src="preview/seaside-memory.jpg" alt="${d.alt}"><small>${d.caption}</small></a></section>
<section id="start" class="section"><p class="eyebrow">YOUR FIRST LITTLE WORLD</p><h2>${d.first}</h2><div class="steps">${d.steps.map((s,i)=>`<div><div class="number">0${i+1}</div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div><div class="prompt"><p><strong>${d.upload}</strong>${d.then}</p><blockquote id="prompt">${d.prompt}</blockquote><p>${d.easy}</p><button id="copy">${d.copy}</button><div id="copied" class="status" role="status"></div><p class="small">${d.uploadNote}</p></div><h3>${d.installTitle}</h3><p class="small">${d.install}</p><div class="downloads"><a class="button" href="photo-world-builder.zip" download>${d.download}</a><a class="button secondary" href="https://github.com/pztcookie/photo-world-builder">${d.repo} ↗</a></div><p class="note">${d.note}</p></section>
<section class="section"><p class="eyebrow">TRY THE STARTERS</p><h2>${d.examplesTitle}</h2><div class="examples">${d.examples.map((e,i)=>`<a class="example" href="${demo(i)}"><span class="symbol">${symbols[i]}</span><b>${e[0]}</b><p>${e[1]}</p><span>${d.enter}</span></a>`).join('')}</div><p class="small">${d.exampleNote}</p></section>
<section class="section"><h2>${d.tour}</h2><table><thead><tr>${d.th.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${d.actions.map(a=>`<tr><td>${a[0]}</td><td>${a[1]}</td></tr>`).join('')}</tbody></table></section>
<section class="section"><h2>${d.grow}</h2><p class="small">${d.growText}</p><div class="prompt"><pre id="continue"></pre></div></section>
<section class="section"><h2>${d.faqTitle}</h2>${d.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</section>`;
$('#continue').textContent=d.continuePrompt;$('#footer').textContent=d.footer;
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(d.prompt);$('#copied').textContent=d.copied;}catch{$('#copied').textContent=d.copyFail;}};
// The initial hash is resolved again after translated content has been inserted.
if(location.hash==='#start')requestAnimationFrame(()=>$('#start').scrollIntoView());
