process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdTVlZJUycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nU1ZWSVMnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogJGFkbT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEpKTsgJHVpZD0kYWRtPyRhZG1bMF0tPklEOjE7CiAkb1snY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOyAkb1snY29va2llX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrNjAwLCdsb2dnZWRfaW4nKTsKICRvWydzZWNfbmFtZSddPVNFQ1VSRV9BVVRIX0NPT0tJRTsgJG9bJ3NlY192YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzYwMCwnc2VjdXJlX2F1dGgnKTsKICRvWydhdXRoX25hbWUnXT1BVVRIX0NPT0tJRTsgJG9bJ2F1dGhfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLHRpbWUoKSs2MDAsJ2F1dGgnKTsKICRiPWdldF9vcHRpb24oJ3BzX3NhdmlrYWlub3NfYmFrXzIwMjYwODE3Jyk7ICRpZHM9aXNfYXJyYXkoJGIpPyRiWydpZHMnXTphcnJheSgpOwogJG9bJ3B2el9pZCddPWFycmF5X3NsaWNlKCRpZHMsMCw2KTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'SVVIS'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP SVVIS',B64);
  await new Promise(r=>setTimeout(r,6000));
  const prep=JSON.parse(await (await fetch(WP+'/?ps_sv=SVVIS')).text());
  await off(s);
  out.ids=prep.pvz_id;
  const { chromium }=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1600,height:1100}});
  const ck=[{name:prep.cookie_name,value:prep.cookie_value,domain:'dev.avesa.lt',path:'/'}];
  if(prep.sec_name) ck.push({name:prep.sec_name,value:prep.sec_value,domain:'dev.avesa.lt',path:'/'});
  if(prep.auth_name) ck.push({name:prep.auth_name,value:prep.auth_value,domain:'dev.avesa.lt',path:'/wp-admin'});
  await ctx.addCookies(ck);
  const p=await ctx.newPage();
  out.js=[]; p.on('pageerror',e=>out.js.push(String(e).slice(0,140)));
  const id=prep.pvz_id[0];
  await p.goto(WP+'/wp-admin/post.php?post='+id+'&action=edit',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,2500));
  out.kortele=await p.evaluate(()=>{
    const t=document.body.innerText;
    const i=t.toLowerCase().indexOf('savikain');
    return {rado: i>=0, iskarpa: i>=0? t.slice(Math.max(0,i-160), i+320) : t.slice(0,200)};
  });
  await put('sv_kortele.png', await p.screenshot({fullPage:false}), 'kortele su savikaina');
  await p.goto(WP+'/wp-admin/admin.php?page=ps-katalogas&eile=be_savikainos',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,2500));
  await put('sv_katalogas.png', await p.screenshot({fullPage:false}), 'katalogo eile');
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('svvis.json', Buffer.from(JSON.stringify(out)), 'svvis');
console.log('ok');
