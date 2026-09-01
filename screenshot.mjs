process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY2YyBTaG9ydFBpeGVsIGh0YWNjZXNzIGJsb2thcyArIHdlYnAgc2VydmUgdGVzdGFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19zZW8nXSk/JF9HRVRbJ3BzX3NlbyddOicnOyBpZigkZiE9PSdSJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NjZjJyk7IEBzZXRfdGltZV9saW1pdCgyMDApOwogIHRyeXsKICAgICRodD1maWxlX2dldF9jb250ZW50cyhBQlNQQVRILicuaHRhY2Nlc3MnKTsgcHJlZ19tYXRjaCgnfiMgQkVHSU4gU2hvcnRQaXhlbFdlYnAuKj8jIEVORCBTaG9ydFBpeGVsV2VicH5zJywkaHQsJG0pOyAkb1snc3BfYmxvY2snXT0kbVswXT8/bnVsbDsgJG9bJ3NwX3BsdWdpbiddPWZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy9zaG9ydHBpeGVsLWltYWdlLW9wdGltaXNlcicpOyAkb1snc3BfYWN0aXZlJ109aW5fYXJyYXkoJ3Nob3J0cGl4ZWwtaW1hZ2Utb3B0aW1pc2VyL3dwLXNob3J0cGl4ZWwucGhwJywoYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKSk7CiAgICAvLyB0ZXN0YXM6IHByZWvEl3MganBnIHN1IEFjY2VwdCB3ZWJwCiAgICAkcGlkPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X21pbWVfdHlwZT0naW1hZ2UvanBlZycgQU5EIHBvc3RfcGFyZW50IElOIChTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcpIE9SREVSIEJZIElEIERFU0MgTElNSVQgMSIpOwogICAgJHU9d3BfZ2V0X2F0dGFjaG1lbnRfaW1hZ2VfdXJsKCRwaWQsJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcpOyAkb1sndGVzdF91cmwnXT0kdTsgJHA9Z2V0X2F0dGFjaGVkX2ZpbGUoJHBpZCk7ICRvWydvcmlnX2hhc193ZWJwJ109ZmlsZV9leGlzdHMoJHAuJy53ZWJwJyl8fGZpbGVfZXhpc3RzKHByZWdfcmVwbGFjZSgnflwuKGpwZT9nfHBuZykkfmknLCcud2VicCcsJHApKTsgJG9bJ29yaWdfd2VicF9uYW1lJ109ZmlsZV9leGlzdHMoJHAuJy53ZWJwJyk/J3guanBnLndlYnAnOihmaWxlX2V4aXN0cyhwcmVnX3JlcGxhY2UoJ35cLihqcGU/Z3xwbmcpJH5pJywnLndlYnAnLCRwKSk/J3gud2VicCc6J25lcmEnKTsKICAgIGZvcmVhY2goYXJyYXkoJ3dlYnAnPT4naW1hZ2Uvd2VicCxpbWFnZS8qJywnbm8nPT4naW1hZ2UvKicpIGFzICRrPT4kYWNjKXsgJGc9d3BfcmVtb3RlX2hlYWQoJHUsYXJyYXkoJ3RpbWVvdXQnPT4xNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ2hlYWRlcnMnPT5hcnJheSgnQWNjZXB0Jz0+JGFjYykpKTsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJG9bJ3NlcnZlJ11bJGtdPWFycmF5KCdjb2RlJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJGcpLCdjdCc9PiRoWydjb250ZW50LXR5cGUnXT8/bnVsbCwnbGVuJz0+JGhbJ2NvbnRlbnQtbGVuZ3RoJ10/P251bGwsJ3ZhcnknPT4kaFsndmFyeSddPz9udWxsKTsgfQogICAgLy8ga2FpcCBwYXZhZGludGkgZXNhbWkgd2VicDogeC5qcGcud2VicCBhciB4LndlYnA/CiAgICAkdXA9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ107ICRhPWNvdW50KGdsb2IoJHVwLicvMjAyNi8wNi8qLmpwZy53ZWJwJykpOyAkYj0wOyBmb3JlYWNoKGFycmF5X3NsaWNlKGdsb2IoJHVwLicvMjAyNi8wNi8qLndlYnAnKSwwLDIwMDApIGFzICR3KXsgaWYoIXN0cl9lbmRzX3dpdGgoJHcsJy5qcGcud2VicCcpJiYhc3RyX2VuZHNfd2l0aCgkdywnLnBuZy53ZWJwJykmJihmaWxlX2V4aXN0cyhwcmVnX3JlcGxhY2UoJ35cLndlYnAkficsJy5qcGcnLCR3KSl8fGZpbGVfZXhpc3RzKHByZWdfcmVwbGFjZSgnflwud2VicCR+JywnLnBuZycsJHcpKSkpICRiKys7IH0gJG9bJ25hbWluZ18yMDI2XzA2J109YXJyYXkoJ3guanBnLndlYnAnPT4kYSwneC53ZWJwX3N1X2pwZyc9PiRiLCdqcGdfdmlzbyc9PmNvdW50KGdsb2IoJHVwLicvMjAyNi8wNi8qLmpwZycpKSwncG5nX3Zpc28nPT5jb3VudChnbG9iKCR1cC4nLzIwMjYvMDYvKi5wbmcnKSkpOwogICAgJG9bJ25hbWluZ19sZWdhY3knXT1hcnJheSgnanBnLndlYnAnPT5jb3VudChnbG9iKCR1cC4nL3BldHNob3AtbGVnYWN5L2ltYWdlcy8qLyouanBnLndlYnAnKSksJ3dlYnAnPT5jb3VudChnbG9iKCR1cC4nL3BldHNob3AtbGVnYWN5L2ltYWdlcy8qLyoud2VicCcpKSwnanBnJz0+Y291bnQoZ2xvYigkdXAuJy9wZXRzaG9wLWxlZ2FjeS9pbWFnZXMvKi8qLmpwZycpKSk7CiAgICAkb1sncG5nX2JpZyddPWFycmF5KCk7ICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJHVwLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRkaXJzPWFycmF5KCk7IGZvcmVhY2goJGl0IGFzICRmbCl7IGlmKG1pY3JvdGltZSh0cnVlKS0kdDA+NDApIGJyZWFrOyBpZihzdHJ0b2xvd2VyKCRmbC0+Z2V0RXh0ZW5zaW9uKCkpPT09J3BuZycpeyAkZD1kaXJuYW1lKHN0cl9yZXBsYWNlKCR1cCwnJywkZmwtPmdldFBhdGhuYW1lKCkpKTsgJGQ9aW1wbG9kZSgnLycsYXJyYXlfc2xpY2UoZXhwbG9kZSgnLycsJGQpLDAsMykpOyAkZGlyc1skZF09KCRkaXJzWyRkXT8/MCkrJGZsLT5nZXRTaXplKCk7IH0gfSBhcnNvcnQoJGRpcnMpOyAkb1sncG5nX2J5X2Rpcl9tYiddPWFycmF5X21hcChmbigkeCk9PnJvdW5kKCR4LzEwNDg1NzYpLGFycmF5X3NsaWNlKCRkaXJzLDAsOCx0cnVlKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-124348';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1566c.json';
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
