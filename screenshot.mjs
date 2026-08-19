process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDU4J10pPyRfR0VUWydwc19oMDU4J106Jyc7CiBpZighaW5fYXJyYXkoJGEsYXJyYXkoJ0RSWScsJ0lNUE9SVCcsJ0tFSVNUSScpLHRydWUpKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoOTAwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nSDA1OCcsJ2EnPT4kYSk7CgogJGlyYXNhaT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X25hbWUscG9zdF9jb250ZW50IEZST00geyRQfXBvc3RzCiAgIFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgKHBvc3RfY29udGVudCBMSUtFICclcGV0c2hvcC5sdC9pbWFnZS8lJwogICAgICBPUiBwb3N0X2NvbnRlbnQgTElLRSAnJXBldHNob3AubHQvY2FjaGUvJScpIiwgQVJSQVlfQSk7CiAkdXJsPWFycmF5KCk7CiBmb3JlYWNoKCRpcmFzYWkgYXMgJHIpewogICBwcmVnX21hdGNoX2FsbCgnI2h0dHBzPzovLyg/Ond3d1wuKT9wZXRzaG9wXC5sdCgvKD86aW1hZ2V8Y2FjaGUpL1teIlwnXHM+KV0rKSNpJywkclsncG9zdF9jb250ZW50J10sJG0pOwogICBmb3JlYWNoKCRtWzBdIGFzICR1KSAkdXJsWyR1XT0xOwogfQogJHVybD1hcnJheV9rZXlzKCR1cmwpOwogJG9bJ3VuaWthbGl1J109Y291bnQoJHVybCk7ICRvWydpcmFzdSddPWNvdW50KCRpcmFzYWkpOwoKIGlmKCRhPT09J0RSWScpewogICAkb1sndGlrcmluaW1hcyddPWFycmF5KCk7ICRvaz0wOwogICBmb3JlYWNoKCR1cmwgYXMgJHUpewogICAgICRyPXdwX3JlbW90ZV9oZWFkKCR1LCBhcnJheSgndGltZW91dCc9PjE1LCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogICAgICRzdD1pc193cF9lcnJvcigkcik/LTE6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpOwogICAgICRjdD1pc193cF9lcnJvcigkcik/Jyc6d3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnY29udGVudC10eXBlJyk7CiAgICAgJGNsPWlzX3dwX2Vycm9yKCRyKT8wOihpbnQpd3BfcmVtb3RlX3JldHJpZXZlX2hlYWRlcigkciwnY29udGVudC1sZW5ndGgnKTsKICAgICBpZigkc3Q9PTIwMCkgJG9rKys7CiAgICAgJG9bJ3Rpa3JpbmltYXMnXVtdPWFycmF5KCd1Jz0+YmFzZW5hbWUoJHUpLCdzdCc9PiRzdCwndGlwYXMnPT4kY3QsJ2JhaXR1Jz0+JGNsKTsKICAgfQogICAkb1sncGFzaWVraWFtdSddPSRvazsKIH0KCiBpZigkYT09PSdJTVBPUlQnKXsKICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL2ZpbGUucGhwJzsKICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL21lZGlhLnBocCc7CiAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9pbWFnZS5waHAnOwogICAkemVtPWdldF9vcHRpb24oJ3BzX2gwNThfemVtZWxhcGlzJywgYXJyYXkoKSk7CiAgICRvWydpbXBvcnQnXT1hcnJheSgpOyAkb2s9MDsgJGJsPTA7CiAgIGZvcmVhY2goJHVybCBhcyAkdSl7CiAgICAgaWYoaXNzZXQoJHplbVskdV0pKXsgJG9rKys7IGNvbnRpbnVlOyB9CiAgICAgJHI9d3BfcmVtb3RlX2dldCgkdSwgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKTsKICAgICBpZihpc193cF9lcnJvcigkcikgfHwgd3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpIT0yMDApewogICAgICAgJG9bJ2ltcG9ydCddW109YXJyYXkoJ3UnPT5iYXNlbmFtZSgkdSksJ2tsJz0+J2F0c2lzaXVudGltYXMnKTsgJGJsKys7IGNvbnRpbnVlOwogICAgIH0KICAgICAkYm9keT13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICAgaWYoc3RybGVuKCRib2R5KTw1MDApeyAkb1snaW1wb3J0J11bXT1hcnJheSgndSc9PmJhc2VuYW1lKCR1KSwna2wnPT4ncGVyIG1hemFzJyk7ICRibCsrOyBjb250aW51ZTsgfQogICAgICR2YXJkYXM9c2FuaXRpemVfZmlsZV9uYW1lKHVybGRlY29kZShiYXNlbmFtZShwYXJzZV91cmwoJHUsUEhQX1VSTF9QQVRIKSkpKTsKICAgICBpZighcHJlZ19tYXRjaCgnL1wuKGpwZT9nfHBuZ3x3ZWJwfGdpZikkL2knLCR2YXJkYXMpKSAkdmFyZGFzLj0nLmpwZyc7CiAgICAgJGY9d3BfdXBsb2FkX2JpdHMoJHZhcmRhcywgbnVsbCwgJGJvZHkpOwogICAgIGlmKCFlbXB0eSgkZlsnZXJyb3InXSkpeyAkb1snaW1wb3J0J11bXT1hcnJheSgndSc9PiR2YXJkYXMsJ2tsJz0+JGZbJ2Vycm9yJ10pOyAkYmwrKzsgY29udGludWU7IH0KICAgICAkdGlwYXM9d3BfY2hlY2tfZmlsZXR5cGUoJGZbJ2ZpbGUnXSwgbnVsbCk7CiAgICAgJGF0dD1hcnJheSgncG9zdF9taW1lX3R5cGUnPT4kdGlwYXNbJ3R5cGUnXSwncG9zdF90aXRsZSc9PnByZWdfcmVwbGFjZSgnL1wuXHcrJC8nLCcnLCR2YXJkYXMpLAogICAgICAgICAgICAgICAgJ3Bvc3RfY29udGVudCc9PicnLCdwb3N0X3N0YXR1cyc9Pidpbmhlcml0Jyk7CiAgICAgJGlkPXdwX2luc2VydF9hdHRhY2htZW50KCRhdHQsICRmWydmaWxlJ10pOwogICAgIGlmKGlzX3dwX2Vycm9yKCRpZCkgfHwgISRpZCl7ICRvWydpbXBvcnQnXVtdPWFycmF5KCd1Jz0+JHZhcmRhcywna2wnPT4nYXR0YWNobWVudCcpOyAkYmwrKzsgY29udGludWU7IH0KICAgICB3cF91cGRhdGVfYXR0YWNobWVudF9tZXRhZGF0YSgkaWQsIHdwX2dlbmVyYXRlX2F0dGFjaG1lbnRfbWV0YWRhdGEoJGlkLCAkZlsnZmlsZSddKSk7CiAgICAgJHplbVskdV09d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRpZCk7CiAgICAgJG9rKys7CiAgICAgJG9bJ2ltcG9ydCddW109YXJyYXkoJ3UnPT4kdmFyZGFzLCdpZCc9PiRpZCwnbmF1amFzJz0+JHplbVskdV0pOwogICB9CiAgIHVwZGF0ZV9vcHRpb24oJ3BzX2gwNThfemVtZWxhcGlzJywgJHplbSwgZmFsc2UpOwogICAkb1snaW1wb3J0dW90YSddPSRvazsgJG9bJ25lcGF2eWtvJ109JGJsOyAkb1snemVtZWxhcHlqZSddPWNvdW50KCR6ZW0pOwogfQoKIGlmKCRhPT09J0tFSVNUSScpewogICAkemVtPWdldF9vcHRpb24oJ3BzX2gwNThfemVtZWxhcGlzJywgYXJyYXkoKSk7CiAgICRvWyd6ZW1lbGFweWplJ109Y291bnQoJHplbSk7CiAgICR1cD13cF91cGxvYWRfZGlyKCk7ICRkPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGQpKSBAbWtkaXIoJGQsMDc1NSx0cnVlKTsKICAgJGtvcD1hcnJheSgpOyBmb3JlYWNoKCRpcmFzYWkgYXMgJHIpICRrb3BbJHJbJ0lEJ11dPSRyWydwb3N0X2NvbnRlbnQnXTsKICAgQGZpbGVfcHV0X2NvbnRlbnRzKCRkLicvbnVvdHJhdWt1X3R1cmlueXNfcHJpZXNfJy5kYXRlKCdZbWRfSGlzJykuJy5qc29uJywgd3BfanNvbl9lbmNvZGUoJGtvcCkpOwogICAkcGFrPTA7ICR1cGQ9MDsKICAgZm9yZWFjaCgkaXJhc2FpIGFzICRyKXsKICAgICAkYz0kclsncG9zdF9jb250ZW50J107ICRzPSRjOwogICAgIGZvcmVhY2goJHplbSBhcyAkc2VuYT0+JG5hdWphKXsKICAgICAgICRraWVrPXN1YnN0cl9jb3VudCgkYywkc2VuYSk7CiAgICAgICBpZigka2llayl7ICRjPXN0cl9yZXBsYWNlKCRzZW5hLCB3cF9tYWtlX2xpbmtfcmVsYXRpdmUoJG5hdWphKSwgJGMpOyAkcGFrKz0ka2llazsgfQogICAgIH0KICAgICBpZigkYyE9PSRzKXsgJHdwZGItPnVwZGF0ZSgkUC4ncG9zdHMnLGFycmF5KCdwb3N0X2NvbnRlbnQnPT4kYyksYXJyYXkoJ0lEJz0+JHJbJ0lEJ10pKTsKICAgICAgICAgICAgICAgICAgY2xlYW5fcG9zdF9jYWNoZSgkclsnSUQnXSk7ICR1cGQrKzsgfQogICB9CiAgICRvWydwYWtlaXN0YSddPSRwYWs7ICRvWydpcmFzdV9hdG5hdWppbnRhJ109JHVwZDsKICAgJG9bJ2xpa29fc2VudSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICBBTkQgKHBvc3RfY29udGVudCBMSUtFICclcGV0c2hvcC5sdC9pbWFnZS8lJyBPUiBwb3N0X2NvbnRlbnQgTElLRSAnJXBldHNob3AubHQvY2FjaGUvJScpIik7CiAgICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H058'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
let snipId=null;
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H058 nuotrauku perkelimas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  for(const [zyme,par,pauze] of [['dry','DRY',3000],['import','IMPORT',5000],['keisti','KEISTI',3000]]){
    const r=await fetch(WP+'/?ps_h058='+par); const t=await r.text();
    try{ out[zyme]=JSON.parse(t); }catch(e){ out[zyme+'_zalias']=t.slice(0,300); }
    await new Promise(s=>setTimeout(s,pauze));
  }
  /* PATIKRA: ar nuotraukos gyvai atsidaro */
  out.patikra=[];
  for(const s of ['josera-sunu-maistas','josera-kaciu-maistas']){
    const x=await fetch('https://dev.avesa.lt/'+s+'/'); const h=await x.text();
    const img=[...h.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m=>m[1])
      .filter(u=>u.includes('/uploads/')).slice(0,40);
    let ok=0, bl=[];
    for(const u of img.slice(0,14)){
      const full=u.startsWith('http')?u:'https://dev.avesa.lt'+u;
      try{ const y=await fetch(full,{method:'HEAD'}); if(y.status===200) ok++; else bl.push({u:u.slice(-40),st:y.status}); }
      catch(e){ bl.push({u:u.slice(-40),kl:1}); }
    }
    out.patikra.push({s,http:x.status,senu_petshop:(h.match(/petshop\.lt\/(image|cache)\//g)||[]).length,
                      tikrinta:Math.min(img.length,14),atsidaro:ok,blogi:bl});
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h058.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h058 nuotrauku perkelimas');
