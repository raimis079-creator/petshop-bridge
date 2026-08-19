process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDY1J10pPyRfR0VUWydwc19oMDY1J106Jyc7CiBpZighaW5fYXJyYXkoJGEsYXJyYXkoJ05VT1JPRE9TJywnTUlBTU9SJyksdHJ1ZSkpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDY1JywnYSc9PiRhKTsKCiBpZigkYT09PSdOVU9ST0RPUycpewogICAkej1qc29uX2RlY29kZShiYXNlNjRfZGVjb2RlKCdleUl2Y0hKcGJuTXRjSEp2WTJGeVpTMXRhVzVwTFdobGNuSnBibWN0WVc1a0xYSnBZMlV0YUhsd2IyRnNaWEpuWlc1cFl5MXpZWFZ6WVhNdGJXRnBjM1JoY3kxaGJHVnlaMmx6YTJsbGJYTXRjM1ZoZFdkMWMybGxiWE10YzNWdWFXMXpMVE10YTJjaU9pQWlhSFIwY0hNNkx5OWtaWFl1WVhabGMyRXViSFF2WjJGdGFXNTBiMnBoY3k5d2NtbHVjeThpTENBaUwycHZjMlZ5WVMxdGFXNXBkMlZzYkMweE1DMXJaeTF6WVhWellYTXRiV0ZwYzNSaGN5MXRZWHAxTFhabGFYTnNhWFV0YzNWdWFXMXpJam9nSW1oMGRIQnpPaTh2WkdWMkxtRjJaWE5oTG14MEwyZGhiV2x1ZEc5cVlYTXZhbTl6WlhKaEx5SXNJQ0l2YW05elpYSmhMV0poYkdGdVkyVXRjR0Z6WVhKaGN5MXpkVzVwYlhNdGMzVXRkbWx6ZEdsbGJtRXRNVFZyWnlJNklDSm9kSFJ3Y3pvdkwyUmxkaTVoZG1WellTNXNkQzluWVcxcGJuUnZhbUZ6TDJwdmMyVnlZUzhpTENBaUwycHZjMlZ5WVMxdVlYUjFjbVV0Wlc1bGNtZGxkR2xqTFRFeUxUVXRhMmN0WW1WbmNuVmthWE10YzJGMWMyRnpMVzFoYVhOMFlYTXRjM1ZoZFdkMWMybGxiWE10WVd0MGVYWnBaVzF6TFhOMWJtbHRjeUk2SUNKb2RIUndjem92TDJSbGRpNWhkbVZ6WVM1c2RDOW5ZVzFwYm5SdmFtRnpMMnB2YzJWeVlTOGlMQ0FpTDJwdmMyVnlZUzF3YjNWc2RISjVMVzFsYm5VdE1USXROUzFyWnkxellYVnpZWE10YldGcGMzUmhjeTF6ZFc1cGJYTWlPaUFpYUhSMGNITTZMeTlrWlhZdVlYWmxjMkV1YkhRdloyRnRhVzUwYjJwaGN5OXFiM05sY21Fdklpd2dJaTlxYjNObGNtRXRjMkZzYlc5dUxXRnVaQzF3YjNSaGRHOHRNVEl0TlMxclp5MWlaV2R5ZFdScGN5MXpZWFZ6WVhNdGJXRnBjM1JoY3kxemRXNXBiWE1pT2lBaWFIUjBjSE02THk5a1pYWXVZWFpsYzJFdWJIUXZaMkZ0YVc1MGIycGhjeTlxYjNObGNtRXZJaXdnSWk5cWIzTmxjbUV0ZVc5MWJtY3RjM1JoY2kweE5TMXJaeTFpWldkeWRXUnBjeTF6WVhWellYTXRiV0ZwYzNSaGN5MXFZWFZ1YVdWdGN5MXpkVzVwYlhNaU9pQWlhSFIwY0hNNkx5OWtaWFl1WVhabGMyRXViSFF2WjJGdGFXNTBiMnBoY3k5cWIzTmxjbUV2SWl3Z0lpOXFiM05sY21FdGMyVnVjMmxqWVhRdE1pMXJaeTF6WVhWellYTXRiV0ZwYzNSaGN5MXJZWFJsYlhNaU9pQWlhSFIwY0hNNkx5OWtaWFl1WVhabGMyRXViSFF2WjJGdGFXNTBiMnBoY3k5cWIzTmxjbUV2SWl3Z0lpOXFiM05sY21FdGJtRjBkWEpsYkd4bExUSnJaeTF6WVhWellYTXRiV0ZwYzNSaGN5MXpkR1Z5YVd4cGVuVnZkRzl0Y3kxcllYUmxiWE1pT2lBaWFIUjBjSE02THk5a1pYWXVZWFpsYzJFdWJIUXZaMkZ0YVc1MGIycGhjeTlxYjNObGNtRXZJaXdnSWk5cWIzTmxjbUV0YldGeWFXNWxjM05sTFRKclp5MXpZWFZ6WVhNdGJXRnBjM1JoY3kxcllYUmxiWE1pT2lBaWFIUjBjSE02THk5a1pYWXVZWFpsYzJFdWJIUXZaMkZ0YVc1MGIycGhjeTlxYjNObGNtRXZJaXdnSWk5cWIzTmxjbUV0WTNWc2FXNWxjM05sTFRJdGEyY3RjMkYxYzJGekxXMWhhWE4wWVhNdGEyRjBaVzF6SWpvZ0ltaDBkSEJ6T2k4dlpHVjJMbUYyWlhOaExteDBMMmRoYldsdWRHOXFZWE12YW05elpYSmhMeUlzSUNJdmFtOXpaWEpoTFd4bFoyVnlMVEl0YTJjdGMyRjFjMkZ6TFcxaGFYTjBZWE10YTJGMFpXMXpJam9nSW1oMGRIQnpPaTh2WkdWMkxtRjJaWE5oTG14MEwyZGhiV2x1ZEc5cVlYTXZhbTl6WlhKaEx5SXNJQ0l2YW05elpYSmhMV05oZEdWc2RYZ3RNVEJyWnkxellYVnpZWE10YldGcGMzUmhjeTFyWVhSbGJYTWlPaUFpYUhSMGNITTZMeTlrWlhZdVlYWmxjMkV1YkhRdloyRnRhVzUwYjJwaGN5OXFiM05sY21Fdklpd2dJaTl6WVhWellYTXRiV0ZwYzNSaGN5MXJZWFJsYlhNdGFtOXpaWEpoTFd4bFoyVnlMVEV3TFd0bklqb2dJbWgwZEhCek9pOHZaR1YyTG1GMlpYTmhMbXgwTDJkaGJXbHVkRzlxWVhNdmFtOXpaWEpoTHlJc0lDSXZhbTl6WlhKaExXMWhjbWx1WlhOelpTMHhNR3RuTFhOaGRYTmhjeTF0WVdsemRHRnpMV3RoZEdWdGN5STZJQ0pvZEhSd2N6b3ZMMlJsZGk1aGRtVnpZUzVzZEM5bllXMXBiblJ2YW1GekwycHZjMlZ5WVM4aUxDQWlMM0YxWVhSMGNtOHRZbVZuY25Wa2FYTXRkbWx6ZFMxMlpXbHpiR2wxTFhObGJtcHZjblV0WkdsbGRHbHVhWE10YzNWdWRTMXdZWE5oY21GekxYTjFMV0poYkhSaExYcDFkbWx0YVMxcGNpMXJjbWxzYVhVdE1USnJaeUk2SUNKb2RIUndjem92TDJSbGRpNWhkbVZ6WVM1c2RDOW5ZVzFwYm5SdmFtRnpMM0YxWVhSMGNtOHZJaXdnSWk5d2NtbHVjeTF3Y205allYSmxMVzFwYm1rdGFHVnljbWx1WnkxaGJtUXRjbWxqWlMxb2VYQnZZV3hsY21kbGJtbGpMWE5oZFhOaGN5MXRZV2x6ZEdGekxXRnNaWEpuYVhOcmFXVnRjeTF6ZFdGMVozVnphV1Z0Y3kxemRXNXBiWE10TnpVdGEyY2lPaUFpYUhSMGNITTZMeTlrWlhZdVlYWmxjMkV1YkhRdloyRnRhVzUwYjJwaGN5OXdjbWx1Y3k4aUxDQWlMMjF2Ym1kbExXRnVaQzFqTFhNdGNDMWhJam9nSW1oMGRIQnpPaTh2WkdWMkxtRjJaWE5oTG14MEwyZGhiV2x1ZEc5cVlYTXZiVzl1WjJVdkluMD0nKSwgdHJ1ZSk7CiAgIC8qIHBhcGlsZG9taSB0YWlraW5pYWkgKi8KICAgJHQxMjI9Z2V0X3Rlcm0oMTIyLCdwcm9kdWN0X2NhdCcpOwogICBpZigkdDEyMiAmJiAhaXNfd3BfZXJyb3IoJHQxMjIpKSAkelsnL3N1bmltcy90cmFuc3BvcnRhdmltby1kZXplcy0xNTUyMTU1OTY3J109cGFyc2VfdXJsKGdldF90ZXJtX2xpbmsoJHQxMjIpLFBIUF9VUkxfUEFUSCk7CiAgICRzaz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIElELHBvc3RfbmFtZSBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3BhZ2UnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICBBTkQgKHBvc3RfbmFtZSBMSUtFICclc2thaWNpdW9rbCUnIE9SIHBvc3RfdGl0bGUgTElLRSAnJWthaWNpdW9rbCUnKSBMSU1JVCAxIiwgQVJSQVlfQSk7CiAgICRvWydza2FpY2l1b2tsZSddPSRzazsKICAgaWYoJHNrKSAkelsnL3N1bnUtbWFpc3RvLXNrYWljaXVva2xlJ109cGFyc2VfdXJsKGdldF9wZXJtYWxpbmsoJHNrWydJRCddKSxQSFBfVVJMX1BBVEgpOwogICAkb1sndGFpa2luaXUnXT1jb3VudCgkeik7CgogICAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X2NvbnRlbnQgRlJPTSB7JFB9cG9zdHMKICAgICBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdHlwZSBJTiAoJ3BhZ2UnLCdwb3N0JykKICAgICBBTkQgcG9zdF9jb250ZW50IExJS0UgJyUvL3BldHNob3AubHQvJSciLCBBUlJBWV9BKTsKICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGQ9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsgaWYoIWlzX2RpcigkZCkpIEBta2RpcigkZCwwNzU1LHRydWUpOwogICAkaz1hcnJheSgpOyBmb3JlYWNoKCRlaWwgYXMgJHIpICRrWyRyWydJRCddXT0kclsncG9zdF9jb250ZW50J107CiAgIEBmaWxlX3B1dF9jb250ZW50cygkZC4nL251b3JvZG9zX3ByaWVzXycuZGF0ZSgnWW1kX0hpcycpLicuanNvbicsIHdwX2pzb25fZW5jb2RlKCRrKSk7CgogICAkcGFrPTA7ICR1cGQ9MDsgJGxpa289MDsKICAgZm9yZWFjaCgkZWlsIGFzICRyKXsKICAgICAkYz0kclsncG9zdF9jb250ZW50J107ICRzPSRjOwogICAgIGZvcmVhY2goJHogYXMgJHNlbmE9PiRuYXVqYSl7CiAgICAgICBpZighJG5hdWphKSBjb250aW51ZTsKICAgICAgIGZvcmVhY2goYXJyYXkoJ2h0dHBzOi8vcGV0c2hvcC5sdCcuJHNlbmEsJ2h0dHA6Ly9wZXRzaG9wLmx0Jy4kc2VuYSwKICAgICAgICAgICAgICAgICAgICAgJ2h0dHBzOi8vd3d3LnBldHNob3AubHQnLiRzZW5hLCdodHRwczovL3BldHNob3AubHQnLiRzZW5hLicvJykgYXMgJHYpewogICAgICAgICAkbj1zdWJzdHJfY291bnQoJGMsJHYpOwogICAgICAgICBpZigkbil7ICRjPXN0cl9yZXBsYWNlKCR2LCRuYXVqYSwkYyk7ICRwYWsrPSRuOyB9CiAgICAgICB9CiAgICAgfQogICAgIGlmKCRjIT09JHMpeyAkd3BkYi0+dXBkYXRlKCRQLidwb3N0cycsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRjKSxhcnJheSgnSUQnPT4kclsnSUQnXSkpOwogICAgICAgICAgICAgICAgICBjbGVhbl9wb3N0X2NhY2hlKCRyWydJRCddKTsgJHVwZCsrOyB9CiAgIH0KICAgJG9bJ3Bha2Vpc3RhJ109JHBhazsgJG9bJ2lyYXN1J109JHVwZDsKICAgJG9bJ2xpa29fc3Vfc2Vub21pcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cwogICAgIFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90eXBlIElOICgncGFnZScsJ3Bvc3QnKSBBTkQgcG9zdF9jb250ZW50IExJS0UgJyUvL3BldHNob3AubHQvJSciKTsKIH0KCiBpZigkYT09PSdNSUFNT1InKXsKICAgJGR1b209anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJ3BocDovL2lucHV0JyksIHRydWUpOwogICBpZihpc19hcnJheSgkZHVvbSkgJiYgIWVtcHR5KCRkdW9tWydodG1sJ10pKXsKICAgICAkcj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIElELHBvc3RfY29udGVudCBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X25hbWU9J21pYW1vci1pcy1tZWlsZXMta2F0ZW1zJyBMSU1JVCAxIiwgQVJSQVlfQSk7CiAgICAgaWYoJHIpewogICAgICAgJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGQ9JHVwWydiYXNlZGlyJ10uJy9wcy1iYWNrdXBzJzsKICAgICAgIEBmaWxlX3B1dF9jb250ZW50cygkZC4nL21pYW1vcl9wcmllc18nLmRhdGUoJ1ltZF9IaXMnKS4nLmh0bWwnLCAkclsncG9zdF9jb250ZW50J10pOwogICAgICAgJHdwZGItPnVwZGF0ZSgkUC4ncG9zdHMnLCBhcnJheSgncG9zdF9jb250ZW50Jz0+JGR1b21bJ2h0bWwnXSksIGFycmF5KCdJRCc9PiRyWydJRCddKSk7CiAgICAgICBjbGVhbl9wb3N0X2NhY2hlKCRyWydJRCddKTsKICAgICAgICRtb2o9MDsgZm9yZWFjaChhcnJheSgnw4QnLCfDhcKhJywnw4XCvicsJ8OFwrMnKSBhcyAkcykgJG1vais9c3Vic3RyX2NvdW50KCRkdW9tWydodG1sJ10sJHMpOwogICAgICAgJG9bJ21pYW1vciddPWFycmF5KCdpZCc9PihpbnQpJHJbJ0lEJ10sJ3puX3ByaWVzJz0+c3RybGVuKCRyWydwb3N0X2NvbnRlbnQnXSksCiAgICAgICAgICd6bl9wbyc9PnN0cmxlbigkZHVvbVsnaHRtbCddKSwnbW9qaWJha2UnPT4kbW9qKTsKICAgICB9IGVsc2UgJG9bJ21pYW1vciddPSduZXJhc3Rhcyc7CiAgIH0gZWxzZSAkb1snbWlhbW9yJ109J25lcmEgZHVvbWVudSc7CiAgICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H065'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function blokas(h,kl){
  const re=new RegExp('<(div|article|section)[^>]*class="[^"]*'+kl+'[^"]*"','i');
  const i=h.search(re); if(i<0) return '';
  let g=0,j=-1; const rr=/<\/?(div|article|section)\b[^>]*>/gi; rr.lastIndex=i; let m;
  while((m=rr.exec(h))!==null){ if(m[0].startsWith('</')) g--; else g++;
    if(g===0){ j=m.index+m[0].length; break; } if(rr.lastIndex>i+400000) break; }
  return j>i? h.slice(i,j):'';
}
function vidus(b){ const i=b.indexOf('>'), j=b.lastIndexOf('</'); return (i>0&&j>i)?b.slice(i+1,j).trim():b; }
let snipId=null;
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H065 uzdarymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const rn=await fetch(WP+'/?ps_h065=NUORODOS'); const tn=await rn.text();
  try{ out.nuorodos=JSON.parse(tn); }catch(e){ out.n_zalias=tn.slice(0,300); }

  /* MIAMOR is senos svetaines */
  out.miamor_paieska=[];
  let html='';
  for(const u of ['https://petshop.lt/miamor-is-meiles-katems','https://petshop.lt/miamor-katems',
                  'https://petshop.lt/blog/miamor-is-meiles-katems']){
    try{
      const x=await fetch(u); const h=await x.text();
      let b=vidus(blokas(h,'articleDescription')||blokas(h,'blogDescription')||'');
      const moj=/Å¡|Å¾|Ä…|Ä¯|Ä—/.test(b)?1:0;
      out.miamor_paieska.push({u,http:x.status,zn:b.length,mojibake:moj});
      if(x.status===200 && b.length>800 && !moj){ html=b; break; }
    }catch(e){ out.miamor_paieska.push({u,kl:String(e).slice(0,50)}); }
  }
  if(html){
    const r=await fetch(WP+'/?ps_h065=MIAMOR',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html})});
    const t=await r.text();
    try{ out.miamor=JSON.parse(t); }catch(e){ out.m_zalias=t.slice(0,300); }
  } else { out.miamor='saltinis nerastas'; }
  await new Promise(r=>setTimeout(r,3000));
  out.patikra=[];
  for(const s of ['senbernaras','josera-sunu-maistas','miamor-is-meiles-katems','hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu']){
    try{ const x=await fetch('https://dev.avesa.lt/'+s+'/'); const h=await x.text();
      out.patikra.push({s,http:x.status,senos:(h.match(/petshop\.lt\//g)||[]).length,
        moj:(h.match(/Å¡|Å¾|Ä…|Ä¯|Ä—/g)||[]).length,
        i_kat:(h.match(/href="\/kategorija\//g)||[]).length,
        i_gam:(h.match(/href="\/gamintojas\//g)||[]).length}); }
    catch(e){ out.patikra.push({s,kl:1}); }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h065.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h065 uzdarymas');
