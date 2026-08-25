process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI3NyddKSB8fCAkX0dFVFsncHNfaDI3NyddIT09J1JVTjIwMjYwODI1TCcpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNzdBJyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICRyaWQ9d2NfZ2V0X3Byb2R1Y3RfaWRfYnlfc2t1KCczNDE4NTAtZHAnKTsgJFRbJ3JpbmsnXT1hcnJheSgnaWQnPT4kcmlkLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRyaWQpKTsKICRraWQ9JHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnxb1hcm7FsyBwYWdhbGl1a2FpLCA4MCBnJScgTElNSVQgMSIpOwogJFRbJ3phcm51J109YXJyYXkoJ2lkJz0+JGtpZCk7CiBpZigka2lkKXsgJHBvPWdldF9wb3N0KCRraWQpOyAkVFsnemFybnUnXVsnZXhjJ109bWJfc3Vic3RyKCRwby0+cG9zdF9leGNlcnB0LDAsMjAwKTsgJFRbJ3phcm51J11bJ3BhdF9leGMnXT1zdWJzdHJfY291bnQoJHBvLT5wb3N0X2V4Y2VycHQsJ1BhdHBnaScpOyAkVFsnemFybnUnXVsncGF0X2NvbiddPXN1YnN0cl9jb3VudCgkcG8tPnBvc3RfY29udGVudCwnUGF0cGdpJyk7CiAgJG49MDsgaWYoJFRbJ3phcm51J11bJ3BhdF9leGMnXXx8JFRbJ3phcm51J11bJ3BhdF9jb24nXSl7ICRuPSR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskd3BkYi0+cG9zdHN9IFNFVCBwb3N0X2V4Y2VycHQ9UkVQTEFDRShwb3N0X2V4Y2VycHQsJ1BhdHBnaScsJ1BhdG9naScpLCBwb3N0X2NvbnRlbnQ9UkVQTEFDRShwb3N0X2NvbnRlbnQsJ1BhdHBnaScsJ1BhdG9naScpIFdIRVJFIElEPSVkIiwka2lkKSk7IGNsZWFuX3Bvc3RfY2FjaGUoJGtpZCk7fSAkVFsnemFybnUnXVsncGF0YWlzeXRhJ109JG47IH0KIGlmKCRyaWQpeyAkcnA9Z2V0X3Bvc3QoJHJpZCk7ICRUWydyaW5rJ11bJ3BhdCddPXN1YnN0cl9jb3VudCgkcnAtPnBvc3RfY29udGVudCwnUGF0cGdpJyk7IGlmKCRUWydyaW5rJ11bJ3BhdCddKXsgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyR3cGRiLT5wb3N0c30gU0VUIHBvc3RfY29udGVudD1SRVBMQUNFKHBvc3RfY29udGVudCwnUGF0cGdpJywnUGF0b2dpJykgV0hFUkUgSUQ9JWQiLCRyaWQpKTsgY2xlYW5fcG9zdF9jYWNoZSgkcmlkKTsgJFRbJ3JpbmsnXVsncGF0YWlzeXRhJ109MTsgfQogICR2YWlrYWk9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwcm9kdWN0X2lkIEZST00geyRwfXdjX21ubV9jaGlsZF9pdGVtcyBXSEVSRSBjb250YWluZXJfaWQ9JWQgT1JERVIgQlkgbWVudV9vcmRlciBMSU1JVCAxIiwkcmlkKSk7ICRUWydrb21wX3VybCddPSR2YWlrYWk/Z2V0X3Blcm1hbGluaygoaW50KSR2YWlrYWlbMF0pOicnOyB9CiAkVFsnc25pcHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIGlkIElOICg1MjQsNTMyLDUzNSw1MzksNTQ3LDU1MCw1NTgsNTYwKSBPUiBuYW1lIExJS0UgJyVyaW5rJScgT1IgbmFtZSBMSUtFICclTW5NJScgT1IgbmFtZSBMSUtFICclTWl4JScgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogJFRbJ3RlbWEnXT1hcnJheSgncHJpbWFyeSc9PmdldF90aGVtZV9tb2QoJ2NvbG9yX3ByaW1hcnknKSwnc2Vjb25kYXJ5Jz0+Z2V0X3RoZW1lX21vZCgnY29sb3Jfc2Vjb25kYXJ5JyksJ2ZvbnQnPT5nZXRfdGhlbWVfbW9kKCd0eXBlX3RleHRzJyksJ3N0eWxlc2hlZXQnPT5nZXRfc3R5bGVzaGVldCgpKTsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskcH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK';
const out={v:'H277A'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H277 v1 (rinkinio vitrinos recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h277=RUN20260825L',{},'recon'); try{ out.r=JSON.parse(await d.text()); }catch(e){ out.r='ne-json'; }
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  // snippet kodai
  out.kodai={};
  for(const s of (out.r.snips||[])){ if(!s.active||s.active==='0') continue; try{ const g=await fetch(SNIP+'/'+s.id,{headers:A}); const jj=await g.json(); out.kodai[s.id]=jj.code||''; }catch(e){} }
  const {chromium}=await import('playwright'); const br=await chromium.launch();
  async function snap(url,name,w){ const ctx=await br.newContext({viewport:{width:w,height:1000},ignoreHTTPSErrors:true}); const pg=await ctx.newPage();
    await pg.goto(url,{waitUntil:'networkidle',timeout:60000}); await miegok(1200);
    const o={put:await put('screenshots/h277_'+name+'.png',await pg.screenshot({fullPage:true}),'H277A')};
    o.btn=await pg.$$eval('button.single_add_to_cart_button, .single_add_to_cart_button',ns=>ns.map(n=>{const c=getComputedStyle(n);return {t:n.textContent.trim(),bg:c.backgroundColor,col:c.color,r:c.borderRadius,ff:c.fontFamily.slice(0,40),fs:c.fontSize};})).catch(()=>[]);
    o.h1=await pg.$eval('h1',n=>{const c=getComputedStyle(n);return {ff:c.fontFamily.slice(0,40),fs:c.fontSize,col:c.color};}).catch(()=>null);
    o.body=await pg.$eval('body',n=>{const c=getComputedStyle(n);return {ff:c.fontFamily.slice(0,40),col:c.color};}).catch(()=>null);
    o.cont=await pg.$$eval('.product-main .row, .product-main, .mnm_form, .mnm_table, .mnm_child_products',ns=>ns.map(n=>({cls:n.className.slice(0,70),w:n.getBoundingClientRect().width,ml:getComputedStyle(n).marginLeft}))).catch(()=>[]);
    o.html=await pg.$eval('.mnm_form',n=>n.outerHTML.replace(/\s+/g,' ').slice(0,2500)).catch(()=>'');
    o.links=await pg.$$eval('link[rel=stylesheet]',ns=>ns.map(n=>n.href.replace(/^https?:\/\/dev.avesa.lt/,'').split('?')[0]).filter(h=>/mnm|mix|rink|petshop|child|flatsome/.test(h))).catch(()=>[]);
    await ctx.close(); return o; }
  out.rink=await snap(out.r.rink.url,'rink_desktop',1440);
  out.rink_m=await snap(out.r.rink.url,'rink_mobile',390);
  if(out.r.komp_url) out.komp=await snap(out.r.komp_url,'komp_desktop',1440);
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h277run.json', Buffer.from(JSON.stringify(out,null,1)), 'H277A');
