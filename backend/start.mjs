import {createApp} from './server.mjs';
import {createSmtpTransport} from './smtp.mjs';
try{
 const transport=createSmtpTransport();
 const port=Number(process.env.PORT||4180);if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Invalid PORT');
 const origins=(process.env.ALLOWED_ORIGINS||'https://lareirasoftware.com,https://www.lareirasoftware.com').split(',').map(x=>x.trim());
 const app=createApp({sendMail:m=>transport.sendMail(m),from:process.env.CONTACT_FROM,to:process.env.CONTACT_TO||'lareirasoftwarecdm@gmail.com',origins});
 app.requestTimeout=20000;app.headersTimeout=10000;
 app.listen(port,'127.0.0.1',()=>console.log('Lareira mail endpoint listening on loopback port '+port));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>app.close(()=>{transport.close();process.exit(0)}));
}catch(error){console.error(error.message==='Invalid server configuration'?'Configure CONTACT_FROM, CONTACT_TO and ALLOWED_ORIGINS before starting.':error.message);process.exitCode=1}
