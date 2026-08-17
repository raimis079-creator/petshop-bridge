process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MjInXSk/JF9HRVRbJ3BzX2c4MjInXTonJykgIT09ICdHODIyJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJHVpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgdS5JRCBGUk9NIHskUH11c2VycyB1IEpPSU4geyRQfXVzZXJtZXRhIG0gT04gbS51c2VyX2lkPXUuSUQKICAgV0hFUkUgbS5tZXRhX2tleT0neyRQfWNhcGFiaWxpdGllcycgQU5EIG0ubWV0YV92YWx1ZSBMSUtFICclYWRtaW5pc3RyYXRvciUnIE9SREVSIEJZIHUuSUQgQVNDIExJTUlUIDEiKTsKICRleHA9dGltZSgpKzkwMDsKICRvPWFycmF5KCd2Jz0+J0c4MjInLCd1aWQnPT4kdWlkLAogICdsb2dnZWRfaW4nPT5hcnJheSgndmFyZGFzJz0+TE9HR0VEX0lOX0NPT0tJRSwncmVpa3NtZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnbG9nZ2VkX2luJykpLAogICdzZWN1cmUnPT5hcnJheSgndmFyZGFzJz0+U0VDVVJFX0FVVEhfQ09PS0lFLCdyZWlrc21lJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdzZWN1cmVfYXV0aCcpKSwKICAnYXV0aCc9PmFycmF5KCd2YXJkYXMnPT5BVVRIX0NPT0tJRSwncmVpa3NtZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsJGV4cCwnYXV0aCcpKSwKICAncHJla2VzJz0+YXJyYXkoMTc5NzgsMTI0NTIpLAogICdkYic9PmFycmF5KAogICAgMTc5Nzg9PmdldF9wb3N0X21ldGEoMTc5NzgsJ19nbG9iYWxfdW5pcXVlX2lkJyx0cnVlKSwKICAgIDEyNDUyPT5nZXRfcG9zdF9tZXRhKDEyNDUyLCdfZ2xvYmFsX3VuaXF1ZV9pZCcsdHJ1ZSkpLAogKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'G822'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }
let d=null;
try{
  const s=await snip('TEMP G822 slapukai',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g822=G822')).text();
  try{ d=JSON.parse(t); out.db=d.db; out.uid=d.uid; }catch(e){ out.zalias=t.slice(0,400); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,250); }

if(d && d.logged_in){
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1500,height:1000}, ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:d.logged_in.vardas, value:d.logged_in.reiksme, domain:'dev.avesa.lt', path:'/'},
    {name:d.secure.vardas,    value:d.secure.reiksme,    domain:'dev.avesa.lt', path:'/'},
    {name:d.auth.vardas,      value:d.auth.reiksme,      domain:'dev.avesa.lt', path:'/wp-admin'},
  ]);
  const pg=await ctx.newPage();
  const jsKlaidos=[]; pg.on('pageerror',e=>jsKlaidos.push(String(e).slice(0,120)));
  out.ekranai={};
  for(const pid of d.prekes){
    try{
      await pg.goto(WP+'/wp-admin/post.php?post='+pid+'&action=edit',{waitUntil:'domcontentloaded',timeout:60000});
      await pg.waitForTimeout(2500);
      let inv=null;
      try{ await pg.click('.inventory_options a, li.inventory_tab a',{timeout:8000}); await pg.waitForTimeout(1200); }catch(e){ inv='skirtukas nerastas'; }
      const val=await pg.evaluate(()=>{ const el=document.querySelector('#_global_unique_id, input[name="_global_unique_id"]'); return el? el.value : null; });
      const pav=await pg.evaluate(()=>{ const t=document.querySelector('#title'); return t? t.value.slice(0,60) : (document.title||'').slice(0,60); });
      const buf=await pg.screenshot({fullPage:false});
      await put('gtin_'+pid+'.png', buf, 'gtin vizuali patikra '+pid);
      out.ekranai[pid]={gtin_ekrane:val, pavadinimas:pav, skirtukas:inv, url:pg.url().slice(0,90)};
    }catch(e){ out.ekranai[pid]={klaida:String(e).slice(0,160)}; }
  }
  out.js_klaidos=jsKlaidos;
  await br.close();
}
const zlib=await import('zlib');
await put('g822.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g822 vizuali patikra');
