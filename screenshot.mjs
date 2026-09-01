process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY2IFdlYlAgcmVjb24gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU2NicpOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsKICB0cnl7CiAgICAkb1snZ2Rfd2VicCddPWZ1bmN0aW9uX2V4aXN0cygnaW1hZ2V3ZWJwJyk7ICRvWydpbWFnaWNrJ109Y2xhc3NfZXhpc3RzKCdJbWFnaWNrJyk/YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihJbWFnaWNrOjpxdWVyeUZvcm1hdHMoJ1dFQlAqJykpKTpudWxsOyAkb1snZXhlYyddPWZ1bmN0aW9uX2V4aXN0cygnc2hlbGxfZXhlYycpOwogICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGJhc2U9JHVwWydiYXNlZGlyJ107ICRvWydiYXNlZGlyJ109JGJhc2U7ICRvWydkaXNrX2ZyZWVfZ2InXT1yb3VuZChkaXNrX2ZyZWVfc3BhY2UoJGJhc2UpLzEwNzM3NDE4MjQsMSk7CiAgICAkbj1hcnJheSgnanBnJz0+MCwncG5nJz0+MCwnd2VicCc9PjAsJ2pwZ19tYic9PjAsJ3BuZ19tYic9PjAsJ3dlYnBfaGFzX2pwZyc9PjApOyAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiYXNlLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRzYW1wbGU9YXJyYXkoKTsKICAgIGZvcmVhY2goJGl0IGFzICRmbCl7IGlmKG1pY3JvdGltZSh0cnVlKS0kdDA+NjApeyAkb1snc2Nhbl9wYXJ0aWFsJ109dHJ1ZTsgYnJlYWs7IH0gJGU9c3RydG9sb3dlcigkZmwtPmdldEV4dGVuc2lvbigpKTsgJHA9JGZsLT5nZXRQYXRobmFtZSgpOyBpZihzdHJwb3MoJHAsJy9jYWNoZS8nKSE9PWZhbHNlfHxzdHJwb3MoJHAsJy9wcy1iYWNrdXBzLycpIT09ZmFsc2UpIGNvbnRpbnVlOwogICAgICBpZigkZT09PSdqcGcnfHwkZT09PSdqcGVnJyl7ICRuWydqcGcnXSsrOyAkblsnanBnX21iJ10rPSRmbC0+Z2V0U2l6ZSgpOyBpZihjb3VudCgkc2FtcGxlKTwzJiYhcHJlZ19tYXRjaCgnfi1cZCt4XGQrXC5+JywkcCkpICRzYW1wbGVbXT1zdHJfcmVwbGFjZSgkYmFzZSwnJywkcCk7IH0gZWxzZWlmKCRlPT09J3BuZycpeyAkblsncG5nJ10rKzsgJG5bJ3BuZ19tYiddKz0kZmwtPmdldFNpemUoKTsgfSBlbHNlaWYoJGU9PT0nd2VicCcpeyAkblsnd2VicCddKys7IGlmKGZpbGVfZXhpc3RzKHByZWdfcmVwbGFjZSgnflwud2VicCR+JywnLmpwZycsJHApKSkgJG5bJ3dlYnBfaGFzX2pwZyddKys7IH0gfQogICAgJG5bJ2pwZ19tYiddPXJvdW5kKCRuWydqcGdfbWInXS8xMDQ4NTc2KTsgJG5bJ3BuZ19tYiddPXJvdW5kKCRuWydwbmdfbWInXS8xMDQ4NTc2KTsgJG9bJ2ZhaWxhaSddPSRuOyAkb1snc2FtcGxlJ109JHNhbXBsZTsgJG9bJ3NjYW5fcyddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kdDAsMSk7CiAgICAvLyBrb252ZXJzaWpvcyB0ZXN0YXMgc3UgMSBmYWlsdSAoR0QpLCBrb2t5YsSXIDgyCiAgICBpZigkc2FtcGxlJiYkb1snZ2Rfd2VicCddKXsgJHNyYz0kYmFzZS4kc2FtcGxlWzBdOyAkaW09QGltYWdlY3JlYXRlZnJvbWpwZWcoJHNyYyk7IGlmKCRpbSl7ICR0bXA9c3lzX2dldF90ZW1wX2RpcigpLicvcHNfd2VicF90ZXN0LndlYnAnOyAkdDE9bWljcm90aW1lKHRydWUpOyBpbWFnZXdlYnAoJGltLCR0bXAsODIpOyBpbWFnZWRlc3Ryb3koJGltKTsgJG9bJ3Rlc3QnXT1hcnJheSgnc3JjX2tiJz0+cm91bmQoZmlsZXNpemUoJHNyYykvMTAyNCksJ3dlYnBfa2InPT5yb3VuZChmaWxlc2l6ZSgkdG1wKS8xMDI0KSwnbXMnPT5yb3VuZCgobWljcm90aW1lKHRydWUpLSR0MSkqMTAwMCkpOyBAdW5saW5rKCR0bXApOyB9IH0KICAgIC8vIC5odGFjY2VzczogYXIgamF1IHlyYSB3ZWJwIHRhaXN5a2xpxbM7IEFwYWNoZSBtb2R1bGlhaQogICAgJGh0PWZpbGVfZ2V0X2NvbnRlbnRzKEFCU1BBVEguJy5odGFjY2VzcycpOyAkb1snaHRfd2VicCddPXN0cmlwb3MoJGh0LCd3ZWJwJykhPT1mYWxzZT9zdWJzdHJfY291bnQoJGh0LCd3ZWJwJyk6MDsgJG9bJ2h0X21hcmtlcnMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKGFycmF5X21hcCgndHJpbScsZXhwbG9kZSgiXG4iLCRodCkpLGZuKCRsKT0+c3RyX3N0YXJ0c193aXRoKCRsLCcjIEJFR0lOJyl8fHN0cl9zdGFydHNfd2l0aCgkbCwnIyBFTkQnKSkpOwogICAgJG9bJ2FwYWNoZV9tb2R1bGVzJ109ZnVuY3Rpb25fZXhpc3RzKCdhcGFjaGVfZ2V0X21vZHVsZXMnKT9hcnJheV92YWx1ZXMoYXJyYXlfaW50ZXJzZWN0KGFwYWNoZV9nZXRfbW9kdWxlcygpLGFycmF5KCdtb2RfcmV3cml0ZScsJ21vZF9oZWFkZXJzJywnbW9kX21pbWUnLCdtb2RfZXhwaXJlcycpKSk6J24vYSAocGhwLWZwbSknOwogICAgJG9bJ3NlcnZlcl9zdyddPSRfU0VSVkVSWydTRVJWRVJfU09GVFdBUkUnXT8/bnVsbDsgJG9bJ3BocF9tZW0nXT1pbmlfZ2V0KCdtZW1vcnlfbGltaXQnKTsgJG9bJ21heF9leGVjJ109aW5pX2dldCgnbWF4X2V4ZWN1dGlvbl90aW1lJyk7CiAgICAvLyBoZXJvIG1vYmlsZToga29raWUgZHlkxb5pYWkgcmVnaXN0cnVvdGkKICAgICRvWydpbWFnZV9zaXplcyddPXdwX2dldF9yZWdpc3RlcmVkX2ltYWdlX3N1YnNpemVzKCkgPyBhcnJheV9tYXAoZm4oJHMpPT4kc1snd2lkdGgnXS4neCcuJHNbJ2hlaWdodCddLHdwX2dldF9yZWdpc3RlcmVkX2ltYWdlX3N1YnNpemVzKCkpIDogbnVsbDsKICAgICRvWydhdHRhY2htZW50c19qcGdwbmcnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X21pbWVfdHlwZSBJTiAoJ2ltYWdlL2pwZWcnLCdpbWFnZS9wbmcnKSIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-123951';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1566b.json';
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
