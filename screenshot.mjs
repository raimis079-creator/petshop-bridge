process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgQVVESVQgRyDigJQgZ3JlcCArIGxvb3BiYWNrIHRlc3QgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYXUyJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2F1MiddKSk7ICRvPWFycmF5KCk7CiAgaWYgKCRmPT09J0cnKSB7CiAgICAkZmlsZXM9YXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS8qKi8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpKTsKICAgIGZvcmVhY2goJGZpbGVzIGFzICRmcCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7ICRscz1leHBsb2RlKCJcbiIsJGMpOwogICAgICBmb3JlYWNoKCRscyBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCIvdXBkYXRlX21ldGFfZGF0YVwoXHMqJ19wc19zb3VyY2UnfGFkZF9tZXRhX2RhdGFcKFxzKidfcHNfc291cmNlJ3wnX3BzX3NvdXJjZSdccyosXHMqXFxcJHwnX3BzX29yZGVyX3R5cGUnfCdfcHNfc2hpcG1lbnRzJ1xzKix8ZnVuY3Rpb24gcmVzb2x2ZVwofGFkZF9hY3Rpb25cKFxzKid3b29jb21tZXJjZV8oY2hlY2tvdXRfb3JkZXJfcHJvY2Vzc2VkfG5ld19vcmRlcnxwYXltZW50X2NvbXBsZXRlfG9yZGVyX3N0YXR1c19wcm9jZXNzaW5nfHRoYW5reW91KScvIiwkbCkpICRvWydnJ11bYmFzZW5hbWUoZGlybmFtZSgkZnApKS4nLycuYmFzZW5hbWUoJGZwKS4nOicuKCRpKzEpXT10cmltKG1iX3N1YnN0cigkbCwwLDE0MCkpOyB9IH0KICAgIC8vIGVtcGxveWVlIGNhcHMKICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3Rlc3R1b3RvamFzJyk7ICRyPWdldF9yb2xlKCdwc19kYXJidW90b2phcycpOyAkb1sncm9sZV9jYXBzJ109JHI/YXJyYXlfa2V5cyhhcnJheV9maWx0ZXIoJHItPmNhcGFiaWxpdGllcykpOm51bGw7ICRvWydlbXAnXT0kdT8kdS0+SUQ6bnVsbDsKICAgIC8vIGxvb3BiYWNrIGthaXAgZGFyYnVvdG9qYXMKICAgIGlmKCR1KXsgJGNrPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1LT5JRCx0aW1lKCkrNjAwLCdsb2dnZWRfaW4nKTsgJGNzPWFycmF5KG5ldyBXUF9IdHRwX0Nvb2tpZShhcnJheSgnbmFtZSc9PkxPR0dFRF9JTl9DT09LSUUsJ3ZhbHVlJz0+JGNrKSkpOwogICAgICBmb3JlYWNoKGFycmF5KCdwcy1kZXNrJywncHMtZGVzayZ2aWV3PXJ5dGFzJywncHMtbGFwYWknLCdwcy1kcm9wc2hpcCcsJ3BzLXRpZWtpbWFzJywncHMtbGFpc2thaScsJ3BzLWthdGFsb2dhcycsJ3djLW9yZGVycycpIGFzICRwZyl7ICRyMj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9Jy4kcGcpLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRiPWlzX3dwX2Vycm9yKCRyMik/JHIyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyMik7ICRjb2RlPWlzX3dwX2Vycm9yKCRyMik/J2Vycic6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIyKTsgcHJlZ19tYXRjaCgnLzx0aXRsZT4oLio/KTxcL3RpdGxlPi9zJywkYiwkbSk7ICRvWydlbXBfcGFnZXMnXVskcGddPWFycmF5KCRjb2RlLHN0cmxlbigkYiksdHJpbSgkbVsxXT8/JycpLHN0cnBvcygkYiwnTmVwYWthbmthJykhPT1mYWxzZXx8c3RycG9zKCRiLCduZXR1cml0ZScpIT09ZmFsc2U/J05PLUFDQ0VTUyc6JycgKTsgfSB9CiAgICAkb1snYWRtaW5fYmFyJ109YXJyYXkoKTsgJGNrPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKDEsdGltZSgpKzYwMCwnbG9nZ2VkX2luJyk7ICRjcz1hcnJheShuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PiRjaykpKTsKICAgICRyMj13cF9yZW1vdGVfZ2V0KGFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGVzaycpLGFycmF5KCdjb29raWVzJz0+JGNzLCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydhZG1pbl9kZXNrJ109YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIyKSxzdHJsZW4od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIyKSkpOwogICAgLy8gc2hpcHBpbmcgbWV0aG9kIHRpdGxlcyBrYWlwIHNhdWdvbWEgdXpzYWt5bWUKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG9bJ3NoaXBfbGluZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvaS5vcmRlcl9pZCxvaS5vcmRlcl9pdGVtX25hbWUsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gV0hFUkUgbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG1ldGFfa2V5PSdtZXRob2RfaWQnKSBtaWQsKFNFTEVDVCBtZXRhX3ZhbHVlIEZST00geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0gV0hFUkUgbS5vcmRlcl9pdGVtX2lkPW9pLm9yZGVyX2l0ZW1faWQgQU5EIG1ldGFfa2V5PSdpbnN0YW5jZV9pZCcpIGlpZCBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBXSEVSRSBvcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBPUkRFUiBCWSBvcmRlcl9pZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogICAgJG9bJ29yZGVyX21ldGFfMzUwOTAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBtZXRhX2tleSxMRUZUKG1ldGFfdmFsdWUsNjApIHYgRlJPTSB7JHB9d2Nfb3JkZXJzX21ldGEgV0hFUkUgb3JkZXJfaWQ9MzUwOTAiLEFSUkFZX0EpOwogICAgJG9bJ2l0ZW1fbWV0YV8zNTA5MCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2l0ZW1faWQsbS5tZXRhX2tleSxMRUZUKG0ubWV0YV92YWx1ZSw0MCkgdiBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBtIE9OIG0ub3JkZXJfaXRlbV9pZD1vaS5vcmRlcl9pdGVtX2lkIFdIRVJFIG9pLm9yZGVyX2lkPTM1MDkwIEFORCBvaS5vcmRlcl9pdGVtX3R5cGU9J2xpbmVfaXRlbScgQU5EIG0ubWV0YV9rZXkgTElLRSAnX3BzJSciLEFSUkFZX0EpOwogICAgJG9bJ2xwX3Rlcm1pbmFsX3NhbXBsZSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskcH13b29fbGl0aHVhbmlhcG9zdF9scGV4cHJlc3NfdGVybWluYWxzIExJTUlUIDEiLEFSUkFZX0EpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='dep-143722';
const GKEY='ps_au2';
const PHASES=["G"];
const OUT='analize/audit_g.json';
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
