import {createServer} from 'node:http';
import {createHash,randomUUID} from 'node:crypto';

class HttpError extends Error {constructor(status,message){super(message);this.status=status}}
const fail=(status,message)=>{throw new HttpError(status,message)};
const email=v=>typeof v==='string'&&v.length<=254&&/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/.test(v);
const enums={goal:['whatsapp','call','quote','visit','unknown'],budget:['yes','unsure','no'],timing:['flexible','weeks','fixed'],contactMethod:['email','whatsapp']};
const arrays={features:['presentation','shop','booking','payment','integration','unknown'],assets:['logo','photos','texts'],languages:['es','en','gl']};
const limits={business:100,location:120,links:1000,services:800,visual:600,deadline:10,person:80,contact:120};
export function validatePayload(body){
 if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).some(k=>!['answers','website'].includes(k))||(body.website!==undefined&&body.website!==''))fail(400,'Solicitud no válida.');
 const a=body.answers;if(!a||typeof a!=='object'||Array.isArray(a))fail(400,'Faltan las respuestas.');
 if(Object.keys(a).some(k=>![...Object.keys(limits),...Object.keys(enums),...Object.keys(arrays)].includes(k)))fail(400,'Campo desconocido.');
 const clean={};
 for(const [k,max] of Object.entries(limits)){const v=a[k]??'';if(typeof v!=='string'||v.length>max||/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))fail(400,'Revisa las respuestas.');clean[k]=v.trim()}
 for(const k of ['business','location','services','contact'])if(!clean[k])fail(400,'Completa los datos obligatorios.');
 for(const [k,allowed] of Object.entries(enums)){if(!allowed.includes(a[k]))fail(400,'Revisa las opciones elegidas.');clean[k]=a[k]}
 for(const [k,allowed] of Object.entries(arrays)){const values=a[k]??[];if(!Array.isArray(values)||values.length>allowed.length||new Set(values).size!==values.length||values.some(v=>!allowed.includes(v)))fail(400,'Revisa las opciones elegidas.');clean[k]=values}
 if(!clean.features.length)fail(400,'Indica qué necesitas.');
 if(clean.contactMethod==='email'?!email(clean.contact):(!/^[+()\d\s-]+$/.test(clean.contact)||clean.contact.replace(/\D/g,'').length<7||clean.contact.replace(/\D/g,'').length>15))fail(400,'Revisa el contacto.');
 if(clean.timing==='fixed'){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(clean.deadline)||!Number.isFinite(Date.parse(clean.deadline))||new Date(clean.deadline).toISOString().slice(0,10)!==clean.deadline)fail(400,'Revisa la fecha.');
 }else clean.deadline='';
 return clean;
}
const labels={business:'Negocio',location:'Localidad',links:'Enlaces',services:'Qué ofrece',visual:'Mantener / evitar',person:'Persona',contact:'Contacto',deadline:'Fecha concreta',goal:'Objetivo',budget:'Encaje del precio',timing:'Cuándo',contactMethod:'Respuesta preferida',features:'Necesita',assets:'Material',languages:'Idiomas'};
const words={whatsapp:'WhatsApp',email:'Correo electrónico',call:'Llamadas',quote:'Información o presupuesto',visit:'Visitas al negocio',unknown:'Por decidir',yes:'Le encaja',unsure:'Quiere hablarlo',no:'Ahora no le encaja',flexible:'Flexible',weeks:'Próximas semanas',fixed:'Fecha concreta',presentation:'Presentación y contacto',shop:'Tienda online',booking:'Sistema de reservas',payment:'Cobros online',integration:'Integraciones',logo:'Logotipo',photos:'Fotografías',texts:'Textos',es:'Castellano',en:'Inglés',gl:'Gallego'};
export function buildMail(a,{from,to},requestId){
 const custom=a.features.some(v=>['shop','booking','payment','integration'].includes(v))||a.languages.length>2;
 const text='Solicitud de boceto · Lareira\nReferencia: '+requestId+'\n\n'+Object.entries(a).map(([k,v])=>labels[k]+': '+(Array.isArray(v)?v.map(x=>words[x]).join(', '):(Object.hasOwn(enums,k)?words[v]:v)||'No indicado')).join('\n')+'\n\nOrientación: '+(custom?'Presupuesto a medida.':'Revisión humana del alcance y precio.')+'\nRespuestas facilitadas por el interesado. No es un pedido contratado.';
 return {from,to,replyTo:a.contactMethod==='email'?a.contact:undefined,subject:'Solicitud de boceto · Lareira',text,disableFileAccess:true,disableUrlAccess:true};
}
export function createApp({sendMail,from,to,origins,rateLimit=10,windowMs=60_000,maxEntries=1000}){
 if(typeof sendMail!=='function'||!email(from)||!email(to)||!Array.isArray(origins)||!origins.length||origins.some(v=>{try{return new URL(v).origin!==v||!/^https?:/.test(v)}catch{return true}}))throw new Error('Invalid server configuration');
 const cache=new Map(),rates=new Map();const ttl=3_600_000;
 const reply=(res,status,body)=>{res.writeHead(status);res.end(body?JSON.stringify(body):undefined)};
 return createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Vary','Origin');
  try{
   if(req.url!=='/api/brief')fail(404,'No encontrado.');
   const origin=req.headers.origin;if(!origins.includes(origin))fail(403,'Origen no permitido.');
   res.setHeader('Access-Control-Allow-Origin',origin);
   if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','POST');res.setHeader('Access-Control-Allow-Headers','Content-Type, Idempotency-Key');return reply(res,204)}
   if(req.method!=='POST'){res.setHeader('Allow','POST, OPTIONS');fail(405,'Método no permitido.')}
   if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))fail(415,'Formato no admitido.');
   if(Number(req.headers['content-length']||0)>16_384)fail(413,'Solicitud demasiado grande.');
   let size=0;const chunks=[];for await(const chunk of req){size+=chunk.length;if(size>16_384)fail(413,'Solicitud demasiado grande.');chunks.push(chunk)}
   let payload;try{payload=JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{fail(400,'Solicitud no válida.')}
   const a=validatePayload(payload);const key=req.headers['idempotency-key'];if(typeof key!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(key))fail(400,'Falta la referencia del envío.');
   const fingerprint=createHash('sha256').update(JSON.stringify(a)).digest('hex');const now=Date.now();
   for(const [k,v] of cache)if(v.done&&now-v.created>ttl)cache.delete(k);
   for(const [k,v] of rates)if(now-v.start>windowMs)rates.delete(k);
   const token=origin+':'+key,previous=cache.get(token);
   if(previous){if(previous.fingerprint!==fingerprint)fail(409,'La referencia pertenece a otra solicitud.');const r=await previous.promise;return reply(res,r.status,r.body)}
   const ip=req.socket.remoteAddress;let bucket=rates.get(ip);
   if(!bucket){if(rates.size>=maxEntries)fail(503,'Inténtalo más tarde.');bucket={start:now,count:0};rates.set(ip,bucket)}
   if(++bucket.count>rateLimit){res.setHeader('Retry-After',String(Math.ceil(windowMs/1000)));fail(429,'Demasiados intentos. Espera un minuto.')}
   if(cache.size>=maxEntries)fail(503,'Inténtalo más tarde.');
   const entry={created:now,fingerprint,done:false};const requestId=randomUUID();
   entry.promise=Promise.resolve().then(async()=>{
    try{
     const info=await sendMail(buildMail(a,{from,to},requestId));
     if(!info?.accepted?.some(v=>String(v).toLowerCase()===to.toLowerCase()))throw new Error('Recipient not accepted');
     entry.done=true;return {status:200,body:{ok:true,delivery:'accepted',requestId}};
    }catch{cache.delete(token);return {status:502,body:{ok:false,error:'No se ha podido confirmar el envío. Tus respuestas siguen aquí.'}}}
   });cache.set(token,entry);const result=await entry.promise;reply(res,result.status,result.body);
  }catch(error){reply(res,error instanceof HttpError?error.status:500,{ok:false,error:error instanceof HttpError?error.message:'No se ha podido procesar la solicitud.'})}
 });
}
