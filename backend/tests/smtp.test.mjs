import test from 'node:test';import assert from 'node:assert/strict';import {smtpOptions} from '../smtp.mjs';
const env={SMTP_HOST:'smtp.example.invalid',SMTP_USER:'forms',SMTP_PASS:'test-only',SMTP_PORT:'587'};
test('SMTP uses enforced STARTTLS or implicit TLS and certificate verification',()=>{const s=smtpOptions(env);assert.equal(s.secure,false);assert.equal(s.requireTLS,true);assert.equal(s.tls.rejectUnauthorized,true);assert.equal(smtpOptions({...env,SMTP_PORT:'465'}).secure,true)});
test('SMTP configuration fails closed without credentials or valid port',()=>{for(const key of ['SMTP_HOST','SMTP_USER','SMTP_PASS'])assert.throws(()=>smtpOptions({...env,[key]:''}));assert.throws(()=>smtpOptions({...env,SMTP_PORT:'25'}))});
