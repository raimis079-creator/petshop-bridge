process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NDYnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTk3LVIyJ107CiAgICAkdz1nZXRfb3B0aW9uKCd3aWRnZXRfeWl0aC13b29jb21tZXJjZS1hamF4LW5hdmlnYXRpb24tZmlsdGVycycpOyAkb1snd2lkZ2V0J109JHc7CiAgICAkb1snZ3l2X3Rlcm1zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC50ZXJtX2lkLHQubmFtZSx0LnNsdWcsdHQuY291bnQgRlJPTSB7JHB9dGVybXMgdCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkIFdIRVJFIHR0LnRheG9ub215PSdwYV9neXZ1bm9fcnVzaXMnIixBUlJBWV9BKTsKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCB0ci5vYmplY3RfaWQgRlJPTSB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPXRyLm9iamVjdF9pZCBBTkQgcG8ucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIHR0LnRlcm1faWQgSU4gKDY3OSw2ODIsNjgzLDY4NCkiKTsKICAgICRpZHM9YXJyYXlfdW5pcXVlKGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7ICRvWydyaW5rX24nXT1jb3VudCgkaWRzKTsKICAgIGZvcmVhY2ggKCRpZHMgYXMgJGlkKSB7ICRwcj13Y19nZXRfcHJvZHVjdCgkaWQpOyAkb1sncmluayddWyRpZF09W21iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw0MCksJHByPyRwci0+Z2V0X3R5cGUoKTonPycsJ2d5dic9PndwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfZ3l2dW5vX3J1c2lzJyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwnYW16Jz0+d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwYV9hbXppdXMnLFsnZmllbGRzJz0+J25hbWVzJ10pLCdrYXQnPT53cF9nZXRfcG9zdF90ZXJtcygkaWQsJ3Byb2R1Y3RfY2F0JyxbJ2ZpZWxkcyc9PiduYW1lcyddKSwnYXR0cl9tZXRhJz0+YXJyYXlfa2V5cygoYXJyYXkpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wcm9kdWN0X2F0dHJpYnV0ZXMnLHRydWUpKV07IH0KICAgIC8vIGt1cmlzIHByZXNldGFzIHRhaWtvbWFzIDY3OTogc25pcHBldC9rb2RhcyBzdSBwcmVzZXQgSUQ/CiAgICBmb3JlYWNoICgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCAoY29kZSBMSUtFICcleWl0aF93Y2FuX3ByZXNldCUnIE9SIGNvZGUgTElLRSAnJXByZXNldCUnIEFORCBjb2RlIExJS0UgJyU2NzklJykiLEFSUkFZX04pIGFzICRyKSAkb1snc25pcHMnXVtdPWltcGxvZGUoJyAnLCRyKTsKICAgIGZvcmVhY2ggKGdsb2IoV1BNVV9QTFVHSU5fRElSLicvKi5waHAnKSBhcyAkZikgeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmIChwcmVnX21hdGNoKCcveWl0aF93Y2FufHByZXNldC9pJywkYykpICRvWydtdV9wcmVzZXQnXVtdPWJhc2VuYW1lKCRmKTsgfQogICAgLy8gcHJlc2V0IDM0MTE0IC8gNjY0NCBmaWx0cmFpCiAgICBmb3JlYWNoIChbMzQxMTQsNjY0NF0gYXMgJHBpZCkgeyAkZj1nZXRfcG9zdF9tZXRhKCRwaWQsJ19maWx0ZXJzJyx0cnVlKTsgJG9bJ3ByZXNldCddWyRwaWRdPWFycmF5X21hcChmbigkeCk9PlskeFsndGl0bGUnXT8/JycsJHhbJ3RheG9ub215J10/PycnLCR4WydzaG93X3RvZ2dsZSddPz8nJywkeFsnYWRvcHRpdmUnXT8/JyddLChhcnJheSkkZik7IH0KICAgIC8vIGd5dnVubyBydXNpcyBwYXMga29tcG9uZW50dXM/IFB2ei4gMzUzMDkgdmFpa2FpCiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-121538';
const GKEY='ps_ex46';
const PHASES=["R"];
const OUT='analize/s1597_r2.json';
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
