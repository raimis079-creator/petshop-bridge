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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgVGVtcGxhdGUgRml4CiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc190ZjMnXSkgfHwgJF9HRVRbJ3BzX3RmMyddICE9PSAnVGYzZzgnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4ndHBsLWZpeC12MScpOwoKICAgIC8vIGFyIEZsYXRzb21lIHNhYmxvbmFzIHRpa3JhaSB5cmEKICAgICRmbCA9IGdldF90ZW1wbGF0ZV9kaXJlY3RvcnkoKS4nL3BhZ2UtbXktYWNjb3VudC5waHAnOwogICAgJHJbJ2ZsYXRzb21lX3NhYmxvbmFzJ10gPSBpc19yZWFkYWJsZSgkZmwpID8gZmlsZXNpemUoJGZsKSA6ICdORVJBJzsKCiAgICAkc3QgPSAkd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgICAkdmFyZGFzID0gJ1BldHNob3AgUGFza3lyb3MgU2FibG9uYXMgdjEgKExJVkUpJzsKICAgICRlcyA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQgRlJPTSAkc3QgV0hFUkUgbmFtZT0lcyIsICR2YXJkYXMpKTsKICAgIGlmICghJGVzKSB7CiAgICAgICAgJHdwZGItPmluc2VydCgkc3QsIGFycmF5KCduYW1lJz0+JHZhcmRhcywnY29kZSc9PmJhc2U2NF9kZWNvZGUoJ0x5b3FDaUFxSUZCbGRITm9iM0FnVUdGemEzbHliM01nVTJGaWJHOXVZWE1nZGpFZ0tFeEpWa1VwQ2lBcUNpQXFJRkJTU1VWYVFWTlVTVk02SUVac1lYUnpiMjFsSUd0aGFYSjVhbWtnY0dGemEzbHliM01nYldWdWFYVWdLR0FqYlhrdFlXTmpiM1Z1ZEMxdVlYWmdMQ0J1WVhZdGRtVnlkR2xqWVd3cENpQXFJSEpsYm1SbGNtbHVZU0JtWVdsc1lYTWdZR1pzWVhSemIyMWxMM0JoWjJVdGJYa3RZV05qYjNWdWRDNXdhSEJnTGlCVVlXa2dWMjl5WkZCeVpYTnpJR0J3WVdkbExYdHpiSFZuZlM1d2FIQmdDaUFxSUhOaFlteHZibUZ6SU9LQWxDQnFhWE1nY0dGeVpXNXJZVzFoY3lCUVFVZEJUQ0JRVlZOTVFWQkpUeUJUVEZWSEowRXVJRkJoYTJWcGRIVnpJSE5zZFdjbllTQnBjd29nS2lCZ2JYa3RZV05qYjNWdWRHQWdhU0JnY0dGemEzbHlZV0FnS0ZNek1qa3BMQ0JYVUNCdVpXSmxkSFZ5YVNCZ2NHRm5aUzF3WVhOcmVYSmhMbkJvY0dBZ2FYSWdhM0pwYm5SaElHa0tJQ29nWW1WdVpISmhJR0J3WVdkbExuQm9jR0FnNG9DVUlHdGhhWEo1YzJseklITnJlV1JsYkdseklFUkpUa2RUVkVFdUNpQXFDaUFxSUZOUVVrVk9SRWxOUVZNNklHNTFhM0psYVhCcFlXMGdjMkZpYkc5dVlTQndZV2RoYkNCcGMxOWhZMk52ZFc1MFgzQmhaMlVvS1N3Z1RrVWdjR0ZuWVd3Z2MyeDFaeWRoTGdvZ0tpQlVaVzF2Y3lCbVlXbHNZWE1nVGtWRVZVSk1TVlZQU2tGTlFWTWdLR3RwZEdGcGNDQkdiR0YwYzI5dFpTQmhkRzVoZFdwcGJtbHRZV2tnYm5WbGFYUjFJSEJ5YnlCellXeHBLU3dLSUNvZ2FYSWdZWFJsYVhSNWFtVWdjMngxWnlkaElHZGhiR2x0WVNCclpXbHpkR2tnYkdGcGMzWmhhU0RpZ0pRZ2MybHpJR3RoWW14cGRXdGhjeUJ1WlhOMWJIVnpMZ29nS2dvZ0tpQnBjMTloWTJOdmRXNTBYM0JoWjJVb0tTQjBaV2x6YVc1bllTQnBjaUJsYm1Sd2IybHVkQ2RoYlhNNklHbHJhU0JUTXpJNUlIWnBjMmtnTDIxNUxXRmpZMjkxYm5Rdktnb2dLaUJoWkhKbGMyRnBJR0oxZG04Z1ZFRlRJRkJCVkZNZ2NIVnpiR0Z3YVhNc0lIUmhaQ0J3WVdkbExXMTVMV0ZqWTI5MWJuUXVjR2h3SUdKMWRtOGdibUYxWkc5cVlXMWhjd29nS2lCMmFYTjFjaTRnVTJseklHWnBiSFJ5WVhNZ1lYUnJkWEpwWVNCVVNVdFRURWxCU1NCMFlTQndZV05wWVNCbGJHZHpaVzVoTGdvZ0tpOEtZV1JrWDJacGJIUmxjaWdLQ1NkMFpXMXdiR0YwWlY5cGJtTnNkV1JsSnl3S0NYTjBZWFJwWXlCbWRXNWpkR2x2YmlBb0lDUjBaVzF3YkdGMFpTQXBJSHNLQ1FscFppQW9JQ0VnWm5WdVkzUnBiMjVmWlhocGMzUnpLQ0FuYVhOZllXTmpiM1Z1ZEY5d1lXZGxKeUFwSUh4OElDRWdhWE5mWVdOamIzVnVkRjl3WVdkbEtDa2dLU0I3Q2drSkNYSmxkSFZ5YmlBa2RHVnRjR3hoZEdVN0Nna0pmUW9KQ1NSbWJHRjBjMjl0WlNBOUlHZGxkRjkwWlcxd2JHRjBaVjlrYVhKbFkzUnZjbmtvS1NBdUlDY3ZjR0ZuWlMxdGVTMWhZMk52ZFc1MExuQm9jQ2M3Q2drSmNtVjBkWEp1SUdselgzSmxZV1JoWW14bEtDQWtabXhoZEhOdmJXVWdLU0EvSUNSbWJHRjBjMjl0WlNBNklDUjBaVzF3YkdGMFpUc0tDWDBzQ2drNU9Rb3BPd289JyksCiAgICAgICAgICAgICdzY29wZSc9PidnbG9iYWwnLCdhY3RpdmUnPT4xLCdwcmlvcml0eSc9PjEwLCdkZXNjcmlwdGlvbic9PicnLCd0YWdzJz0+JycsCiAgICAgICAgICAgICdtb2RpZmllZCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSkpOwogICAgICAgICRyWydzbmlwcGV0X2lkJ10gPSAoaW50KSAkd3BkYi0+aW5zZXJ0X2lkOwogICAgfSBlbHNlIHsgJHJbJ2phdV9idXZvJ10gPSAkZXMtPmlkOyB9CiAgICB3cF9jYWNoZV9mbHVzaCgpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Template Fix',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('tplfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_tf3=Tf3g8"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 6');
// PATIKRA: ar kairysis meniu grizo (be auth — struktura matosi ir svečiui? ne, reikia auth)
const h = sh('curl -sSk -m 40 "'+SITE+'/paskyra/"').out;
O.svecio_ilgis = h.length;
O.turi_nav_vertical = (h.indexOf('nav-vertical') >= 0);
O.turi_my_account_nav = (h.indexOf('my-account-nav') >= 0);
O.turi_page_wrapper = (h.indexOf('page-wrapper my-account') >= 0);
O.kodai = {
  paskyra: sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/paskyra/"').out.trim(),
  augintinis: sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/paskyra/augintinis/"').out.trim(),
  home: sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim(),
};
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
putB64('tplfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
