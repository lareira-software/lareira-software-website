import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url))), repo=path.resolve(root,'..');
const output=path.join(repo,'.git/quiz-navigation');await mkdir(output,{recursive:true});
const server=createServer(async(req,res)=>{try{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(p!==root&&!p.startsWith(root+path.sep)){res.writeHead(403);return res.end()}const f=p===root?path.join(root,'index.html'):p;res.setHeader('Content-Type',f.endsWith('.html')?'text/html':f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.woff2')?'font/woff2':'text/plain');res.end(await readFile(f))}catch{res.writeHead(404);res.end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-sync','--remote-debugging-port=0','--user-data-dir='+path.join(output,'chrome-'+Date.now()),'about:blank'],{stdio:['ignore','ignore','pipe']});
let ws,sid,id=0;const pending=new Map();
try{
 const address=await new Promise((resolve,reject)=>{let s='';const t=setTimeout(()=>reject(Error('Chrome startup timeout')),15000);chrome.stderr.on('data',b=>{s+=b;const m=s.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m){clearTimeout(t);resolve(m[1])}});chrome.once('exit',c=>reject(Error('Chrome exited '+c)))});
 ws=new WebSocket(address);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',j,{once:true})});
 ws.addEventListener('message',e=>{const d=JSON.parse(e.data);if(d.id){const p=pending.get(d.id);if(p){pending.delete(d.id);d.error?p.reject(Error(JSON.stringify(d.error))):p.resolve(d.result)}}});
 const send=(method,params={},sessionId=sid)=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params,...(sessionId?{sessionId}:{})}));setTimeout(()=>{if(pending.has(n)){pending.delete(n);reject(Error('CDP timeout '+method))}},15000).unref()});
 const target=await send('Target.createTarget',{url:'about:blank'},null);sid=(await send('Target.attachToTarget',{targetId:target.targetId,flatten:true},null)).sessionId;await send('Runtime.enable');await send('Page.enable');
 const ev=async(expression)=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 const wait=async(expression)=>{for(let i=0;i<100;i++){if(await ev(expression))return;await new Promise(r=>setTimeout(r,50))}throw Error('Wait failed: '+expression)};
 const click=sel=>ev('document.querySelector('+JSON.stringify(sel)+').click()');
 const fill=(sel,val)=>ev('(()=>{let e=document.querySelector('+JSON.stringify(sel)+');e.value='+JSON.stringify(val)+';e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}))})()');
 const frame=()=>ev('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
 const snap=async(name)=>{await ev('document.fonts.ready');const m=await send('Page.getLayoutMetrics');const b=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:m.cssContentSize.width,height:m.cssContentSize.height,scale:1}});await writeFile(path.join(output,name+'.png'),Buffer.from(b.data,'base64'))};
 await send('Page.navigate',{url:origin+'/'});await wait('!!document.querySelector("#business")');
 await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await ev('document.fonts.ready');await ev('window.scrollTo(0,0)');await frame();assert.ok(Math.abs(await ev('document.querySelector("main").getBoundingClientRect().top'))<=2,'desktop main must stay top-aligned on a tall screen');
 const report=[];
 for(const {width,height,label} of [{width:1440,height:700,label:'desktop'},{width:390,height:700,label:'mobile390'},{width:320,height:568,label:'mobile320'}]){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<600});await ev('sessionStorage.clear()');await send('Page.reload');await wait('document.querySelector(".step:not([hidden])")?.dataset.step==="0"');await frame();await ev('document.fonts.ready');await ev('window.scrollTo(0,0)');await frame();
  await fill('#business','Prueba navegación');await fill('#location','A Coruña');
  const initial=await ev('document.querySelector(".brand-main").getBoundingClientRect().top');
  if(label==='mobile390')await snap('mobile-first');if(label==='desktop')await snap('desktop-first');
  if(width===1440){await ev('document.querySelector(".brand details").open=true');await frame();const side=await ev('(()=>{const e=document.querySelector(".brand"),y=scrollY;e.scrollTop=e.scrollHeight;return {scroll:e.scrollTop,documentUnchanged:scrollY===y}})()');assert.ok(side.scroll>0&&side.documentUnchanged,'long desktop offer must scroll independently');await ev('document.querySelector(".brand details").open=false;document.querySelector(".brand").scrollTop=0');await frame()}
  await click('#next');await wait('document.querySelector(".step:not([hidden])")?.dataset.step==="1"');
  await fill('#services','Texto largo simulado para probar navegación y scroll.');await ev('document.querySelector("#services").style.height="1000px"');
  await click('input[name="goal"][value="whatsapp"]');await frame();
  const tallTop=await ev('document.querySelector(".brand-main").getBoundingClientRect().top');
  if(width===1440)assert.ok(Math.abs(tallTop-initial)<=2,`desktop brand-main moved from ${initial} to ${tallTop} during long step`);
  await ev('window.scrollTo(0,document.documentElement.scrollHeight)');await frame();
  await click('#next');await wait('document.querySelector(".step:not([hidden])")?.dataset.step==="2"');await frame();
  const next=await ev('({top:document.querySelector("#title-2").getBoundingClientRect().top,brand:document.querySelector(".brand-main").getBoundingClientRect().top})');
  assert.ok(Math.abs(next.top-24)<=8,`${label} next heading top expected 24±8, got ${next.top}`);
  if(width===1440)assert.ok(Math.abs(next.brand-initial)<=2,`desktop brand-main shifted across steps: ${initial} -> ${next.brand}`);
  if(label==='mobile390')await snap('mobile-next');
  await ev('window.scrollTo(0,document.documentElement.scrollHeight)');await frame();await click('#back');await wait('document.querySelector(".step:not([hidden])")?.dataset.step==="1"');await frame();
  const back=await ev('document.querySelector("#title-1").getBoundingClientRect().top');assert.ok(Math.abs(back-24)<=8,`${label} back heading top expected 24±8, got ${back}`);
  report.push({viewport:label,initialBrandTop:initial,tallBrandTop:tallTop,nextHeadingTop:next.top,backHeadingTop:back});
 }
 console.log(JSON.stringify({status:'pass',cases:report,screenshots:['desktop-first.png','mobile-first.png','mobile-next.png'],evidence:output},null,2));await send('Browser.close',{},null);
}catch(e){console.error(e);process.exitCode=1}finally{try{ws?.close()}catch{}chrome.kill('SIGTERM');await new Promise(r=>server.close(r))}
