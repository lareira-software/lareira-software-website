import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {createService,readSmtpEnvironment} from '../runtime.mjs';

test('closed service starts without SMTP and cannot accept or send submissions',async()=>{
 const app=createService({release:'test-revision'});app.listen(0,'127.0.0.1');await once(app,'listening');
 try{
  const base='http://127.0.0.1:'+app.address().port;
  const health=await (await fetch(base+'/healthz')).json();
  assert.deepEqual(health,{ok:true,service:'lareira-brief-mail',release:'test-revision',acceptingSubmissions:false});
  const response=await fetch(base+'/api/brief',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"answers":{"business":"synthetic"}}'});
  assert.equal(response.status,503);assert.equal((await response.json()).ok,false);
  assert.equal((await fetch(base+'/unknown')).status,404);
 }finally{await new Promise(resolve=>app.close(resolve))}
});
test('enabled service reports configuration state without sending during health checks',async()=>{
 let sent=0;const app=createService({enabled:true,release:'release-test',appOptions:{from:'review@example.invalid',to:'inbox@example.invalid',origins:['https://example.invalid'],sendMail:async()=>{sent++;return {accepted:['inbox@example.invalid']}}}});
 app.listen(0,'127.0.0.1');await once(app,'listening');try{const r=await fetch('http://127.0.0.1:'+app.address().port+'/healthz');assert.equal(r.status,200);assert.equal((await r.json()).acceptingSubmissions,true);assert.equal(sent,0)}finally{await new Promise(resolve=>app.close(resolve))}
});
test('SMTP secret files preserve exact values and reject ambiguous configuration',()=>{
 const config=readSmtpEnvironment({SMTP_HOST:'smtp.example.invalid',SMTP_PORT:'465',SMTP_USER_FILE:'/run/secrets/user',SMTP_PASS_FILE:'/run/secrets/pass'},p=>p.endsWith('/user')?'forms@example.invalid':'  test-only-secret  ');
 assert.equal(config.SMTP_USER,'forms@example.invalid');assert.equal(config.SMTP_PASS,'  test-only-secret  ');
 assert.throws(()=>readSmtpEnvironment({SMTP_USER:'direct',SMTP_USER_FILE:'/run/secrets/user'}),/both/);
 assert.throws(()=>readSmtpEnvironment({SMTP_PASS_FILE:'/not-readable'},()=>{throw Error('secret value must not appear')}),/Cannot read SMTP_PASS_FILE/);
});
