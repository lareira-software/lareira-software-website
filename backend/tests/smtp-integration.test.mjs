import test from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'node:net';import nodemailer from 'nodemailer';import {createApp} from '../server.mjs';
test('HTTP submission travels through Nodemailer and real loopback SMTP, once',async()=>{
 const messages=[],recipients=[];
 const smtp=createServer(socket=>{socket.setEncoding('utf8');socket.write('220 localhost test SMTP\r\n');let buffer='',inData=false,lines=[];socket.on('data',chunk=>{buffer+=chunk;let n;while((n=buffer.indexOf('\r\n'))>=0){const line=buffer.slice(0,n);buffer=buffer.slice(n+2);if(inData){if(line==='.'){messages.push(lines.join('\r\n'));lines=[];inData=false;socket.write('250 queued by local test sink\r\n')}else lines.push(line.startsWith('..')?line.slice(1):line);continue}if(/^EHLO|^HELO/i.test(line))socket.write('250 localhost\r\n');else if(/^MAIL FROM:/i.test(line))socket.write('250 sender ok\r\n');else if(/^RCPT TO:/i.test(line)){recipients.push(line);socket.write('250 recipient ok\r\n')}else if(/^DATA$/i.test(line)){inData=true;socket.write('354 end with dot\r\n')}else if(/^QUIT$/i.test(line)){socket.end('221 bye\r\n')}else if(/^RSET|^NOOP/i.test(line))socket.write('250 ok\r\n');else socket.write('502 test sink command unsupported\r\n')}})});
 await new Promise(r=>smtp.listen(0,'127.0.0.1',r));
 // Plain SMTP is ONLY a local test fixture; production options enforce TLS (smtp.test.mjs).
 const mailer=nodemailer.createTransport({host:'127.0.0.1',port:smtp.address().port,secure:false,ignoreTLS:true,logger:false,debug:false});
 const app=createApp({sendMail:m=>mailer.sendMail(m),from:'forms@example.invalid',to:'inbox@example.invalid',origins:['https://lareirasoftware.com']});await new Promise(r=>app.listen(0,'127.0.0.1',r));
 try{
  const data={answers:{business:'Salon prueba SMTP',location:'Cee',services:'Cortes',goal:'whatsapp',features:['presentation'],assets:[],languages:['es'],budget:'yes',timing:'flexible',contactMethod:'email',contact:'prueba@example.invalid'},website:''};
  const send=()=>fetch('http://127.0.0.1:'+app.address().port+'/api/brief',{method:'POST',headers:{Origin:'https://lareirasoftware.com','Content-Type':'application/json','Idempotency-Key':'9dc66cab-3444-4423-b78e-907fd4c5f3ec'},body:JSON.stringify(data)});
  const a=await send(),b=await send();assert.equal(a.status,200);assert.equal(b.status,200);assert.deepEqual(await a.json(),await b.json());assert.equal(messages.length,1);assert.equal(recipients.length,1);assert.match(recipients[0],/<inbox@example.invalid>/);assert.match(messages[0],/Reply-To: prueba@example.invalid/i);assert.match(messages[0],/Salon prueba SMTP/);
 }finally{mailer.close();await new Promise(r=>app.close(r));await new Promise(r=>smtp.close(r))}
});
