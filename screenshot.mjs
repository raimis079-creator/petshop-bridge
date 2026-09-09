process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjY2IHR1c2NpdSBhdHJpYnV0dSBmaWx0cmFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmID0gaXNzZXQoJF9HRVRbJ3BzX2JrQiddKSA/ICRfR0VUWydwc19ia0InXSA6ICcnOwogIGlmKCRmIT09J0EnICYmICRmIT09J0InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY2NicsJ2ZhemUnPT4kZiwnd3AnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwogIGdsb2JhbCAkd3BkYjsKICAkUEFWPSdQcmVrZXMgVHVzY2l1IGF0cmlidXR1IHNsZXBpbWFzIHYxLjAgKHdvb2NvbW1lcmNlX2Rpc3BsYXlfcHJvZHVjdF9hdHRyaWJ1dGVzKSc7CiAgdHJ5ewogICAgaWYoJGY9PT0nQScpewogICAgICAka29kYXMgPSA8PDwnS09EQVMnCi8qKgogKiBQcmVrZXMgVHVzY2l1IGF0cmlidXR1IHNsZXBpbWFzIHYxLjAgKHdvb2NvbW1lcmNlX2Rpc3BsYXlfcHJvZHVjdF9hdHRyaWJ1dGVzKQogKgogKiBOZXJvZG8ga2xpZW50byBwcmVrZXMga29ydGVsxJdqZSBhdHJpYnV0xbMgZWlsdcSNacWzLCBrdXJpxbMgcmVpa8WhbcSXIHR1xaHEjWlhLgogKiBQcmllxb5hc3RpczogZGFsaXMgcHJla2nFsyB0dXJpIHByaXNraXJ0xIUgYXRyaWJ1dMSFIChwdnouIHBhX21vbm9wcm90ZWluKSBiZSBqb2tpbwogKiB0ZXJtaW5vIOKAlCBXb28gdG9raXUgYXR2ZWp1IHBpZcWhaWEgYW50cmHFoXTEmSBzdSB0dcWhxI1pdSBsYW5nZWxpdS4KICogVmVpa2lhIHRpayBBVFZBSVpEQVZJTVVJLiBGZWVkJ2FpLCBrYXRhbG9nYXMgaXIgX3Byb2R1Y3RfYXR0cmlidXRlcyBuZWtlacSNaWFtaS4KICovCmFkZF9maWx0ZXIoICd3b29jb21tZXJjZV9kaXNwbGF5X3Byb2R1Y3RfYXR0cmlidXRlcycsIGZ1bmN0aW9uKCAkYXR0cmlidXRlcywgJHByb2R1Y3QgPSBudWxsICkgewoJaWYgKCAhIGlzX2FycmF5KCAkYXR0cmlidXRlcyApICkgewoJCXJldHVybiAkYXR0cmlidXRlczsKCX0KCWZvcmVhY2ggKCAkYXR0cmlidXRlcyBhcyAkcmFrdGFzID0+ICRlaWx1dGUgKSB7CgkJJHJlaWtzbWUgPSBpc3NldCggJGVpbHV0ZVsndmFsdWUnXSApID8gJGVpbHV0ZVsndmFsdWUnXSA6ICcnOwoJCWlmICggaXNfYXJyYXkoICRyZWlrc21lICkgKSB7CgkJCSRyZWlrc21lID0gaW1wbG9kZSggJyAnLCAkcmVpa3NtZSApOwoJCX0KCQkkc3ZhcnVzID0gdHJpbSggd3Bfc3RyaXBfYWxsX3RhZ3MoIChzdHJpbmcpICRyZWlrc21lICkgKTsKCQkkc3ZhcnVzID0gdHJpbSggc3RyX3JlcGxhY2UoIGFycmF5KCAiXHhjMlx4YTAiLCAnJm5ic3A7JyApLCAnICcsICRzdmFydXMgKSApOwoJCWlmICggJycgPT09ICRzdmFydXMgfHwgJy0nID09PSAkc3ZhcnVzIHx8ICfigJMnID09PSAkc3ZhcnVzICkgewoJCQl1bnNldCggJGF0dHJpYnV0ZXNbICRyYWt0YXMgXSApOwoJCX0KCX0KCXJldHVybiAkYXR0cmlidXRlczsKfSwgMjAsIDIgKTsKS09EQVM7CiAgICAgICRzbD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgICAgICRlc2FtYXM9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxhY3RpdmUgRlJPTSAkc2wgV0hFUkUgbmFtZT0lcyIsJFBBViksQVJSQVlfQSk7CiAgICAgICRvWydidXZvJ109JGVzYW1hczsKICAgICAgaWYoY2xhc3NfZXhpc3RzKCdcQ29kZV9TbmlwcGV0c1xTbmlwcGV0JykpewogICAgICAgICRzPW5ldyBcQ29kZV9TbmlwcGV0c1xTbmlwcGV0KCk7CiAgICAgICAgaWYoJGVzYW1hcykgJHMtPmlkPShpbnQpJGVzYW1hc1snaWQnXTsKICAgICAgICAkcy0+bmFtZT0kUEFWOyAkcy0+Y29kZT0ka29kYXM7ICRzLT5zY29wZT0nZ2xvYmFsJzsgJHMtPmFjdGl2ZT10cnVlOyAkcy0+cHJpb3JpdHk9MTA7CiAgICAgICAgJHMtPmRlc2M9J1NsZXBpYSBrbGllbnRvIHByZWvEl3Mga29ydGVsxJdqZSBhdHJpYnV0dXMgYmUgcmVpa8WhbcSXcy4gUzE2NjYuJzsKICAgICAgICAkcj1cQ29kZV9TbmlwcGV0c1xzYXZlX3NuaXBwZXQoJHMpOwogICAgICAgICRvWydpc3NhdWdvdGEnXT1pc19vYmplY3QoJHIpPyRyLT5pZDokcjsKICAgICAgfSBlbHNlIHsKICAgICAgICAkb1sna2xhaWRhJ109J0NvZGVfU25pcHBldHNcU25pcHBldCBrbGFzZXMgbmVyYSc7CiAgICAgIH0KICAgICAgLy8gcGF0aWtyYSBEQgogICAgICAkb1snZGJfcG8nXT0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHNjb3BlLHByaW9yaXR5LExFTkdUSChjb2RlKSBsIEZST00gJHNsIFdIRVJFIG5hbWU9JXMiLCRQQVYpLEFSUkFZX0EpOwogICAgICAkb1snYWt0eXZpdV9zbmlwcGV0dSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRzbCBXSEVSRSBhY3RpdmU9MSIpOwogICAgfQogICAgaWYoJGY9PT0nQicpewogICAgICAkb1snZmlsdHJhc191enJlZ2lzdHJ1b3RhcyddPWhhc19maWx0ZXIoJ3dvb2NvbW1lcmNlX2Rpc3BsYXlfcHJvZHVjdF9hdHRyaWJ1dGVzJyk/J3RhaXAnOiduZSc7CiAgICAgIC8vIHByZWtlIFNVIG1vbm9wcm90ZWluIHJlaWtzbWUgKGtvbnRyb2xlKQogICAgICAkc3U9JHdwZGItPmdldF92YXIoIlNFTEVDVCB0ci5vYmplY3RfaWQgRlJPTSB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBBTkQgdHQudGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyBKT0lOIHskd3BkYi0+cG9zdHN9IHAgT04gcC5JRD10ci5vYmplY3RfaWQgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgTElNSVQgMSIpOwogICAgICAkdGlrcj1hcnJheSgnanVuaW9yJz0+MTk3ODAsJ3R1cmtleSc9PjE5NzE1LCdrb250cm9sZV9zdV9yZWlrc21lJz0+KGludCkkc3UpOwogICAgICBmb3JlYWNoKCR0aWtyIGFzICRrPT4kaWQpewogICAgICAgIGlmKCEkaWQpeyAkb1sndGlrcmEnXVska109J25lcmEnOyBjb250aW51ZTsgfQogICAgICAgICR1PWdldF9wZXJtYWxpbmsoJGlkKTsKICAgICAgICAkcj13cF9yZW1vdGVfZ2V0KCR1LGFycmF5KCd0aW1lb3V0Jz0+NDUsJ3NzbHZlcmlmeSc9PmZhbHNlLCdoZWFkZXJzJz0+YXJyYXkoJ1VzZXItQWdlbnQnPT4nTW96aWxsYS81LjAgQ2hyb21lLzE1MicsJ0NhY2hlLUNvbnRyb2wnPT4nbm8tY2FjaGUnKSkpOwogICAgICAgIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWyd0aWtyYSddWyRrXT0nRVJSICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IGNvbnRpbnVlOyB9CiAgICAgICAgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgICAgICRlaWw9YXJyYXkoKTsKICAgICAgICBpZihwcmVnX21hdGNoKCcvPHRhYmxlW14+XSpzaG9wX2F0dHJpYnV0ZXMuKj88XC90YWJsZT4vcycsJGIsJG0pKXsKICAgICAgICAgIHByZWdfbWF0Y2hfYWxsKCcvPHRoW14+XSo+KC4qPyk8XC90aD5ccyo8dGRbXj5dKj4oLio/KTxcL3RkPi9zJywkbVswXSwkYWEsUFJFR19TRVRfT1JERVIpOwogICAgICAgICAgZm9yZWFjaCgkYWEgYXMgJHgpeyAkZWlsW3RyaW0oc3RyaXBfdGFncygkeFsxXSkpXT10cmltKHN0cmlwX3RhZ3MoJHhbMl0pKT09PScnPycoVFXFoMSMSUEpJzpzdWJzdHIodHJpbShzdHJpcF90YWdzKCR4WzJdKSksMCw0MCk7IH0KICAgICAgICB9CiAgICAgICAgJG9bJ3Rpa3JhJ11bJGtdPWFycmF5KCdpZCc9PiRpZCwndXJsJz0+JHUsJ2tvZGFzJz0+d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLCdhdHJpYnV0YWknPT4kZWlsLAogICAgICAgICAgJ3R1c2NpdSc9PmNvdW50KGFycmF5X2ZpbHRlcigkZWlsLGZ1bmN0aW9uKCR2KXtyZXR1cm4gJHY9PT0nKFRVxaDEjElBKSc7fSkpKTsKICAgICAgfQogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-063700';
const GKEY='ps_bkB';
const PHASES=["A", "B"];
const OUT='analize/s1666_a.json';
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
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
