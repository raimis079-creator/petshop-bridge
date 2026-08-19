process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA2NyddKT8kX0dFVFsncHNfaDA2NyddOicnKSE9PSdIMDY3JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNjcnKTsKCiAvKiBrYW5kaWRhdGFpIG9nOmltYWdlICovCiAkb1snbG9nbyddPWFycmF5KCk7CiAkbGlkPShpbnQpZ2V0X3RoZW1lX21vZCgnY3VzdG9tX2xvZ28nKTsKIGlmKCRsaWQpICRvWydsb2dvJ11bJ2N1c3RvbV9sb2dvJ109YXJyYXkoJ2lkJz0+JGxpZCwndXJsJz0+d3BfZ2V0X2F0dGFjaG1lbnRfdXJsKCRsaWQpKTsKICRvWydsb2dvJ11bJ3NpdGVfaWNvbiddPWdldF9zaXRlX2ljb25fdXJsKCk7CiAkb1snZGlkZWxlc19udW90cmF1a29zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwLnBvc3RfdGl0bGUscC5wb3N0X25hbWUKICAgRlJPTSB7JFB9cG9zdHMgcCBXSEVSRSBwLnBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIHAucG9zdF9taW1lX3R5cGUgTElLRSAnaW1hZ2UvJScKICAgT1JERVIgQlkgcC5JRCBERVNDIExJTUlUIDEyIiwgQVJSQVlfQSk7CiBmb3JlYWNoKCRvWydkaWRlbGVzX251b3RyYXVrb3MnXSBhcyAmJHgpewogICAkbT13cF9nZXRfYXR0YWNobWVudF9tZXRhZGF0YSgkeFsnSUQnXSk7CiAgICR4Wyd3J109aXNzZXQoJG1bJ3dpZHRoJ10pPyRtWyd3aWR0aCddOjA7ICR4WydoJ109aXNzZXQoJG1bJ2hlaWdodCddKT8kbVsnaGVpZ2h0J106MDsKICAgJHhbJ3VybCddPXdwX2dldF9hdHRhY2htZW50X3VybCgkeFsnSUQnXSk7CiB9IHVuc2V0KCR4KTsKCiAvKiBwcmFkaW5pcyBwdXNsYXBpcyDigJQga2FzIGphbWUgKi8KICRwZj0oaW50KWdldF9vcHRpb24oJ3BhZ2Vfb25fZnJvbnQnKTsKICRwPWdldF9wb3N0KCRwZik7CiAkb1sncHJhZGluaXMnXT1hcnJheSgnaWQnPT4kcGYsJ3Bhdic9PiRwPyRwLT5wb3N0X3RpdGxlOm51bGwsCiAgICd0dXJpbmlvX3puJz0+JHA/c3RybGVuKCRwLT5wb3N0X2NvbnRlbnQpOjAsCiAgICd0ZWtzdGFzJz0+JHA/bWJfc3Vic3RyKHRyaW0ocHJlZ19yZXBsYWNlKCcvXHMrL3UnLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkcC0+cG9zdF9jb250ZW50KSkpLDAsNDAwKTonJyk7CiAkb1snYmxvZ25hbWUnXT1nZXRfb3B0aW9uKCdibG9nbmFtZScpOyAkb1snYmxvZ2Rlc2NyaXB0aW9uJ109Z2V0X29wdGlvbignYmxvZ2Rlc2NyaXB0aW9uJyk7CgogLyogNiBzbHVnIHB1c2xhcGlhaSDigJQgdHVyaW55cyAqLwogJG9bJ3NsdWc2J109YXJyYXkoKTsKIGZvcmVhY2goYXJyYXkoJ3NwcmVuZGltYWknLCdwYXNpdWx5bWFpJywnbmF1amFzLXN1bml1a2FzJywnbmF1amFzLWthY2l1a2FzJywnamF1dHJ1cy12aXJza2luaW1hcycsJ2RhdWdpYXUtcGlnaWF1JykgYXMgJHMpewogICAkcHA9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCxwb3N0X3RpdGxlLHBvc3RfY29udGVudCBGUk9NIHskUH1wb3N0cwogICAgIFdIRVJFIHBvc3RfbmFtZT0lcyBBTkQgcG9zdF90eXBlPSdwYWdlJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExJTUlUIDEiLCRzKSxBUlJBWV9BKTsKICAgJHR0PWdldF90ZXJtX2J5KCdzbHVnJywkcywncHJvZHVjdF9jYXQnKTsKICAgJG9bJ3NsdWc2J11bJHNdPWFycmF5KAogICAgICdwc2xfaWQnPT4kcHA/KGludCkkcHBbJ0lEJ106bnVsbCwncHNsX3Bhdic9PiRwcD8kcHBbJ3Bvc3RfdGl0bGUnXTpudWxsLAogICAgICdwc2xfdGVrc3Rhcyc9PiRwcD9tYl9zdWJzdHIodHJpbShwcmVnX3JlcGxhY2UoJy9ccysvdScsJyAnLHdwX3N0cmlwX2FsbF90YWdzKCRwcFsncG9zdF9jb250ZW50J10pKSksMCwyMjApOicnLAogICAgICdrYXRfaWQnPT4kdHQ/JHR0LT50ZXJtX2lkOm51bGwsJ2thdF9wYXYnPT4kdHQ/JHR0LT5uYW1lOm51bGwsJ2thdF9wcmVraXUnPT4kdHQ/JHR0LT5jb3VudDowLAogICAgICdrYXRfYXByYXN5bWFzJz0+JHR0P21iX3N1YnN0cih3cF9zdHJpcF9hbGxfdGFncygkdHQtPmRlc2NyaXB0aW9uKSwwLDE2MCk6JycpOwogfQogLyogbGlrdXNpb3Mgc2Vub3MgbnVvcm9kb3MgKi8KICRvWydzZW5vcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUgRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJS8vcGV0c2hvcC5sdC8lJyIsIEFSUkFZX0EpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H067'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H067 uzbaigimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h067=H067'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h067.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h067 uzbaigimo recon');
