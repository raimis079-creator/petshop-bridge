process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const VER='S1548h'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,code:Buffer.from('PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ4IGh0bWwgKHNhYmxvbnUgSFRNTCB2aXp1YWxpYWkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfaDgnXSl8fCRfR0VUWydwc19oOCddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE1NDhoJyk7CiAgdHJ5ewogICAgZm9yZWFjaChhcnJheSgKICAgICAgJ29yZGVyLXBhaWQnPT5hcnJheSgnb3JkZXJfbnVtYmVyJz0+JyNUU1QtMScsJ3RvdGFsJz0+JzI0LDkwIEVVUicsJ25hbWUnPT4nUmFpbWlzJywnb3JkZXJfdXJsJz0+aG9tZV91cmwoJy8nKSksCiAgICAgICdkdW5uaW5nLTEnPT5hcnJheSgnb3JkZXJfbnVtYmVyJz0+JyNUU1QtMicsJ3RvdGFsJz0+JzEyLDAwIEVVUicsJ25hbWUnPT4nUmFpbWlzJywncGF5X3VybCc9PmhvbWVfdXJsKCcvJyksJ2V4cGlyZXNfYXQnPT4nMjAyNi0wOS0wNScpLAogICAgICAnZm91bmRpbmcnPT5hcnJheSgnbmFtZSc9PidSYWltaXMnLCdjb2RlJz0+J1BJUk1JRUpJMTAnLCdkaXNjb3VudCc9PictMTAgJSBwaXJtYW0gdcW+c2FreW11aScsJ3ZhbGlkX3VudGlsJz0+JzIwMjYtMDktMzAnLCdzaG9wX3VybCc9PmhvbWVfdXJsKCcvJykpLAogICAgKSBhcyAkdHA9PiRwYXlsb2FkKXsKICAgICAgJGZsb3dfY2xhc3M9KCdmb3VuZGluZyc9PT0kdHApPydtYXJrZXRpbmcnOid0cmFuc2FjdGlvbmFsJzsKICAgICAgJHJlY2lwaWVudD0ndGVzdEBleGFtcGxlLmNvbSc7ICRzdWJqZWN0PScnOwogICAgICBvYl9zdGFydCgpOyBpbmNsdWRlIFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy8nLiR0cC4nLnBocCc7ICRodG1sPW9iX2dldF9jbGVhbigpOwogICAgICAkb1snaHRtbCddWyR0cF09YmFzZTY0X2VuY29kZSgkaHRtbCk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8'),scope:'global',active:true,priority:5})});
  try{sid=JSON.parse(await c.text()).id; out.sid=sid;}catch(e){}
  await miegok(9000);
  const d=await fetch(WP+'/?ps_h8=GO',{headers:{'User-Agent':'Mozilla/5.0'}});
  const j=JSON.parse(await d.text());
  const pw=await import('playwright');
  const br=await pw.chromium.launch(); const pg=await (await br.newContext({viewport:{width:700,height:900}})).newPage();
  for(const [nm,b64] of Object.entries(j.html||{})){
    await pg.setContent(Buffer.from(b64,'base64').toString('utf8'),{waitUntil:'domcontentloaded'});
    await pg.waitForTimeout(1500);
    out[nm]=await put('screenshots/s1548_'+nm+'.png',await pg.screenshot({fullPage:true}),VER+' '+nm);
  }
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/s1548_h.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
