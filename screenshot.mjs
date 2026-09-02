process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSByZWNvbjUKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NSddKSkgcmV0dXJuOwogICAgJG8gPSBbJ1ZFUlNJSkEnID0+ICdTMTU5MS1SNSddOwogICAgJGluYyA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9pbmNsdWRlcy8nOwogICAgJHYgPSBmaWxlKCRpbmMuJ2NsYXNzLXZmLWltcG9ydC5waHAnKTsKICAgICRzPW51bGw7IGZvcmVhY2ggKCR2IGFzICRpPT4kbCkgaWYgKHN0cnBvcygkbCwnZnVuY3Rpb24gcGV0c2hvcF94bWxfdmZfYXR0YWNoX3RvX2V4aXN0aW5nKCcpIT09ZmFsc2UpeyRzPSRpO2JyZWFrO30KICAgIGlmICgkcyE9PW51bGwpICRvWydhdHRhY2gnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcCgncnRyaW0nLGFycmF5X3NsaWNlKCR2LCRzLDE0MCkpLCBmbigkeCk9PnRyaW0oJHgpIT09JycgJiYgIXByZWdfbWF0Y2goJy9eXHMqKFwvXC98XCp8XC9cKikvJywkeCkpKTsKICAgICRzPW51bGw7IGZvcmVhY2ggKCR2IGFzICRpPT4kbCkgaWYgKHN0cnBvcygkbCwnZnVuY3Rpb24gcGV0c2hvcF94bWxfdmZfc3RvY2tfc3luYygnKSE9PWZhbHNlKXskcz0kaTticmVhazt9CiAgICBpZiAoJHMhPT1udWxsKSAkb1snc3RvY2tfc3luYyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKCdydHJpbScsYXJyYXlfc2xpY2UoJHYsJHMsNjApKSwgZm4oJHgpPT50cmltKCR4KSE9PScnICYmICFwcmVnX21hdGNoKCcvXlxzKihcL1wvfFwqfFwvXCopLycsJHgpKSk7CiAgICAkZiA9IGZpbGUoJGluYy4nY2xhc3MtZnVsZmlsbG1lbnQucGhwJyk7CiAgICAkcz1udWxsOyBmb3JlYWNoICgkZiBhcyAkaT0+JGwpIGlmIChzdHJwb3MoJGwsJ2Z1bmN0aW9uIHVwZGF0ZV92Zl9xdHknKSE9PWZhbHNlKXskcz0kaTticmVhazt9CiAgICBpZiAoJHMhPT1udWxsKSAkb1sndXBkYXRlX3ZmX3F0eSddPWFycmF5X21hcCgncnRyaW0nLGFycmF5X3NsaWNlKCRmLCRzLDMwKSk7CiAgICAkcz1udWxsOyBmb3JlYWNoICgkZiBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvZnVuY3Rpb24gcmVjYWxjdWxhdGVcYi8nLCRsKSl7JHM9JGk7YnJlYWs7fQogICAgaWYgKCRzIT09bnVsbCkgJG9bJ3JlY2FsY3VsYXRlJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3J0cmltJyxhcnJheV9zbGljZSgkZiwkcyw3MCkpLCBmbigkeCk9PnRyaW0oJHgpIT09JycgJiYgIXByZWdfbWF0Y2goJy9eXHMqKFwvXC98XCp8XC9cKikvJywkeCkpKTsKICAgIC8vIFZGIGNhY2hlOiBuZW1hcGludHUga2F0ZWdvcmlqdSBzdSAnVkVUIGtvbnMnIHNhcmFzYXMKICAgICRydWxlcyA9IG5ldyBQZXRzaG9wX0ltcG9ydF9SdWxlc19WRigpOyAkbWFwID0gJHJ1bGVzLT5nZXRfdmZfY2F0ZWdvcnlfbWFwKCk7CiAgICAkYiA9IGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wZXRzaG9wLXZmLWNhY2hlLnhtbCcpOwogICAgcHJlZ19tYXRjaF9hbGwoJy88cm93Pi4qPzxcL3Jvdz4vcycsJGIsJHJvd3MpOyAkY2F0cz1bXTsKICAgIGZvcmVhY2ggKCRyb3dzWzBdIGFzICRydykgeyBwcmVnX21hdGNoKCcvPGNhdGVnb3J5PiguKj8pPFwvY2F0ZWdvcnk+LycsJHJ3LCRjKTsgJGNhdD0kY1sxXT8/Jyc7IGlmIChzdHJpcG9zKCRjYXQsJ1ZFVCcpIT09ZmFsc2UgfHwgc3RyaXBvcygkY2F0LCdoaXBvYWxlcmcnKSE9PWZhbHNlKSB7ICRrPSRjYXQuJyA9PiAnLigkbWFwWyRjYXRdPz8n4oCUTkVNQVBJTlRB4oCUJyk7ICRjYXRzWyRrXT0oJGNhdHNbJGtdPz8wKSsxOyB9IH0KICAgICRvWyd2ZXRfY2F0cyddPSRjYXRzOwogICAgZm9yZWFjaCAoJG1hcCBhcyAkaz0+JHZ2KSBpZiAoc3RyaXBvcygkaywna29ucycpIT09ZmFsc2UpICRvWydtYXBfa29ucyddWyRrXT0kdnY7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-080315';
const GKEY='ps_ex5';
const PHASES=["R"];
const OUT='analize/s1591_recon5.json';
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
