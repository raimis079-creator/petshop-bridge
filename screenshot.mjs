process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAyNCddKT8kX0dFVFsncHNfaDAyNCddOicnKSE9PSdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDI0Jyk7CgogLyogMS4gVElLU0xVUyBwYXZlaWt0dSBwb2FpYmlzOiByZW1pYXNpIGV4Y2VycHQgSVIgZXhjZXJwdCBkdmlndWJhaSBrb2R1b3RhcyAqLwogJG9bJ3BhdmVpa3RhX3Rpa3NsaWFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIHAKICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICBBTkQgVFJJTShDT0FMRVNDRShwLnBvc3RfZXhjZXJwdCwnJykpPD4nJwogICBBTkQgKHAucG9zdF9leGNlcnB0IExJS0UgJyUmbHQ7JScgT1IgcC5wb3N0X2V4Y2VycHQgTElLRSAnJSZndDslJykKICAgQU5EIE5PVCBFWElTVFMgKFNFTEVDVCAxIEZST00geyRQfXBvc3RtZXRhIG0gV0hFUkUgbS5wb3N0X2lkPXAuSUQKICAgICAgICAgICAgICAgICAgIEFORCBtLm1ldGFfa2V5PSdyYW5rX21hdGhfZGVzY3JpcHRpb24nIEFORCBtLm1ldGFfdmFsdWU8PicnKSIpOwogJG9bJ3NhdmFfbWV0YV9zdV9lc3liZW1pcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0bWV0YSBtCiAgIEpPSU4geyRQfXBvc3RzIHAgT04gcC5JRD1tLnBvc3RfaWQKICAgV0hFUkUgbS5tZXRhX2tleT0ncmFua19tYXRoX2Rlc2NyaXB0aW9uJyBBTkQgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICBBTkQgKG0ubWV0YV92YWx1ZSBMSUtFICclJmx0OyUnIE9SIG0ubWV0YV92YWx1ZSBMSUtFICclJmFtcDslJykiKTsKCiAvKiAyLiBSQVNZTUFTIGkgbXUtcGx1Z2lucyAqLwogJGI2ND0nUEQ5d2FIQUtMeW9xQ2lBcUlGQnNkV2RwYmlCT1lXMWxPaUJRWlhSemFHOXdJRk5GVHlCQmNISmh4YUY1Ylc4Z1ZtRnNlVzFoY3lCMk1TNHdMakFnS0dWemVXSnB4Yk1nWkdWcmIyUmhkbWx0WVhNcENpQXFJRVJsYzJOeWFYQjBhVzl1T2lCSnhhSEZvV2xtY25WdmFtRWdTRlJOVENCbGMzbGlaWE1nYVhJZ2NHSEZvV0ZzYVc1aElIUmhaM1Z6SUZKaGJtc2dUV0YwYUNCdFpYUmhJR0Z3Y21IRm9YbHRaUzRLSUNvZ0lDQWdJQ0FnSUNBZ0lDQWdJRVJoYkdseklIQnlaV3RweGJNZ2RIVnlhU0JrZG1sbmRXSmhhU0IxeGI1cmIyUjFiM1RFaFNCd2IzTjBYMlY0WTJWeWNIUWdLQ1pzZER0d0ptZDBPeTR1TGlrc0NpQXFJQ0FnSUNBZ0lDQWdJQ0FnSUNCcmRYTEVyeUJTWVc1cklFMWhkR2dnYVcxaElNVytZV3hweElVc0lHRndiR1Z1YTJSaGJXRnpJRmR2YjBOdmJXMWxjbU5sSUdacGJIUnl4Yk1nWjNKaGJtUnBic1NaTGdvZ0tpQWdJQ0FnSUNBZ0lDQWdJQ0FnVm1sMGNtbHViMnBsSUhSbGEzTjBZWE1neGFGMllYSjFjeXdnYnlCdFpYUmhJR0Z3Y21IRm9YbHRaU0J1ZFhSbGE4U1haR0YyYnlCdFlYUnZiV0VneGFGcGRXdkZvV3pFbHk0S0lDb2dJQ0FnSUNBZ0lDQWdJQ0FnSUVacGJIUnlZWE1nZEdGcGMyOGdhWElnWlhOaGJYVnpMQ0JwY2lCaWRYTnBiWFZ6SUdsdGNHOXlkTVd6SUdGMGRtVnFkWE11Q2lBcUlGWmxjbk5wYjI0NklERXVNQzR3Q2lBcUlFRjFkR2h2Y2pvZ1VHVjBjMmh2Y0M1c2RBb2dLaThLQ21sbUlDZ2dJU0JrWldacGJtVmtLQ0FuUVVKVFVFRlVTQ2NnS1NBcElIc0tDV1Y0YVhRN0NuMEtDbWxtSUNnZ0lTQmpiR0Z6YzE5bGVHbHpkSE1vSUNkUVpYUnphRzl3WDFORlQxOUJjSEpoYzNsdFlYTW5JQ2tnS1NCN0Nnb0pZMnhoYzNNZ1VHVjBjMmh2Y0Y5VFJVOWZRWEJ5WVhONWJXRnpJSHNLQ2drSlkyOXVjM1FnVmtWU1UwbEtRU0E5SUNjeExqQXVNQ2M3Q2dvSkNTOHFLaUJMYVdWcklHdGhjblRGc3lCa1lYVm5hV0YxYzJsaGFTQmlZVzVrYjIxaElHUmxhMjlrZFc5MGFTQW9aSFpwWjNWaVlYTXZkSEpwWjNWaVlYTWdhMjlrWVhacGJXRnpLUzRnS2k4S0NRbGpiMjV6ZENCTlFWaGZSRVZMVDBSQlZrbE5WU0E5SURNN0Nnb0pDWEIxWW14cFl5QnpkR0YwYVdNZ1puVnVZM1JwYjI0Z2FXNXBkQ2dwSUhzS0NRa0pZV1JrWDJacGJIUmxjaWdnSjNKaGJtdGZiV0YwYUM5bWNtOXVkR1Z1WkM5a1pYTmpjbWx3ZEdsdmJpY3NJR0Z5Y21GNUtDQmZYME5NUVZOVFgxOHNJQ2QyWVd4NWRHa25JQ2tzSURJd0lDazdDZ2tKZlFvS0NRa3ZLaW9LQ1FrZ0tpQk9kWFpoYkc4Z2JXVjBZU0JoY0hKaHhhRjViY1NGTGdvSkNTQXFDZ2tKSUNvZ1JXbG5ZVG9nY0dGcllYSjBiM1JwYm1GcElHUmxhMjlrZFc5cVlXMXZjeUJsYzNsaVpYTWdLR3R2YkNCMFpXdHpkR0Z6SUc1MWMzUnZhbUVnYTJWcGMzUnBjeWtzQ2drSklDb2dkR0ZrWVNCd1ljV2hZV3hwYm1GdGFTQmhkSE5wWkdWdVo4U1pJSFJoWjJGcExDQjBZV1JoSUhOMWRtbGxibTlrYVc1aGJXa2dkR0Z5Y0dGcExnb0pDU0FxSUVwbGFTQndieUIyWVd4NWJXOGdiR2xyZE1XeklIUjF4YUhFaldsaElPS0FsQ0JuY3NTRnhiNXBibUZ0WVhNZ2IzSnBaMmx1WVd4aGN5QW9aMlZ5YVdGMUlNV2hhWFZyeGFGc3hKY2dibVZwSUc1cFpXdGhjeWt1Q2drSklDb0tDUWtnS2lCQWNHRnlZVzBnSUhOMGNtbHVaeUFrZEdWcmMzUmhjeUJTWVc1cklFMWhkR2dnY0dGeWRXL0ZvWFJoY3lCaGNISmh4YUY1YldGekxnb0pDU0FxSUVCeVpYUjFjbTRnYzNSeWFXNW5DZ2tKSUNvdkNna0pjSFZpYkdsaklITjBZWFJwWXlCbWRXNWpkR2x2YmlCMllXeDVkR2tvSUNSMFpXdHpkR0Z6SUNrZ2V3b0tDUWtKYVdZZ0tDQWhJR2x6WDNOMGNtbHVaeWdnSkhSbGEzTjBZWE1nS1NCOGZDQW5KeUE5UFQwZ2RISnBiU2dnSkhSbGEzTjBZWE1nS1NBcElIc0tDUWtKQ1hKbGRIVnliaUFrZEdWcmMzUmhjenNLQ1FrSmZRb0tDUWtKSkhRZ1BTQWtkR1ZyYzNSaGN6c0tDZ2tKQ1dadmNpQW9JQ1JwSUQwZ01Ec2dKR2tnUENCelpXeG1PanBOUVZoZlJFVkxUMFJCVmtsTlZUc2dKR2tyS3lBcElIc0tDUWtKQ1NSd2NtbGxjeUE5SUNSME93b0pDUWtKSkhRZ0lDQWdJRDBnYUhSdGJGOWxiblJwZEhsZlpHVmpiMlJsS0NBa2RDd2dSVTVVWDFGVlQxUkZVeUI4SUVWT1ZGOUlWRTFNTlN3Z0oxVlVSaTA0SnlBcE93b0pDUWtKYVdZZ0tDQWtkQ0E5UFQwZ0pIQnlhV1Z6SUNrZ2V3b0pDUWtKQ1dKeVpXRnJPd29KQ1FrSmZRb0pDUWw5Q2dvSkNRa2tkQ0E5SUhkd1gzTjBjbWx3WDJGc2JGOTBZV2R6S0NBa2RDQXBPd29KQ1Fra2RDQTlJSEJ5WldkZmNtVndiR0ZqWlNnZ0p5OWNjeXN2ZFNjc0lDY2dKeXdnSkhRZ0tUc0tDUWtKSkhRZ1BTQjBjbWx0S0NBa2RDQXBPd29LQ1FrSmNtVjBkWEp1SUNnZ0p5Y2dQVDA5SUNSMElDa2dQeUFrZEdWcmMzUmhjeUE2SUNSME93b0pDWDBLQ1gwS0NnbFFaWFJ6YUc5d1gxTkZUMTlCY0hKaGMzbHRZWE02T21sdWFYUW9LVHNLZlFvPSc7CiAkdHVyaW55cz1iYXNlNjRfZGVjb2RlKCRiNjQpOwogJG1kNV9sYXVrdGFzPSdkZmViYjBjMDFlN2FmMjVjZmJhMmUyYzY2M2Y4NWMzZSc7CiAkb1snbWQ1X2xhdWt0YXMnXT0kbWQ1X2xhdWt0YXM7ICRvWydtZDVfZ2F1dGFzJ109bWQ1KCR0dXJpbnlzKTsKIGlmKG1kNSgkdHVyaW55cykhPT0kbWQ1X2xhdWt0YXMpewogICAkb1snTlVUUkFVS1RBJ109J21kNSBuZXN1dGFtcGEgcGVyZGF2aW1lJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7CiB9CiAka2VsaWFzPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atc2VvLWFwcmFzeW1hcy5waHAnOwogaWYoZmlsZV9leGlzdHMoJGtlbGlhcykpewogICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZD0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRkKSkgQG1rZGlyKCRkLDA3NTUsdHJ1ZSk7CiAgIEBjb3B5KCRrZWxpYXMsJGQuJy9wZXRzaG9wLXNlby1hcHJhc3ltYXNfJy5kYXRlKCdZbWRfSGlzJykuJy5iYWsnKTsKICAgJG9bJ2JhayddPSdwYWRhcnl0YSc7CiB9IGVsc2UgeyAkb1snYmFrJ109J25lcmVpa2VqbyAobmF1amFzIGZhaWxhcyknOyB9CiAkb2s9QGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsJHR1cmlueXMpOwogJG9bJ2lyYXN5dGFfYmFpdHUnXT0kb2s7CiBjbGVhcnN0YXRjYWNoZSh0cnVlLCRrZWxpYXMpOwogJG9bJ2ZhaWxvX21kNV9kaXNrZSddPWZpbGVfZXhpc3RzKCRrZWxpYXMpP21kNV9maWxlKCRrZWxpYXMpOm51bGw7CiAkb1snc3V0YW1wYSddPSgkb1snZmFpbG9fbWQ1X2Rpc2tlJ109PT0kbWQ1X2xhdWt0YXMpPzE6MDsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H024'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
const TESTAI={13610:'https://dev.avesa.lt/?p=13610',13048:'https://dev.avesa.lt/?p=13048',
              13152:'https://dev.avesa.lt/?p=13152',19785:'https://dev.avesa.lt/?p=19785',
              34969:'https://dev.avesa.lt/?p=34969'};
async function metos(){
  const r={};
  for(const [id,u] of Object.entries(TESTAI)){
    try{
      const x=await fetch(u); const h=await x.text();
      const m=h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
      const raw=m?m[1]:'';
      r[id]={http:x.status,desc:raw.slice(0,190),ilg:raw.length,
             lt_gt:/&lt;|&gt;/.test(raw)?1:0, amp:/&amp;/.test(raw)?1:0};
    }catch(e){ r[id]={klaida:String(e).slice(0,90)}; }
  }
  return r;
}
try{
  out.pries=await metos();
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H024 SEO aprasymo filtras',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h024=APPLY'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,700); }
  await new Promise(r=>setTimeout(r,5000));
  out.po=await metos();
  let hs=0; try{ const h=await fetch(WP+'/'); hs=h.status; }catch(e){ hs=-1; }
  out.namai=hs;
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h024.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h024 seo aprasymo filtras');
