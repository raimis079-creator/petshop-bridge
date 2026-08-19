process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA5OSddKSA/ICRfR0VUWydwc19oMDk5J10gOiAnJykgIT09ICdGRUVEJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7IEBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCc1MTJNJyk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gwOTknKTsKICR1cCA9IHdwX3VwbG9hZF9kaXIoKTsgJGZkID0gdHJhaWxpbmdzbGFzaGl0KCR1cFsnYmFzZWRpciddKS4ncGV0c2hvcC1mZWVkcy8nOwoKICRwcmllcyA9IGFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCdnb29nbGUueG1sJywna2FpbmEyNC54bWwnLCdrYWlub3MueG1sJykgYXMgJGYpewogICAkcCA9ICRmZC4kZjsKICAgJHByaWVzWyRmXSA9IGZpbGVfZXhpc3RzKCRwKSA/IGFycmF5KCdLQic9PnJvdW5kKGZpbGVzaXplKCRwKS8xMDI0KSwgJ2RhdGEnPT5kYXRlKCdZLW0tZCBIOmknLCBmaWxlbXRpbWUoJHApKSkgOiAnbmVyYSc7CiB9CiAkb1sncHJpZXMnXSA9ICRwcmllczsKCiAkdDAgPSBtaWNyb3RpbWUodHJ1ZSk7CiBkb19hY3Rpb24oJ3BzX2ZlZWRzX25ha3RpbmlzJyk7CiAkb1sndHJ1a21lX3MnXSA9IHJvdW5kKG1pY3JvdGltZSh0cnVlKS0kdDAsIDEpOwogJG9bJ2F0bWludGlzX01CJ10gPSByb3VuZChtZW1vcnlfZ2V0X3BlYWtfdXNhZ2UodHJ1ZSkvMTA0ODU3NiwgMSk7CgogY2xlYXJzdGF0Y2FjaGUoKTsKIGZvcmVhY2goYXJyYXkoJ2dvb2dsZS54bWwnLCdrYWluYTI0LnhtbCcsJ2thaW5vcy54bWwnKSBhcyAkZil7CiAgICRwID0gJGZkLiRmOwogICBpZighZmlsZV9leGlzdHMoJHApKXsgJG9bJ3BvJ11bJGZdPSduZXJhJzsgY29udGludWU7IH0KICAgJHQgPSBAZmlsZV9nZXRfY29udGVudHMoJHApOwogICAkb1sncG8nXVskZl0gPSBhcnJheSgKICAgICAnS0InICAgICAgICA9PiByb3VuZChmaWxlc2l6ZSgkcCkvMTAyNCksCiAgICAgJ2RhdGEnICAgICAgPT4gZGF0ZSgnWS1tLWQgSDppJywgZmlsZW10aW1lKCRwKSksCiAgICAgJ2NkYXRhX2FtcCcgPT4gcHJlZ19tYXRjaF9hbGwoJy88IVxbQ0RBVEFcW1teXF1dKiZhbXA7W15cXV0qXF1cXT4vJywgJHQpLAogICAgICdhbXBfYW1wJyAgID0+IHN1YnN0cl9jb3VudCgkdCwgJyZhbXA7YW1wOycpLAogICAgICdhbXBfdmlzbycgID0+IHN1YnN0cl9jb3VudCgkdCwgJyZhbXA7JyksCiAgICk7CiAgIGlmKHByZWdfbWF0Y2goJy9bXjw+XSooRkFSTUlOQXxFdWthbnViYXxHZW1vbilbXjw+XSovdScsICR0LCAkbSkpICRvWydwYXZ5emR5cyddWyRmXSA9IHN1YnN0cigkbVswXSwwLDE0MCk7CiB9CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H099'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H099 feed pergeneravimas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const ctl=new AbortController(); const tmr=setTimeout(()=>ctl.abort(), 600000);
  let tt='';
  try{ const rr=await fetch(WP+'/?ps_h099=FEED',{signal:ctl.signal}); tt=await rr.text(); }
  catch(e){ tt='NUTRUKO: '+String(e).slice(0,120); }
  clearTimeout(tmr);
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  for(const p of ['/feed/google/','/feed/kaina24/','/feed/kainos/']){
    try{ const r=await fetch(WP+p); const t=await r.text();
      out['URL'+p]={http:r.status, KB:Math.round(t.length/1024),
        cdata_amp:(t.match(/<!\[CDATA\[[^\]]*&amp;[^\]]*\]\]>/g)||[]).length,
        pavyzdys:(t.match(/[^<>]*(FARMINA|Eukanuba|Gemon)[^<>]*/)||[''])[0].slice(0,130)};
    }catch(e){ out['URL'+p]={klaida:String(e).slice(0,80)}; }
  }
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h099.json', Buffer.from(JSON.stringify(out,null,1)), 'h099 feed pergeneravimas');
