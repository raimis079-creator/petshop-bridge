process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBQT0MgaW5zdGFsbCtyZWNvbiB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19mMTknXSk/JF9HRVRbJ3BzX2YxOSddOicnOwogIGlmKCFpbl9hcnJheSgkdixhcnJheSgnSTEnLCdSMScpLHRydWUpKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidGMTlQLTEuMCcsJ2ZhemUnPT4kdik7CiAgdHJ5ewogICAgJGFkbT1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ2ZpZWxkcyc9PidJRCcpKTsKICAgIHdwX3NldF9jdXJyZW50X3VzZXIoKGludCkkYWRtWzBdKTsKICAgIGlmKCR2PT09J0kxJyl7CiAgICAgIGlmKGlzX2RpcihXUF9QTFVHSU5fRElSLicvc3Vic2NyaXB0aW9uJykpeyAkb1snamF1X3lyYSddPSdUQUlQJzsgfQogICAgICBlbHNlewogICAgICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9jbGFzcy13cC11cGdyYWRlci5waHAnOwogICAgICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4taW5zdGFsbC5waHAnOwogICAgICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9maWxlLnBocCc7CiAgICAgICAgJGFwaT1wbHVnaW5zX2FwaSgncGx1Z2luX2luZm9ybWF0aW9uJyxhcnJheSgnc2x1Zyc9PidzdWJzY3JpcHRpb24nLCdmaWVsZHMnPT5hcnJheSgnc2VjdGlvbnMnPT5mYWxzZSkpKTsKICAgICAgICBpZihpc193cF9lcnJvcigkYXBpKSl7ICRvWydTVE9QJ109J2FwaTogJy4kYXBpLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgICAgICRvWyd2ZXJzaWphX3JlcG8nXT0kYXBpLT52ZXJzaW9uOwogICAgICAgICR1cD1uZXcgUGx1Z2luX1VwZ3JhZGVyKG5ldyBBdXRvbWF0aWNfVXBncmFkZXJfU2tpbigpKTsKICAgICAgICAkcj0kdXAtPmluc3RhbGwoJGFwaS0+ZG93bmxvYWRfbGluayk7CiAgICAgICAgJG9bJ2luc3RhbGwnXT1pc193cF9lcnJvcigkcik/JHItPmdldF9lcnJvcl9tZXNzYWdlKCk6KCRyPydPSyc6J05FUEFWWUtPJyk7CiAgICAgIH0KICAgICAgJGZhaWxhcz1udWxsOwogICAgICBmb3JlYWNoKGdldF9wbHVnaW5zKCkgYXMgJHBmPT4kcGQpIGlmKHN0cnBvcygkcGYsJ3N1YnNjcmlwdGlvbi8nKT09PTApeyAkZmFpbGFzPSRwZjsgJG9bJ3BsdWdpbiddPSRwZFsnTmFtZSddLicgJy4kcGRbJ1ZlcnNpb24nXTsgfQogICAgICBpZigkZmFpbGFzKXsKICAgICAgICAkYWt0PWFjdGl2YXRlX3BsdWdpbigkZmFpbGFzKTsKICAgICAgICAkb1snYWt0eXZhdmltYXMnXT1pc193cF9lcnJvcigkYWt0KT8kYWt0LT5nZXRfZXJyb3JfbWVzc2FnZSgpOidPSyc7CiAgICAgIH0gZWxzZSAkb1snU1RPUCddPSdmYWlsYXMgbmVyYXN0YXMgcG8gaW5zdGFsbCc7CiAgICB9CiAgICBpZigkdj09PSdSMScpewogICAgICBnbG9iYWwgJHdwZGI7CiAgICAgICRkaXI9V1BfUExVR0lOX0RJUi4nL3N1YnNjcmlwdGlvbic7CiAgICAgIC8vIDEuIGxlbnRlbGVzIC8gcG9zdCB0aXBhaQogICAgICAkb1snbGVudGVsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9JXN1YnNjcmklJyIpOwogICAgICAkb1sncG9zdF90aXBhaSddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X3Bvc3RfdHlwZXMoKSxmdW5jdGlvbigkdCl7cmV0dXJuIHN0cmlwb3MoJHQsJ3N1YnNjcmknKSE9PWZhbHNlO30pKTsKICAgICAgLy8gMi4gSFBPUyBkZWtsYXJhY2lqYQogICAgICAkb1snaHBvc19kZWtsYXJhY2lqYSddPSc/JzsKICAgICAgZm9yZWFjaChnbG9iKCRkaXIuJy8qLnBocCcpIGFzICRmKXsgJGs9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAgIGlmKHN0cnBvcygkaywnRmVhdHVyZXNVdGlsJykhPT1mYWxzZSl7IHByZWdfbWF0Y2goJy9kZWNsYXJlX2NvbXBhdGliaWxpdHlcKFteKV0qXCkvJywkaywkbSk7ICRvWydocG9zX2Rla2xhcmFjaWphJ109JG1bMF0/Pyd5cmEgRmVhdHVyZXNVdGlsJzsgYnJlYWs7IH0gfQogICAgICAvLyAzLiBob29rJ2FpOiByZW5ld2FsL3BheW1lbnQvcGF1c2UgaXMgdmlzbyBwbHVnaW5vCiAgICAgICRob29rcz1hcnJheSgpOwogICAgICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIpKTsKICAgICAgZm9yZWFjaCgkaXQgYXMgJGYpeyBpZihzdWJzdHIoJGYsLTQpIT09Jy5waHAnKSBjb250aW51ZTsgJGs9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCIvZG9fYWN0aW9uXChccypbJ1wiXShbYS16MC05X1wvXSspWydcIl0vaSIsJGssJG0pOwogICAgICAgIGZvcmVhY2goJG1bMV0gYXMgJGgpIGlmKHByZWdfbWF0Y2goJy9yZW5ld3xwYXltZW50fHBhdXNlfGNhbmNlbHxyZXN1bWV8YWN0aXZ8ZXhwaXJ8Y3Jvbi9pJywkaCkpICRob29rc1skaF09MTsKICAgICAgfQogICAgICAkb1snaG9va2FpJ109YXJyYXlfc2xpY2UoYXJyYXlfa2V5cygkaG9va3MpLDAsMzApOwogICAgICAvLyA0LiBjcm9uIHV6ZHVvdHlzIHBvIGFrdHl2YXZpbW8KICAgICAgJGNyPWFycmF5KCk7IGZvcmVhY2goX2dldF9jcm9uX2FycmF5KCkgYXMgJHQ9PiRocykgZm9yZWFjaCgkaHMgYXMgJGg9PiR4KSBpZihzdHJpcG9zKCRoLCdzdWJzY3JpJykhPT1mYWxzZXx8c3RyaXBvcygkaCwnc2RldnMnKSE9PWZhbHNlfHxzdHJpcG9zKCRoLCdzdWJzY3JwdCcpIT09ZmFsc2UpICRjclskaF09MTsKICAgICAgJG9bJ2Nyb24nXT1hcnJheV9rZXlzKCRjcik7CiAgICAgIC8vIDUuIHByb2R1a3RvIG1ldGEgbGF1a2FpIChrYWlwIHBhenltaW1hIHByZW51bWVyYXRhKQogICAgICAkbWV0YT1hcnJheSgpOwogICAgICBmb3JlYWNoKCRpdCBhcyAkZil7IGlmKHN1YnN0cigoc3RyaW5nKSRmLC00KSE9PScucGhwJykgY29udGludWU7ICRrPWZpbGVfZ2V0X2NvbnRlbnRzKChzdHJpbmcpJGYpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCIvWydcIl0oXz9zdWJzY3JwdFthLXpfXSp8X3N1YnNjcmlwdGlvblthLXpfXSopWydcIl0vaSIsJGssJG0pOwogICAgICAgIGZvcmVhY2goJG1bMV0gYXMgJHgpICRtZXRhWyR4XT0xOwogICAgICB9CiAgICAgICRvWydtZXRhX3Jha3RhaSddPWFycmF5X3NsaWNlKGFycmF5X2tleXMoJG1ldGEpLDAsMjUpOwogICAgICAvLyA2LiBrbGFzZXMKICAgICAgJG9bJ2tsYXNlcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoZ2V0X2RlY2xhcmVkX2NsYXNzZXMoKSxmdW5jdGlvbigkYyl7cmV0dXJuIHN0cmlwb3MoJGMsJ3NkZXZzJykhPT1mYWxzZXx8c3RyaXBvcygkYywnc3Vic2NycHQnKSE9PWZhbHNlfHxzdHJpcG9zKCRjLCd3cHN1YnNjcmlwdGlvbicpIT09ZmFsc2U7fSkpOwogICAgICAkb1sna2xhc2VzJ109YXJyYXlfc2xpY2UoJG9bJ2tsYXNlcyddLDAsMjApOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_poc1-213921';
const GKEY='ps_f19';
const PHASES=["I1","R1"];
const OUT='analize/f19_poc1.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
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
