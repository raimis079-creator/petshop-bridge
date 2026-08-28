process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIER5ZHppdSBUZXJtaW5haSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19kdCddID8/ICcnKSAhPT0gJ0RUMScgKSByZXR1cm47CiAkbz1bJ3YnPT4nRFQxJ107CiBmb3JlYWNoKFsncGFfZHlkaXMnLCdwYV9pbGdpcycsJ3BhX2tpZWtpc19wYWt1b3RlamUnXSBhcyAkdHgpewogICAkb1skdHhdPVtdOwogICBmb3JlYWNoKGdldF90ZXJtcyhbJ3RheG9ub215Jz0+JHR4LCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKSBhcyAkdCkKICAgICAkb1skdHhdW109WydpZCc9PiR0LT50ZXJtX2lkLCduYW1lJz0+JHQtPm5hbWUsJ3NsdWcnPT4kdC0+c2x1ZywnY291bnQnPT4kdC0+Y291bnRdOwogfQogLyogcGFfcGFrdW90ZXNfZHlkaXMgLSB0aWsgbGl0cmFpIGlyIHBhbmFzdXMgKi8KICRvWydwYWt1b3Rlc19saXRyYWknXT1bXTsKIGZvcmVhY2goZ2V0X3Rlcm1zKFsndGF4b25vbXknPT4ncGFfcGFrdW90ZXNfZHlkaXMnLCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKSBhcyAkdCl7CiAgIGlmKHByZWdfbWF0Y2goJy9cZFxzKihsfEx8bGl0cikvdScsJHQtPm5hbWUpKQogICAgICRvWydwYWt1b3Rlc19saXRyYWknXVtdPVsnaWQnPT4kdC0+dGVybV9pZCwnbmFtZSc9PiR0LT5uYW1lLCdzbHVnJz0+JHQtPnNsdWcsJ2NvdW50Jz0+JHQtPmNvdW50XTsKIH0KIC8qIGthIG5hdWRvamEga2F0ZWdvcmlqb3MsIGkga3VyaWFzIGtyaXRvIG5hdWpvcyBwcmVrZXMgKi8KIGdsb2JhbCAkd3BkYjsKICRvWydrYXRlZ29yaWp1X3ByYWt0aWthJ109W107CiBmb3JlYWNoKFtbJ1NrYW7El3N0YWkgxaF1bmltcycsJ3BhX2R5ZGlzJ10sWyfFvWFpc2xhaSDFoXVuaW1zJywncGFfZHlkaXMnXSwKICAgICAgICAgIFsnVHZlbmtpbmnFsyDFvnV2xbMgbWFpc3RhcycsJ3BhX3Bha3VvdGVzX2R5ZGlzJ10sCiAgICAgICAgICBbJ8WgdWtvcywgxaFlcGXEjWlhaSwgxb5pcmtsxJdzIMWhdW5pbXMnLCdwYV9keWRpcyddXSBhcyAkcG9yYSl7CiAgICRrdD1nZXRfdGVybV9ieSgnbmFtZScsJHBvcmFbMF0sJ3Byb2R1Y3RfY2F0Jyk7CiAgIGlmKCEka3QpIGNvbnRpbnVlOwogICAkbj0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcC5JRCkgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSByMSBPTiByMS5vYmplY3RfaWQ9cC5JRAogICAgICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHQxIE9OIHQxLnRlcm1fdGF4b25vbXlfaWQ9cjEudGVybV90YXhvbm9teV9pZCBBTkQgdDEudGVybV9pZD0lZAogICAgICAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gcjIgT04gcjIub2JqZWN0X2lkPXAuSUQKICAgICAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0MiBPTiB0Mi50ZXJtX3RheG9ub215X2lkPXIyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHQyLnRheG9ub215PSVzCiAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLCRrdC0+dGVybV9pZCwkcG9yYVsxXSkpOwogICAkdmlzbz0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgQ09VTlQoRElTVElOQ1QgcC5JRCkgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSByMSBPTiByMS5vYmplY3RfaWQ9cC5JRAogICAgICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHQxIE9OIHQxLnRlcm1fdGF4b25vbXlfaWQ9cjEudGVybV90YXhvbm9teV9pZCBBTkQgdDEudGVybV9pZD0lZAogICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIiwka3QtPnRlcm1faWQpKTsKICAgJG9bJ2thdGVnb3JpanVfcHJha3Rpa2EnXVtdPVsna2F0Jz0+JHBvcmFbMF0sJ3RheCc9PiRwb3JhWzFdLCdzdV9hdHJpYnV0dSc9PiRuLCd2aXNvJz0+JHZpc29dOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='DYD2-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Dydziu Terminai v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dt=DT1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'dt');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dyd2_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
