'use strict';
const $ = id => document.getElementById(id);
const PALETTES = [
  {name:'Zanzibar',colors:['#a72931','#f4d486','#fff2d3','#542330']},
  {name:'Ocean',colors:['#143f55','#83c6bd','#f3ecd5','#092a37']},
  {name:'Marigold',colors:['#db8d28','#493b66','#fff0c8','#50334e']},
  {name:'Forest',colors:['#31584b','#b8c888','#f2edd6','#1b3832']},
  {name:'Rose',colors:['#bc697d','#6c2540','#f9e2d5','#462537']}
];
const MOTIFS = [{id:'botanical',name:'Botanical'},{id:'rosette',name:'Rosette'},{id:'paisley',name:'Paisley'},{id:'geometric',name:'Geometric'},{id:'sunflower',name:'Sunflower'},{id:'waves',name:'Waves'}];
const SAYINGS = [
  {text:'PENYE UPENDO PANA AMANI',translation:'Where there is love, there is peace.'},
  {text:'HABA NA HABA HUJAZA KIBABA',translation:'Little by little fills the measure.'},
  {text:'UMOJA NI NGUVU',translation:'Unity is strength.'},
  {text:'SUBIRA HUVUTA HERI',translation:'Patience brings blessings.'},
  {text:'MOYO WANGU UNA FURAHA',translation:'My heart is full of joy.'},
  {text:'KILA SIKU NI MWANZO MPYA',translation:'Every day is a new beginning.'}
];
const DEFAULT = {motif:'botanical',palette:0,colors:[...PALETTES[0].colors],scale:106,border:'diamond',borderSize:65,phrase:SAYINGS[0].text,showPhrase:true,seed:1};
let state = structuredClone(DEFAULT), serial = 0, number = 1;
const STORE = 'kanga-studio-designs-v1';
const escapeXML = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const flower = (c1,c2,petals=8,radius=28) => {
  let s='';
  for(let i=0;i<petals;i++) s+=`<ellipse cx="0" cy="-${radius*.7}" rx="${radius*.25}" ry="${radius*.6}" fill="${c1}" stroke="${c2}" stroke-width="1.2" transform="rotate(${i*360/petals})"/>`;
  return s+`<circle r="${radius*.3}" fill="${c2}"/><circle r="${radius*.13}" fill="${c1}"/>`;
};
function motifMarkup(type,c,variant=0){
  const [,gold,cream,dark]=c;let s='';
  if(type==='botanical'){
    s+=`<path d="M-37 38Q-12 7 0 0Q26-12 37-38M-40-29Q-16-20-4-5M7 10Q23 27 38 29" fill="none" stroke="${gold}" stroke-width="1.8"/>`;
    [[-22,20,-42],[20,-21,136],[-25,-19,-85],[22,23,80]].forEach(([x,y,r])=>{s+=`<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0Q-18-23 0-31Q18-23 0 0" fill="${gold}"/><path d="M0-3V-28" stroke="${dark}" stroke-width="1"/></g>`;});
    s+=flower(cream,gold,8,24);
    s+=`<circle r="4" fill="${dark}"/><g transform="translate(-35 -30)">${flower(gold,cream,5,9)}</g><g transform="translate(38 29)">${flower(gold,cream,5,9)}</g>`;
    for(let i=0;i<4;i++)s+=`<circle cx="${[-39,34,-12,14][i]}" cy="${[-5,8,-39,39][i]}" r="1.4" fill="${cream}"/>`;
  }else if(type==='rosette'){
    for(let i=0;i<12;i++)s+=`<path d="M0-7Q-19-21-8-36Q-1-48 0-48Q1-48 8-36Q19-21 0-7Z" fill="${i%2?gold:cream}" stroke="${dark}" stroke-width="1" transform="rotate(${i*30})"/>`;
    s+=`<circle r="19" fill="${dark}"/>`+flower(gold,cream,8,15)+`<circle r="3" fill="${dark}"/>`;
    for(let i=0;i<12;i++)s+=`<circle cx="0" cy="-41" r="1.5" fill="${dark}" transform="rotate(${i*30})"/>`;
  }else if(type==='paisley'){
    s+=`<path d="M-13 36C-57 9-28-25 0-20Q29-14 24-45Q52-8 33 22Q15 55-13 36Z" fill="${gold}" stroke="${cream}" stroke-width="2"/><path d="M-11 28C-43 7-22-17 0-12Q22-7 28-23Q39 1 24 22Q9 43-11 28Z" fill="${dark}"/><g transform="translate(1 9)">${flower(cream,gold,8,16)}</g><path d="M-13 23Q-29 3-12-4M18 24Q30 11 27 0" stroke="${cream}" stroke-width="1.5" fill="none"/>`;
    for(let i=0;i<8;i++)s+=`<circle cx="${-23+i*6}" cy="${32+Math.sin(i*.5)*6}" r="1.4" fill="${cream}"/>`;
    s+=`<circle cx="-37" cy="-35" r="4" fill="${cream}"/><circle cx="40" cy="40" r="2" fill="${gold}"/>`;
  }else if(type==='geometric'){
    s+=`<path d="M0-48 48 0 0 48-48 0Z" fill="none" stroke="${cream}" stroke-width="2"/><path d="m0-38 38 38L0 38-38 0Z" fill="${gold}"/><path d="M0-28 7-7 28 0 7 7 0 28-7 7-28 0-7-7Z" fill="${dark}"/><path d="M0-16 16 0 0 16-16 0Z" fill="${cream}"/><circle r="4" fill="${dark}"/>`;
    for(let i=0;i<4;i++)s+=`<path d="M-4-45 0-40 4-45 0-50Z" fill="${gold}" transform="rotate(${90*i})"/>`;
  }else if(type==='sunflower'){
    for(let i=0;i<16;i++)s+=`<path d="M0-12Q-14-26 0-46Q14-26 0-12" fill="${i%2?gold:cream}" transform="rotate(${i*22.5})"/><path d="M0-20V-36" stroke="${dark}" stroke-width=".8" transform="rotate(${i*22.5})"/>`;
    s+=`<circle r="18" fill="${dark}"/><circle r="14" fill="none" stroke="${gold}" stroke-width="1.5"/>`;
    for(let i=0;i<12;i++)s+=`<circle cx="${Math.cos(i*2.4)*Math.sqrt(i)*3.3}" cy="${Math.sin(i*2.4)*Math.sqrt(i)*3.3}" r="1.6" fill="${cream}"/>`;
  }else{
    for(let i=0;i<5;i++)s+=`<path d="M-49 ${-42+i*20}Q-25 ${-67+i*20}0 ${-42+i*20}T49 ${-42+i*20}" stroke="${i%2?cream:gold}" stroke-width="5" fill="none"/><path d="M-49 ${-34+i*20}Q-25 ${-59+i*20}0 ${-34+i*20}T49 ${-34+i*20}" stroke="${dark}" stroke-width="1" fill="none"/>`;
    s+=`<circle cx="-25" cy="21" r="2" fill="${cream}"/><circle cx="25" cy="-18" r="2" fill="${cream}"/>`;
  }
  return `<g transform="rotate(${variant})">${s}</g>`;
}
function borderUnit(type,c){
  const [base,gold,cream,dark]=c;
  if(type==='diamond')return `<path d="M0-20 20 0 0 20-20 0Z" fill="${base}"/><path d="M0-12 12 0 0 12-12 0Z" fill="${cream}"/><path d="M0-6 6 0 0 6-6 0Z" fill="${dark}"/><circle cx="24" cy="0" r="2.1" fill="${base}"/><circle cx="-24" cy="0" r="2.1" fill="${base}"/>`;
  if(type==='petal')return flower(base,cream,8,19)+`<circle r="4" fill="${dark}"/><circle cx="-25" r="2" fill="${dark}"/><circle cx="25" r="2" fill="${dark}"/>`;
  return `<path d="M-27 6Q-16-13-4 0T20-6M-27 14Q-13-5 0 8T27 2" fill="none" stroke="${base}" stroke-width="3.5"/><circle cx="-9" cy="-14" r="2.5" fill="${cream}"/><circle cx="15" cy="16" r="2.5" fill="${dark}"/>`;
}
function buildSVG(s,width=1200,height=800){
  const id='k'+(++serial),W=1200,H=800,b=s.borderSize,c=s.colors,[base,gold,cream,dark]=c;
  const tile=s.scale*1.4,rotation=s.motif==='geometric'||s.motif==='waves'?0:((s.seed%5)-1)*8;
  const m=motifMarkup(s.motif,c,rotation);
  let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeXML(s.motif+' kanga: '+s.phrase)}"><title>${escapeXML(s.phrase||'Kanga Studio design')}</title><desc>Original Swahili-inspired kanga with ${escapeXML(s.motif)} motifs and a ${escapeXML(s.border)} border. Created with Kanga Studio.</desc><defs><pattern id="${id}pattern" width="${tile}" height="${tile}" patternUnits="userSpaceOnUse"><g transform="translate(${tile/2} ${tile/2}) scale(${tile/120})">${m}</g><g transform="translate(0 0) scale(${tile/160}) rotate(180)">${m}</g><g transform="translate(${tile} 0) scale(${tile/160}) rotate(180)">${m}</g><g transform="translate(0 ${tile}) scale(${tile/160}) rotate(180)">${m}</g><g transform="translate(${tile} ${tile}) scale(${tile/160}) rotate(180)">${m}</g></pattern><clipPath id="${id}field"><rect x="${b+14}" y="${b+14}" width="${W-2*b-28}" height="${H-2*b-28}"/></clipPath><clipPath id="${id}edge"><rect x="12" y="12" width="${W-24}" height="${H-24}"/></clipPath></defs><rect width="1200" height="800" fill="${dark}"/><rect x="5" y="5" width="1190" height="790" fill="${base}" stroke="${cream}" stroke-width="2"/><rect x="14" y="14" width="1172" height="772" fill="${gold}"/><rect x="${b}" y="${b}" width="${W-2*b}" height="${H-2*b}" fill="${dark}" stroke="${cream}" stroke-width="3"/><rect x="${b+8}" y="${b+8}" width="${W-2*b-16}" height="${H-2*b-16}" fill="${base}" stroke="${gold}" stroke-width="3"/><rect x="${b+14}" y="${b+14}" width="${W-2*b-28}" height="${H-2*b-28}" fill="url(#${id}pattern)" clip-path="url(#${id}field)"/>`;
  const edgeScale=(b-22)/42,edgeStep=52*edgeScale,pos=14+(b-14)/2,unit=borderUnit(s.border,c);
  svg+=`<g clip-path="url(#${id}edge)">`;
  for(let x=pos;x<W-pos+1;x+=edgeStep)svg+=`<g transform="translate(${x} ${pos}) scale(${edgeScale})">${unit}</g><g transform="translate(${x} ${H-pos}) scale(${edgeScale})">${unit}</g>`;
  for(let y=pos+edgeStep;y<H-pos-edgeStep/2;y+=edgeStep)svg+=`<g transform="translate(${pos} ${y}) rotate(90) scale(${edgeScale})">${unit}</g><g transform="translate(${W-pos} ${y}) rotate(90) scale(${edgeScale})">${unit}</g>`;
  svg+='</g>';
  // Small stitch-like details along the inner frame keep the border distinct from the centre.
  for(let x=b+20;x<W-b-10;x+=12)svg+=`<path d="M${x} ${b+3}v3M${x} ${H-b-6}v3" stroke="${gold}" stroke-width="1.2"/>`;
  for(let y=b+20;y<H-b-10;y+=12)svg+=`<path d="M${b+3} ${y}h3M${W-b-6} ${y}h3" stroke="${gold}" stroke-width="1.2"/>`;
  if(s.showPhrase&&s.phrase.trim()){
    const words=s.phrase.trim().split(/\s+/),lines=[];let line='';
    words.forEach(word=>{if((line+' '+word).trim().length>43&&line){lines.push(line);line=word;}else line+=(line?' ':'')+word;});if(line)lines.push(line);
    const n=lines.length,boxH=Math.max(58,n*33+25),boxY=H-b-boxH-20,boxW=Math.min(980,W-2*b-70),boxX=(W-boxW)/2;
    svg+=`<rect x="${boxX-5}" y="${boxY-5}" width="${boxW+10}" height="${boxH+10}" fill="${base}" stroke="${gold}" stroke-width="2"/><rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" fill="${cream}" stroke="${dark}" stroke-width="1"/>`;
    lines.forEach((text,i)=>{const size=Math.min(29,(boxW-48)/(Array.from(text).length*.8));svg+=`<text x="600" y="${boxY+boxH/2+(i-(n-1)/2)*33+size*.34}" text-anchor="middle" font-family="Georgia, serif" font-size="${size}" font-weight="bold" letter-spacing="2" fill="${dark}">${escapeXML(text)}</text>`;});
  }
  return svg+'</svg>';
}
function validState(s){
  if(!s||!MOTIFS.some(m=>m.id===s.motif)||!['diamond','petal','wave'].includes(s.border)||!Array.isArray(s.colors)||s.colors.length!==4||!s.colors.every(c=>/^#[\da-f]{6}$/i.test(c))||typeof s.phrase!=='string')return null;
  return {motif:s.motif,palette:Number.isInteger(s.palette)&&s.palette>=0&&s.palette<PALETTES.length?s.palette:-1,colors:[...s.colors],scale:Math.min(145,Math.max(70,Number(s.scale)||106)),border:s.border,borderSize:Math.min(95,Math.max(44,Number(s.borderSize)||65)),phrase:s.phrase.slice(0,100),showPhrase:s.showPhrase!==false,seed:Math.max(1,Math.min(9999,Number(s.seed)||1))};
}
function readSaved(){try{return JSON.parse(localStorage.getItem(STORE)||'[]').filter(d=>d&&validState(d.state)).slice(0,24);}catch{return [];}}
function writeSaved(items){try{localStorage.setItem(STORE,JSON.stringify(items));updateSavedCount();return true;}catch{toast('Your browser could not save this design. Download a copy instead.');return false;}}
function updateSavedCount(){$('saved-count').textContent=readSaved().length;}
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
function render(){
  $('preview').innerHTML=buildSVG(state);
  $('design-summary').textContent=MOTIFS.find(m=>m.id===state.motif).name+' · '+(state.palette>=0?PALETTES[state.palette].name+' palette':'Custom palette');
  $('design-number').textContent=String(number).padStart(3,'0');
  document.querySelectorAll('[data-motif]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.motif===state.motif));
  document.querySelectorAll('[data-palette]').forEach(btn=>btn.setAttribute('aria-pressed',Number(btn.dataset.palette)===state.palette));
  document.querySelectorAll('[data-border]').forEach(btn=>btn.setAttribute('aria-pressed',btn.dataset.border===state.border));
  state.colors.forEach((c,i)=>{$('color-'+i).value=c;$('color-'+i).title=['Background','Accent','Light','Ink'][i]+': '+c;});
  $('scale').value=state.scale;$('scale-output').value=state.scale<90?'Small':state.scale>122?'Large':'Medium';
  $('border-size').value=state.borderSize;$('border-output').value=state.borderSize<57?'Fine':state.borderSize>78?'Bold':'Classic';
  $('phrase').value=state.phrase;$('character-count').textContent=state.phrase.length+'/100';
  const saying=SAYINGS.findIndex(s=>s.text.toUpperCase()===state.phrase.trim().toUpperCase());
  $('saying').value=saying>=0?String(saying):'custom';
  $('translation').textContent=saying>=0?SAYINGS[saying].translation:'Your own words, your own meaning.';
  $('show-phrase').checked=state.showPhrase;
}
function applyDesign(next){state=validState(next)||structuredClone(DEFAULT);number++;render();}
function closeExports(){$('export-menu').hidden=true;$('export-toggle').setAttribute('aria-expanded','false');}
function downloadBlob(blob,extension){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='kanga-'+state.motif+'-'+String(number).padStart(3,'0')+'.'+extension;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
function downloadSVG(){closeExports();downloadBlob(new Blob([buildSVG(state)],{type:'image/svg+xml;charset=utf-8'}),'svg');toast('Your SVG download is ready.');}
async function downloadPNG(){
  closeExports();const button=$('export-toggle');button.disabled=true;toast('Preparing your high-resolution PNG…');
  const svg=buildSVG(state,3600,2400),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));
  try{const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});const canvas=document.createElement('canvas');canvas.width=3600;canvas.height=2400;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');ctx.drawImage(img,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('Export failed');downloadBlob(blob,'png');toast('Your 3600 × 2400 PNG is ready.');}catch{toast('PNG export failed in this browser. Try downloading SVG.');}finally{URL.revokeObjectURL(url);button.disabled=false;}
}
function showSaved(){
  const items=readSaved(),list=$('saved-list');list.replaceChildren();
  if(!items.length)list.innerHTML='<p class="saved-empty">Your stories belong here.<span>Create a kanga and choose “Save design” to start your collection.</span></p>';
  items.forEach((item,index)=>{
    const card=document.createElement('article');card.className='saved-item';card.innerHTML=buildSVG(validState(item.state),480,320);
    const p=document.createElement('p');p.textContent=item.state.phrase||'Untitled kanga';card.appendChild(p);
    const actions=document.createElement('div'),load=document.createElement('button'),remove=document.createElement('button');load.className='secondary-button';load.textContent='Edit this design';load.onclick=()=>{applyDesign(item.state);$('saved-dialog').close();$('workspace').scrollIntoView({behavior:'smooth'});toast('Your saved design is ready to edit.');};remove.className='text-button';remove.textContent='Delete';remove.onclick=()=>{const current=readSaved();current.splice(index,1);if(writeSaved(current))showSaved();};actions.append(load,remove);card.appendChild(actions);list.appendChild(card);
  });
  if(!$('saved-dialog').open)$('saved-dialog').showModal();
}
function setup(){
  $('motif-grid').innerHTML=MOTIFS.map(m=>`<button class="motif-button" data-motif="${m.id}" aria-pressed="false"><svg viewBox="-57 -57 114 114" aria-hidden="true">${motifMarkup(m.id,['#faf7ef','#a72931','#c99550','#a72931'])}</svg>${m.name}</button>`).join('');
  $('palette-options').innerHTML=PALETTES.map((p,i)=>`<button class="palette-button" data-palette="${i}" aria-label="${p.name} palette" title="${p.name}" aria-pressed="false">${p.colors.map(c=>`<span style="background:${c}"></span>`).join('')}</button>`).join('');
  $('colour-editor').innerHTML=['Background','Accent','Light','Ink'].map((label,i)=>`<label><div class="colour-input-wrap"><input id="color-${i}" type="color" aria-label="${label} colour" value="${state.colors[i]}"></div>${label}</label>`).join('');
  $('saying').innerHTML=SAYINGS.map((s,i)=>`<option value="${i}">${s.text.charAt(0)+s.text.slice(1).toLowerCase()}</option>`).join('')+'<option value="custom">Write your own saying…</option>';
  document.querySelectorAll('[data-motif]').forEach(b=>b.onclick=()=>{state.motif=b.dataset.motif;render();});
  document.querySelectorAll('[data-palette]').forEach(b=>b.onclick=()=>{state.palette=Number(b.dataset.palette);state.colors=[...PALETTES[state.palette].colors];render();});
  document.querySelectorAll('[data-border]').forEach(b=>b.onclick=()=>{state.border=b.dataset.border;render();});
  state.colors.forEach((_,i)=>{$('color-'+i).addEventListener('input',e=>{state.colors[i]=e.target.value;state.palette=-1;render();});});
  $('scale').oninput=e=>{state.scale=Number(e.target.value);render();};$('border-size').oninput=e=>{state.borderSize=Number(e.target.value);render();};
  $('phrase').oninput=e=>{const start=e.target.selectionStart,end=e.target.selectionEnd;state.phrase=e.target.value;render();e.target.setSelectionRange(start,end);};
  $('saying').onchange=e=>{if(e.target.value==='custom'){state.phrase='';render();$('phrase').focus();}else{state.phrase=SAYINGS[Number(e.target.value)].text;render();}};
  $('show-phrase').onchange=e=>{state.showPhrase=e.target.checked;render();};
  $('reset').onclick=()=>{state=structuredClone(DEFAULT);number=1;render();toast('Back to the original. A fresh start.');};
  $('shuffle').onclick=()=>{const random=n=>Math.floor(Math.random()*n),palette=random(PALETTES.length);applyDesign({...DEFAULT,motif:MOTIFS[random(MOTIFS.length)].id,palette,colors:[...PALETTES[palette].colors],scale:80+random(60),border:['diamond','petal','wave'][random(3)],borderSize:48+random(42),phrase:SAYINGS[random(SAYINGS.length)].text,seed:1+random(9998)});toast('A new colour story, just for you.');};
  $('save').onclick=()=>{const items=readSaved();if(items.length>=24){toast('Your collection has 24 designs. Download or delete one to make room.');return;}if(items.some(d=>JSON.stringify(d.state)===JSON.stringify(state))){toast('This design is already in your collection.');return;}if(writeSaved([{state:structuredClone(state),date:new Date().toISOString()},...items]))toast('Saved to your collection in this browser.');};
  $('open-saved').onclick=showSaved;
  $('export-toggle').onclick=()=>{const hidden=!$('export-menu').hidden;$('export-menu').hidden=hidden;$('export-toggle').setAttribute('aria-expanded',String(!hidden));};
  $('download-svg').onclick=downloadSVG;$('download-png').onclick=downloadPNG;
  document.addEventListener('click',e=>{if(!e.target.closest('.export-wrap'))closeExports();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeExports();});
  $('fullscreen').onclick=()=>{$('expanded-preview').innerHTML=buildSVG(state);$('preview-dialog').showModal();};
  document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
  const collection=[
    {title:'Upendo',subtitle:'For the love that surrounds you',design:{...DEFAULT}},
    {title:'Pwani',subtitle:'A little breeze from the coast',design:{...DEFAULT,motif:'waves',palette:1,colors:PALETTES[1].colors,phrase:SAYINGS[5].text,border:'wave',scale:98}},
    {title:'Sherehe',subtitle:'Wear a little celebration',design:{...DEFAULT,motif:'sunflower',palette:2,colors:PALETTES[2].colors,phrase:SAYINGS[4].text,border:'petal',scale:118}},
    {title:'Amani',subtitle:'Find beauty in the quiet',design:{...DEFAULT,motif:'paisley',palette:3,colors:PALETTES[3].colors,phrase:SAYINGS[3].text,border:'diamond',scale:110}}
  ];
  collection.forEach(preset=>{const b=document.createElement('button');b.className='collection-card';b.setAttribute('aria-label','Start with '+preset.title+' design');b.innerHTML=`<div class="collection-art">${buildSVG(preset.design,480,320)}</div><span class="collection-title">${preset.title}<span>↗</span></span><span class="collection-sub">${preset.subtitle}</span>`;b.onclick=()=>{applyDesign(preset.design);$('workspace').scrollIntoView({behavior:'smooth',block:'start'});toast(preset.title+' — now make it your own.');};$('collection-grid').appendChild(b);});
  updateSavedCount();render();
}
setup();
