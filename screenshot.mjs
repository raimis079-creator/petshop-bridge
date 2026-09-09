process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjg0IHp1cm5hbG8gcmFrdHUgdGFpc3ltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX2JsaSddKT8kX0dFVFsncHNfYmxpJ106Jyc7CiAgaWYoJGYhPT0nQScmJiRmIT09J0InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTY4NFoyJywnZmF6ZSc9PiRmKTsKICAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Ata2F0YWxvZ2FzLnBocCc7CiAgZ2xvYmFsICR3cGRiOwogIHRyeXsKICAgIGlmKCRmPT09J0EnKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGtlbGlhcyk7CiAgICAgICRvWydwcmllc19tZDUnXT1tZDUoJGMpOwogICAgICAkcGFrPWFycmF5KAogICAgICAgIGFycmF5KAogICAgICAgICAgIlx0XHRcdFx0XHQnYnV2bycgICAgPT4gKCBudWxsID09PSBcJGJ1dm8gPyAnJyA6IChzdHJpbmcpIFwkYnV2byApLFxuXHRcdFx0XHRcdCd0YXBvJyAgICA9PiAoIG51bGwgPT09IFwkdGFwbyA/ICcnIDogKHN0cmluZykgXCR0YXBvICksIiwKICAgICAgICAgICJcdFx0XHRcdFx0J3NlbmEnICAgID0+ICggbnVsbCA9PT0gXCRidXZvID8gJycgOiAoc3RyaW5nKSBcJGJ1dm8gKSxcblx0XHRcdFx0XHQnbmF1amEnICAgPT4gKCBudWxsID09PSBcJHRhcG8gPyAnJyA6IChzdHJpbmcpIFwkdGFwbyApLCIKICAgICAgICApLAogICAgICAgIGFycmF5KAogICAgICAgICAgIlx0XHRcdFx0XHQnYnV2bycgICAgPT4gJycsXG5cdFx0XHRcdFx0J3RhcG8nICAgID0+IFwka2lla2lzIC4gJyB2bnQuIMOXICcgLiBcJHNhdiAuICcg4oKsJywiLAogICAgICAgICAgIlx0XHRcdFx0XHQnc2VuYScgICAgPT4gJycsXG5cdFx0XHRcdFx0J25hdWphJyAgID0+IFwka2lla2lzIC4gJyB2bnQuIMOXICcgLiBcJHNhdiAuICcg4oKsJyxcblx0XHRcdFx0XHQnbGVpc3RpX2JlX3Bva3ljaW8nID0+IDEsIgogICAgICAgICksCiAgICAgICk7CiAgICAgIGZvcmVhY2goJHBhayBhcyAkaT0+JHApewogICAgICAgICRuPXN1YnN0cl9jb3VudCgkYywkcFswXSk7CiAgICAgICAgJG9bJ3Bha2VpdGltYXNfJy4kaV09JG47CiAgICAgICAgaWYoJG4hPT0xKXsgJG9bJ1NUT1AnXT0ncGFrZWl0aW1hcyAnLiRpLicgcmFzdGFzICcuJG4uJyBrYXJ0dXMnOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgICAgICAgJGM9c3RyX3JlcGxhY2UoJHBbMF0sJHBbMV0sJGMpOwogICAgICB9CiAgICAgICRrbGFpZGE9bnVsbDsKICAgICAgdHJ5eyAkdD1AdG9rZW5fZ2V0X2FsbCgkYyxUT0tFTl9QQVJTRSk7IGlmKCFpc19hcnJheSgkdCkpICRrbGFpZGE9J3R1c2NpYSc7IH0KICAgICAgY2F0Y2goVGhyb3dhYmxlICRlKXsgJGtsYWlkYT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAgIGlmKCRrbGFpZGEpeyAkb1snU1RPUCddPSdTSU5UQUtTRTogJy4ka2xhaWRhOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9CiAgICAgICRiYWs9JGtlbGlhcy4nLXY4ODAtQkFDS1VQLScuZGF0ZSgnWW1kLUhpcycpOyBjb3B5KCRrZWxpYXMsJGJhayk7ICRvWydiYWsnXT1iYXNlbmFtZSgkYmFrKTsKICAgICAgZmlsZV9wdXRfY29udGVudHMoJGtlbGlhcywkYyk7CiAgICAgIGNsZWFyc3RhdGNhY2hlKHRydWUsJGtlbGlhcyk7CiAgICAgICRvWydwb19tZDUnXT1tZDUoZmlsZV9nZXRfY29udGVudHMoJGtlbGlhcykpOwogICAgICAkcj13cF9yZW1vdGVfZ2V0KGhvbWVfdXJsKCcvJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICAgJGs9aXNfd3BfZXJyb3IoJHIpPzA6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogICAgICAkb1snaGVhcnRiZWF0J109JGs7CiAgICAgIGlmKCRrPj01MDB8fCRrPT09MCl7IGNvcHkoJGJhaywka2VsaWFzKTsgJG9bJ1JPTExCQUNLJ109MTsgfQogICAgfQogICAgaWYoJGY9PT0nQicpewogICAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgICB3cF9zZXRfY3VycmVudF91c2VyKChpbnQpJGFkbVswXSk7CiAgICAgIGFkZF9maWx0ZXIoJ3dwX2RvaW5nX2FqYXgnLCdfX3JldHVybl90cnVlJyw5OSk7CiAgICAgIGFkZF9maWx0ZXIoJ3dwX2RpZV9hamF4X2hhbmRsZXInLGZ1bmN0aW9uKCl7IHJldHVybiBmdW5jdGlvbigkbSwkdD0nJywkYT1hcnJheSgpKXsgdGhyb3cgbmV3IEV4Y2VwdGlvbignWCcpOyB9OyB9LDk5KTsKICAgICAgJGxlbnQ9UGV0c2hvcF9QYXJ0aWpvczo6bGVudGVsZSgpOyAkcGFydD00MDczOwogICAgICAkcD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUICogRlJPTSBgJGxlbnRgIFdIRVJFIGlkPSVkIiwkcGFydCksQVJSQVlfQSk7CiAgICAgICRwaWQ9KGludCkkcFsncHJvZHVjdF9pZCddOwogICAgICAkcHJpZXM9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXZ5a2lhaSBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSk7CiAgICAgICRfUE9TVD0kX1JFUVVFU1Q9YXJyYXkoJ2FjdGlvbic9Pidwc19rYXRfcGFydGlqYScsJ25vbmNlJz0+d3BfY3JlYXRlX25vbmNlKCdwc19rYXQnKSwKICAgICAgICAncGFydCc9PiRwYXJ0LCdpZCc9PiRwaWQsJ2xhdWthcyc9PidnZXJpYXVzaWFfaWtpJywncmVpa3NtZSc9PicyMDI4LTAxLTE1Jyk7CiAgICAgIG9iX3N0YXJ0KCk7IHRyeXsgUGV0c2hvcF9LYXRhbG9nYXM6OmFqYXhfcGFydGlqYSgpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXt9ICRvdXQ9b2JfZ2V0X2NsZWFuKCk7CiAgICAgICRvWydhdHNha2FzJ109anNvbl9kZWNvZGUoJG91dCx0cnVlKTsKICAgICAgJG9bJ3p1cm5hbG9fcHJpZXMnXT0kcHJpZXM7CiAgICAgICRvWyd6dXJuYWxvX3BvJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXZ5a2lhaSBXSEVSRSBwcm9kdWN0X2lkPSVkIiwkcGlkKSk7CiAgICAgICRvWyduYXVqYXNfaXJhc2FzJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBsYWlrYXMsdGlwYXMsbGF1a2FzLHNlbmEsbmF1amEsa2FzLHBhc3RhYmEgRlJPTSB7JHdwZGItPnByZWZpeH1wc19pdnlraWFpIFdIRVJFIHByb2R1Y3RfaWQ9JWQgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwkcGlkKSxBUlJBWV9BKTsKICAgICAgLy8gYXRzdGF0b20KICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgYCRsZW50YCBTRVQgZ2VyaWF1c2lhX2lraT1OVUxMIFdIRVJFIGlkPSVkIiwkcGFydCkpOwogICAgICAkb1snYXRzdGF0eXRhJ109JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBnZXJpYXVzaWFfaWtpIEZST00gYCRsZW50YCBXSEVSRSBpZD0lZCIsJHBhcnQpKTsKICAgICAgJG9bJ3N2ZXRhaW5lJ109d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUod3BfcmVtb3RlX2dldChob21lX3VybCgnLycpLGFycmF5KCd0aW1lb3V0Jz0+MjUsJ3NzbHZlcmlmeSc9PmZhbHNlKSkpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='dep-095508';
const GKEY='ps_bli';
const PHASES=["A", "B"];
const OUT='analize/s1684_z2.json';
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
