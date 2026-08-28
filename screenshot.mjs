process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEZha3QgU2NoZW1hIFJlY29uCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoIWlzc2V0KCRfR0VUWydwc19mc2NoJ10pIHx8ICRfR0VUWydwc19mc2NoJ10hPT0nR08nKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J0ZTQ0gnKTsKIGZvcmVhY2goYXJyYXkoJ3BzX2Zha3RfZWlsdXRlcycsJ3BzX2Zha3RfdXpzYWt5bWFpJykgYXMgJHQpewogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiREVTQ1JJQkUgeyR3cGRiLT5wcmVmaXh9eyR0fSIsQVJSQVlfQSk7CiAgaWYoJHJvd3MpIGZvcmVhY2goJHJvd3MgYXMgJHIpICRvWyR0XVtdPSRyWydGaWVsZCddLicgJy4kclsnVHlwZSddOwogIGVsc2UgJG9bJHRdPSdORVJBJzsKIH0KICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+YXJyYXkoJ0lEJywndXNlcl9sb2dpbicpKSk7CiAkb1snYWRtaW4nXT0kdT9hcnJheSgoaW50KSR1WzBdLT5JRCwkdVswXS0+dXNlcl9sb2dpbik6bnVsbDsKICRvWydjcm9uX25hdWRvamEnXT0gKGludCkgKGRlZmluZWQoJ0RJU0FCTEVfV1BfQ1JPTicpICYmIERJU0FCTEVfV1BfQ1JPTik7CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==' ; const VER='FSCH';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Fakt Schema Recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  const r=await fx(WP+'/?ps_fsch=GO',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.duom=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,2000); }
  for(const p of ['/','/krepselis/']){
    try{ const pr=await fetch(WP+p,{redirect:'manual'}); out.zingsniai.push('psl:'+p+'='+pr.status); }catch(e){ out.zingsniai.push('psl:'+p+'=ERR'); }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/fsch.json', Buffer.from(JSON.stringify(out,null,1)), VER);
