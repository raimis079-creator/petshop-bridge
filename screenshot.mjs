process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBURU1QIEwzMDEgcGFwaWxkeW1hcwogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfbGEnXSkpIHJldHVybjsgJGs9KHN0cmluZykkX0dFVFsncHNfbGEnXTsKIGlmKCFpbl9hcnJheSgkayxhcnJheSgnUkVDT04nLCdBUFBMWScpLHRydWUpKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbic7CiAkbWFwPWpzb25fZGVjb2RlKChzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKCRmKSx0cnVlKTsgJG89YXJyYXkoJ2snPT4kaywnbWFwX24nPT5pc19hcnJheSgkbWFwKT9jb3VudCgkbWFwKTonTkVSQScpOwogLyoga2FuZGlkYXRhaSAqLwogJHAxODYzMj1nZXRfcG9zdCgxODYzMik7ICRvWydrZXBlbnlzJ109JHAxODYzMj9hcnJheSgkcDE4NjMyLT5wb3N0X25hbWUsJHAxODYzMi0+cG9zdF9zdGF0dXMsZ2V0X3Blcm1hbGluaygxODYzMikpOm51bGw7CiAka2F0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LmNvdW50IEZST00geyR3cGRiLT50ZXJtc30gdCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgKHQuc2x1ZyBMSUtFICcldHJhbnNwb3J0JScgT1IgdC5uYW1lIExJS0UgJyVyYW5zcG9ydGF2JScpIE9SREVSIEJZIHR0LmNvdW50IERFU0MiLEFSUkFZX0EpOwogJG9bJ2thdGVnb3Jpam9zJ109JGthdDsKICRvWydlc2FtaSddPWFycmF5KCdrZXBlbnlzLTEwMC1nJz0+aXNzZXQoJG1hcFsna2VwZW55cy0xMDAtZyddKT8kbWFwWydrZXBlbnlzLTEwMC1nJ106bnVsbCwnc3VuaW1zL3RyYW5zcG9ydGF2aW1vLWRlemVzLTE1NTIxNTU5NjcnPT5pc3NldCgkbWFwWydzdW5pbXMvdHJhbnNwb3J0YXZpbW8tZGV6ZXMtMTU1MjE1NTk2NyddKT8kbWFwWydzdW5pbXMvdHJhbnNwb3J0YXZpbW8tZGV6ZXMtMTU1MjE1NTk2NyddOm51bGwpOwogaWYoJ0FQUExZJz09PSRrICYmIGlzX2FycmF5KCRtYXApKXsKICAkbmF1am9zPWFycmF5KCk7CiAgaWYoJHAxODYzMiAmJiAncHVibGlzaCc9PT0kcDE4NjMyLT5wb3N0X3N0YXR1cyl7ICRuYXVqb3NbJ2tlcGVueXMtMTAwLWcnXT10cmltKHBhcnNlX3VybChnZXRfcGVybWFsaW5rKDE4NjMyKSxQSFBfVVJMX1BBVEgpLCcvJyk7IH0KICBpZigka2F0KXsgJG5hdWpvc1snc3VuaW1zL3RyYW5zcG9ydGF2aW1vLWRlemVzLTE1NTIxNTU5NjcnXT0nX19URVJNX18nLihpbnQpJGthdFswXVsndGVybV9pZCddOyB9CiAgZm9yZWFjaCgkbmF1am9zIGFzICRhPT4kYil7ICRtYXBbJGFdPSRiOyB9CiAgQGNvcHkoJGYsV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uLmJha18nLmdtZGF0ZSgnWW1kX0hpJykpOwogICRvWydyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkZix3cF9qc29uX2VuY29kZSgkbWFwLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUykpOwogICRvWyduYXVqb3MnXT0kbmF1am9zOyAkb1snbWFwX25fcG8nXT1jb3VudCgkbWFwKTsKICAkd3BkYi0+cXVlcnkoIlVQREFURSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSw1KTsK'; const VER='LA';
const out={v:VER,zingsniai:[]}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(10000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  /* 1. isjungiam senus TEMP */
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  const temp=(Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''));
  for(const s of temp){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  out.zingsniai.push('isjungta_TEMP:'+temp.length);
  /* 2. kuriam recon snippeta */
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP LA deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const cr=JSON.parse(await c.text()); sid=cr.id; out.zingsniai.push('snip_id:'+sid);
  await miegok(9000);
  /* 3. skaitom */
  const r=await fx(WP+'/?ps_la=RECON',{headers:{'Cache-Control':'no-cache'}},'get');
  const t=await r.text(); out.http=r.status;
  try{ out.dep=JSON.parse(t); }catch(e){ out.dep_zalias=t.slice(0,1200); }
  await miegok(6000);
  const r2=await fx(WP+'/?ps_la=APPLY',{headers:{'Cache-Control':'no-cache'}},'ver');
  const t2=await r2.text();
  try{ out.ver=JSON.parse(t2); }catch(e){ out.ver_zalias=t2.slice(0,1200); }
  await miegok(3000); out.tikra=[];
  for(const p of ['/kepenys-100-g','/sunims/transportavimo-dezes-1552155967','/athena-pienas-katems-200-ml']){
    let url='https://dev.avesa.lt'+p, ch=[], fin=url;
    for(let i=0;i<5;i++){ const r=await fetch(url,{redirect:'manual'}); ch.push(r.status); const loc=r.headers.get('location');
      if(r.status>=300&&r.status<400&&loc){ url=loc.startsWith('http')?loc:('https://dev.avesa.lt'+loc); fin=url; continue; } fin=url; break; }
    out.tikra.push({p,ch:ch.join('>'),fin:fin.replace('https://dev.avesa.lt','')});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('deploy/l301add.json', Buffer.from(JSON.stringify(out,null,1)), VER);
