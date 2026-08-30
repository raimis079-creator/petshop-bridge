process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTI4YyBwc19nZW5lcmF0ZV90b2tlbiBBUEkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19tbDMnXSl8fCRfR0VUWydwc19tbDMnXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J1MxNTI4YycpOwogIHRyeXsKICAgIGZvcmVhY2goYXJyYXkoJ3BzX2dlbmVyYXRlX3Rva2VuJywncHNfY29uc3VtZV90b2tlbicsJ3BzX3ZlcmlmeV90b2tlbicsJ3BzX3BlZWtfdG9rZW4nKSBhcyAkZm4pewogICAgICBpZihmdW5jdGlvbl9leGlzdHMoJGZuKSl7CiAgICAgICAgJHI9bmV3IFJlZmxlY3Rpb25GdW5jdGlvbigkZm4pOwogICAgICAgICRvWydmbiddWyRmbl09YXJyYXkoJ2ZhaWxhcyc9PmJhc2VuYW1lKCRyLT5nZXRGaWxlTmFtZSgpKSwKICAgICAgICAgICdwYXInPT5hcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiAoJHAtPmlzT3B0aW9uYWwoKT8nPyc6JycpLiRwLT5nZXROYW1lKCk7fSwkci0+Z2V0UGFyYW1ldGVycygpKSk7CiAgICAgICAgLy8gZnVua2Npam9zIGtvZGFzCiAgICAgICAgJGM9ZmlsZSgkci0+Z2V0RmlsZU5hbWUoKSk7CiAgICAgICAgJG9bJ2tvZGFzJ11bJGZuXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsaW1wbG9kZSgnJyxhcnJheV9zbGljZSgkYywkci0+Z2V0U3RhcnRMaW5lKCktMSxtaW4oNDUsJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrMikpKSk7CiAgICAgIH0gZWxzZSAkb1snZm4nXVskZm5dPSdORVJBJzsKICAgIH0KICAgIGdsb2JhbCAkd3BkYjsKICAgICR0PSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JHdwZGItPnByZWZpeH1wc190b2tlbnMnIik7CiAgICAkb1snbGVudGVsZSddPSR0PzonTkVSQSc7CiAgICBpZigkdCkgJG9bJ3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-193921';
const GKEY='ps_ml3';
const PHASES=["GO"];
const OUT='analize/s1528c_recon.json';
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
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
