process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjQzaCBkZXYuYXZlc2EubHQgVkFMWU1BUyAoQVBQTFkpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfYmgnXSk/JF9HRVRbJ3BzX2JoJ106JycpOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE2NDNoJywncmV6aW1hcyc9PidBUFBMWScpOwogIHRyeXsKICAgICRiaz1hcnJheSgpOyAkdWQ9d3BfdXBsb2FkX2RpcigpOwogICAgJEQ9J2h0dHBzOi8vZGV2LmF2ZXNhLmx0JzsgJERoPSdodHRwOi8vZGV2LmF2ZXNhLmx0JzsKICAgIC8vIC0tLS0gMS4gcG9zdF9jb250ZW50IC0+IHNha25pbmVzIG51b3JvZG9zCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X2NvbnRlbnQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X2NvbnRlbnQgTElLRSAnJWRldi5hdmVzYS5sdCUnIixBUlJBWV9BKTsKICAgICRvWyd0dXJpbnlzJ109YXJyYXkoJ3Jhc3RhJz0+Y291bnQoJHJvd3MpLCdhdG5hdWppbnRhJz0+MCwncGFrZWl0aW11Jz0+MCk7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsKICAgICAgJGJrWydwb3N0cyddWyRyWydJRCddXT0kclsncG9zdF9jb250ZW50J107CiAgICAgICRuPXN0cl9yZXBsYWNlKGFycmF5KCRELicvJywkRGguJy8nLCRELCREaCksIGFycmF5KCcvJywnLycsJycsJycpLCAkclsncG9zdF9jb250ZW50J10pOwogICAgICAka2llaz1zdWJzdHJfY291bnQoc3RydG9sb3dlcigkclsncG9zdF9jb250ZW50J10pLCdkZXYuYXZlc2EubHQnKTsKICAgICAgaWYoJG4hPT0kclsncG9zdF9jb250ZW50J10pewogICAgICAgICR3cGRiLT51cGRhdGUoJHdwZGItPnBvc3RzLGFycmF5KCdwb3N0X2NvbnRlbnQnPT4kbiksYXJyYXkoJ0lEJz0+JHJbJ0lEJ10pKTsKICAgICAgICBjbGVhbl9wb3N0X2NhY2hlKCRyWydJRCddKTsKICAgICAgICAkb1sndHVyaW55cyddWydhdG5hdWppbnRhJ10rKzsgJG9bJ3R1cmlueXMnXVsncGFrZWl0aW11J10rPSRraWVrOwogICAgICB9CiAgICB9CiAgICAvLyAtLS0tIDIuIHBvc3RtZXRhIF9tZW51X2l0ZW1fdXJsIC0+IHNha25pbmVzICh0ZXN0IGt1cG9ubyBfdXNlZF9ieSBORUxJRUNJQU0pCiAgICAkbXI9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbWV0YV9pZCxwb3N0X2lkLG1ldGFfa2V5LG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX3ZhbHVlIExJS0UgJyVkZXYuYXZlc2EubHQlJyIsQVJSQVlfQSk7CiAgICAkb1snbWV0YSddPWFycmF5KCdyYXN0YSc9PmNvdW50KCRtciksJ2F0bmF1amludGEnPT4wLCdwcmFsZWlzdGEnPT5hcnJheSgpKTsKICAgIGZvcmVhY2goJG1yIGFzICRyKXsKICAgICAgaWYoJHJbJ21ldGFfa2V5J10hPT0nX21lbnVfaXRlbV91cmwnKXsgJG9bJ21ldGEnXVsncHJhbGVpc3RhJ11bXT1hcnJheSgkclsncG9zdF9pZCddLCRyWydtZXRhX2tleSddKTsgY29udGludWU7IH0KICAgICAgaWYoaXNfc2VyaWFsaXplZCgkclsnbWV0YV92YWx1ZSddKSl7ICRvWydtZXRhJ11bJ3ByYWxlaXN0YSddW109YXJyYXkoJHJbJ3Bvc3RfaWQnXSwnU0VSSUFMSVpFRCcpOyBjb250aW51ZTsgfQogICAgICAkYmtbJ21ldGEnXVskclsnbWV0YV9pZCddXT0kclsnbWV0YV92YWx1ZSddOwogICAgICAkbj1zdHJfcmVwbGFjZShhcnJheSgkRC4nLycsJERoLicvJyksYXJyYXkoJy8nLCcvJyksJHJbJ21ldGFfdmFsdWUnXSk7CiAgICAgICR3cGRiLT51cGRhdGUoJHdwZGItPnBvc3RtZXRhLGFycmF5KCdtZXRhX3ZhbHVlJz0+JG4pLGFycmF5KCdtZXRhX2lkJz0+JHJbJ21ldGFfaWQnXSkpOwogICAgICAkb1snbWV0YSddWydhdG5hdWppbnRhJ10rKzsKICAgIH0KICAgIHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAvLyAtLS0tIDMuIGd1aWQgLT4gcGV0c2hvcC5sdCAoa2FpcCBSMTkyKQogICAgJGdyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELGd1aWQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBndWlkIExJS0UgJyVkZXYuYXZlc2EubHQlJyIsQVJSQVlfQSk7CiAgICAkb1snZ3VpZCddPWFycmF5KCdyYXN0YSc9PmNvdW50KCRnciksJ2F0bmF1amludGEnPT4wKTsKICAgIGZvcmVhY2goJGdyIGFzICRyKXsKICAgICAgJGJrWydndWlkJ11bJHJbJ0lEJ11dPSRyWydndWlkJ107CiAgICAgICRuPXN0cl9yZXBsYWNlKGFycmF5KCRELCREaCksYXJyYXkoJ2h0dHBzOi8vcGV0c2hvcC5sdCcsJ2h0dHBzOi8vcGV0c2hvcC5sdCcpLCRyWydndWlkJ10pOwogICAgICAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wb3N0cyxhcnJheSgnZ3VpZCc9PiRuKSxhcnJheSgnSUQnPT4kclsnSUQnXSkpOwogICAgICAkb1snZ3VpZCddWydhdG5hdWppbnRhJ10rKzsKICAgIH0KICAgIC8vIC0tLS0gNC4gdHJhbnNpZW50YWkgc3UgZGV2LmF2ZXNhLmx0IC0+IHRyaW50aSAoYXRzaWt1cmlhKQogICAgJHRuPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclZGV2LmF2ZXNhLmx0JScgQU5EIChvcHRpb25fbmFtZSBMSUtFICdcX3RyYW5zaWVudFxfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnXF9zaXRlXF90cmFuc2llbnRcXyUnIE9SIG9wdGlvbl9uYW1lPSdjbXBsel90cmFuc2llbnRzJykiKTsKICAgICRvWyd0cmFuc2llbnRhaSddPWFycmF5KCdyYXN0YSc9PiR0biwnaXN0cmludGEnPT4wKTsKICAgIGZvcmVhY2goJHRuIGFzICR0KXsgJGJrWydvcHRpb25zJ11bJHRdPWdldF9vcHRpb24oJHQpOyBpZihkZWxldGVfb3B0aW9uKCR0KSkgJG9bJ3RyYW5zaWVudGFpJ11bJ2lzdHJpbnRhJ10rKzsgfQogICAgLy8gLS0tLSBrb3BpamEKICAgICRwPSR1ZFsnYmFzZWRpciddLicvcHMtYmFja3Vwcy9kZXYtdXJsLXZhbHltYXMtUzE2NDMtJy5kYXRlKCdZbWQtSGlzJykuJy5qc29uJzsKICAgIGlmKCFpc19kaXIoZGlybmFtZSgkcCkpKSBAbWtkaXIoZGlybmFtZSgkcCksMDc1NSx0cnVlKTsKICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRwLGpzb25fZW5jb2RlKCRiayxKU09OX1VORVNDQVBFRF9VTklDT0RFKSk7CiAgICAkb1sna29waWphJ109YmFzZW5hbWUoJHApOyAkb1sna29waWphX0InXT1maWxlc2l6ZSgkcCk7CiAgICAvLyAtLS0tIGtvbnRyb2xlCiAgICAkb1sncG8nXT1hcnJheSgKICAgICAgJ3Bvc3RzX2NvbnRlbnQnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X2NvbnRlbnQgTElLRSAnJWRldi5hdmVzYS5sdCUnIiksCiAgICAgICdwb3N0c19ndWlkJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgZ3VpZCBMSUtFICclZGV2LmF2ZXNhLmx0JSciKSwKICAgICAgJ3Bvc3RtZXRhJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV92YWx1ZSBMSUtFICclZGV2LmF2ZXNhLmx0JSciKSwKICAgICAgJ29wdGlvbnMnPT4kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fdmFsdWUgTElLRSAnJWRldi5hdmVzYS5sdCUnIiksCiAgICApOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-184416';
const GKEY='ps_bh';
const PHASES=["GO"];
const OUT='analize/s1643_h.json';
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
