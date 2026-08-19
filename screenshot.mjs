process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA2NCddKT8kX0dFVFsncHNfaDA2NCddOicnKSE9PSdJUkFTWVRJJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNjQnKTsKICRkdW9tPWpzb25fZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCdwaHA6Ly9pbnB1dCcpLCB0cnVlKTsKIGlmKCFpc19hcnJheSgkZHVvbSkpeyAkb1sna2xhaWRhJ109J25lcmEgZHVvbWVudSc7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogJHplbT1qc29uX2RlY29kZShAZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksIHRydWUpOwogaWYoIWlzX2FycmF5KCR6ZW0pKSAkemVtPWFycmF5KCk7CiAkaGlnPXBhcnNlX3VybChnZXRfdGVybV9saW5rKGdldF90ZXJtKDgyLCdwcm9kdWN0X2NhdCcpKSxQSFBfVVJMX1BBVEgpOwoKICR1cD13cF91cGxvYWRfZGlyKCk7ICRkPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGQpKSBAbWtkaXIoJGQsMDc1NSx0cnVlKTsKICRrb3A9YXJyYXkoKTsKIGZvcmVhY2goJGR1b20gYXMgJHgpewogICAkcj0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElELHBvc3RfY29udGVudCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X25hbWU9JXMgQU5EIHBvc3RfdHlwZT0ncGFnZScgTElNSVQgMSIsJHhbJ3NsdWcnXSksQVJSQVlfQSk7CiAgIGlmKCRyKSAka29wWyRyWydJRCddXT0kclsncG9zdF9jb250ZW50J107CiB9CiBAZmlsZV9wdXRfY29udGVudHMoJGQuJy90dXJpbnlzX3ByaWVzX3BlcnJhc3ltb18nLmRhdGUoJ1ltZF9IaXMnKS4nLmpzb24nLCB3cF9qc29uX2VuY29kZSgka29wKSk7CgogJG9bJ3JleiddPWFycmF5KCk7CiBmb3JlYWNoKCRkdW9tIGFzICR4KXsKICAgJHI9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCxwb3N0X2NvbnRlbnQgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF9uYW1lPSVzIEFORCBwb3N0X3R5cGU9J3BhZ2UnIExJTUlUIDEiLCR4WydzbHVnJ10pLEFSUkFZX0EpOwogICBpZighJHIpeyAkb1sncmV6J11bXT1hcnJheSgnc2x1Zyc9PiR4WydzbHVnJ10sJ2tsJz0+J25lcmFzdGFzJyk7IGNvbnRpbnVlOyB9CiAgICRjPSR4WydodG1sJ107CiAgIC8qIDEuIG51b3JvZG9zOiBwZXRzaG9wLmx0IC0+IG5hdWphcyBrZWxpYXMgKi8KICAgJHBhaz0wOyAkbGlrbz0wOwogICBwcmVnX21hdGNoX2FsbCgnI2h0dHBzPzovLyg/Ond3d1wuKT9wZXRzaG9wXC5sdCgvW14iXCdccz4pXSopI2knLCRjLCRtKTsKICAgZm9yZWFjaChhcnJheV91bmlxdWUoJG1bMF0pIGFzICRwaWxuYXMpewogICAgICRrZWxpYXM9cGFyc2VfdXJsKCRwaWxuYXMsUEhQX1VSTF9QQVRIKTsKICAgICBpZihwcmVnX21hdGNoKCcjXi8oaW1hZ2V8Y2FjaGUpLyMnLCRrZWxpYXMpKXsgJGxpa28rKzsgY29udGludWU7IH0KICAgICAkc3c9c3RydG9sb3dlcih0cmltKHN0cnRvaygka2VsaWFzLCc/JyksJy8nKSk7CiAgICAgaWYoJHN3PT09J3N1bmltcy9wcmlleml1cm9zLXByaWVtb25lcycpeyAkYz1zdHJfcmVwbGFjZSgkcGlsbmFzLCRoaWcsJGMpOyAkcGFrKys7IGNvbnRpbnVlOyB9CiAgICAgaWYoJHN3PT09JycpeyAkYz1zdHJfcmVwbGFjZSgkcGlsbmFzLCcvJywkYyk7ICRwYWsrKzsgY29udGludWU7IH0KICAgICBpZighaXNzZXQoJHplbVskc3ddKSl7ICRsaWtvKys7IGNvbnRpbnVlOyB9CiAgICAgJHY9JHplbVskc3ddOyAkdD1udWxsOwogICAgIGlmKHN0cnBvcygkdiwnX19URVJNX18nKT09PTApeyAkdHQ9Z2V0X3Rlcm0oKGludClzdWJzdHIoJHYsOCksJ3Byb2R1Y3RfY2F0Jyk7CiAgICAgICBpZigkdHQgJiYgIWlzX3dwX2Vycm9yKCR0dCkpICR0PXBhcnNlX3VybChnZXRfdGVybV9saW5rKCR0dCksUEhQX1VSTF9QQVRIKTsgfQogICAgIGVsc2UgJHQ9JHY7CiAgICAgaWYoISR0KXsgJGxpa28rKzsgY29udGludWU7IH0KICAgICAkYz1zdHJfcmVwbGFjZSgkcGlsbmFzLCR0LCRjKTsgJHBhaysrOwogICB9CiAgIC8qIDIuIHNhbnR5a2luaWFpIHNlbmkga2VsaWFpICovCiAgICRjPXByZWdfcmVwbGFjZSgnIyg/PD0iKS9zdW5pbXMvcHJpZXppdXJvcy1wcmllbW9uZXMvPyg/PSIpI2knLCRoaWcsJGMsLTEsJG4yKTsKICAgJHBhays9JG4yOwogICAvKiAzLiBwYXRpa3JhOiBhciBuZWJlbGlrbyBtb2ppYmFrZSAqLwogICAkbW9qPTA7IGZvcmVhY2goYXJyYXkoJ8OE4oCmJywnw4QnLCfDhcKhJywnw4XCvicsJ8OFwrMnLCfDhcKrJykgYXMgJHMpICRtb2orPXN1YnN0cl9jb3VudCgkYywkcyk7CiAgICR3cGRiLT51cGRhdGUoJFAuJ3Bvc3RzJywgYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRjKSwgYXJyYXkoJ0lEJz0+JHJbJ0lEJ10pKTsKICAgY2xlYW5fcG9zdF9jYWNoZSgkclsnSUQnXSk7CiAgICRvWydyZXonXVtdPWFycmF5KCdzbHVnJz0+JHhbJ3NsdWcnXSwnaWQnPT4oaW50KSRyWydJRCddLAogICAgICd6bl9wcmllcyc9PnN0cmxlbigkclsncG9zdF9jb250ZW50J10pLCd6bl9wbyc9PnN0cmxlbigkYyksCiAgICAgJ251b3JvZHVfcGFrZWlzdGEnPT4kcGFrLCdsaWtvX3NlbnUnPT4kbGlrbywnbW9qaWJha2UnPT4kbW9qKTsKIH0KICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H064'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function blokas(h){
  const re=/<(div|article|section)[^>]*class="[^"]*articleDescription[^"]*"/i;
  const i=h.search(re); if(i<0) return '';
  let g=0,j=-1; const rr=/<\/?(div|article|section)\b[^>]*>/gi; rr.lastIndex=i; let m;
  while((m=rr.exec(h))!==null){ if(m[0].startsWith('</')) g--; else g++;
    if(g===0){ j=m.index+m[0].length; break; } if(rr.lastIndex>i+500000) break; }
  return j>i ? h.slice(i,j) : '';
}
function vidus(b){
  const i=b.indexOf('>'); const j=b.lastIndexOf('</');
  return (i>0&&j>i)? b.slice(i+1,j).trim() : b;
}
const SLUGS=['jorksyro-terjeras','biglis','senbernaras'];
let snipId=null;
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H064 turinio perrasymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const duom=[];
  out.paimta=[];
  for(const s of SLUGS){
    const x=await fetch('https://petshop.lt/'+s);
    const h=await x.text();
    const b=blokas(h); const v=vidus(b);
    const t=v.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const moj=/Å¡|Å¾|Ä…|Ä¯|Ä—/.test(v)?1:0;
    out.paimta.push({s,http:x.status,zn:v.length,zodziu:t.split(' ').length,mojibake:moj,
                     pradzia:t.slice(0,90)});
    if(x.status===200 && v.length>2000 && !moj) duom.push({slug:s,html:v});
    await new Promise(r=>setTimeout(r,400));
  }
  out.perduota=duom.length;
  if(duom.length){
    const r=await fetch(WP+'/?ps_h064=IRASYTI',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(duom)});
    const t=await r.text();
    try{ out.irasymas=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  }
  await new Promise(r=>setTimeout(r,3000));
  out.patikra=[];
  for(const s of SLUGS){
    const x=await fetch('https://dev.avesa.lt/'+s+'/'); const h=await x.text();
    out.patikra.push({s,http:x.status,
      mojibake:(h.match(/Å¡|Å¾|Ä…|Ä¯|Ä—/g)||[]).length,
      i_kat:(h.match(/href="\/kategorija\//g)||[]).length,
      senos:(h.match(/petshop\.lt\//g)||[]).length});
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h064.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h064 turinio perrasymas');
