process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU3IHNsYXNoX2NoZWNrPTEgKyBjYWNoZSBtYXRhdmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnU0VUJywnVkVSJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgndic9PidTMTU1NycsJ2ZhemUnPT4kZik7IEBzZXRfdGltZV9saW1pdCgyNTApOwogIHRyeXsKICAgIGlmKCFmdW5jdGlvbl9leGlzdHMoJ3dwX2NhY2hlX3NldHRpbmcnKSkgcmVxdWlyZV9vbmNlIFdQX1BMVUdJTl9ESVIuJy93cC1zdXBlci1jYWNoZS93cC1jYWNoZS5waHAnOwogICAgaWYoJGY9PT0nU0VUJyl7IHdwX2NhY2hlX3NldHRpbmcoJ3dwX2NhY2hlX3NsYXNoX2NoZWNrJywxKTsgd3BfY2FjaGVfc2V0dGluZygnd3BfY2FjaGVfaG9tZV9wYXRoJywnLycpOyB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyBpbmNsdWRlIFdQX0NPTlRFTlRfRElSLicvd3AtY2FjaGUtY29uZmlnLnBocCc7ICRvWydzbGFzaCddPSR3cF9jYWNoZV9zbGFzaF9jaGVjazsgJG9bJ21vZF9yZXdyaXRlJ109JHdwX2NhY2hlX21vZF9yZXdyaXRlOyAkb1snaG9tZV9wYXRoJ109JHdwX2NhY2hlX2hvbWVfcGF0aDsgfQogICAgZWxzZSB7CiAgICAgICR1cmxzPWFycmF5KCdwcmFkaW5pcyc9PmhvbWVfdXJsKCcvJyksJ2thdGVnb3JpamEnPT5ob21lX3VybCgnL2thdGVnb3JpamEvc3VuaW1zL21haXN0YXMtc3VuaW1zL3NhdXNhcy1tYWlzdGFzLXN1bmltcy8nKSwncHJla2UnPT5nZXRfcGVybWFsaW5rKGdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4xLCdmaWVsZHMnPT4naWRzJykpWzBdKSwndGFrc2FzJz0+aG9tZV91cmwoJy90YWtzYXMvJykpOwogICAgICBmb3JlYWNoKCR1cmxzIGFzICRrPT4kdSl7ICRyPWFycmF5KCk7IGZvcigkaT0wOyRpPDM7JGkrKyl7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgdmVyMycsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J3RleHQvaHRtbCcsJ0FjY2VwdC1FbmNvZGluZyc9PidnemlwJykpKTsgJHJbJ21zJ11bXT0oaW50KXJvdW5kKChtaWNyb3RpbWUodHJ1ZSktJHQwKSoxMDAwKTsgfQogICAgICAgICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXJzKCRnKS0+Z2V0QWxsKCk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnKTsgJHJbJ2NvZGUnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyk7ICRyWydjYyddPSRoWydjYWNoZS1jb250cm9sJ10/P251bGw7ICRyWydrYiddPXJvdW5kKHN0cmxlbigkYikvMTAyNCk7ICRyWydodG1sX29rJ109c3RycG9zKCRiLCc8L2h0bWw+JykhPT1mYWxzZTsgJHJbJ2Rldl91cmxzJ109c3Vic3RyX2NvdW50KCRiLCdkZXYuYXZlc2EubHQnKTsgJHJbJ3Byb2RfdXJscyddPXN1YnN0cl9jb3VudCgkYiwnaHR0cHM6Ly9wZXRzaG9wLmx0Jyk7ICRvWyd0J11bJGtdPSRyOyB9CiAgICAgIGZvcmVhY2goYXJyYXkoJ2NhcnQnPT53Y19nZXRfY2FydF91cmwoKSwnY2hlY2tvdXQnPT53Y19nZXRfY2hlY2tvdXRfdXJsKCksJ2FjY291bnQnPT53Y19nZXRfcGFnZV9wZXJtYWxpbmsoJ215YWNjb3VudCcpKSBhcyAkaz0+JHUpeyAkZz13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+NDAsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ0FjY2VwdCc9Pid0ZXh0L2h0bWwnKSkpOyAkb1snbmVfY2FjaGUnXVska109d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKVsnY2FjaGUtY29udHJvbCddPz8nZGluYW1pbmlzJzsgfQogICAgICAkZz13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J3RleHQvaHRtbCcpLCdjb29raWVzJz0+YXJyYXkobmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+J3dvb2NvbW1lcmNlX2l0ZW1zX2luX2NhcnQnLCd2YWx1ZSc9PicxJykpKSkpOyAkb1snbmVfY2FjaGUnXVsnd2NfY29va2llJ109d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKVsnY2FjaGUtY29udHJvbCddPz8nZGluYW1pbmlzJzsKICAgICAgJGc9d3BfcmVtb3RlX2dldChob21lX3VybCgnL2F1Z2ludGluaXMvJyksYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+J3RleHQvaHRtbCcpLCdyZWRpcmVjdGlvbic9PjApKTsgJG9bJ25lX2NhY2hlJ11bJ2F1Z2ludGluaXMnXT1hcnJheSh3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkZyksd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKVsnY2FjaGUtY29udHJvbCddPz8nZGluYW1pbmlzJyk7CiAgICAgICRvWydmaWxlcyddPWNvdW50KGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlLyovKi8qJyxHTE9CX0JSQUNFKSk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-111334';
const GKEY='ps_seo';
const PHASES=["SET", "VER"];
const OUT='analize/s1557.json';
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
