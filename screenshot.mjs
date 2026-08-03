import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczQ1J10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfczQ1J107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nczM0NS12MScpOwogICAgJEYgPSBQRVRTSE9QX0NPUkVfRElSLidpbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnOwogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkRik7CiAgICAkclsndmFydGFpJ109YXJyYXkoJ2R5ZGlzJz0+c3RybGVuKCRjKSwnc2hhX29rJz0+KHN0cnBvcyhoYXNoKCdzaGEyNTYnLCRjKSwnNGMzMTZjM2ZlYWQ1NDgyNycpPT09MCkpOwogICAgJFA9YXJyYXkoJ0EnPT5hcnJheShiYXNlNjRfZGVjb2RlKCdDUWtKQ1FscFppQW9JQ1IzSUQ0Z01DQW1KaUFrZHlBOFBTQXhNakFnS1NCN0Nna0pDUWtKQ1NSdmRYUmJKMk4xY25KbGJuUmZkMlZwWjJoMFgydG5KMTBnUFNCeWIzVnVaQ2dnSkhjc0lESWdLVHNLQ1FrSkNRa0pKRzkxZEZzbmQyVnBaMmgwWDNWd1pHRjBaV1JmWVhRblhTQWdQU0JuYldSaGRHVW9JQ2RaTFcwdFpDQklPbWs2Y3ljZ0tUc0tDUWtKQ1FsOUlHVnNjMlVnZXc9PScpLGJhc2U2NF9kZWNvZGUoJ0NRa0pDUWxwWmlBb0lDUjNJRDRnTUNBbUppQWtkeUE4UFNBeE1qQWdLU0I3Q2drSkNRa0pDU1J2ZFhSYkoyTjFjbkpsYm5SZmQyVnBaMmgwWDJ0bkoxMGdQU0J5YjNWdVpDZ2dKSGNzSURJZ0tUc0tDUWtKQ1FrSkx5OGc0cGlGSUZNek5EVTZJR0IzWldsbmFIUmZkWEJrWVhSbFpGOWhkR0FnUTBsQklFNUZRa1ZFUlVSQlRVRlRMaUJUWVc1cGRHbDZaWEpwY3lCT1JWcEpUazhLQ1FrSkNRa0pMeThnWVc1cmMzUmxjMjVsY3lCRVFpQnlaV2xyYzIxbGN5d2dkRzlrWld3Z1ltVnpZV3g1WjJsemEyRnBJR1JsWkdFZ2JtRjFhbUVnWkdGMFlTQnBjZ29KQ1FrSkNRa3ZMeURpZ0o1emRtOXlhWE1nWVhSdVlYVnFhVzUwWVhNaUlIUmhjR1JoZG04ZzRvQ2VjSEp2Wm1sc2FYTWdhWE56WVhWbmIzUmhjeUl1SUVSaGRHRWdiblZ6ZEdGMGJ3b0pDUWtKQ1Frdkx5QmpjbVZoZEdVdmRYQmtZWFJsSUd0bGJHbGhjeXdnYTNWeWFYTWdUVUZVVHlCelpXNWhhbWtnYzNadmNta3VDZ2tKQ1FrSmZTQmxiSE5sSUhzPScpKSwKICAgICAgICAgICAgICdCJz0+YXJyYXkoYmFzZTY0X2RlY29kZSgnQ1Fra2QzQmtZaTArYzNWd2NISmxjM05mWlhKeWIzSnpLQ0IwY25WbElDazdDZ2tKSkc5cklEMGdKSGR3WkdJdFBtbHVjMlZ5ZENnZ2MyVnNaam82ZEdGaWJHVmZibUZ0WlNncExDQWtaR0YwWVNBcE93PT0nKSxiYXNlNjRfZGVjb2RlKCdDUWt2THlCVE16UTFPaUJEVWtWQlZFVWc0b0NVSUdCM1pXbG5hSFJmZFhCa1lYUmxaRjloZEdBZ2JuVnpkR0YwYjIxaGN5QlVTVXNnYW1WcElITjJiM0pwY3lCeVpXRnNhV0ZwSUhCaGRHVnBhM1JoY3k0S0NRbHBaaUFvSUdsemMyVjBLQ0FrWkdGMFlWc25ZM1Z5Y21WdWRGOTNaV2xuYUhSZmEyY25YU0FwSUNZbUlHNTFiR3dnSVQwOUlDUmtZWFJoV3lkamRYSnlaVzUwWDNkbGFXZG9kRjlyWnlkZElDa2dld29KQ1Fra1pHRjBZVnNuZDJWcFoyaDBYM1Z3WkdGMFpXUmZZWFFuWFNBOUlHZHRaR0YwWlNnZ0oxa3RiUzFrSUVnNmFUcHpKeUFwT3dvSkNYMEtDZ2tKSkhkd1pHSXRQbk4xY0hCeVpYTnpYMlZ5Y205eWN5Z2dkSEoxWlNBcE93b0pDU1J2YXlBOUlDUjNjR1JpTFQ1cGJuTmxjblFvSUhObGJHWTZPblJoWW14bFgyNWhiV1VvS1N3Z0pHUmhkR0VnS1RzPScpKSwKICAgICAgICAgICAgICdDJz0+YXJyYXkoYmFzZTY0X2RlY29kZSgnQ1Fra1kyaGhibWRsWkNBOUlHRnljbUY1S0NrN0Nna0pKSFZ3WkdGMFpYTWdQU0JoY25KaGVTZ3BPd29KQ1dadmNtVmhZMmdnS0NBa2FXNXdkWFFnWVhNZ0pHWWdQVDRnSkhaaGJDQXBJSHNLQ1FrSmFXWWdLQ0J3Y205d1pYSjBlVjlsZUdsemRITW9JQ1J3WlhRc0lDUm1JQ2tnSmlZZ0pIWmhiQ0FoUFQwZ0pIQmxkQzArSkdZZ0tTQjdDZ2tKQ1Fra1kyaGhibWRsWkZ0ZElEMGdKR1k3Q2drSkNRa2tkWEJrWVhSbGMxc2dKR1lnWFNBOUlDUjJZV3c3Q2drSkNYMEtDUWw5JyksYmFzZTY0X2RlY29kZSgnQ1Fra1kyaGhibWRsWkNBOUlHRnljbUY1S0NrN0Nna0pKSFZ3WkdGMFpYTWdQU0JoY25KaGVTZ3BPd29KQ1dadmNtVmhZMmdnS0NBa2FXNXdkWFFnWVhNZ0pHWWdQVDRnSkhaaGJDQXBJSHNLQ1FrSmFXWWdLQ0FoSUhCeWIzQmxjblI1WDJWNGFYTjBjeWdnSkhCbGRDd2dKR1lnS1NBcElIc0tDUWtKQ1dOdmJuUnBiblZsT3dvSkNRbDlDZ2tKQ1M4dklPS1loU0JUTXpRMU9pQlRWazlTU1ZNZ2JIbG5hVzVoYldGeklGTkxRVWxVU1U1RklIQnlZWE50WlM0S0NRa0pMeThnUkVJZ2JHRnBhMjhnWUNJeE1pNDFNQ0pnSUNoemRISnBibWNwTENCeVpYRjFaWE4wWVhNZ1lYUnVaWE5oSUdBeE1pNDFZQ0FvWm14dllYUXBJT0tBbEFvSkNRa3ZMeUJuY21sbGVuUmhjeUJnSVQwOVlDQnFkVzl6SUd4aGFXdDVaR0YyYnlCVFMwbFNWRWxPUjBGSlV5d2dkRzlrWld3Z2EybGxhM1pwWlc1aGN5QndjbTltYVd4cGJ3b0pDUWt2THlCcGMzTmhkV2R2YW1sdFlYTWc0b0NlWVhSdVlYVnFhVzVrWVhadklpQnVaWEJoYTJsMGRYTnBJSE4yYjNKcElHbHlJR3B2SUdSaGRHRXVDZ2tKQ1dsbUlDZ2dKMk4xY25KbGJuUmZkMlZwWjJoMFgydG5KeUE5UFQwZ0pHWWdLU0I3Q2drSkNRa2tibUYxYW1GeklEMGdLQ0J1ZFd4c0lEMDlQU0FrZG1Gc0lIeDhJQ2NuSUQwOVBTQWtkbUZzSUNrZ1B5QnVkV3hzSURvZ0tHWnNiMkYwS1NBa2RtRnNPd29KQ1FrSkpITmxibUZ6SUNBOUlDZ2diblZzYkNBOVBUMGdKSEJsZEMwK0pHWWdmSHdnSnljZ1BUMDlJQ1J3WlhRdFBpUm1JQ2tnUHlCdWRXeHNJRG9nS0dac2IyRjBLU0FrY0dWMExUNGtaanNLQ1FrSkNXbG1JQ2dnSkc1aGRXcGhjeUE5UFQwZ0pITmxibUZ6SUNrZ2V3b0pDUWtKQ1dOdmJuUnBiblZsT3lBZ0lDOHZJRTVGVUVGVFNVdEZTVlJGSU9LQWxDQnVaV2tnYzNadmNtbHpMQ0J1WldrZ2FtOGdaR0YwWVNCdVpXeHBaWE4wYVFvSkNRa0pmUW9KQ1FrSkpHTm9ZVzVuWldSYlhTQTlJQ1JtT3dvSkNRa0pKSFZ3WkdGMFpYTmJJQ1JtSUYwZ1BTQWtibUYxYW1Gek93b0pDUWtKTHk4Z1JHRjBZU0JoZEc1aGRXcHBibUZ0WVNCVVNVc2dhMkZ5ZEhVZ2MzVWdjbVZoYkdsMUlITjJiM0pwYnlCd2IydDVZMmwxTGdvSkNRa0pKSFZ3WkdGMFpYTmJKM2RsYVdkb2RGOTFjR1JoZEdWa1gyRjBKMTBnUFNCbmJXUmhkR1VvSUNkWkxXMHRaQ0JJT21rNmN5Y2dLVHNLQ1FrSkNXTnZiblJwYm5WbE93b0pDUWw5Q2drSkNTOHZJRXRzYVdWdWRHOGdjR0YwWldscmRHOGdZSGRsYVdkb2RGOTFjR1JoZEdWa1gyRjBZQ0JPUlZCU1NVbE5RVTBnYm1sbGEyRmtZUzRLQ1FrSmFXWWdLQ0FuZDJWcFoyaDBYM1Z3WkdGMFpXUmZZWFFuSUQwOVBTQWtaaUFwSUhzS0NRa0pDV052Ym5ScGJuVmxPd29KQ1FsOUNna0pDV2xtSUNnZ0pIWmhiQ0FoUFQwZ0pIQmxkQzArSkdZZ0tTQjdDZ2tKQ1Fra1kyaGhibWRsWkZ0ZElEMGdKR1k3Q2drSkNRa2tkWEJrWVhSbGMxc2dKR1lnWFNBOUlDUjJZV3c3Q2drSkNYMEtDUWw5JykpKTsKICAgIGZvcmVhY2ggKCRQIGFzICRrPT4keCl7ICRyWydpbmthcmFpJ11bJGtdPXN1YnN0cl9jb3VudCgkYywkeFswXSk7IH0KICAgICRyWydqYXUnXT0oc3RycG9zKCRjLCdTMzQ1JykhPT1mYWxzZSk7CiAgICBpZiAoJHY9PT0nZHJ5Jyl7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9CiAgICBpZiAoJHY9PT0nYXBwbHknKXsKICAgICAgICBpZiAoJHJbJ2phdSddKSB7ICRyWydWRVJESUtUQVMnXT0nSkFVIElESUVHVEEnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgICAgIGlmICghJHJbJ3ZhcnRhaSddWydzaGFfb2snXSkgeyAkclsnVkVSRElLVEFTJ109J1NVU1RBQkRZVEEg4oCUIGJhc2VsaW5lJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBmb3JlYWNoICgkclsnaW5rYXJhaSddIGFzICRrPT4kbil7IGlmKCRuIT09MSl7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgaW5rYXJhcyAnLiRrLic9Jy4kbjsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0gfQogICAgICAgICRuPSRjOyBmb3JlYWNoICgkUCBhcyAkeCl7ICRuPXN0cl9yZXBsYWNlKCR4WzBdLCR4WzFdLCRuKTsgfQogICAgICAgICRvaz10cnVlOyB0cnl7IHRva2VuX2dldF9hbGwoJG4sVE9LRU5fUEFSU0UpOyB9Y2F0Y2goXFBhcnNlRXJyb3IgJGUpeyAkb2s9ZmFsc2U7ICRyWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAgICAgJHJbJ3NpbnRha3NlJ109JG9rOwogICAgICAgIGlmKCEkb2speyAkclsnVkVSRElLVEFTJ109J1NVU1RBQkRZVEEg4oCUIHNpbnRha3NlJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgICAgIGNvcHkoJEYsJEYuJy5iYWtfUzM0NScpOyBmaWxlX3B1dF9jb250ZW50cygkRiwkbik7CiAgICAgICAgJHJbJ1ZFUkRJS1RBUyddPSdJRElFR1RBJzsgJHJbJ2R5ZGlzX3BvJ109ZmlsZXNpemUoJEYpOyAkclsnc2hhX3BvJ109aGFzaF9maWxlKCdzaGEyNTYnLCRGKTsKICAgICAgICAkclsnc2l0ZSddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('s345.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_s45=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 50 "'+SITE+'/?ps_s45=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,700); }
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('s345.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
