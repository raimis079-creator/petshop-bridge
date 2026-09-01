process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTg4IG1wIHJha3RhcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21wayddKSB8fCAkX0dFVFsncHNfbXBrJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE1ODgnKTsKICB0cnl7CiAgICBkZWxldGVfb3B0aW9uKCdwc19nYTRfbXBfc2VjcmV0Jyk7IGFkZF9vcHRpb24oJ3BzX2dhNF9tcF9zZWNyZXQnLCc1R0diUDJHeFJNYTBMQ0RQWUxTbmFnJywnJywnbm8nKTsKICAgICRvWydyYWt0YXMnXT1QZXRzaG9wX0dBNF9TZXJ2ZXJpczo6c2VjcmV0KCk/J3lyYSc6J25lcmEnOyAkb1snYXV0b2xvYWQnXT0kR0xPQkFMU1snd3BkYiddLT5nZXRfdmFyKCJTRUxFQ1QgYXV0b2xvYWQgRlJPTSB7JEdMT0JBTFNbJ3dwZGInXS0+cHJlZml4fW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWU9J3BzX2dhNF9tcF9zZWNyZXQnIik7CiAgICAkdj1QZXRzaG9wX0dBNF9TZXJ2ZXJpczo6dmFsaWR1b3RpKDM1MTAwKTsgJG9bJ2RyeV9odHRwJ109JHZbJ2h0dHAnXTsgJG9bJ2RyeV9tc2dzJ109JHZbJ2F0c2FrYXMnXTsKICAgICR2Mj1QZXRzaG9wX0dBNF9TZXJ2ZXJpczo6dmFsaWR1b3RpKDM1MDg4KTsgJG9bJ2RyeTJfaHR0cCddPSR2MlsnaHR0cCddOyAkb1snZHJ5Ml9tc2dzJ109JHYyWydhdHNha2FzJ107ICRvWydkcnkyX2NpZCddPSR2MlsncGF5bG9hZCddWydjbGllbnRfaWQnXTsKICAgIC8vIGRldidlIHJlYWxhdXMgc2l1bnRpbW8gYmxva2FzOiBpxaFrdmllc3RpIHNpdXN0aSgpIHRlc3RpbmlhbSB1xb5zYWt5bXVpIGlyIHBhdGlrcmludGkgxb55bcSFCiAgICBQZXRzaG9wX0dBNF9TZXJ2ZXJpczo6c2l1c3RpKDM1MDg4KTsgJG9yZD13Y19nZXRfb3JkZXIoMzUwODgpOyAkb1snZGV2X3p5bWEnXT0kb3JkLT5nZXRfbWV0YSgnX3BzX2dhNF9tcF9rb2RhcycpOyAkb1snZGV2X2F0J109JG9yZC0+Z2V0X21ldGEoJ19wc19nYTRfbXBfYXQnKTsKICAgICRvcmQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19nYTRfbXBfa29kYXMnKTsgJG9yZC0+c2F2ZSgpOwogICAgJG9bJ3Byb2QnXT1QZXRzaG9wX0dBNF9TZXJ2ZXJpczo6cHJvZCgpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-193147';
const GKEY='ps_mpk';
const PHASES=["GO"];
const OUT='analize/s1588_mp.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
