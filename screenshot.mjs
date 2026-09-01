process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU5IGhlcm8gcHJlbG9hZCBkaWVnaW1hcyArIFBTSSBwcmFkaW5pcyAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoIWluX2FycmF5KCRmLGFycmF5KCdESUVHVEknLCdQU0knKSx0cnVlKSkgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTU5JywnZmF6ZSc9PiRmKTsgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgdHJ5ewogICAgaWYoJGY9PT0nRElFR1RJJyl7CiAgICAgICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtaGVyby1wcmVsb2FkLnBocCc7IGlmKGZpbGVfZXhpc3RzKCRwKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignamF1IHlyYScpOyAkY29kZT1iYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lFaGxjbThnVUhKbGJHOWhaQ0IyTVM0d0lDaHdjbUZrYVc1cGJ5Qk1RMUFnY0dGMlpXbHJjMnpFbDJ4cGJ5QndjbVZzYjJGa0lDc2dabVYwWTJod2NtbHZjbWwwZVNrS0lDb2dSR1Z6WTNKcGNIUnBiMjQ2SUZCeVlXUnBibWx2SUhCMWMyeGhjR2x2SUdobGNtOGdjR0YyWldscmMyekVsMnhwY3lCNWNtRWdRMU5USUdKaFkydG5jbTkxYm1RZ0tIQnZjM1JmWTI5dWRHVnVkQ0JwYm14cGJtVWdRMU5US1N3Z2RHRmtJRzVoY3NXaGVXdHN4SmNLSUNvZ0lDQnF4SzhnWVhSeVlXNWtZU0IwYVdzZ2NHVnljMnRoYWNTTmFYVnphU0JEVTFNZzRvQ1VJRXhEVUNCemRHRnlkSFZ2YW1FZ2NHRnphM1YwYVc1cGN5QW9VekUxTlRJZ2NtVmpiMjQ2SUV4RFVDQTFMRGtnY3lCdGIySnBiR1VwTGlERm9HbHpJRzF2WkhWc2FYTUtJQ29nSUNERXJ5QThhR1ZoWkQ0Z2NISmhaR2x1YVdGdFpTQndkWE5zWVhCNWFtVWdhY1doZG1Wa1lTQThiR2x1YXlCeVpXdzlJbkJ5Wld4dllXUWlJR0Z6UFNKcGJXRm5aU0lnWm1WMFkyaHdjbWx2Y21sMGVUMGlhR2xuYUNJK0lITjFJRlJWVHlCUVFjU01TVlVnVlZKTUxBb2dLaUFnSUd0MWNzU3ZJRzVoZFdSdmFtRWdRMU5USUNoemEyRnBkRzl0WVhNZ2FjV2hJSFIxY21sdWFXOHNJR3RoWkNCMlpYSnphV3B2Y3lCd1lYSmhiV1YwY21GeklIWnBjMkZrWVNCemRYUmhjSFRGc3lEaWdKUWdhMmwwWVdsd0lHUjJhV2QxWW1GeklIQmhjbk5wYzJsMWJuUnBiV0Z6S1M0S0lDb2dWbVZ5YzJsdmJqb2dNUzR3Q2lBcUNpQXFJRk14TlRVNElDZ3lNREkyTFRBNUxUQXhLUzRnVG1sbGEyOGdibVZyWlduRWpXbGhJSFIxY21sdWVXcGxPeUJxWldrZ2FHVnlieUJEVTFNZ2NISmhaR2x1YVdGdFpTQnVaWEpoYm1SaGJXRnpJT0tBbENCdWFXVnJieUJ1WlduRm9YWmxaR0V1Q2lBcUx3cHBaaUFvSUNFZ1pHVm1hVzVsWkNnZ0owRkNVMUJCVkVnbklDa2dLU0I3SUdWNGFYUTdJSDBLQ21Ga1pGOWhZM1JwYjI0b0lDZDNjRjlvWldGa0p5d2dablZ1WTNScGIyNGdLQ2tnZXdvSmFXWWdLQ0FoSUdselgyWnliMjUwWDNCaFoyVW9LU0FwSUhzZ2NtVjBkWEp1T3lCOUNna2thV1FnUFNBb2FXNTBLU0JuWlhSZmIzQjBhVzl1S0NBbmNHRm5aVjl2Ymw5bWNtOXVkQ2NnS1RzS0NXbG1JQ2dnSVNBa2FXUWdLU0I3SUhKbGRIVnlianNnZlFvSkpIQnZjM1FnUFNCblpYUmZjRzl6ZENnZ0pHbGtJQ2s3Q2dscFppQW9JQ0VnSkhCdmMzUWdmSHdnSVNCd2NtVm5YMjFoZEdOb0tDQW5mbUpoWTJ0bmNtOTFibVF0YVcxaFoyVTZYSE1xZFhKc1hDaGNjeXBiSWx3blhUOG9XMTRpWENjcFhITmRLbWhsY204dFlYVm5hVzUwYVc1cFlXbGJYaUpjSnlsY2MxMHFLVnNpWENkZFAxeHpLbHdwZm1rbkxDQWtjRzl6ZEMwK2NHOXpkRjlqYjI1MFpXNTBMQ0FrYlNBcElDa2dleUJ5WlhSMWNtNDdJSDBLQ1NSMWNtd2dQU0FrYlZzeFhUc0tDV2xtSUNnZ01DQTlQVDBnYzNSeWNHOXpLQ0FrZFhKc0xDQW5MeThuSUNrZ0tTQjdJQ1IxY213Z1BTQW9JR2x6WDNOemJDZ3BJRDhnSjJoMGRIQnpPaWNnT2lBbmFIUjBjRG9uSUNrZ0xpQWtkWEpzT3lCOUNna3ZMeUJrWlhZZ2RtVnBaSEp2Wkdsek9pQjBkWEpwYm5seklHZGhiR2tnYkdGcGEzbDBhU0J3WlhSemFHOXdMbXgwSU9LQWxDQlZVa3dnZEhWeWFTQnpkWFJoY0hScElITjFJSFIxYnl3Z2E4U0ZJRzFoZEhseklHNWhjc1doZVd0c3hKY2djRzhnYjJJZ2NHVnljbUhGb1hsdGJ3b0pKR2h2YzNRZ1BTQndZWEp6WlY5MWNtd29JR2h2YldWZmRYSnNLQ2tzSUZCSVVGOVZVa3hmU0U5VFZDQXBPd29KSkhWeWJDQWdQU0J3Y21WblgzSmxjR3hoWTJVb0lDZCtYaWhvZEhSd2N6ODZMeThwS0hkM2Qxd3VLVDl3WlhSemFHOXdYQzVzZEg0bkxDQW5KREVuSUM0Z0pHaHZjM1FzSUNSMWNtd2dLVHNLQ1dWamFHOGdKenhzYVc1cklISmxiRDBpY0hKbGJHOWhaQ0lnWVhNOUltbHRZV2RsSWlCb2NtVm1QU0luSUM0Z1pYTmpYM1Z5YkNnZ0pIVnliQ0FwSUM0Z0p5SWdabVYwWTJod2NtbHZjbWwwZVQwaWFHbG5hQ0krSnlBdUlDSmNiaUk3Q24wc0lERWdLVHNLJyk7IGlmKG1kNSgkY29kZSkhPT0nYmNkOGQ0ZDA2NTkzMGI2NTAxYzYyODM5ODQyNWMyODMnKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtZDUnKTsgdG9rZW5fZ2V0X2FsbCgkY29kZSxUT0tFTl9QQVJTRSk7IGZpbGVfcHV0X2NvbnRlbnRzKCRwLCRjb2RlKTsgJG9bJ21kNSddPW1kNV9maWxlKCRwKTsKICAgICAgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOwogICAgfSBlbHNlIHsKICAgICAgLy8gcGHFoWlsZG9tIGNhY2hlIGlyIHRpa3JpbmFtIHByZWxvYWQKICAgICAgJGc9d3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9Pid0ZXh0L2h0bWwnKSkpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZyk7IHByZWdfbWF0Y2hfYWxsKCd+PGxpbmtbXj5dK2FzPSJpbWFnZSJbXj5dKj5+JywkYiwkbSk7ICRvWydwcmVsb2FkX2ltZyddPSRtWzBdOyBwcmVnX21hdGNoKCd+YmFja2dyb3VuZC1pbWFnZTp1cmxcKChbXildKmhlcm9bXildKilcKX4nLCRiLCRtbSk7ICRvWydjc3NfdXJsJ109JG1tWzFdPz9udWxsOwogICAgICAkdDA9bWljcm90aW1lKHRydWUpOyB3cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J3RleHQvaHRtbCcpKSk7ICRvWydtc19jYWNoZWQnXT0oaW50KXJvdW5kKChtaWNyb3RpbWUodHJ1ZSktJHQwKSoxMDAwKTsKICAgICAgZm9yZWFjaChhcnJheShob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nKSxob21lX3VybCgnL3Byb2R1Y3Qvcm95YWwtY2FuaW4tY2F0LWZ1c3N5LWV4aWdlbnQtMTAta2ctc2F1c2FzLXBhc2FyYXMtaXNyYW5raW9tcy1rYXRlbXMvJykpIGFzICR1KSB3cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9Pid0ZXh0L2h0bWwnKSkpOwogICAgICAkb1sncHNpJ109UGV0c2hvcF9TRU86OnFhX2N3dihhcnJheShob21lX3VybCgnLycpKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-112028';
const GKEY='ps_seo';
const PHASES=["DIEGTI", "PSI"];
const OUT='analize/s1559.json';
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
