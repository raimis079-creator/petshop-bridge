process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEF0cmlidXR1IEF1ZGl0YXMgdjEuMCAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogaWYoICgkX0dFVFsncHNfYXVkJ10gPz8gJycpICE9PSAnQVVEMScgKSByZXR1cm47CiBnbG9iYWwgJHdwZGI7ICRvPVsndic9PidBVUQxJ107CiAkdGF4PSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgdGF4b25vbXkgRlJPTSB7JHdwZGItPnRlcm1fdGF4b25vbXl9IFdIRVJFIHRheG9ub215IExJS0UgJ3BhXFxfJSciKTsKICRvWyd0YWtzb25vbWlqdSddPWNvdW50KCR0YXgpOwoKICRub3JtPWZ1bmN0aW9uKCRzKXsKICAgJHM9dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLCRzKSk7CiAgICRzPXN0cl9yZXBsYWNlKCcsJywnLicsJHMpOwogICAkcz1wcmVnX3JlcGxhY2UoJy8oXGQpXHMqKGtnfGd8bHxtbHxjbXxtbXx2bnQpXGIvaXUnLCckMSAkMicsJHMpOwogICByZXR1cm4gbWJfc3RydG9sb3dlcigkcyk7CiB9OwogJG9bJ2R1Ymxpa2F0YWknXT1bXTsgJG9bJ2tvbGl6aWpvcyddPVtdOyAkb1sncmFpZHppdV9tYXJndW1hJ109W107ICRvWyd0ZXJtaW51J109MDsKIGZvcmVhY2goJHRheCBhcyAkdHgpewogICAkdD1nZXRfdGVybXMoWyd0YXhvbm9teSc9PiR0eCwnaGlkZV9lbXB0eSc9PmZhbHNlXSk7CiAgIGlmKGlzX3dwX2Vycm9yKCR0KSkgY29udGludWU7CiAgICRvWyd0ZXJtaW51J10rPWNvdW50KCR0KTsKICAgJHBhZ2FsX25vcm09W107ICRwYWdhbF9zbHVnPVtdOyAkZGlkej0wOyAkbWF6PTA7CiAgIGZvcmVhY2goJHQgYXMgJHgpewogICAgICRuPSRub3JtKCR4LT5uYW1lKTsKICAgICAkcGFnYWxfbm9ybVskbl1bXT1bJ2lkJz0+JHgtPnRlcm1faWQsJ25hbWUnPT4keC0+bmFtZSwnc2x1Zyc9PiR4LT5zbHVnLCdjb3VudCc9PiR4LT5jb3VudF07CiAgICAgJHBhZ2FsX3NsdWdbJHgtPnNsdWddW109JHgtPm5hbWU7CiAgICAgJHBpcm1hPW1iX3N1YnN0cih0cmltKCR4LT5uYW1lKSwwLDEpOwogICAgIGlmKCRwaXJtYSE9PScnICYmIG1iX3N0cnRvdXBwZXIoJHBpcm1hKT09PSRwaXJtYSAmJiBwcmVnX21hdGNoKCcvXHB7TH0vdScsJHBpcm1hKSkgJGRpZHorKzsKICAgICBlbHNlaWYocHJlZ19tYXRjaCgnL1xwe0x9L3UnLCRwaXJtYSkpICRtYXorKzsKICAgfQogICBmb3JlYWNoKCRwYWdhbF9ub3JtIGFzICRuPT4kZykgaWYoY291bnQoJGcpPjEpICRvWydkdWJsaWthdGFpJ11bXT1bJ3RheCc9PiR0eCwnbm9ybSc9PiRuLCd0ZXJtaW5haSc9PiRnXTsKICAgZm9yZWFjaCgkcGFnYWxfc2x1ZyBhcyAkc2w9PiRnKSBpZihjb3VudCgkZyk+MSkgJG9bJ2tvbGl6aWpvcyddW109Wyd0YXgnPT4kdHgsJ3NsdWcnPT4kc2wsJ3BhdmFkaW5pbWFpJz0+JGddOwogICBpZigkZGlkej4wICYmICRtYXo+MCkgJG9bJ3JhaWR6aXVfbWFyZ3VtYSddW109Wyd0YXgnPT4kdHgsJ2RpZHppYWphJz0+JGRpZHosJ21hemFqYSc9PiRtYXpdOwogfQogLyogYXIgZHUgc2tpcnRpbmdpIHBhdmFkaW5pbWFpIGR1b3R1IHRhIHBhdGkgc2x1ZyAocG90ZW5jaWFsaSBrb2xpemlqYSBhdGVpdHlqZSkgKi8KICRvWydidXNpbW9zX2tvbGl6aWpvcyddPVtdOwogZm9yZWFjaCgkdGF4IGFzICR0eCl7CiAgICR0PWdldF90ZXJtcyhbJ3RheG9ub215Jz0+JHR4LCdoaWRlX2VtcHR5Jz0+ZmFsc2VdKTsgaWYoaXNfd3BfZXJyb3IoJHQpKSBjb250aW51ZTsKICAgJG09W107CiAgIGZvcmVhY2goJHQgYXMgJHgpeyAkcz1zYW5pdGl6ZV90aXRsZSgkeC0+bmFtZSk7ICRtWyRzXVtdPSR4LT5uYW1lOyB9CiAgIGZvcmVhY2goJG0gYXMgJHM9PiRnKSBpZihjb3VudCgkZyk+MSkgJG9bJ2J1c2ltb3Nfa29saXppam9zJ11bXT1bJ3RheCc9PiR0eCwnc2x1Zyc9PiRzLCdpcyc9PiRnXTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDk5KTsK'; const VER='AUD-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Atributu Auditas v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_aud=AUD1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'aud');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/auditas_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
