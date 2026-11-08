try{
 const response=await fetch('http://127.0.0.1:'+(process.env.PORT||4180)+'/healthz',{signal:AbortSignal.timeout(2500)});
 const state=await response.json();
 if(!response.ok||state.service!=='lareira-brief-mail'||state.release!==(process.env.RELEASE_SHA||'dev')||typeof state.acceptingSubmissions!=='boolean')process.exitCode=1;
}catch{process.exitCode=1}
