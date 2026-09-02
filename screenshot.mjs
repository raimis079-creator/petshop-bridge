process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NjInXSkpIHJldHVybjsKICAgICRvPVsnVkVSU0lKQSc9PidTMTYwMC1GMSddOwogICAgJG9bJ2tsYXNlcyddPWFycmF5X21hcChmbigkdCk9PlskdC0+dGVybV9pZCwkdC0+c2x1ZywkdC0+bmFtZSwkdC0+Y291bnRdLGdldF90ZXJtcyhbJ3RheG9ub215Jz0+J3Byb2R1Y3Rfc2hpcHBpbmdfY2xhc3MnLCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKSk7CiAgICBmb3JlYWNoIChbMTY5OTY9PjAuMDUsMTY5OTk9PjAuMDUsMTY5NzY9PjAuMjVdIGFzICRpZD0+JHcpIHsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7ICRvWydwcmllcyddWyRpZF09JHByLT5nZXRfd2VpZ2h0KCk7ICRwci0+c2V0X3dlaWdodCgkdyk7ICRwci0+c2F2ZSgpOyB9CiAgICBmb3JlYWNoIChbMzUzOTY9PjAuNCwzNTM5OD0+MC4zNSwzNTQwMD0+Mi41XSBhcyAkaWQ9PiR3KSB7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkcHItPnNldF93ZWlnaHQoJHcpOyAkcHItPnNhdmUoKTsgdXBkYXRlX3Bvc3RfbWV0YSgkaWQsJ193ZWlnaHQnLCR3KTsgJG9bJ3N2J11bJGlkXT13Y19nZXRfcHJvZHVjdCgkaWQpLT5nZXRfd2VpZ2h0KCk7IH0KICAgIHdwX3NldF9vYmplY3RfdGVybXMoMzU0MDAsWzI1M10sJ3BhX2d5dnVub19ydXNpcycsZmFsc2UpOyAkYT1nZXRfcG9zdF9tZXRhKDM1NDAwLCdfcHJvZHVjdF9hdHRyaWJ1dGVzJyx0cnVlKTsgaWYoIWlzX2FycmF5KCRhKSkgJGE9W107IGlmKCFpc3NldCgkYVsncGFfZ3l2dW5vX3J1c2lzJ10pKXsgJGFbJ3BhX2d5dnVub19ydXNpcyddPVsnbmFtZSc9PidwYV9neXZ1bm9fcnVzaXMnLCd2YWx1ZSc9PicnLCdwb3NpdGlvbic9PjAsJ2lzX3Zpc2libGUnPT4xLCdpc192YXJpYXRpb24nPT4wLCdpc190YXhvbm9teSc9PjFdOyB1cGRhdGVfcG9zdF9tZXRhKDM1NDAwLCdfcHJvZHVjdF9hdHRyaWJ1dGVzJywkYSk7fSAkb1sncnVzaXNfMzU0MDAnXT13cF9nZXRfcG9zdF90ZXJtcygzNTQwMCwncGFfZ3l2dW5vX3J1c2lzJyxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgICRvWydzY190dWFsZXRhaSddPWFycmF5X21hcChmbigkaWQpPT5bJGlkLHdjX2dldF9wcm9kdWN0KCRpZCktPmdldF9zaGlwcGluZ19jbGFzcygpLHdjX2dldF9wcm9kdWN0KCRpZCktPmdldF93ZWlnaHQoKV0sWzE1OTI4LDE1OTIwLDE1ODcwLDE5MTQwXSk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-133845';
const GKEY='ps_ex62';
const PHASES=["R"];
const OUT='analize/s1600_fix.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
