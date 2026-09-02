process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjUnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVI2J107CiAgICAkb3AyPW1heWJlX3Vuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MiIpKTsKICAgIGZvcmVhY2ggKFsnaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnLCd1cGRhdGVfY3VzdG9tX2ZpZWxkc19sb2dpYycsJ2N1c3RvbV9maWVsZHNfbGlzdCcsJ2N1c3RvbV9uYW1lJywnY3VzdG9tX3ZhbHVlJywnZHVwbGljYXRlX21hdGNoaW5nJywnY3VzdG9tX2R1cGxpY2F0ZV9uYW1lJywnY3VzdG9tX2R1cGxpY2F0ZV92YWx1ZScsJ2lzX3NlbGVjdGl2ZV9oYXNoaW5nJywncHJvZHVjdF9zdG9ja19xdHknLCdwcm9kdWN0X21hbmFnZV9zdG9jaycsJ2lzX3Byb2R1Y3RfdXBkYXRlX3N0b2NrJ10gYXMgJGspIGlmIChpc3NldCgkb3AyWyRrXSkpICRvWydvcHQyJ11bJGtdPWlzX2FycmF5KCRvcDJbJGtdKT9qc29uX2VuY29kZSgkb3AyWyRrXSk6bWJfc3Vic3RyKChzdHJpbmcpJG9wMlska10sMCwzMDApOwogICAgJG9wMz1tYXliZV91bnNlcmlhbGl6ZSgkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiKSk7CiAgICBmb3JlYWNoIChbJ3Byb2R1Y3Rfc3RvY2tfcXR5JywncHJvZHVjdF9tYW5hZ2Vfc3RvY2snLCdpc19wcm9kdWN0X3VwZGF0ZV9zdG9jaycsJ3Byb2R1Y3Rfc3RvY2tfc3RhdHVzJywnY3VzdG9tX25hbWUnLCdjdXN0b21fdmFsdWUnLCdpc191cGRhdGVfY3VzdG9tX2ZpZWxkcyddIGFzICRrKSAkb1snb3B0MyddWyRrXT1pc3NldCgkb3AzWyRrXSk/KGlzX2FycmF5KCRvcDNbJGtdKT9qc29uX2VuY29kZSgkb3AzWyRrXSk6bWJfc3Vic3RyKChzdHJpbmcpJG9wM1ska10sMCwxMjApKTonTsSWUkEnOwogICAgJG9bJ29wdDNfa2V5c19zdG9jayddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfa2V5cygkb3AzKSxmbigkayk9PnN0cmlwb3MoJGssJ3N0b2NrJykhPT1mYWxzZXx8c3RyaXBvcygkaywncXR5JykhPT1mYWxzZSkpOwogICAgLy8gcHJvZHVjdHMucGhwIHF0eSBwb3JhIGtvZHUKICAgICR1PSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcGF0aCBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MiIpOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSh3cF9yZW1vdGVfZ2V0KCR1LFsndGltZW91dCc9PjkwXSkpOwogICAgZm9yZWFjaCAoWycwMU0yMjA4MDEnLCcwMU0yMTAyMDInLCcwMU1WS0Q0MjInLCcwMUE2QTAxMTEwJ10gYXMgJGMpIHsgaWYgKHByZWdfbWF0Y2goJy88Y29kZT4nLnByZWdfcXVvdGUoJGMpLic8XC9jb2RlPi4qPzxxdHk+KFxkKyk8XC9xdHk+L3MnLCRiLCRtKSkgJG9bJ3Byb2R1Y3RzX3F0eSddWyRjXT0oaW50KSRtWzFdOyB9CiAgICAvLyB1cGRhdGUgZ2F0ZSBrb2RhcwogICAgJGM9ZmlsZShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC14bWwvcGV0c2hvcC14bWwucGhwJyk7ICRvWydnYXRlJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3J0cmltJyxhcnJheV9zbGljZSgkYyw0NDcsNTIpKSxmbigkeCk9PnRyaW0oJHgpIT09JycmJiFwcmVnX21hdGNoKCcvXlxzKihcL1wvfFwqfFwvXCopLycsJHgpKSk7CiAgICAkb1snanVuayddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKCdydHJpbScsYXJyYXlfc2xpY2UoJGMsNjcxLDQ1KSksZm4oJHgpPT50cmltKCR4KSE9PScnJiYhcHJlZ19tYXRjaCgnL15ccyooXC9cL3xcKnxcL1wqKS8nLCR4KSkpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1J8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-093118';
const GKEY='ps_ex25';
const PHASES=["R"];
const OUT='analize/s1593_r6.json';
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
