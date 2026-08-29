process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIEUyRSB2MiAoVVRDICsgZGlhZykgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19lMyddKT8kX0dFVFsncHNfZTMnXTonJykhPT0nVDMnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidFM1QzJyk7CiAgdHJ5ewogICAgYWRkX2ZpbHRlcigncHJlX3dwX21haWwnLCdfX3JldHVybl90cnVlJyw5OTkpOwogICAgZ2xvYmFsICR3cGRiOyAkanQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7ICRvdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnMnOwogICAgcmVxdWlyZV9vbmNlIFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcmV6dWx0YXRhaS5waHAnOwogICAgJGVtPSdlMy10ZXN0YXNAZXhhbXBsZS5pbnZhbGlkJzsKCiAgICAkb3JkPXdjX2NyZWF0ZV9vcmRlcigpOyAkb3JkLT5zZXRfYmlsbGluZ19lbWFpbCgkZW0pOwogICAgJG9yZC0+c2V0X3RvdGFsKDI1LjUwKTsgJG9yZC0+c2V0X3N0YXR1cygncHJvY2Vzc2luZycpOyAkb3JkLT5zYXZlKCk7CiAgICAkb2lkPSRvcmQtPmdldF9pZCgpOwogICAgJG9kX2dtdD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGRhdGVfY3JlYXRlZF9nbXQgRlJPTSBgJG90YCBXSEVSRSBpZD0lZCIsJG9pZCkpOwogICAgJG9bJ2RpYWcnXT1hcnJheSgnb2lkJz0+JG9pZCwnb2RfZ210Jz0+JG9kX2dtdCwnbG9rYWx1cyc9PiRvcmQtPmdldF9kYXRlX2NyZWF0ZWQoKS0+ZGF0ZSgnWS1tLWQgSDppOnMnKSk7CgogICAgJGJhej1hcnJheSgncmVjaXBpZW50X2VtYWlsJz0+JGVtLCdmbG93X2NsYXNzJz0+J3NlcnZpY2UnLCdzdGF0dXMnPT4nc2VudCcsCiAgICAgICdjcmVhdGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCdzY2hlZHVsZWRfYXQnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJykpOwogICAgJHIxPSR3cGRiLT5pbnNlcnQoJGp0LGFycmF5X21lcmdlKCRiYXosYXJyYXkoJ2pvYl9rZXknPT4nZTN0ZXN0X2NhcnQnLCdmbG93Jz0+J2NhcnRfYWJhbmRvbmVkJywKICAgICAgJ2NsaWNrZWRfYXQnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJyxzdHJ0b3RpbWUoJG9kX2dtdC4nIFVUQycpLTcyMDApKSkpOwogICAgJGoxPSR3cGRiLT5pbnNlcnRfaWQ7ICRvWydpbnMxJ109YXJyYXkoJHIxLCR3cGRiLT5sYXN0X2Vycm9yKTsKICAgICRyMj0kd3BkYi0+aW5zZXJ0KCRqdCxhcnJheV9tZXJnZSgkYmF6LGFycmF5KCdqb2Jfa2V5Jz0+J2UzdGVzdF9yZWZpbGwnLCdmbG93Jz0+J3JlZmlsbF9kdWUnLAogICAgICAnY2xpY2tlZF9hdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnLHN0cnRvdGltZSgkb2RfZ210LicgVVRDJyktMzYwMCkpKSk7CiAgICAkajI9JHdwZGItPmluc2VydF9pZDsgJG9bJ2luczInXT1hcnJheSgkcjIsJHdwZGItPmxhc3RfZXJyb3IpOwoKICAgICRwcj1QZXRzaG9wX1JlenVsdGF0YWk6OnByaXNreXJpbWFzKDApOwogICAgJG9bJ2VtYWlsX3V6c2FreW11J109JHByWydlbWFpbF91enNha3ltdSddOwogICAgJG9bJ2VtYWlsX3BhamFtb3MnXT0kcHJbJ2VtYWlsX3BhamFtb3MnXTsKICAgICRvWydyZWZpbGwnXT0kcHJbJ3BhZ2FsX3NyYXV0YSddWydyZWZpbGxfZHVlJ10/P251bGw7CiAgICAkb1snY2FydCddPSRwclsncGFnYWxfc3JhdXRhJ11bJ2NhcnRfYWJhbmRvbmVkJ10/PyduZXJhICh0ZWlzaW5nYSDigJQgbGFzdCBjbGljayBsYWltaSknOwoKICAgIC8vIHNlbmFzIHV6c2FreW1hcyB1eiA3IGQuIGxhbmdvCiAgICAkb3JkMj13Y19jcmVhdGVfb3JkZXIoKTsgJG9yZDItPnNldF9iaWxsaW5nX2VtYWlsKCRlbSk7CiAgICAkb3JkMi0+c2V0X3RvdGFsKDEwKTsgJG9yZDItPnNldF9zdGF0dXMoJ3Byb2Nlc3NpbmcnKTsgJG9yZDItPnNhdmUoKTsKICAgICR3cGRiLT51cGRhdGUoJG90LGFycmF5KCdkYXRlX2NyZWF0ZWRfZ210Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycsdGltZSgpLTIwKjg2NDAwKSksYXJyYXkoJ2lkJz0+JG9yZDItPmdldF9pZCgpKSk7CiAgICAkcHIyPVBldHNob3BfUmV6dWx0YXRhaTo6cHJpc2t5cmltYXMoMCk7CiAgICAkb1sncG9fc2VubyddPWFycmF5KCd1enMnPT4kcHIyWydlbWFpbF91enNha3ltdSddLCdzdW1hJz0+JHByMlsnZW1haWxfcGFqYW1vcyddKTsKCiAgICAkd3BkYi0+ZGVsZXRlKCRqdCxhcnJheSgnaWQnPT4kajEpKTsgJHdwZGItPmRlbGV0ZSgkanQsYXJyYXkoJ2lkJz0+JGoyKSk7CiAgICAkb3JkLT5kZWxldGUodHJ1ZSk7ICRvcmQyLT5kZWxldGUodHJ1ZSk7CiAgICAkcHIzPVBldHNob3BfUmV6dWx0YXRhaTo6cHJpc2t5cmltYXMoMCk7CiAgICAkb1sncG9fdmFseW1vJ109YXJyYXkoJ3V6cyc9PiRwcjNbJ2VtYWlsX3V6c2FreW11J10sCiAgICAgICdqb2JzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gYCRqdGAgV0hFUkUgam9iX2tleSBMSUtFICdlM3Rlc3QlJyIpLAogICAgICAnb3JkJz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00gYCRvdGAgV0hFUkUgYmlsbGluZ19lbWFpbD0lcyIsJGVtKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='e3_testas3-203634';
const GKEY='ps_e3';
const PHASES=["T3"];
const OUT='analize/e3_t3.json';
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
