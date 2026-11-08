import {createService,readSmtpEnvironment} from './runtime.mjs';
import {createSmtpTransport} from './smtp.mjs';
try{
 const flag=process.env.SUBMISSIONS_ENABLED??'false';
 if(!['true','false'].includes(flag))throw new Error('SUBMISSIONS_ENABLED must be true or false');
 const enabled=flag==='true';
 const transport=enabled?createSmtpTransport(readSmtpEnvironment()):null;
 const port=Number(process.env.PORT||4180);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
 const host=process.env.HOST||'127.0.0.1';if(!['127.0.0.1','0.0.0.0'].includes(host))throw new Error('HOST must be loopback or container interface');
 const origins=(process.env.ALLOWED_ORIGINS||'https://lareirasoftware.com,https://www.lareirasoftware.com').split(',').map(x=>x.trim());
 const app=createService({enabled,release:process.env.RELEASE_SHA||'dev',appOptions:enabled?{sendMail:m=>transport.sendMail(m),from:process.env.CONTACT_FROM,to:process.env.CONTACT_TO||'info@lareirasoftware.com',origins}:undefined});
 app.requestTimeout=20000;app.headersTimeout=10000;
 app.listen(port,host,()=>console.log('Lareira endpoint listening on '+host+':'+port+'; submissions '+(enabled?'enabled':'disabled')));
 app.on('error',()=>{console.error('Lareira endpoint could not listen; check address and port.');transport?.close();process.exitCode=1});
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>app.close(()=>{transport?.close();process.exit(0)}));
}catch(error){console.error(error.message==='Invalid server configuration'?'Configure CONTACT_FROM, CONTACT_TO and ALLOWED_ORIGINS before starting.':error.message);process.exitCode=1}
