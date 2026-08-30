process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGthdGFsb2dvIGtvcnRlbGVzIHJlY29uIDIgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnKSE9PSdLMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0tBVC1SMicpOwogICRzcmM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJyk7CiAgJG9bJ2RvX2FjdGlvbiddPXByZWdfbWF0Y2hfYWxsKCcvZG9fYWN0aW9uXChccypbXCciXShbYS16X10rKS8nLCRzcmMsJG0pPyRtWzFdOmFycmF5KCk7CiAgJG9bJ2ZpbHRlcnMnXT1wcmVnX21hdGNoX2FsbCgnL2FwcGx5X2ZpbHRlcnNcKFxzKltcJyJdKHBldHNob3Bfa2F0W2Etel9dKikvJywkc3JjLCRtMik/YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbTJbMV0pKTphcnJheSgpOwogIC8vIGtvcnRlbGUoKSBrdW5hczogbnVvIDI4ODEgaWtpIGtvcnRfYXByYXN5bWFpICgzNTc4KQogICRlaWw9ZXhwbG9kZSgiXG4iLCRzcmMpOwogICRvWydrb3J0ZWxlX3ByYWR6aWEnXT1hcnJheV9tYXAoJ3RyaW0nLGFycmF5X3NsaWNlKCRlaWwsMjg4MCwzMCkpOwogIC8vIHJhc3RpIGt1ciBrb3J0ZWxlIGJhaWdpYXNpIOKAlCBncmF6aW5hIGh0bWw/IGllc2thdSAncmV0dXJuJyBhcmJhIGVjaG8gZ2FsZQogICRnYWI9aW1wbG9kZSgiXG4iLGFycmF5X3NsaWNlKCRlaWwsMjg4MCw3MDApKTsKICBwcmVnX21hdGNoX2FsbCgnL2tvcnRfW2Etel9dK1woLycsJGdhYiwkbTMpOwogICRvWydrb3J0X2Jsb2thaV9rdmllY2lhbWknXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtM1swXSkpOwogIC8vIHBhc2t1dGluZXMga29ydGVsZSgpIGVpbHV0ZXMgcHJpZXMga29ydF9hcHJhc3ltYWkKICAkb1sna29ydGVsZV9nYWxhcyddPWFycmF5X21hcCgndHJpbScsYXJyYXlfc2xpY2UoJGVpbCwzNTYwLDE3KSk7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='f19_kat2-092932';
const GKEY='ps_f19';
const PHASES=["K2"];
const OUT='analize/f19_kat2.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
