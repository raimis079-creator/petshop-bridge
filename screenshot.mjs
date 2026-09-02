process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NjEnXSkpIHJldHVybjsKICAgIGluaV9zZXQoJ21lbW9yeV9saW1pdCcsJzc2OE0nKTsgJG89WydWRVJTSUpBJz0+J1MxNjAwLVYxJ107CiAgICAkaWRzPVszNTM5MiwzNTM5NCwzNTM5NiwzNTM5OCwzNTQwMCwzNTQwMiwzNTQwNCwzNTQwNiwzNTQwOCwzNTQxMCwzNTQxMl07CiAgICAkc2FyPVBldHNob3BfUmlua2luaWFpOjpyaW5raW5pYWkoKTsgJG1hcD1bXTsgZm9yZWFjaCAoJHNhciBhcyAkcikgJG1hcFsoaW50KSRyWydpZCddXT0kcjsKICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkcj0kbWFwWyRpZF0/P1tdOyAkb1snciddWyRpZF09WydwYXYnPT5tYl9zdWJzdHIoJHByLT5nZXRfbmFtZSgpLDAsNDUpLCdzdCc9PiRwci0+Z2V0X3N0YXR1cygpLCdrYWluYSc9PiRwci0+Z2V0X3ByaWNlKCksJ3Nhdic9PiRyWydzYXZpa2FpbmEnXT8/bnVsbCwnbWFyemEnPT4kclsnbWFyemEnXT8/bnVsbCwncGN0Jz0+aXNzZXQoJHJbJ21hcnphJ10sJHJbJ2thaW5hJ10pJiYkclsna2FpbmEnXT4wP3JvdW5kKCRyWydtYXJ6YSddLyRyWydrYWluYSddKjEwMCk6bnVsbCwnc2FuZCc9PmFycmF5X3ZhbHVlcygoYXJyYXkpKCRyWydzYW5kZWxpYWknXT8/W10pKSwndHJ1a3N0YSc9PiRyWyd0cnVrc3RhJ10/P251bGwsJ3N2b3Jpcyc9PiRwci0+Z2V0X3dlaWdodCgpLCdzYyc9PiRwci0+Z2V0X3NoaXBwaW5nX2NsYXNzKCksJ2thdCc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pLCdydXNpcyc9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfZ3l2dW5vX3J1c2lzJyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwnaW1nJz0+JHByLT5nZXRfaW1hZ2VfaWQoKT8xOjAsJ3ZudCc9PiRyWyd2bnQnXT8/bnVsbCwncHJldmlldyc9PmdldF9wcmV2aWV3X3Bvc3RfbGluaygkaWQpXTsgfQogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-133700';
const GKEY='ps_ex61';
const PHASES=["R"];
const OUT='analize/s1600_v.json';
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
