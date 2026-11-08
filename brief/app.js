(function(){
'use strict';
const $=s=>document.querySelector(s);const form=$('#brief-form');const steps=[...document.querySelectorAll('.step')];const storeKey='lareira-brief-v1';const labels=['El negocio','La web','Material e idiomas','Encaje y fecha','Contacto'];let current=0;let lastBrief=null;let storage=true;let sending=false;let submission=null;
const names={goal:{whatsapp:'Consultas por WhatsApp',call:'Llamadas',quote:'Información o presupuestos',visit:'Conocer y visitar el negocio',unknown:'Por decidir'},features:{presentation:'Presentación y contacto',shop:'Tienda online',booking:'Sistema de reservas',payment:'Cobros online',integration:'Integraciones',unknown:'Por decidir'},assets:{logo:'Logotipo',photos:'Fotografías',texts:'Información o textos'},languages:{es:'Castellano',en:'Inglés',gl:'Gallego'},budget:{yes:'El precio de referencia me encaja',unsure:'Necesito hablarlo o valorar el alcance',no:'Ahora no me encaja'},timing:{flexible:'Tengo flexibilidad',weeks:'En las próximas semanas',fixed:'Fecha concreta'}};
function value(name){return (form.elements.namedItem(name)?.value||'').trim()}
function selected(name){return [...form.querySelectorAll('input[name="'+name+'"]:checked')].map(x=>x.value)}
function data(){return {business:value('business'),location:value('location'),links:value('links'),services:value('services'),goal:value('goal'),features:selected('features'),assets:selected('assets'),languages:selected('languages'),visual:value('visual'),budget:value('budget'),timing:value('timing'),deadline:value('timing')==='fixed'?value('deadline'):'',person:value('person'),contactMethod:value('contactMethod'),contact:value('contact')}}
function save(){try{sessionStorage.setItem(storeKey,JSON.stringify({step:current,data:data(),submission}))}catch{storage=false;$('#storage-status').textContent='Tu navegador no permite guardar el avance. Se conserva mientras no recargues esta página.'}}
function restore(){try{const saved=JSON.parse(sessionStorage.getItem(storeKey)||'null');if(!saved||typeof saved.data!=='object'||!saved.data)return;for(const e of [...form.elements]){if(!e.name)continue;const v=saved.data[e.name];if(e.type==='radio')e.checked=typeof v==='string'&&v===e.value;else if(e.type==='checkbox')e.checked=Array.isArray(v)&&v.includes(e.value);else if(typeof v==='string')e.value=v.slice(0,e.maxLength>0?e.maxLength:1000)}current=Number.isInteger(saved.step)?Math.max(0,Math.min(4,saved.step)):0;if(saved.submission&&typeof saved.submission.key==='string'&&/^[a-f0-9-]{36}$/i.test(saved.submission.key)&&typeof saved.submission.signature==='string'&&saved.submission.signature.length<10000)submission=saved.submission}catch{storage=false}}
function sync(){const d=data();const fixed=d.timing==='fixed';$('#date-wrap').hidden=!fixed;$('#deadline').required=fixed;const email=d.contactMethod==='email';$('#contact').type=email?'email':'tel';$('#contact').inputMode=email?'email':'tel';$('#contact').autocomplete=email?'email':'tel';$('#contact-label').firstChild.textContent=email?'Tu correo electrónico':'Tu número de WhatsApp';$('#contact-hint').textContent=email?'Lo usaremos para responder a esta consulta.':'Incluye el prefijo si tu número no es de España.';$('#language-note').textContent=d.languages.length>2?'Has elegido tres idiomas: lo valoraremos con un presupuesto aparte.':'Hasta dos idiomas incluidos en la web base. Si no lo sabes todavía, te orientamos.';const custom=d.features.some(x=>['shop','booking','payment','integration'].includes(x));$('#delivery-note').textContent=custom?'El plazo de las funciones a medida se concreta en su presupuesto; no se les aplica automáticamente el de la web base.':'Plazo orientativo: 7–15 días laborables, desde la aprobación del boceto, el primer pago y la recepción del material imprescindible. Comprobamos disponibilidad y confirmamos la fecha antes de contratar.';$('#scope-note').textContent=custom?'Has indicado funciones que necesitan presupuesto a medida. Los 490 € son la referencia para una web de presentación, no el precio de tu proyecto completo.':'La web de presentación cuesta 490 € IVA incluido. Solo decides contratar después de ver el boceto.'}
function show(n,focus=true){current=n;steps.forEach((s,i)=>{s.hidden=i!==n;s.classList.toggle('entering',i===n)});$('#progress-text').textContent='Paso '+(n+1)+' de 5 · '+labels[n];$('.progress').setAttribute('aria-valuenow',String(n+1));$('#progress-fill').style.width=((n+1)/5*100)+'%';$('#back').hidden=n===0;$('#next').firstChild.textContent=n===4?'Revisar mi resumen ':'Continuar ';$('#form-error').hidden=true;sync();save();if(focus)focusStart(steps[n].querySelector('h2'))}
function valid(){const error=$('#form-error');error.hidden=true;for(const e of steps[current].querySelectorAll('input,textarea')){if((e.required||e.value)&&!e.checkValidity()){e.reportValidity();return false}if(e.required&&e.type!=='radio'&&e.type!=='checkbox'&&!e.value.trim()){error.textContent='Completa este dato para continuar.';error.hidden=false;e.focus();return false}}
 const d=data();if(current===1&&!d.features.length){error.textContent='Elige qué necesitas o la opción de ayuda para decidirlo.';error.hidden=false;form.querySelector('[name="features"]').focus();return false}
 if(current===4&&d.contactMethod==='whatsapp'&&(d.contact.replace(/\D/g,'').length<7||d.contact.replace(/\D/g,'').length>15||!/^[+()\d\s-]+$/.test(d.contact))){error.textContent='Revisa el número de WhatsApp e incluye el prefijo si corresponde.';error.hidden=false;$('#contact').focus();return false}return true}
function display(key,v){if(Array.isArray(v))return v.length?v.map(x=>names[key]?.[x]||x).join(', '):'Pendiente / no indicado';return names[key]?.[v]||v||'Pendiente / no indicado'}
function summaryRows(d){return [['Negocio',d.business],['Localidad',d.location],['Enlaces',d.links],['Qué ofrece',d.services],['Objetivo',display('goal',d.goal)],['Necesita',display('features',d.features)],['Material',display('assets',d.assets)],['Idiomas',display('languages',d.languages)],['Mantener / evitar',d.visual],['Precio',display('budget',d.budget)],['Fecha',display('timing',d.timing)+(d.deadline?' · '+d.deadline:'')],['Persona',d.person],['Contacto',(d.contactMethod==='email'?'Email: ':'WhatsApp: ')+d.contact]]}
let focusGeneration=0;
function focusStart(target){
 const generation=++focusGeneration;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(generation!==focusGeneration||!target.isConnected)return;
  target.tabIndex=-1;target.focus({preventScroll:true});
  window.scrollTo({top:Math.max(0,window.scrollY+target.getBoundingClientRect().top-24),left:0,behavior:'instant'});
 }));
}
function finish(){
 const d=data(),route=globalThis.LareiraBrief.classify(d);lastBrief={answers:d};
 const signature=JSON.stringify(d);
 if(!submission||submission.signature!==signature)submission={key:crypto.randomUUID(),signature};
 $('#summary').replaceChildren();
 for(const [title,raw] of summaryRows(d)){const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;dd.textContent=raw||'Pendiente / no indicado';div.append(dt,dd);$('#summary').append(div)}
 $('#route-message').textContent=route.message;
 $('#submit-status').textContent='';$('#submit-error').hidden=true;$('#send-mail').disabled=false;$('#send-mail').textContent='Enviar solicitud por correo';
 $('#result-title').textContent='Revisa tu solicitud.';$('#result .intro').textContent='Todavía no se ha enviado a Lareira.';
 form.hidden=true;$('#result').hidden=false;save();focusStart($('#result-title'));
}
async function sendMail(){
 if(!lastBrief||sending||$('#send-mail').dataset.sent==='true')return;
 if(globalThis.LAREIRA_REVIEW){$('#submit-status').textContent='Modo revisión: envío desactivado. No se ha enviado ningún correo.';return}
 const endpoint=new URL(document.querySelector('meta[name="brief-endpoint"]').content,location.href);
 if(endpoint.protocol!=='https:'&&!(endpoint.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(endpoint.hostname))){$('#submit-error').textContent='El envío necesita la versión web configurada. Tus respuestas siguen aquí.';$('#submit-error').hidden=false;return}
 sending=true;for(const id of ['send-mail','edit','reset'])$('#'+id).disabled=true;
 $('#send-mail').setAttribute('aria-busy','true');$('#send-mail').textContent='Enviando…';$('#submit-status').textContent='Enviando tu solicitud por correo…';$('#submit-error').hidden=true;
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{
  const response=await fetch(endpoint,{method:'POST',mode:'cors',credentials:'omit',redirect:'error',signal:controller.signal,headers:{'Content-Type':'application/json','Idempotency-Key':submission.key},body:JSON.stringify({answers:lastBrief.answers,website:value('website')})});
  const result=await response.json();
  if(!response.ok||result.ok!==true||result.delivery!=='accepted'||typeof result.requestId!=='string'||!result.requestId)throw new Error('not-accepted');
  $('#result-title').textContent='Solicitud enviada por correo.';$('#result .intro').textContent='El servicio de correo ha aceptado tu solicitud. Te responderemos por el contacto que has indicado.';
  $('#submit-status').textContent='Referencia del envío: '+result.requestId;$('#send-mail').textContent='Solicitud enviada';$('#send-mail').dataset.sent='true';
  focusStart($('#result-title'));
 }catch{
  $('#submit-status').textContent='';$('#submit-error').textContent='No hemos podido confirmar el envío. Tus respuestas siguen aquí. Puedes volver a intentarlo sin rellenar el formulario otra vez.';$('#submit-error').hidden=false;$('#send-mail').textContent='Reintentar envío por correo';
 }finally{
  clearTimeout(timer);sending=false;$('#send-mail').removeAttribute('aria-busy');
  for(const id of ['send-mail','edit','reset'])$('#'+id).disabled=id!=='reset'&&$('#send-mail').dataset.sent==='true';
 }
}
$('#next').addEventListener('click',()=>{if(!valid())return;current===4?finish():show(current+1)});
$('#back').addEventListener('click',()=>show(Math.max(0,current-1)));
$('#edit').addEventListener('click',()=>{if(sending)return;form.hidden=false;$('#result').hidden=true;show(0)});
$('#brand-home').addEventListener('click',e=>{e.preventDefault();if(sending||$('#send-mail').dataset.sent==='true')return;form.hidden=false;$('#result').hidden=true;show(0)});
form.addEventListener('submit',e=>{e.preventDefault();$('#next').click()});
form.addEventListener('input',()=>{sync();save()});form.addEventListener('change',()=>{sync();save()});
$('#reset').addEventListener('click',()=>{if(sending)return;$('#clear-confirm').hidden=false;$('#confirm-reset').focus()});
$('#cancel-reset').addEventListener('click',()=>{$('#clear-confirm').hidden=true;$('#reset').focus()});
$('#confirm-reset').addEventListener('click',()=>{
 if(sending)return;$('#clear-confirm').hidden=true;form.reset();lastBrief=null;submission=null;
 try{sessionStorage.removeItem(storeKey)}catch{}form.hidden=false;$('#result').hidden=true;$('#summary').replaceChildren();$('#submit-status').textContent='';$('#submit-error').hidden=true;
 $('#send-mail').dataset.sent='false';for(const id of ['send-mail','edit','reset'])$('#'+id).disabled=false;
 show(0);try{sessionStorage.removeItem(storeKey)}catch{}
 $('#storage-status').textContent=storage?'Respuestas borradas de esta pestaña. Esto no borra un correo ya enviado.':'Respuestas borradas. El avance no se guarda en este navegador.';
});
$('#send-mail').addEventListener('click',sendMail);
restore();show(current,false);
})();
