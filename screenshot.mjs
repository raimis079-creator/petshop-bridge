process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdRVklTJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidRVklTJywndHMnPT5kYXRlKCdZLW0tZCBIOmk6cycpKTsKICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xKSk7ICR1aWQ9JGFkbT8kYWRtWzBdLT5JRDoxOwogJG9bJ2Nvb2tpZV9uYW1lJ109TE9HR0VEX0lOX0NPT0tJRTsgJG9bJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzYwMCwnbG9nZ2VkX2luJyk7CiAkb1snc2VjX25hbWUnXT1TRUNVUkVfQVVUSF9DT09LSUU7ICRvWydzZWNfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLHRpbWUoKSs2MDAsJ3NlY3VyZV9hdXRoJyk7CiAkb1snYXV0aF9uYW1lJ109QVVUSF9DT09LSUU7ICRvWydhdXRoX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrNjAwLCdhdXRoJyk7CiAkYj1nZXRfb3B0aW9uKCdwc19xdWF0dHJvX3NhdmlrYWludV9iYWtfMjAyNjA4MTcnKTsgJGlkcz1pc19hcnJheSgkYik/YXJyYXlfa2V5cygkYlsnc2VuYSddKTphcnJheSgpOwogJG9bJ3B2el9pZCddPWFycmF5X3NsaWNlKCRpZHMsMCw2KTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'QVIS'};
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
  const s=await snip('TEMP QVIS',B64);
  await new Promise(r=>setTimeout(r,6000));
  const prep=JSON.parse(await (await fetch(WP+'/?ps_sv=QVIS')).text());
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
  const id=16718;
  await p.goto(WP+'/wp-admin/post.php?post='+id+'&action=edit',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,2500));
  out.kortele=await p.evaluate(()=>{
    const t=document.body.innerText;
    const i=t.toLowerCase().indexOf('savikain');
    return {rado: i>=0, iskarpa: i>=0? t.slice(Math.max(0,i-160), i+320) : t.slice(0,200)};
  });
  await put('q_kortele.png', await p.screenshot({fullPage:false}), 'kortele su savikaina');
  await p.goto(WP+'/wp-admin/admin.php?page=ps-katalogas&eile=be_savikainos',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,2500));
  await put('q_katalogas.png', await p.screenshot({fullPage:false}), 'katalogo eile');
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('qvis.json', Buffer.from(JSON.stringify(out)), 'qvis');
console.log('ok');
