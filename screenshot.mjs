process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGRyYXdlciBkaWFnK2ZpeCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJzsgaWYoJGYhPT0nREYnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidERi0xLjAnKTsKICB0cnl7CiAgICAkb1snZmxhZ19wcmllcyddPWdldF9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX2lqdW5ndGEnLCcobmVyYSknKTsKICAgICRvWydza3VfcHJpZXMnXT1nZXRfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9za3UnLGFycmF5KCkpOwogICAgJG9bJ3plbWVsYXBpc19wcmllcyddPVBldHNob3BfUHJlbnVtZXJhdGFfS2F0YWxvZ2FzOjp6ZW1lbGFwaXMoKTsKICAgIGlmKGNvdW50KCRvWyd6ZW1lbGFwaXNfcHJpZXMnXSk8MSl7CiAgICAgICRzaz1hcnJheSgpOwogICAgICBmb3JlYWNoKGFycmF5KDM1MDk3LDM1MDk4LDM1MDk5KSBhcyAkcGlkKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCRwJiYkcC0+Z2V0X3NrdSgpKSAkc2tbXT0kcC0+Z2V0X3NrdSgpOyB9CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX3ByZW51bWVyYXRhX3NrdScsJHNrLGZhbHNlKTsKICAgICAgZGVsZXRlX3RyYW5zaWVudCgncHNfcHJlbl9za3VfaWQnKTsKICAgICAgJG9bJ2lyYXN5dGFfdGVzdGluZXMnXT0kc2s7CiAgICB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19wcmVudW1lcmF0YV9panVuZ3RhJywndGFpcCcsZmFsc2UpOwogICAgZGVsZXRlX3RyYW5zaWVudCgncHNfcHJlbl9za3VfaWQnKTsKICAgICRvWydmbGFnX3BvJ109Z2V0X29wdGlvbigncHNfcHJlbnVtZXJhdGFfaWp1bmd0YScpOwogICAgJG9bJ3plbWVsYXBpc19wbyddPVBldHNob3BfUHJlbnVtZXJhdGFfS2F0YWxvZ2FzOjp6ZW1lbGFwaXMoKTsKICAgICRvWydpanVuZ3RhX3BvJ109UGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OmlqdW5ndGEoKTsKICAgIGZvcmVhY2goJG9bJ3plbWVsYXBpc19wbyddIGFzICRza3U9PiRwaWQpeyAkb1snZ2FsaW1hJ11bJHNrdV09UGV0c2hvcF9QcmVudW1lcmF0YV9LYXRhbG9nYXM6OmdhbGltYSgkcGlkKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='f19_diag_fix-161835';
const GKEY='ps_f19';
const PHASES=["DF"];
const OUT='analize/f19_df_1788106715.json';
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
