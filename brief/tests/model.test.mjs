import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const sandbox = { console }; vm.createContext(sandbox);
vm.runInContext(await readFile(new URL('../model.js', import.meta.url), 'utf8'), sandbox);
const model = sandbox.LareiraBrief;
test('a presentation request at the published reference price remains subject to human review', () => {
  const result = model.classify({features:['presentation'], budget:'yes', goal:'whatsapp', languages:['es']});
  assert.equal(result.route,'base');
  assert.match(result.message,/revis/iu);
});

test('shop, booking, payment and integrations require a tailored estimate, never rejection', () => {
 for (const feature of ['shop','booking','payment','integration']) {
  const result=model.classify({features:[feature],budget:'yes',goal:'whatsapp',languages:['es']});
  assert.equal(result.route,'custom');
  assert.match(result.message,/presupuesto/iu);
 }
});

test('uncertainty or price not accepted calls for a conversation, not a failed application', () => {
 for (const data of [{},{features:['presentation'],budget:'unsure'}, {features:['presentation'],budget:'no'}, {features:['unknown'],budget:'yes'}, {features:['presentation'],budget:'yes',goal:'unknown'}]) {
  assert.equal(model.classify(data).route,'clarify');
 }
});
test('more than two languages calls for a tailored estimate',()=> {
 assert.equal(model.classify({features:['presentation'],budget:'yes',goal:'call',languages:['es','en','gl']}).route,'custom');
});
