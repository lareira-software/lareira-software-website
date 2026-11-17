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

const plain=value=>value.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const extras=home.match(/<section[^>]*id="extras"[\s\S]*?<\/section>/)[0];
test('all twelve add-ons have descriptions and the approved prices',()=>{
 const rows=[...extras.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>({name:plain(m[1].match(/<h3>([\s\S]*?)<\/h3>/)[1]),body:m[1]}));
 const expected=new Map([
  ['Mantenimiento','150 € al año'],['Cambios adicionales','desde 55 €'],
  ['Tablón de noticias y eventos','desde 80 € al año'],['Recogida automática de contenidos','desde 150 € pago único'],
  ['Mantenimiento de conectores','desde 20 € al mes'],['Tercer idioma','120 €'],['Calendario de disponibilidad','100 €'],
  ['Integraciones con tus herramientas','desde 50 €'],['Venta de algunos productos','desde 350 €'],['Blog','750–850 €'],
  ['Reservas y citas online','desde 850 €'],['Tienda online completa','desde 1.900 €']
 ]);
 assert.equal(rows.length,expected.size);assert.equal(new Set(rows.map(r=>r.name)).size,expected.size);
 for(const row of rows){
  assert.ok(expected.has(row.name),row.name);
  const price=row.body.match(/<(?:span|div) class="(?:precio|cifra) num">([\s\S]*?)<\/(?:span|div)>/);
  assert.ok(price,row.name);assert.equal(plain(price[1]),expected.get(row.name),row.name);
  assert.ok(plain(row.body.match(/<p>([\s\S]*?)<\/p>/)?.[1]||'').length>30,row.name+' description');
 }
 assert.equal(rows[1].name,'Cambios adicionales');
 assert.match(plain(extras),/Todos los precios incluyen IVA/);
 assert.doesNotMatch(extras,/Agenda editable|Conexión con tus herramientas/);
});
test('feed setup, review and connector supplements remain separate',()=>{
 const text=plain(extras);
 assert.match(text,/Incluye una fuente y una base de datos/);
 assert.match(text,/Tú revisas cada propuesta y decides qué se publica/);
 assert.match(text,/El tablón se contrata aparte/);
 assert.match(text,/Cada fuente adicional suma 10 €\/mes y cada base de datos adicional, otros 10 €\/mes/);
 assert.match(text,/La configuración de nuevas conexiones se presupuesta aparte/);
 assert.match(text,/CRM, Slack o un programa de inventario/);
});
test('portable ownership and optional editing are explained next to prices',()=>{
 const block=home.match(/<div class="propiedad"[\s\S]*?(?=<section[^>]*id="extras")/)[0];
 assert.match(plain(block),/El mantenimiento es opcional y no tiene permanencia/);
 assert.match(plain(block),/te entregamos su código y archivos/);
 assert.match(plain(block),/lo presupuestamos según lo que quieras editar/);
 assert.ok(home.indexOf('class="propiedad"')<home.indexOf('id="extras"'));
});
test('visible FAQ and structured FAQ have matching questions and answers',()=>{
 const section=home.match(/<section[^>]*id="preguntas"[\s\S]*?<\/section>/)[0];
 const visible=[...section.matchAll(/<details>\s*<summary>([\s\S]*?)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g)].map(m=>({question:plain(m[1]),answer:plain(m[2])}));
 const data=[...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(v=>v['@type']==='FAQPage');
 assert.equal(visible.length,8);
 assert.deepEqual(data.mainEntity.map(v=>({question:v.name,answer:v.acceptedAnswer.text})),visible);
 assert.ok(visible.some(v=>v.question==='¿Puedo llevarme mi web?'));
 assert.ok(visible.some(v=>v.question==='¿Puedo cambiar el contenido sin pediros ayuda?'));
});
