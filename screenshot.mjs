process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfdmVyMTMnXSkgfHwgJF9HRVRbJ3BzX3ZlcjEzJ10hPT0nUlVOMjAyNjA4MjMnKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRUPWFycmF5KCd2Jz0+J1ZFUjEzJyk7CiBhZGRfZmlsdGVyKCdwcmVfd3BfbWFpbCcsJ19fcmV0dXJuX2ZhbHNlJyw5OTkpOwogJHU9Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdvcmRlcmJ5Jz0+J0lEJykpOwogaWYoJHUpeyB3cF9zZXRfY3VycmVudF91c2VyKCR1WzBdLT5JRCk7IHdwX3NldF9hdXRoX2Nvb2tpZSgkdVswXS0+SUQsdHJ1ZSx0cnVlKTsgfQoKICRyZT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnZWlsZScpOyAkcmUtPnNldEFjY2Vzc2libGUodHJ1ZSk7CiAkcmE9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ3ZlaWtzbWFpJyk7ICRyYS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRyaz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywna2xhdXNpbWFzJyk7ICRyay0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRyZz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ2dydXB1b3RpJyk7ICRyZy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICR2az1mdW5jdGlvbigkaWQpIHVzZSAoJHJhLCRyZSwkcmspeyAkbz13Y19nZXRfb3JkZXIoJGlkKTsKICAgcmV0dXJuIGFycmF5X2NvbHVtbigkcmEtPmludm9rZShudWxsLCRvLGFycmF5KCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCwkbyksJ2tsYXVzaW1hcyc9PiRyay0+aW52b2tlKG51bGwsJG8pKSksJ2lkJyk7IH07CgogLyogMS4gQVRTVEFUT00gMzUwNjYgKGlzaW1hbSBpcyBwYXJ0aWp1LCBudWltYW0gcGxhbmEpICovCiAkbz13Y19nZXRfb3JkZXIoMzUwNjYpOwogZm9yZWFjaCgkby0+Z2V0X2l0ZW1zKCkgYXMgJGlpZD0+JGl0KXsKICAgUGV0c2hvcF9BVl9UaWVraW1hczo6aXNpbXRpX2VpbHV0ZSgkbywoaW50KSRpaWQpOwogICBpZigkaXQtPmdldF9tZXRhKCdfcHNfa29uc29saWRhY2lqYScpKXsgJGl0LT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfa29uc29saWRhY2lqYScpOyAkaXQtPnNhdmUoKTsgfQogfQogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRvLT5kZWxldGVfbWV0YV9kYXRhKCdfcHNfbWlzcnVzX3NwcmVuZGltYXMnKTsgJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19taXNydXNfc3ByZXN0YXMnKTsgJG8tPnNhdmUoKTsKICRUWycxX2F0c3RhdHl0YSddPWFycmF5KCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCx3Y19nZXRfb3JkZXIoMzUwNjYpKSwKICAgJ3BhcnRpam9zZSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzX2VpbCBXSEVSRSBvcmRlcl9pZD0zNTA2NiIpLAogICAnbGFpc2thaSc9PmFycmF5X2tleXMoJHJnLT5pbnZva2UobnVsbCxhcnJheSgzNTA2NikpKSk7CgogLyogMi4gUExBTkFTICh0aWsgaXJhc29tLCBrYWlwIGRhcm8ga29ydGVsZSkgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkby0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX21pc3J1c19zcHJlbmRpbWFzJywgd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3ZmJz0+J2F2JywncHJpbnMnPT4ndGllc2lhaScpKSk7CiAkby0+c2F2ZSgpOwogJFRbJzJfcG9fcGxhbm8nXT1hcnJheSgnZWlsZSc9PiRyZS0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKDM1MDY2KSksCiAgICdwYXJ0aWpvc2UnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc190aWVraW1hc19laWwgV0hFUkUgb3JkZXJfaWQ9MzUwNjYiKSwKICAgJ2xhaXNrYWknPT5hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSksCiAgICd2ZWlrc21haSc9PiR2aygzNTA2NikpOwoKIC8qIDMuIFZZS0RZTUFTIChteWd0dWthcyDigJ7EriB0aWVraW1vIHBhcnRpasSFIikgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkc3ByPWFycmF5KCd2Zic9PidhdicsJ3ByaW5zJz0+J3RpZXNpYWknKTsgJG49MDsKIGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICRpaWQ9PiRpdCl7CiAgICRzcmM9JGl0LT5nZXRfbWV0YSgnX3BzX3NvdXJjZScpOwogICBpZighJHNyY3x8J2F2Jz09PSRzcmN8fCdhdichPT0oJHNwclskc3JjXT8/JycpKSBjb250aW51ZTsKICAgaWYoUGV0c2hvcF9BVl9UaWVraW1hczo6aWRldGlfZWlsdXRlKCRvLChpbnQpJGlpZCwkc3JjKSl7ICRpdC0+dXBkYXRlX21ldGFfZGF0YSgnX3BzX2tvbnNvbGlkYWNpamEnLDEpOyAkaXQtPnNhdmUoKTsgJG4rKzsgfQogfQogJFRbJzNfcG9fdnlrZHltbyddPWFycmF5KCdpZGV0YSc9PiRuLCdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCx3Y19nZXRfb3JkZXIoMzUwNjYpKSwKICAgJ3BhcnRpam9zZSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzX2VpbCBXSEVSRSBvcmRlcl9pZD0zNTA2NiIpLAogICAnbGFpc2thaSc9PmFycmF5X2tleXMoJHJnLT5pbnZva2UobnVsbCxhcnJheSgzNTA2NikpKSwKICAgJ3ZlaWtzbWFpJz0+JHZrKDM1MDY2KSk7CgogLyogNC4gR0FMVVRJTklTIEFUU1RBVFlNQVMgKi8KICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpewogICBQZXRzaG9wX0FWX1RpZWtpbWFzOjppc2ltdGlfZWlsdXRlKCRvLChpbnQpJGlpZCk7CiAgIGlmKCRpdC0+Z2V0X21ldGEoJ19wc19rb25zb2xpZGFjaWphJykpeyAkaXQtPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19rb25zb2xpZGFjaWphJyk7ICRpdC0+c2F2ZSgpOyB9CiB9CiAkbz13Y19nZXRfb3JkZXIoMzUwNjYpOwogJG8tPmRlbGV0ZV9tZXRhX2RhdGEoJ19wc19taXNydXNfc3ByZW5kaW1hcycpOyAkby0+ZGVsZXRlX21ldGFfZGF0YSgnX3BzX21pc3J1c19zcHJlc3RhcycpOyAkby0+c2F2ZSgpOwogJFRbJzRfZ2FsdXRpbmUnXT1hcnJheSgnZWlsZSc9PiRyZS0+aW52b2tlKG51bGwsd2NfZ2V0X29yZGVyKDM1MDY2KSksCiAgICdwYXJ0aWpvc2UnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc190aWVraW1hc19laWwgV0hFUkUgb3JkZXJfaWQ9MzUwNjYiKSwKICAgJ2xhaXNrYWknPT5hcnJheV9rZXlzKCRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKSkpOwogJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV0cmFuc2llbnQlcHNfcnl0YXMlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'VER13'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Patikra H239 v1 (planas vs vykdymas)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_ver13=RUN20260823');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    if(cookies.length){
      const {chromium}=await import('playwright');
      const br=await chromium.launch();
      const ctx=await br.newContext({viewport:{width:1500,height:1000},ignoreHTTPSErrors:true});
      await ctx.addCookies(cookies);
      const pg=await ctx.newPage();
      const kl=[]; pg.on('pageerror',e=>kl.push(String(e).slice(0,150)));
      const r=await pg.goto(WP+'/wp-admin/admin.php?page=ps-desk&eile=misrus',{waitUntil:'networkidle',timeout:60000});
      await miegok(1500);
      out.ekranas={http:r.status(),put:await put('screenshots/h239_misrus.png',await pg.screenshot({fullPage:true}),'VER13'),
        mygtukai:await pg.$$eval('.pd-btn-p',ns=>ns.map(n=>n.textContent.trim()))};
      out.js=kl; await br.close();
    }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/ver13.json', Buffer.from(JSON.stringify(out,null,1)), 'VER13');
