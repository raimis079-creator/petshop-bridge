process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEpTIGRpYWcgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX2YxOSddKT8kX0dFVFsncHNfZjE5J106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnUFJFUDMnLCdDTDMnKSx0cnVlKSkgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nSlNELScuJGYpOwogIHRyeXsKICAgICRlbT0ncHNuM3ZpenVhbEBneXZ1bmFpLmx0JzsKICAgIGlmKCRmPT09J1BSRVAzJyl7CiAgICAgICR1aWQ9ZW1haWxfZXhpc3RzKCRlbSk7IGlmKCEkdWlkKXskdWlkPXdwX2NyZWF0ZV91c2VyKCdwc24zdml6dWFsJyx3cF9nZW5lcmF0ZV9wYXNzd29yZCgyMCksJGVtKTt9CiAgICAgICRvWyd1aWQnXT0oaW50KSR1aWQ7CiAgICAgICRvWydjb29raWVfbmFtZSddPUxPR0dFRF9JTl9DT09LSUU7CiAgICAgICRvWydjb29raWVfdmFsJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCx0aW1lKCkrMzYwMCwnbG9nZ2VkX2luJyk7CiAgICAgICRvWyd1cmwnXT13Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ3ByZW51bWVyYXRvcycpOwogICAgfSBlbHNlIHsKICAgICAgZ2xvYmFsICR3cGRiOwogICAgICAkc2lkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBlbWFpbD0lcyIsJGVtKSk7CiAgICAgIGZvcmVhY2goJHNpZHMgYXMgJHNpZCl7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25faXRlbXMgV0hFUkUgc3Vic2NyaXB0aW9uX2lkPSVkIiwkc2lkKSk7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25fZXZlbnRzIFdIRVJFIHN1YnNjcmlwdGlvbl9pZD0lZCIsJHNpZCkpOwogICAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9ucyBXSEVSRSBpZD0lZCIsJHNpZCkpOwogICAgICB9CiAgICAgICR1aWQ9ZW1haWxfZXhpc3RzKCRlbSk7IGlmKCR1aWQpeyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdWlkKTsgfQogICAgICAkb1snaXN0cmludGEnXT1jb3VudCgkc2lkcyk7CiAgICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='psk302-jsdiag-1';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  try{ const l=await fetch(SNIP,{headers:A}); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){}
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id;}catch(e){out.kurimo_atsakas=ct.slice(0,300);}
  await miegok(9000);
  const pr=await fetch(WP+'/?ps_f19=PREP3&r='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  out.PREP=JSON.parse(await pr.text());
  const {chromium}=await import('playwright');
  const br=await chromium.launch(); const cx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1000}});
  await cx.addCookies([{name:out.PREP.cookie_name,value:out.PREP.cookie_val,domain:'dev.avesa.lt',path:'/'}]);
  const pg=await cx.newPage();
  const kons=[]; pg.on('console',m=>{if(m.type()==='error')kons.push(m.text().slice(0,200))});
  pg.on('pageerror',e=>kons.push('PAGEERR: '+String(e).slice(0,200)));
  await pg.goto(out.PREP.url,{waitUntil:'networkidle',timeout:60000});
  await miegok(1500);
  try{ await pg.getByText('PRIIMTI',{exact:true}).first().click({timeout:3500}); await miegok(600);}catch(e){}
  out.script_yra=await pg.evaluate(()=>typeof window.psn3Drawer);
  out.mygtuku=await pg.evaluate(()=>document.querySelectorAll('[onclick*=psn3Drawer]').length);
  try{ await pg.click('button.psn3-cta',{timeout:5000}); }catch(e){ out.click_klaida=String(e).slice(0,150); }
  await miegok(800);
  out.drawer_klase=await pg.evaluate(()=>{var d=document.getElementById('psn3-drawer');return d?d.className:'(nera)'});
  out.drawer_matomas=await pg.evaluate(()=>{var d=document.getElementById('psn3-drawer');if(!d)return false;var r=d.getBoundingClientRect();return r.width>50&&r.x<1300&&getComputedStyle(d).visibility==='visible'});
  out.konsole=kons.slice(0,8);
  await put('analize/jsdiag.png',await pg.screenshot({fullPage:false}),VER);
  await br.close();
  const cl=await fetch(WP+'/?ps_f19=CL3&r='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
  out.CLEAN=JSON.parse(await cl.text());
}catch(e){ out.klaida=String(e).slice(0,600); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/psk302.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
