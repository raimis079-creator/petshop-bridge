process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjEnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVIyJ107CiAgICAkc3M9ZmlsZSgkV1BNVT1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXNlc2VsaWFpLnBocCcpOyAkb1snZWlsJ109Y291bnQoJHNzKTsKICAgIGZvcmVhY2ggKCRzcyBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvcHJhbGVpc3R8c2tpcHxjb250aW51ZXxyZXR1cm58X3piX2xhc3Rfc3luY3xfemJfcXR5fHNoYWRvd19vZnxmdW5jdGlvbiAvJywkbCkpICRvWydrb2RhcyddW109KCRpKzEpLic6Jy50cmltKG1iX3N1YnN0cigkbCwwLDE1MCkpOwogICAgJGF2PSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NoYWRvd19vZiciKTsgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkYXYpKTsKICAgIGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBvc3RfaWQsbWV0YV9rZXksbWV0YV92YWx1ZSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBwb3N0X2lkIElOICgkaW4pIEFORCBtZXRhX2tleSBJTiAoJ19za3UnLCdfemJfcXR5JywnX3piX2Nvc3QnLCdfemJfbGFzdF9zeW5jJywnX3N0b2NrJywnX293bl9zdG9ja19xdHknLCdfYWN0aXZlX2Z1bGZpbGxtZW50X3NvdXJjZScsJ19zdG9ja19zdGF0dXMnKSIpIGFzICRtKSAkb1snYXYnXVskbS0+cG9zdF9pZF1bJG0tPm1ldGFfa2V5XT0kbS0+bWV0YV92YWx1ZTsKICAgIGZvcmVhY2ggKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG0ucG9zdF9pZCwgbS5tZXRhX3ZhbHVlIGF2IEZST00geyRwfXBvc3RtZXRhIG0gV0hFUkUgbS5tZXRhX2tleT0nX3BzX3NoYWRvd19vZiciKSBhcyAkcykgeyAkb1snc2hhZG93J11bJHMtPnBvc3RfaWRdPVsnYXYnPT4kcy0+YXYsJ3piX3F0eSc9PmdldF9wb3N0X21ldGEoJHMtPnBvc3RfaWQsJ196Yl9xdHknLHRydWUpLCdzeW5jJz0+Z2V0X3Bvc3RfbWV0YSgkcy0+cG9zdF9pZCwnX3piX2xhc3Rfc3luYycsdHJ1ZSksJ3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkcy0+cG9zdF9pZCwnX3N0b2NrJyx0cnVlKSwnc3RhdHVzJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRzLT5wb3N0X2lkKV07IH0KICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-092340';
const GKEY='ps_ex21';
const PHASES=["R"];
const OUT='analize/s1593_r2.json';
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
