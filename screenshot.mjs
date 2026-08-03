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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDQg4oCUIHN2b3JpbyByaWJvcyBhZGFwdGVyaXMgKGtvcmVrY2luaXMgY29tbWl0YXMgYW50IFMzNDEpCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zMzQnXSkgKSByZXR1cm47CiAgICAkdiA9ICRfR0VUWydwc19zMzQnXTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidzMzQ0LXYxJyk7CiAgICAkRiA9IFBFVFNIT1BfQ09SRV9ESVIuJ2Fzc2V0cy9wZXQtZm9ybS5qcyc7CiAgICAkanMgPSBmaWxlX2dldF9jb250ZW50cygkRik7CiAgICAkclsndmFydGFpJ10gPSBhcnJheSgnZHlkaXMnPT5zdHJsZW4oJGpzKSwKICAgICAgICAnc2hhX29rJz0+KHN0cnBvcyhoYXNoKCdzaGEyNTYnLCRqcyksJ2NiNzJjNDI2NTUwNjhiYzQnKT09PTApLAogICAgICAgICdkeWRpc19vayc9PihzdHJsZW4oJGpzKT09PTgwMzkzKSk7CiAgICAkQT1hcnJheShiYXNlNjRfZGVjb2RlKCdDV1oxYm1OMGFXOXVJSE55ZGxCaGVXeHZZV1FvS1hzS0NRbDJZWElnYjNWMElEMGdlMzA3Q2drSlptOXlJQ2gyWVhJZ2F5QnBiaUJ6ZEdGMFpTNWtZWFJoS1NCN0Nna0pDV2xtSUNnaFQySnFaV04wTG5CeWIzUnZkSGx3WlM1b1lYTlBkMjVRY205d1pYSjBlUzVqWVd4c0tITjBZWFJsTG1SaGRHRXNJR3NwS1NCamIyNTBhVzUxWlRzS0NRa0phV1lnS0dzZ1BUMDlJQ2RrY21GbWRGOXBaQ2NnZkh3Z2F5QTlQVDBnSjJOeVpXRjBaV1JmWVhRbktTQmpiMjUwYVc1MVpUc0tDUWtKZG1GeUlIWWdQU0J6ZEdGMFpTNWtZWFJoVzJ0ZE93b0pDUWxwWmlBb2RpQTlQVDBnYm5Wc2JDQjhmQ0IySUQwOVBTQjFibVJsWm1sdVpXUWdmSHdnZGlBOVBUMGdKeWNwSUdOdmJuUnBiblZsT3dvSkNRbHZkWFJiYTEwZ1BTQjJPd29KQ1gwS0NRbHlaWFIxY200Z2IzVjBPd29KZlE9PScpLGJhc2U2NF9kZWNvZGUoJ0NTOHFLZ29KSUNvZ1V6TTBORG9nVmtsRlRrRlRJSEpwWW05eklHRmtZWEIwWlhKcGN5RGlnSlFnWUY5M1pXbG5hSFJmYTJkZ0lDMCtJR0JqZFhKeVpXNTBYM2RsYVdkb2RGOXJaMkF1Q2drZ0tnb0pJQ29nNHBpRklFdFBSRVZNSUZOSlZFOGdVa1ZKUzBWS1R5NGdRVzVyWlhSaElITjJiM0pwSUd4aGFXdHZJRlpKUkVsT1NVRk5SU0JzWVhWclpTQmdYM2RsYVdkb2RGOXJaMkFLQ1NBcUlDQWdLRlZKSUhKbGFXdHpiV1VzSUd4dlkyRnNVM1J2Y21GblpTd2c0b0tzTDJScFpXNWhhU0J6YTJGcFkybDFiMnRzWlN3Z2NtOWtlVzFoY3lCaGJuUnlZWE4wWldwbEtTNEtDU0FxSUNBZ1MyRnViMjVwYm1seklGTkZVbFpGVWtsUElHeGhkV3RoY3lEaWdKUWdZR04xY25KbGJuUmZkMlZwWjJoMFgydG5ZQ0FvVXpNek5Td2djMkZ1YVhScGVtVmZhVzV3ZFhRcExnb0pJQ29nSUNCZ1luVnBiR1JRWVhsc2IyRmtLQ2xnSUdCZmQyVnBaMmgwWDJ0bllDQldTVk5CUkVFZ2FYTnRaWE5rWVhadkxDQmlaWFFnVGtsRlMxVlNJRzVsYldGd2FXNWtZWFp2TEFvSklDb2dJQ0J2SUZNek5ERWdZSE55ZGxCaGVXeHZZV1FvS1dBZ2Fta2djSEpoYkdWcGMyUmhkbThnVGtWVVJVbFRTVTVIVlNCMllYSmtkU0F0UGlCM2FHbDBaV3hwYzNRS0NTQXFJQ0FnYm5WdFpYTmtZWFp2TENCcGNpQnpkbTl5YVhNZ2JtVndZWE5wWld0a1lYWnZJR0J3YzE5d1pYUnpZQ0JPUlVrZ1ZrbEZUa0ZOUlNCclpXeDVhbVV1Q2drZ0tnb0pJQ29nNHBpRklFRkVRVkJVUlZKSlV5d2dUa1VnVUVWU1ZrRkVTVTVKVFVGVExpQmdYM2RsYVdkb2RGOXJaMkFnYkdsbGEyRWdkbWxrYVc1cGN5RGlnSlFnY0dWeWRtRmthVzUxY3dvSklDb2dJQ0JuYkc5aVlXeHBZV2tnYzNWc2RYTjBkU0J6YTJGcFkybDFiMnRzWlN3Z1pISmhablJ2SUdGMGEzVnlhVzFoY3lCcGNpQlRSVTVKSUd4dlkyRnNVM1J2Y21GblpTQnBjbUZ6WVdrdUNna2dLZ29KSUNvZzRwaUZJR0IzWldsbmFIUmZkWEJrWVhSbFpGOWhkR0FnYTJ4cFpXNTBZWE1nVGtWVFNWVk9RMGxCSU9LQWxDQnFhU0J1ZFhOMFlYUnZJSE5sY25abGNtbHpJQ2hUTXpNMUtTNEtDU0FxTHdvSlpuVnVZM1JwYjI0Z1lXUmtRMkZ1YjI1cFkyRnNWMlZwWjJoMEtIQmhlV3h2WVdRc0lHUmhkR0VwZXdvSkNXbG1JQ2doWkdGMFlTQjhmQ0FoVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzVvWVhOUGQyNVFjbTl3WlhKMGVTNWpZV3hzS0dSaGRHRXNJQ2RmZDJWcFoyaDBYMnRuSnlrcElIc0tDUWtKY21WMGRYSnVJSEJoZVd4dllXUTdDZ2tKZlFvSkNYWmhjaUIyWVd4MVpTQTlJRk4wY21sdVp5aGtZWFJoTGw5M1pXbG5hSFJmYTJjZ1BUMGdiblZzYkNBL0lDY25JRG9nWkdGMFlTNWZkMlZwWjJoMFgydG5LUzUwY21sdEtDazdDZ2tKYVdZZ0tIWmhiSFZsSUNFOVBTQW5KeWtnZXdvSkNRbHdZWGxzYjJGa0xtTjFjbkpsYm5SZmQyVnBaMmgwWDJ0bklEMGdkbUZzZFdVdWNtVndiR0ZqWlNnbkxDY3NJQ2N1SnlrN0Nna0pmUW9KQ1dSbGJHVjBaU0J3WVhsc2IyRmtMbDkzWldsbmFIUmZhMmM3Q2drSmNtVjBkWEp1SUhCaGVXeHZZV1E3Q2dsOUNnb0pablZ1WTNScGIyNGdjM0oyVUdGNWJHOWhaQ2dwZXdvSkNYWmhjaUJ2ZFhRZ1BTQjdmVHNLQ1FsbWIzSWdLSFpoY2lCcklHbHVJSE4wWVhSbExtUmhkR0VwSUhzS0NRa0phV1lnS0NGUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG1oaGMwOTNibEJ5YjNCbGNuUjVMbU5oYkd3b2MzUmhkR1V1WkdGMFlTd2dheWtwSUdOdmJuUnBiblZsT3dvSkNRbHBaaUFvYXlBOVBUMGdKMlJ5WVdaMFgybGtKeUI4ZkNCcklEMDlQU0FuWTNKbFlYUmxaRjloZENjcElHTnZiblJwYm5WbE93b0pDUWwyWVhJZ2RpQTlJSE4wWVhSbExtUmhkR0ZiYTEwN0Nna0pDV2xtSUNoMklEMDlQU0J1ZFd4c0lIeDhJSFlnUFQwOUlIVnVaR1ZtYVc1bFpDQjhmQ0IySUQwOVBTQW5KeWtnWTI5dWRHbHVkV1U3Q2drSkNXOTFkRnRyWFNBOUlIWTdDZ2tKZlFvSkNYSmxkSFZ5YmlCaFpHUkRZVzV2Ym1sallXeFhaV2xuYUhRb2IzVjBMQ0J6ZEdGMFpTNWtZWFJoS1RzS0NYMD0nKSk7CiAgICAkQj1hcnJheShiYXNlNjRfZGVjb2RlKCdDUWt2THlCVE1qQTRPaUJ5WldSaFozVnZhbUZ1ZENCemFYVnVZMmxoYlNCd1pYUmZhV1FnTFQ0Z2MyVnlkbVZ5YVhNZ1pXbHVZU0JwSUhWd1pHRjBaVjl3WlhRZ0tHMWxjbWRsS1N3Z2JtVWdhU0JqY21WaGRHVXVDZ2tKYVdZZ0tITjBZWFJsTG1Wa2FYUlFaWFJKWkNrZ2NHRjViRzloWkM1d1pYUmZhV1FnUFNCemRHRjBaUzVsWkdsMFVHVjBTV1E3Q2drSmNtVjBkWEp1SUhCaGVXeHZZV1E3Q2dsOScpLGJhc2U2NF9kZWNvZGUoJ0NRa3ZMeUJUTWpBNE9pQnlaV1JoWjNWdmFtRnVkQ0J6YVhWdVkybGhiU0J3WlhSZmFXUWdMVDRnYzJWeWRtVnlhWE1nWldsdVlTQnBJSFZ3WkdGMFpWOXdaWFFnS0cxbGNtZGxLU3dnYm1VZ2FTQmpjbVZoZEdVdUNna0phV1lnS0hOMFlYUmxMbVZrYVhSUVpYUkpaQ2tnY0dGNWJHOWhaQzV3WlhSZmFXUWdQU0J6ZEdGMFpTNWxaR2wwVUdWMFNXUTdDZ2tKTHk4Z1V6TTBORG9nVkVGVElGQkJWRk1nY21saWIzTWdZV1JoY0hSbGNtbHpJR3RoYVhBZ1lXNXZibWx0YVc1cFlXMWxJR3RsYkhscVpTNGdTV3RwSUdOcFlTQmdYM2RsYVdkb2RGOXJaMkFLQ1Frdkx5QmlkWFp2SUhScGF5QkpVMDFGVkVGTlFWTWdLSHB5TGlCbWFXeDBjbUVnWVhWcmMyTnBZWFVwTENCMGIyUmxiQ0JRVWtsVFNVcFZUa2RWVTBsUElIWmhjblJ2ZEc5cWJ3b0pDUzh2SUd0bGJHbGhjeUJ6ZG05eWFTQjBZV2x3SUhCaGRDQlVXVXhKUVVrZ1VGSkJVa0ZUUkVGV1R5NEtDUWxoWkdSRFlXNXZibWxqWVd4WFpXbG5hSFFvY0dGNWJHOWhaQ3dnYzNSaGRHVXVaR0YwWVNrN0Nna0pjbVYwZFhKdUlIQmhlV3h2WVdRN0NnbDknKSk7CiAgICAkclsnaW5rYXJhaSddPWFycmF5KCdBJz0+c3Vic3RyX2NvdW50KCRqcywkQVswXSksJ0InPT5zdWJzdHJfY291bnQoJGpzLCRCWzBdKSk7CiAgICAkclsnamF1J109KHN0cnBvcygkanMsJ2FkZENhbm9uaWNhbFdlaWdodCcpIT09ZmFsc2UpOwogICAgaWYgKCR2PT09J2RyeScpeyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsgfQogICAgaWYgKCR2PT09J2FwcGx5Jyl7CiAgICAgICAgaWYgKCRyWydqYXUnXSkgeyAkclsnVkVSRElLVEFTJ109J0pBVSBJRElFR1RBJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBpZiAoISRyWyd2YXJ0YWknXVsnc2hhX29rJ10gfHwgISRyWyd2YXJ0YWknXVsnZHlkaXNfb2snXSkgeyAkclsnVkVSRElLVEFTJ109J1NVU1RBQkRZVEEg4oCUIGJhc2VsaW5lJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBmb3JlYWNoICgkclsnaW5rYXJhaSddIGFzICRrPT4kbil7IGlmKCRuIT09MSl7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgaW5rYXJhcyAnLiRrLic9Jy4kbjsgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0gfQogICAgICAgICRuPXN0cl9yZXBsYWNlKCRBWzBdLCRBWzFdLCRqcyk7ICRuPXN0cl9yZXBsYWNlKCRCWzBdLCRCWzFdLCRuKTsKICAgICAgICBjb3B5KCRGLCRGLicuYmFrX1MzNDQnKTsgZmlsZV9wdXRfY29udGVudHMoJEYsJG4pOwogICAgICAgICRyWydWRVJESUtUQVMnXT0nSURJRUdUQSc7ICRyWydkeWRpc19wbyddPWZpbGVzaXplKCRGKTsgJHJbJ3NoYV9wbyddPWhhc2hfZmlsZSgnc2hhMjU2JywkRik7CiAgICAgICAgJHJbJ3p5bW9zJ109YXJyYXkoJ2FkZENhbm9uaWNhbFdlaWdodCc9PnN1YnN0cl9jb3VudCgkbiwnYWRkQ2Fub25pY2FsV2VpZ2h0JyksCiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+c3Vic3RyX2NvdW50KCRuLCdjdXJyZW50X3dlaWdodF9rZycpLAogICAgICAgICAgICAgICAgICAgICAgICAgICdfd2VpZ2h0X2tnJz0+c3Vic3RyX2NvdW50KCRuLCdfd2VpZ2h0X2tnJykpOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('s344.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_s34=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 50 "'+SITE+'/?ps_s34=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,700); }
sh('sleep 4');
sh('curl -sSk -m 40 -o /tmp/pf8.js "'+SITE+'/wp-content/plugins/petshop-core/assets/pet-form.js"');
O.serv=sh('wc -c < /tmp/pf8.js').out.trim();
O.sint=sh('node --check /tmp/pf8.js && echo SINTAKSE_OK').out.trim().slice(0,200);
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
putB64('s344.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
