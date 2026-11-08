import {createServer} from 'node:http';
import {readFileSync} from 'node:fs';
import {createApp} from './server.mjs';

export function readSmtpEnvironment(env=process.env,read=readFileSync){
 const settings={SMTP_HOST:env.SMTP_HOST,SMTP_PORT:env.SMTP_PORT};
 for(const key of ['SMTP_USER','SMTP_PASS']){
  const file=env[key+'_FILE'];
  if(file&&env[key])throw new Error('Do not set both '+key+' and '+key+'_FILE');
  if(file){try{settings[key]=read(file,'utf8')}catch{throw new Error('Cannot read '+key+'_FILE')}}
  else settings[key]=env[key];
 }
 return settings;
}

export function createService({enabled=false,release='dev',appOptions}={}){
 const app=enabled?createApp(appOptions):null;
 return createServer((req,res)=>{
  if(req.url==='/healthz'&&req.method==='GET'){
   res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
   return res.end(JSON.stringify({ok:true,service:'lareira-brief-mail',release,acceptingSubmissions:enabled}));
  }
  if(app)return app.emit('request',req,res);
  const endpoint=req.url==='/api/brief';
  res.writeHead(endpoint?503:404,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(endpoint?{'Retry-After':'3600'}:{})});
  res.end(JSON.stringify({ok:false,error:endpoint?'La recepción de solicitudes todavía no está activada.':'No encontrado.'}));
 });
}
