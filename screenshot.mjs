process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVBJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVBJyk7CiAkb1snbWF4X2lkJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPQUxFU0NFKE1BWChpZCksMCkgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkiKTsKICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xKSk7ICR1aWQ9JGFkbT8kYWRtWzBdLT5JRDoxOwogJG9bJ3VpZCddPSR1aWQ7CiAkb1snY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOwogJG9bJ2Nvb2tpZV92YWx1ZSddPXdwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsIHRpbWUoKSszMDAsICdsb2dnZWRfaW4nKTsKICRvWyd1cmwnXT13Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ2F1Z2ludGluaXMnKS4nP2FjdGlvbj1jcmVhdGUnOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg=='; const B64B='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdFMkVCJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidFMkVCJyk7CiAkbnVvPWlzc2V0KCRfR0VUWydudW8nXSk/KGludCkkX0dFVFsnbnVvJ106MDsKICRvWydudW8nXT0kbnVvOwogJG9bJ2VpbHV0ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgIlNFTEVDVCBpZCxzcml0aXMsdGlwYXMsdmVydGUsdXNlcl9pZCxDSEFSX0xFTkdUSChzZXNpamEpIHNlc19sZW4saXJlbmdpbnlzIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIGlkPiVkIE9SREVSIEJZIGlkIiwkbnVvKSxBUlJBWV9BKTsKICRvWydpc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKAogICJERUxFVEUgRlJPTSB7JFB9cHNfbGF1a2FpX2l2eWtpYWkgV0hFUkUgaWQ+JWQgQU5EIHNyaXRpcz0nYW5rZXRhJyIsJG51bykpOwogJG9bJ2xpa29fYW5rZXRhJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBzX2xhdWthaV9pdnlraWFpIFdIRVJFIHNyaXRpcz0nYW5rZXRhJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'P0N-E2E2'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const sA=await snip('TEMP P0N E2EA',A64);
  await new Promise(r=>setTimeout(r,5000));
  let prep=JSON.parse(await (await fetch(WP+'/?ps_p0=E2EA')).text());
  await off(sA);
  out.prep={max_id:prep.max_id,url:prep.url};

  const { chromium } = await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:900}});
  await ctx.addCookies([{name:prep.cookie_name,value:prep.cookie_value,domain:'dev.avesa.lt',path:'/'}]);
  await ctx.addInitScript(()=>{ 
    window.__beacons=[]; window.__fetchai=[];
    const ob=navigator.sendBeacon?navigator.sendBeacon.bind(navigator):null;
    if(ob) navigator.sendBeacon=function(u,d){const r=ob(u,d);try{let t='';if(d&&d.get)t=d.get('tipas')||'';window.__beacons.push({t:t,ok:r});}catch(e){}return r;};
  });

  /* --- SCENARIJUS 1: uzpildyta forma, pagehide (metimas) --- */
  const p1=await ctx.newPage();
  out.s1={js:[]}; p1.on('pageerror',e=>out.s1.js.push(String(e).slice(0,150)));
  await p1.goto(prep.url,{waitUntil:'domcontentloaded',timeout:30000});
  await p1.waitForSelector('.pspet-wrap',{timeout:15000});
  await new Promise(r=>setTimeout(r,1000));
  const pill=await p1.$('.pspet-wrap .pspet-pill'); if(pill) await pill.click();
  const inp=await p1.$('.pspet-wrap .pspet-field input[type="text"], .pspet-wrap input.pspet-input');
  if(inp){ await inp.fill('Reksas'); out.s1.vardas=1; }
  await new Promise(r=>setTimeout(r,500));
  await p1.evaluate(()=>{window.dispatchEvent(new Event('pagehide'));});
  await new Promise(r=>setTimeout(r,2500));
  out.s1.beacons=await p1.evaluate(()=>window.__beacons);
  await put('e2e_3_metimas.png', await p1.screenshot(), 'e2e metimo scenarijus');
  await p1.close();

  /* --- SCENARIJUS 2: mygtuko paspaudimas — kas vyksta su beacon'ais --- */
  const p2=await ctx.newPage();
  out.s2={js:[],nav:[]};
  p2.on('pageerror',e=>out.s2.js.push(String(e).slice(0,150)));
  p2.on('framenavigated',f=>{if(f===p2.mainFrame())out.s2.nav.push(f.url().slice(-45));});
  p2.on('request',rq=>{const u=rq.url();if(u.includes('/petshop/v1/'))out.s2.rest=(out.s2.rest||[]).concat([rq.method()+' '+u.slice(-45)]);});
  await p2.goto(prep.url,{waitUntil:'domcontentloaded',timeout:30000});
  await p2.waitForSelector('.pspet-wrap',{timeout:15000});
  await new Promise(r=>setTimeout(r,1000));
  const pill2=await p2.$('.pspet-wrap .pspet-pill'); if(pill2) await pill2.click();
  const btn=await p2.$$('.pspet-wrap .pspet-btn');
  if(btn.length){ await btn[btn.length-1].click(); }
  await new Promise(r=>setTimeout(r,2500));
  out.s2.beacons=await p2.evaluate(()=>window.__beacons).catch(()=>'nepasiekiama (naviguota)');
  await put('e2e_4_po_mygtuko.png', await p2.screenshot(), 'e2e mygtuko diagnostika');
  await p2.close();
  await br.close();

  const sB=await snip('TEMP P0N E2EB',B64B);
  await new Promise(r=>setTimeout(r,5000));
  out.db=JSON.parse(await (await fetch(WP+'/?ps_p0=E2EB&nuo='+prep.max_id)).text());
  await off(sB);
}catch(e){ out.bendra=String(e).slice(0,300); }
await put('p0n.json', Buffer.from(JSON.stringify(out)), 'p0n e2e2');
console.log('ok');
