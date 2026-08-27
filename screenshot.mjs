process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEFkcyBwYXRpa3JhCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19hYyddKSB8fCAkX0dFVFsncHNfYWMnXSE9PSdBQzI4JykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4Lidwc19mYWt0X3Jla2xhbWEnOwogJG89YXJyYXkoCiAgJ3Bhc2t1dGluaXNfZ2F2aW1hcyc9PmdldF9vcHRpb24oJ3BzX2Fkc19wYXNrdXRpbmlzJyksCiAgJ2VpbHV0ZXMnPT4kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBkaWVuYSxrYW5hbGFzLGthbXBhbmlqYV9pZCxrYW1wYW5pamEscGFzcGF1ZGltYWksaXNsYWlkb3NfY3Qsa29udmVyc2lqb3Msc2FsdGluaXMsdmVyc2lqYSxpcmFzeXRhX2F0IEZST00gJHQgT1JERVIgQlkgZGllbmEgREVTQywgaXNsYWlkb3NfY3QgREVTQyBMSU1JVCAyNSIsQVJSQVlfQSksCiAgJ3Zpc28nPT4kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIENPVU5UKCopIG4sIFNVTShpc2xhaWRvc19jdCkgYywgTUlOKGRpZW5hKSBudW8sIE1BWChkaWVuYSkgaWtpIEZST00gJHQgV0hFUkUgc2FsdGluaXM9J2Fkc19zY3JpcHQnIixBUlJBWV9BKSwKICk7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const VER='AC28';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  /* 1. isjungiam senus TEMP */
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  /* 2. kuriam recon snippeta */
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Ads patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_ac=AC28',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/adschk2.json', Buffer.from(JSON.stringify(out,null,1)), VER);
