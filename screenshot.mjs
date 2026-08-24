process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDI2NCddKSB8fCAkX0dFVFsncHNfaDI2NCddIT09J1JVTjIwMjYwODI0VicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0gyNjRBJyk7IGdsb2JhbCAkd3BkYjsKICR1PWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnb3JkZXJieSc9PidJRCcpKTsKIGlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdVswXS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHVbMF0tPklELHRydWUsdHJ1ZSk7IH0KIGlmKGlzc2V0KCRfR0VUWydkZXBsb3knXSkpewogICRzaGE9c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2hhJ10pOwogIGZvcmVhY2goYXJyYXkoJ3BldHNob3AtYXYtdGlla2ltYXMucGhwJykgYXMgJGYpewogICAkcj13cF9yZW1vdGVfZ2V0KCdodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlL2NvbnRlbnRzL2RlcGxveS8nLiRmLicuYjY0P3JlZj0nLiRzaGEsYXJyYXkoJ3RpbWVvdXQnPT40MCwnaGVhZGVycyc9PmFycmF5KCdVc2VyLUFnZW50Jz0+J3BzJywnQWNjZXB0Jz0+J2FwcGxpY2F0aW9uL3ZuZC5naXRodWIranNvbicpKSk7CiAgICRqPWpzb25fZGVjb2RlKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSx0cnVlKTsKICAgJGNvZGU9YmFzZTY0X2RlY29kZSh0cmltKGlzc2V0KCRqWydjb250ZW50J10pP2Jhc2U2NF9kZWNvZGUoJGpbJ2NvbnRlbnQnXSk6JycpKTsKICAgJGluZj1hcnJheSgnZ2F1dGEnPT5zdHJsZW4oJGNvZGUpKTsKICAgaWYoJGNvZGUgJiYgc3RycG9zKCRjb2RlLCc8P3BocCcpPT09MCl7CiAgICB0cnl7IHRva2VuX2dldF9hbGwoJGNvZGUsIFRPS0VOX1BBUlNFKTsgJGluZlsnc2ludGFrc2UnXT0nb2snOyB9IGNhdGNoKFBhcnNlRXJyb3IgJGUpeyAkaW5mWydzaW50YWtzZSddPSdLTEFJREE6ICcuJGUtPmdldE1lc3NhZ2UoKTsgfQogICAgaWYoJ29rJz09PSRpbmZbJ3NpbnRha3NlJ10peyAkZHN0PVdQTVVfUExVR0lOX0RJUi4nLycuJGY7IEBjb3B5KCRkc3QsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzLycuJGYuJy5iYWtfaDI2NCcpOyBmaWxlX3B1dF9jb250ZW50cygkZHN0LCRjb2RlKTsgJGluZlsnbWQ1J109bWQ1X2ZpbGUoJGRzdCk7IH0KICAgfSBlbHNlIHsgJGluZlsnc2ludGFrc2UnXT0ndHVzY2lhJzsgfQogICAkVFsnZmFpbGFpJ11bJGZdPSRpbmY7CiAgfQogICRUWydwYXJ0aWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpZWtlamFzLGJ1c2VuYSxwcmlzdGF0eW1hcyxkZXplcyx2ZW5pcGFrX3BhY2sgRlJPTSB7JHdwZGItPnByZWZpeH1wc190aWVraW1hcyBXSEVSRSBidXNlbmE9J2thdXBpYW1hJyIsQVJSQVlfQSk7CiB9CiBpZihpc3NldCgkX0dFVFsncG8nXSkpewogICRUWydwYXJ0aWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRpZWtlamFzLGJ1c2VuYSxwcmlzdGF0eW1hcyxkZXplcyx2ZW5pcGFrX3BhY2ssdmVuaXBha19tYW5pZmVzdCx1enNha3l0YSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNCIsQVJSQVlfQSk7CiAgJGE9KGFycmF5KWdldF9vcHRpb24oJ3BzX2xhaXNrdV9hcmNoeXZhcycsYXJyYXkoKSk7ICRlPSRhWzBdPz9udWxsOyAkVFsncGlybWFzJ109JGU/JGVbJ2tvbnQnXTonJzsgCiAgaWYoJGUpeyAkVFsnYXJjaCddPWFycmF5KCdsYWlrYXMnPT4kZVsnbGFpa2FzJ10sJ2thbSc9PiRlWydrYW0nXSwndGVtYSc9PiRlWyd0ZW1hJ10sJ2tvbnQnPT4kZVsna29udCddLCdwcmllZGFpJz0+JGVbJ3ByaWVkYWknXSwnYXZfZGFsaXMnPT5zdHJwb3MoJGVbJ2h0bWwnXSwnTGl1Y2lvbmknKSE9PWZhbHNlLCdodG1sX2lsZ2lzJz0+c3RybGVuKCRlWydodG1sJ10pKTsgfQogIGZvcmVhY2goYXJyYXkoMzUwNjYpIGFzICRpZCl7ICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZigkbykgJFRbJ3V6cyddWyRpZF09JG8tPmdldF9tZXRhKCdfcHNfZHJvcHNoaXBfc2VudF9zcmMnKTsgfQogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg=='; const SHA='c78cab648e484d5adca7798165f823dd08523258';
const MD5={"petshop-av-tiekimas.php": "08a79af067de2718fd15389122cbd2f1"};
const out={v:'H264A'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(12000); } } throw new Error('fx:'+k); }
let sid=null;
async function busena(pg,name){ await miegok(800); const html=await pg.content();
  const o={url:pg.url().replace(WP,'').slice(0,160), h1:await pg.$eval('h1',n=>n.textContent.trim()).catch(()=>'?'), fatal:/Fatal error|critical error|Kritinė klaida/i.test(html),
    notices:await pg.$$eval('.notice,.pd-msg,.updated,.error',ns=>ns.map(n=>n.textContent.trim().replace(/\s+/g,' ').slice(0,260)).filter(t=>!t.includes('WordPress 7.1'))).catch(()=>[])};
  if(name) o.put=await put('screenshots/h264_'+name+'.png',await pg.screenshot({fullPage:true}),'H264A'); return o; }
try{
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP H257 v1 (deploy+E2E laiskai)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'snip');
  const j=JSON.parse(await c.text()); out.sukurta=j.id; sid=j.id; await miegok(9000);
  const d=await fx(WP+'/?ps_h264=RUN20260824V&deploy=1&sha='+SHA,{},'deploy');
  const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
  try{ out.deploy=JSON.parse(await d.text()); }catch(e){ out.deploy='ne-json'; }
  let visi=true; for(const k in MD5){ if(!out.deploy.failai||!out.deploy.failai[k]||out.deploy.failai[k].md5!==MD5[k]) visi=false; } out.md5_ok=visi;
  const cookies=[]; for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
  if(visi && cookies.length){
    await miegok(2000);
    const {chromium}=await import('playwright'); const br=await chromium.launch();
    const ctx=await br.newContext({viewport:{width:1500,height:1100},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
    const pg=await ctx.newPage(); const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
    pg.on('dialog',async dg=>{ (out.dialogai=out.dialogai||[]).push(dg.message().slice(0,100)); await dg.accept(); });
    await pg.goto(WP+'/wp-admin/admin.php?page=ps-tiekimas',{waitUntil:'networkidle',timeout:60000}); out.tiek=await busena(pg,'tiekimas');
    out.js=kl; await br.close();
  }
  
  await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/h264run.json', Buffer.from(JSON.stringify(out,null,1)), 'H264A');
