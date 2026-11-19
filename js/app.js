const CFG={
  // Modelo local (Transformers.js): CLIP ViT-B/32 cuantizado, de Hugging Face (Xenova/clip-vit-base-patch32).
  MODEL:'Xenova/clip-vit-base-patch32',
  LIB:'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2',
  LOW:0.6, MAX:1024
};
import {PLANTS,CARE,HEALTH} from './plants.js';
const $=s=>document.querySelector(s),show=(id,on=true)=>$(id).hidden=!on;
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ico=(n,x='')=>`<svg viewBox="0 0 24 24" fill="currentColor" ${x}><use href="#${n}"/></svg>`;
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('on',x===b));
  show('#id',b.dataset.t==='id');show('#garden',b.dataset.t==='garden');if(b.dataset.t==='garden')renderGarden();});
['#cam','#gal'].forEach(s=>$(s).onchange=e=>{const f=e.target.files[0];e.target.value='';if(f)run(f)});

function shrink(src,max){return new Promise((ok,ko)=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');
  c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.8))};i.onerror=()=>ko(new Error('img'));i.src=src})}
const readFile=f=>new Promise((ok,ko)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=ko;r.readAsDataURL(f)});

function msg(t,d){show('#busy',false);show('#start',false);show('#res',false);const m=$('#msg');m.hidden=false;
  m.innerHTML=`<svg class="big" viewBox="0 0 100 100"><use href="#monstera"/></svg><h3>${esc(t)}</h3><p>${esc(d)}</p><button class="btn" id="again">Intentar de nuevo</button>`;$('#again').onclick=reset}
function reset(){show('#msg',false);show('#res',false);show('#busy',false);show('#start')}

let clf;
const OTHER=['a photo of a person','a photo of an animal','a photo of a room interior','a photo of food','a screenshot or a document','a photo of a building, a street or a car'];
const PLANTLBL=['a photo of a plant with green leaves','a photo of a flower','a photo of a tree'];
async function analyze(img){
  $('#busyTxt').textContent='Preparando el modelo (la primera vez se descarga, ~90 MB)…';
  if(!clf){const {pipeline}=await import(CFG.LIB);clf=await pipeline('zero-shot-image-classification',CFG.MODEL)}
  $('#busyTxt').textContent='Observando tu planta…';
  const T={hypothesis_template:'{}'};
  const g=await clf(img,PLANTLBL.concat(OTHER),T);
  const pp=g.filter(x=>PLANTLBL.includes(x.label)).reduce((s,x)=>s+x.score,0);
  if(pp<0.5)return {es_planta:false};
  const sp=await clf(img,PLANTS.map(p=>'a photo of a '+p.en+' plant'),T);
  const p=PLANTS.find(x=>'a photo of a '+x.en+' plant'===sp[0].label);
  const hl=await clf(img,HEALTH.map(h=>h[0]),T),h=HEALTH.find(x=>x[0]===hl[0].label);
  return {es_planta:true,nombre_comun:p.es,nombre_cientifico:p.sci,confianza:sp[0].score,estado:h[1],problema:h[2],tratamiento:h[3],cuidados:CARE[p.tipo],
    toxica:p.tox?{mascotas:'sí',ninos:'sí',detalle:'Puede causar irritación o malestar si se mastica o ingiere. Mantenla fuera del alcance y consulta a un veterinario o médico si hay ingestión.'}:{mascotas:'no',ninos:'no',detalle:'Se considera de baja toxicidad, aunque ingerir mucha cantidad puede causar malestar.'}};
}

async function run(file){
  show('#start',false);show('#msg',false);show('#res',false);show('#busy');$('#busyTxt').textContent='Observando tu planta…';
  let thumb,img,data;
  try{img=await shrink(await readFile(file),CFG.MAX);thumb=await shrink(img,160)}catch{return msg('No pudimos leer la foto','Prueba con otra imagen (JPG o PNG).')}
  try{data=await analyze(img)}catch(e){console.error(e);
    return msg(navigator.onLine?'No pudimos cargar el modelo':'Sin conexión',navigator.onLine?'Detalle: '+(e.message||e):'Necesitamos internet al menos una vez para descargar el modelo. Después funciona sin conexión.')}
  const p=$('#mode');p.hidden=false;p.textContent='Modo local · gratis y sin internet';
  if(!data.es_planta)return msg('No vemos una planta aquí','Acércate más a las hojas o flores y con buena luz.');
  if(data.confianza<0.15)return msg('No logré reconocerla','Mi catálogo incluye unas 35 plantas comunes. Prueba con otra foto más cercana y con buena luz.');
  show('#busy',false);render(data,img,'','local');save(data,thumb);
}

function render(d,img,note,mode){
  const pct=Math.round((d.confianza||0)*100),lv=Math.round((d.confianza||0)*5);
  const leaves=[...Array(5)].map((_,i)=>`<svg viewBox="0 0 24 24" class="${i<lv?'':'off'}"><use href="#leaf"/></svg>`).join('');
  const st={sana:['Sana','Tu planta está contenta'],atencion:['Necesita atención','Está pidiendo un poco de cariño'],enferma:['Enferma','Hay que ayudarla pronto']}[d.estado]||['Sin determinar',''];
  const c=d.cuidados,row=(i,t,v)=>v?`<dt>${ico(i)}${t}</dt><dd>${esc(v)}</dd>`:'';
  let h=`<div class="herb"><img src="${img}" alt="Tu foto"><div><h2>${esc(d.nombre_comun)}</h2>${d.nombre_cientifico?`<p class="sci">${esc(d.nombre_cientifico)}</p>`:''}
  <div class="conf" role="img" aria-label="Confianza ${pct}%">${leaves}&nbsp;${pct}%</div></div></div>
  <div class="health ${esc(d.estado)}">${ico('leaf')}<div><b>${st[0]}</b><br>${st[1]}${d.problema?`<br>Posible problema: ${esc(d.problema)}`:''}</div></div>`;
  if(d.tratamiento)h+=`<p><b>Qué puedes hacer:</b> ${esc(d.tratamiento)}</p>`;
  h+='<div class="wave"></div>';
  h+=c?`<dl>${row('drop','Riego',c.riego)}${row('sun','Luz',c.luz)}${row('pot','Sustrato',c.sustrato)}${row('temp','Temperatura',c.temperatura)}${row('bag','Fertilización',c.fertilizacion)}</dl>`:'<p>Los cuidados completos solo están disponibles en modo en línea.</p>';
  if(d.toxica)h+=`<div class="tox"><b>${ico('paw','width="18" height="18"')} Toxicidad</b><br>Mascotas: ${esc(d.toxica.mascotas)} · Niños: ${esc(d.toxica.ninos)}<br>${esc(d.toxica.detalle)}</div>`;
  if(note)h+=`<div class="hint">${esc(note)}</div>`;
  if(mode==='local'&&d.confianza<CFG.LOW)h+=`<div class="hint">Confianza baja. Prueba con otra foto más cerca de las hojas o flores y con buena luz.</div>`;
  h+=`<p class="sci" style="font-size:.85rem">Resultado orientativo. Verifica con un experto si es tóxica o comestible.</p><button class="btn alt" id="new">Identificar otra planta</button>`;
  $('#res').innerHTML=h;show('#res');$('#new').onclick=reset;
}

const KEY='healthyplant.garden';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
function save(d,thumb){const l=load();l.unshift({d,thumb,t:Date.now()});try{localStorage.setItem(KEY,JSON.stringify(l.slice(0,40)))}catch{}}
function renderGarden(){const l=load(),el=$('#list');
  el.innerHTML=l.length?l.map((x,i)=>`<button class="g" data-i="${i}"><img src="${x.thumb}" alt=""><span><b>${esc(x.d.nombre_comun)}</b><small>${new Date(x.t).toLocaleDateString('es')} · ${esc(x.d.estado)}</small></span></button>`).join(''):'<div class="card center"><p>Tu jardín está vacío. ¡Identifica tu primera planta!</p></div>';
  el.querySelectorAll('.g').forEach(b=>b.onclick=()=>{const x=l[b.dataset.i];document.querySelector('nav [data-t=id]').click();show('#start',false);show('#msg',false);render(x.d,x.thumb,'',x.d._local?'local':'online')})}
