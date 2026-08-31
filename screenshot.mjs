process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIG1lbml1IHJlY29uICovCmFkZF9hY3Rpb24oJ2FkbWluX21lbnUnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfbW4nXSl8fCRfR0VUWydwc19tbiddIT09J1InKSByZXR1cm47CiAgZ2xvYmFsICRzdWJtZW51LCRtZW51OyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgpOwogIGZvcmVhY2goJG1lbnUgYXMgJG0peyBpZihzdHJpcG9zKCRtWzBdLCdwZXRzaG9wJykhPT1mYWxzZXx8c3RyaXBvcygkbVsyXSwncGV0c2hvcCcpIT09ZmFsc2UpICRvWyd0b3AnXVtdPWFycmF5KCRtWzBdLCRtWzJdLCRtWzZdPz8nJyk7IH0KICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWxhbmdhaScsJ3BldHNob3AtdXpzYWt5bWFpJywncGV0c2hvcC1wcmVrZXMnLCdwZXRzaG9wLWF0YXNrYWl0b3MnKSBhcyAkcHMpeyBpZihpc3NldCgkc3VibWVudVskcHNdKSkgZm9yZWFjaCgkc3VibWVudVskcHNdIGFzICRpdCl7ICRoPWdldF9wbHVnaW5fcGFnZV9ob29rbmFtZSgkaXRbMl0sJHBzKTsgJG9bJ3N1YiddWyRwc11bXT1hcnJheSgkaXRbMF0sJGl0WzJdLCRoLGhhc19hY3Rpb24oJGgpPydjYic6Jy0nKTsgfSB9CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYW1wYW5panUtbGFuZ2FzLnBocCcpOyBwcmVnX21hdGNoX2FsbCgiLyhhZG1pbl9tZW51fGFkZF9hY3Rpb25cKFteKV17MCw4MH18cGFnZT1bYS16XC1fXSt8J3BldHNob3AtW2EtelwtXSsnKS8iLCRjLCRtKTsgJG9bJ2thbXAnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRtWzBdKSk7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw5OTk5KTsK';
const VER='dep-164130';
const GKEY='ps_mn';
const PHASES=["R"];
const OUT='analize/mn_recon.json';
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
