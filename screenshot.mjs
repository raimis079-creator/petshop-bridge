process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTUzIG5vLXN0b3JlIHJlY29uIChrYXMgc2l1bsSNaWEgQ2FjaGUtQ29udHJvbCBwcmVrxJdqZSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidTMTU1MycpOyBAc2V0X3RpbWVfbGltaXQoMjAwKTsKICB0cnl7CiAgICAkcGF0PSd+bm9jYWNoZV9oZWFkZXJzfG5vLXN0b3JlfERPTk9UQ0FDSEVQQUdFfENhY2hlLUNvbnRyb2x8d2Nfbm9jYWNoZXxzZW5kX2hlYWRlcnN+aSc7CiAgICBmb3JlYWNoKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkcCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgaWYocHJlZ19tYXRjaF9hbGwoJHBhdCwkYywkbSkpeyAkb1snbXUnXVtiYXNlbmFtZSgkcCldPWFycmF5X2NvdW50X3ZhbHVlcygkbVswXSk7IH0gfQogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpIGFzICRwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBpZihwcmVnX21hdGNoX2FsbCgkcGF0LCRjLCRtKSl7ICRvWydjb3JlJ11bYmFzZW5hbWUoJHApXT1hcnJheV9jb3VudF92YWx1ZXMoJG1bMF0pOyB9IH0KICAgIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvcGV0c2hvcC0qLyoucGhwJykgYXMgJHApeyAkYz1maWxlX2dldF9jb250ZW50cygkcCk7IGlmKHByZWdfbWF0Y2hfYWxsKCRwYXQsJGMsJG0pKXsgJG9bJ3BsdWcnXVtzdHJfcmVwbGFjZShXUF9QTFVHSU5fRElSLCcnLCRwKV09YXJyYXlfY291bnRfdmFsdWVzKCRtWzBdKTsgfSB9CiAgICAkY3Q9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7IGZvcmVhY2goZ2xvYigkY3QuJy8qLnBocCcpIGFzICRwKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyBpZihwcmVnX21hdGNoX2FsbCgkcGF0LCRjLCRtKSl7ICRvWydjaGlsZCddW2Jhc2VuYW1lKCRwKV09YXJyYXlfY291bnRfdmFsdWVzKCRtWzBdKTsgfSB9CiAgICAkb1snc25pcHBldHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgYWN0aXZlPTEgQU5EIChjb2RlIExJS0UgJyVub2NhY2hlX2hlYWRlcnMlJyBPUiBjb2RlIExJS0UgJyVuby1zdG9yZSUnIE9SIGNvZGUgTElLRSAnJURPTk9UQ0FDSEVQQUdFJScgT1IgY29kZSBMSUtFICclQ2FjaGUtQ29udHJvbCUnKSIsQVJSQVlfQSk7CiAgICAvLyBneXZhcyB0ZXN0YXM6IHByZWvElyB2cyBrYXRlZ29yaWphIHZzIHByYWRpbmlzIHZzIGJsb2cg4oCUIGtva2llIGhlYWRlcidpYWksIGFyIFNldC1Db29raWUKICAgICRwPWdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywnbnVtYmVycG9zdHMnPT4xLCdmaWVsZHMnPT4naWRzJywnb3JkZXJieSc9PidyYW5kJykpOwogICAgJHVybHM9YXJyYXkoJ3ByZWtlJz0+Z2V0X3Blcm1hbGluaygkcFswXSksJ2thdGVnb3JpamEnPT5nZXRfdGVybV9saW5rKGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdoaWRlX2VtcHR5Jz0+dHJ1ZSwnbnVtYmVyJz0+MSkpWzBdKSwncHJhZGluaXMnPT5ob21lX3VybCgnLycpLCdibG9nJz0+aG9tZV91cmwoJy90YWtzYXMvJykpOwogICAgZm9yZWFjaCgkdXJscyBhcyAkaz0+JHUpeyAkZz13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+MzAsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J01vemlsbGEvNS4wIHJlY29uJykpOyBpZihpc193cF9lcnJvcigkZykpIHsgJG9bJ2hkciddWyRrXT0nRVJSJzsgY29udGludWU7IH0KICAgICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcnMoJGcpLT5nZXRBbGwoKTsgJG9bJ2hkciddWyRrXT1hcnJheSgnY29kZSc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRnKSwnY2MnPT4kaFsnY2FjaGUtY29udHJvbCddPz9udWxsLCdleHBpcmVzJz0+JGhbJ2V4cGlyZXMnXT8/bnVsbCwncHJhZ21hJz0+JGhbJ3ByYWdtYSddPz9udWxsLCdzZXRfY29va2llJz0+aXNzZXQoJGhbJ3NldC1jb29raWUnXSk/KGlzX2FycmF5KCRoWydzZXQtY29va2llJ10pP2FycmF5X21hcChmbigkeCk9PnN1YnN0cigkeCwwLDQwKSwkaFsnc2V0LWNvb2tpZSddKTpzdWJzdHIoJGhbJ3NldC1jb29raWUnXSwwLDYwKSk6bnVsbCwneCc9PmFycmF5X2ZpbHRlcigkaCxmbigkdiwka2spPT5zdHJfc3RhcnRzX3dpdGgoJGtrLCd4LScpLEFSUkFZX0ZJTFRFUl9VU0VfQk9USCkpOyB9CiAgICAvLyBXQzoga2FzIGFudCBzZW5kX2hlYWRlcnMgLyB0ZW1wbGF0ZV9yZWRpcmVjdCAvIHdwCiAgICBnbG9iYWwgJHdwX2ZpbHRlcjsgZm9yZWFjaChhcnJheSgnc2VuZF9oZWFkZXJzJywndGVtcGxhdGVfcmVkaXJlY3QnLCd3cCcsJ3dwX2hlYWRlcnMnKSBhcyAkaGspeyBpZighaXNzZXQoJHdwX2ZpbHRlclskaGtdKSkgY29udGludWU7IGZvcmVhY2goJHdwX2ZpbHRlclskaGtdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKXsgZm9yZWFjaCgkY2JzIGFzICRjYil7ICRmbj0kY2JbJ2Z1bmN0aW9uJ107ICRuPWlzX3N0cmluZygkZm4pPyRmbjooaXNfYXJyYXkoJGZuKT8oaXNfb2JqZWN0KCRmblswXSk/Z2V0X2NsYXNzKCRmblswXSk6JGZuWzBdKS4nOjonLiRmblsxXTonY2xvc3VyZScpOyAkb1snaG9va3MnXVskaGtdW109JHByLicgJy4kbjsgfSB9IH0KICAgICRvWyd3Y19zZXNzaW9uX2Nvb2tpZSddPWRlZmluZWQoJ1dDX1NFU1NJT05fQ0FDSEVfR1JPVVAnKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-093533';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1553.json';
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
