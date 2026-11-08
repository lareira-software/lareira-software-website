import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const home=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
const brief=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('all four primary boceto CTAs lead to the questionnaire, including mobile',()=>{
 const ctas=[...home.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(m=>/class="boton(?:\s|")/.test(m[1])&&m[2].includes('Pide tu boceto gratis'));
 assert.equal(ctas.length,4);
 for(const m of ctas){assert.match(m[1],/href="\/brief\/"/);assert.doesNotMatch(m[1],/data-wa/);assert.doesNotMatch(m[2],/#i-wa/)}
});
test('public questionnaire has no development banners or disabled-mail claims',()=>{
 assert.doesNotMatch(brief,/class="review-note"|Borrador para revisar|correo real a[uú]n no|prototipo|pendiente de confirmar|antes de publicar/i);
 assert.match(brief,/seis meses desde el último contacto/);
 assert.match(brief,/info@lareirasoftware\.com/);
});
test('homepage structured offer and timing match the questionnaire',()=>{
 const data=[...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 const service=data.find(d=>d['@type']==='ProfessionalService');
 assert.deepEqual(service.makesOffer.map(o=>o.price),['490','840']);
 assert.doesNotMatch(home,/Día 2–3|>Día 7<|boceto gratis en 2 o 3 días|PENDIENTE \(LSSI/);
});
