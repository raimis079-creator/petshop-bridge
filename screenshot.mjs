process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIERldiBQYXRpa3JhIHYxLjAgKEthdHJpbmV4IGlyIGthdGVnb3Jpam9zKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfZGV2Y2hrJ10gPz8gJycpICE9PSAnREVWQ0hLMScgKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRvPVsndic9PidERVZDSEsxJ107CgogLy8gMSkgS2F0cmluZXggYmV0IGtva2l1IHN0YXR1c3UKICRyPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQscC5wb3N0X3RpdGxlLHAucG9zdF9zdGF0dXMscC5wb3N0X3R5cGUKICAgIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZSBJTiAoJ3Byb2R1Y3QnLCdwcm9kdWN0X3ZhcmlhdGlvbicpCiAgICBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJyVhdHJpbmV4JScgT1JERVIgQlkgcC5wb3N0X3RpdGxlIiwgQVJSQVlfQSk7CiBmb3JlYWNoKCRyIGFzICYkeCl7CiAgICR4Wydza3UnXT1nZXRfcG9zdF9tZXRhKCR4WydJRCddLCdfc2t1Jyx0cnVlKTsKICAgJHhbJ2thaW5hJ109Z2V0X3Bvc3RfbWV0YSgkeFsnSUQnXSwnX3JlZ3VsYXJfcHJpY2UnLHRydWUpOwogICAkeFsnc3RvY2snXT1nZXRfcG9zdF9tZXRhKCR4WydJRCddLCdfc3RvY2snLHRydWUpOwogfQogJG9bJ2thdHJpbmV4J109JHI7ICRvWydrYXRyaW5leF9zayddPWNvdW50KCRyKTsKCiAvLyAyKSBicmVuZGFzIEthdHJpbmV4CiAkdD1nZXRfdGVybV9ieSgnbmFtZScsJ0thdHJpbmV4JywncHJvZHVjdF9icmFuZCcpOwogJG9bJ2JyZW5kYXNfa2F0cmluZXgnXT0gJHQgPyBbJ2lkJz0+JHQtPnRlcm1faWQsJ2NvdW50Jz0+JHQtPmNvdW50XSA6IG51bGw7CgogLy8gMykga2F0ZWdvcmlqb3MsIGt1cmlvcyBydXBpCiAka2F0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LmNvdW50LHR0LnBhcmVudAogICBGUk9NIHskd3BkYi0+dGVybXN9IHQgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dC50ZXJtX2lkCiAgIFdIRVJFIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EICgKICAgICB0LnNsdWcgTElLRSAnJXp1diUnIE9SIHQuc2x1ZyBMSUtFICclYWt2YXJpdW0lJyBPUiB0LnNsdWcgTElLRSAnJXR2ZW5raW4lJwogICAgIE9SIHQuc2x1ZyBMSUtFICcldHVhbGV0JScgT1IgdC5zbHVnIExJS0UgJyVkdWJlbmVsJScgT1IgdC5zbHVnIExJS0UgJyV0cmFuc3BvcnQlJwogICAgIE9SIHQuc2x1ZyBMSUtFICcla3JhaWslJyBPUiB0LnNsdWcgTElLRSAnJXNlbXR1diUnIE9SIHQuc2x1ZyBMSUtFICcla2lsaW1lbCUnKQogICBPUkRFUiBCWSB0dC5jb3VudCBERVNDIiwgQVJSQVlfQSk7CiAkb1sna2F0ZWdvcmlqb3MnXT0ka2F0OwoKIC8vIDQpIGtpZWsgcHVibGlzaCBwcmVraXUgdG9zZSBrYXRlZ29yaWpvc2UgKHN1IHBhbGlrdW9uaW1pcyBuZXNrYWljaXVvamFtIC0gdGlrIHRpZXNpb2dpYWkpCiBmb3JlYWNoKCRrYXQgYXMgJiRrKXsKICAgJGtbJ3B1Ymxpc2gnXSA9IChpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoCiAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgICAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQKICAgICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZAogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCB0dC50ZXJtX2lkPSVkIiwka1sndGVybV9pZCddKSk7CiAgICRrWydkcmFmdCddID0gKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRAogICAgICBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkCiAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0nZHJhZnQnIEFORCB0dC50ZXJtX2lkPSVkIiwka1sndGVybV9pZCddKSk7CiB9CiAkb1sna2F0ZWdvcmlqb3MnXT0ka2F0OwoKIC8vIDUpIGFyIHlyYSBwcmVraXUgc3UgbGl0cmFpcyBwYXZhZGluaW1lIHRvc2UgenV2dSBrYXRlZ29yaWpvc2UKICRvWydsaXRydV9wcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF90aXRsZSxwLnBvc3Rfc3RhdHVzCiAgIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcKICAgQU5EIChwLnBvc3RfdGl0bGUgUkVHRVhQICdbMC05XSA/KGx8THxsaXRyKScgKQogICBBTkQgKHAucG9zdF90aXRsZSBMSUtFICcla29pJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyV0dmVua2luJScgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyVha3Zhcml1bSUnCiAgICAgICAgT1IgcC5wb3N0X3RpdGxlIExJS0UgJyV6dXYlJyBPUiBwLnBvc3RfdGl0bGUgTElLRSAnJcW+dXYlJykKICAgTElNSVQgNjAiLCBBUlJBWV9BKTsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo=';
const VER='DEVCHK-SITEMAP-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const UA={'User-Agent':'Mozilla/5.0 Chrome/126','Cache-Control':'no-cache'};
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(6000);} } throw new Error('fx:'+k); }

// A) senas prekiu sitemap
try{
  const s=await fx('https://petshop.lt/cache/xml/feed_google_sitemap_product1.xml',{headers:UA},'sm');
  const t=await s.text(); out.sitemap_http=s.status; out.sitemap_baitu=t.length;
  const locs=[...t.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  out.senu_prekiu_url=locs.length;
  await put('analize/senas/produktu_url.json', Buffer.from(JSON.stringify(locs,null,0)), VER+' urls');
}catch(e){ out.sitemap_klaida=String(e).slice(0,300); }

// B) dev patikra
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Dev Patikra v1.0 (Katrinex ir kategorijos)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; out.snippet_id=sid; await miegok(9000);
  const d=await fx(WP+'/?ps_devchk=DEVCHK1',{headers:UA},'chk');
  out.http=d.status; const dt=await d.text();
  try{ out.dev=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/devchk.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log(JSON.stringify(out).slice(0,1200));
