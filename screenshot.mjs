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
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBEZXBsb3kKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2RwNSddKSB8fCAkX0dFVFsncHNfZHA1J10gIT09ICdEcDVxMicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidpMThuLWRlcGxveS12MScpOwogICAgJHN0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICAgJHZhcmRhcyA9ICdQZXRzaG9wIFVJIExva2FsaXphY2lqYSB2MSAoTElWRSknOwogICAgJGVzID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NICRzdCBXSEVSRSBuYW1lPSVzIiwgJHZhcmRhcykpOwogICAgJGtvZGFzID0gYmFzZTY0X2RlY29kZSgnTHlvcUNpQXFJRkJsZEhOb2IzQWdWVWtnVEc5cllXeHBlbUZqYVdwaElIWXhJQ2hNU1ZaRktRb2dLZ29nS2lCV1pYTEVqV2xoSUZSSlN5QjBkVzl6SUhSbGEzTjBkWE1zSUd0MWNtbkZzeUJqWVd4c0xYTnBkR1VnWW5WMmJ5Qkp4YUJOUVZSVlQxUkJVeUJsYlhCcGNtbkZvV3RoYVFvZ0tpQW9WVWtnVEc5allXeHBlbUYwYVc5dUlGSjFiblJwYldVZ1FYVmthWFFnZGpJNklHdGxkSFZ5YVNCbWFXeDBjbUZwTENBNUlIQjFjMnhoY0dsaGFTd2dZMkZqYUdVZ1lubHdZWE56S1M0S0lDb0tJQ29nNHBpRklGSkJTMVJCVXlEaWdKUWdSRTlOUlU1QlV5QlFTVkpOUVZNc0lIUmhaR0VnZEdWcmMzUmhjeTRnVUhKcFpjVytZWE4wYVhNNklHQlRkV0p0YVhSZ0lHVm5lbWx6ZEhWdmFtRUtJQ29nSUNCRVZrbEZTbFZQVTBVZ1pHOXRaVzUxYjNObElITnJhWEowYVc1bmIyMXBjeUJ5WldscnhhRnR4SmR0YVhNNkNpQXFJQ0FnSUNCbWJHRjBjMjl0WlNBZ0lDQWdLREUzZUNrZ1BTQndZV2xseGFGcmIzTWdiWGxuZEhWcllYTWdJQzArSU9LQW5rbGx4YUZyYjNScElnb2dLaUFnSUNBZ2QzQm1iM0p0Y3kxc2FYUmxJQ2d4TVhncElEMGdabTl5Ylc5eklITnBkVzUwYVcxaGN5QWdJQzArSU9LQW5sTnB4Yk56ZEdraUNpQXFJQ0FnUjJ4dlltRnNhU0JzWlc1MFpXekVseUJ3WVdkaGJDQjBaV3R6ZE1TRklHcDFiM01nYzNWd2JHRnJkTVd6TGdvZ0tnb2dLaURpbUlVZ1U4U0VUVTlPU1U1SFFVa2dUa1hFcmxSU1FWVkxWRUVnS0ZKaGFXMXBieUJ6Y0hKbGJtUnBiV0Z6SURJd01qWXRNRGd0TURFcE9nb2dLaUFnSUMwZ1JtOXNiRzkzSUc5dUlFWmhZMlZpYjI5ckwwbHVjM1JoWjNKaGJTOVVkMmwwZEdWeUxDQlRaVzVrSUhWeklHRnVJR1Z0WVdsc0lPS0FsQ0JwYTI5dWIzTUtJQ29nSUNBZ0lGQkJVMHpFbGxCVVQxTWdjR1Z5SUhSb1pXMWxYMjF2WkhNZ0tIWnBjMjl6SUd0bGRIVnlhVzl6SUdKMWRtOGdjR3hoWTJWb2IyeGtaWEluYVdGcEtTd0tJQ29nSUNBZ0lIUnZaTVNYYkNCMlpYSjBhVzFoYVNCaXhhdDB4Yk1nYm1WbmVYWmhjeUJyYjJSaGN5NEtJQ29nSUNBdElFNWxlSFFnTHlCUWNtVjJhVzkxY3lBb1pteGhkSE52YldVc0lEbDRLU0RpZ0pRZ2RtbGxiaUJrYjIxbGJtRnpJRTVGUjBGU1FVNVVWVTlLUVN3Z2EyRmtJSFJoYVFvZ0tpQWdJQ0FnY0hWemJHRndhV0YyYVcxaGN5NGdSbXhoZEhOdmJXVWdkSFZ2Y3lCd1ljU05hWFZ6SUhSbGEzTjBkWE1nYm1GMVpHOXFZU0JyWVhKMWMyVnN4SmR6WlN3S0lDb2dJQ0FnSUdkaGJHVnlhV3B2YzJVZ2FYSWdjMnhoYm10cGEyeHBkVzl6WlM0ZzRvQ2VTMmwwWVhNZ2NIVnpiR0Z3YVhNaUlHZGhiR1Z5YVdwdmFtVWdZc1dyZE1XekNpQXFJQ0FnSUNCTFRFRkpSRWxPUjBGVElIQnlhV1ZwYm1GdGRXMXZJSFJsYTNOMFlYTXVJRkpsYVd0cFlTQmxiR1Z0Wlc1MGJ5QnNlV2RwYnlERXIzSnZaSGx0Ynk0S0lDb2dJQ0F0SUdBbGRpQkJaR1FnZEc4Z1kyRnlkQ0IwYnlCamIyNTBhVzUxWlNab1pXeHNhWEE3WUNBb2JXbDRMV0Z1WkMxdFlYUmphQ2tnNG9DVUlHNWxZV25Gb1d0MUxDQnJkVzhLSUNvZ0lDQWdJSEJoYTJWcHhJMXBZVzFoY3lBbGRpQnBjaUJoY2lCMFpXdHpkR0Z6SUdGd2MydHlhWFJoYVNCeWIyUnZiV0Z6TGlCQ1pTQm1jbTl1ZEMxbGJtUWdjR0YyZVhwa3hiNXBid29nS2lBZ0lDQWdkbVZ5ZEdsdGJ5QnlZV3RwYm5ScElHNWxaMkZzYVcxaExnb2dLZ29nS2lEaW1JVWdUa1ZNU1VYRWpFbEJUVUVnNG9DVUlFcEJWU0JKeGFCV1JWSlRWRUVnS0hCbGNuSmh4YUY1YldGeklITjFaMkZrYVc1MHhiTWdkbVZwYTJsaGJuVEVyeUJrWVd4NWE4U0ZLVG9LSUNvZ0lDQmdRV1JrSUhSdklHTmhjblJnSUNodGVXZDBkV3R2SUhSbGEzTjBZWE1wTENCZ1EyaGxZMnR2ZFhSZ0lDaGhZblVnYTI5dWRHVnJjM1JoYVNrc0lHQkdhV3gwWlhKZ0xnb2dLaUFnSU1TTWFXRWdkbVZ5eEkxcFlXMWhjeUJVU1VzZ1lFRmtaQ0IwYnlCallYSjBPaUFtYkdSeGRXODdKWE1tY21SeGRXODdZQ0RpZ0pRZ1lYUnphMmx5WVhNZ1pHbHVZVzFwYm1sekNpQXFJQ0FnWVhKcFlTMXNZV0psYkNCemRTQndjbVZyeEpkeklIQmhkbUZrYVc1cGJYVXNJRzVsSUcxNVozUjFhMkZ6TGlCZ0pYTmdJRkJTU1ZaQlRFOGdhY1doYkdscmRHa3VDaUFxQ2lBcUlPS1loU0JPUlNCUVJWSWdSMFZVVkVWWVZDQW9kSFpoY210dmJXRWdhMmwwZFhJc0lHNWxJTVNOYVdFcE9nb2dLaUFnSUdCVGFXZHVJSFZ3SUdadmNpQk9aWGR6YkdWMGRHVnlZQ0RpZ0pRZ1JteGhkSE52YldVZ1RsVlRWRUZVV1UzRnNpQnVkVzFoZEhsMGIycHBJSEpsYVd2Rm9XM0VseTRLSUNvZ0lDQkRiMjF3YkdsaGJub2dWRU5HSUhSbGEzTjBZWE1nNG9DVUlIQmxjaUJEYjIxd2JHbGhibm9nYm5WemRHRjBlVzExY3k0S0lDb3ZDZ3BwWmlBb0lDRWdablZ1WTNScGIyNWZaWGhwYzNSektDQW5jR1YwYzJodmNGOXBNVGh1WDIxaGNDY2dLU0FwSUhzS0NXWjFibU4wYVc5dUlIQmxkSE5vYjNCZmFURTRibDl0WVhBb0tTQjdDZ2tKY21WMGRYSnVJR0Z5Y21GNUtBb0pDUWtuWm14aGRITnZiV1VuSUQwK0lHRnljbUY1S0FvSkNRa0pKMU4xWW0xcGRDY2dJQ0FnSUNBZ0lDQTlQaUFuU1dYRm9XdHZkR2tuTEFvSkNRa0pKMDFsYm5VbklDQWdJQ0FnSUNBZ0lDQTlQaUFuVFdWdWFYVW5MQW9KQ1FrSkowZHZJSFJ2SUhSdmNDY2dJQ0FnSUNBOVBpQW5SM0xFcjhXK2RHa2d4SzhnY0hWemJHRndhVzhnZG1seXhhSEZzeWNzQ2drSkNRa25VR0Y1YldWdWRDQnBZMjl1Y3ljZ0lEMCtJQ2ROYjJ2RWwycHBiVzhnWXNXclpHRnBKeXdLQ1FrSkNTZERhR1ZqYTI5MWRDQnpkR1Z3Y3ljZ1BUNGdKMEYwYzJsemEyRnBkSGx0YnlCbGFXZGhKeXdLQ1FrSktTd0tDUWtKSjNkd1ptOXliWE10YkdsMFpTY2dQVDRnWVhKeVlYa29DZ2tKQ1FrblUzVmliV2wwSnlBOVBpQW5VMm5GczNOMGFTY3NDZ2tKQ1Nrc0Nna0pDU2QzYjI5amIyMXRaWEpqWlNjZ1BUNGdZWEp5WVhrb0Nna0pDUWtuVUhKdlpIVmpkQ0JRWVdkcGJtRjBhVzl1SnlBZ0lDQWdJQ0FnSUNBZ1BUNGdKMUJ5Wld0cHhiTWdjSFZ6YkdGd2FjV3pJRzVoZG1sbllXTnBhbUVuTEFvSkNRa0pKMEZrWkNCMGJ5QmpZWEowT2lBbWJHUnhkVzg3SlhNbWNtUnhkVzg3SnlBOVBpQW54SzVreEpkMGFTREVyeUJyY21Wd3hhRmxiTVN2T2lEaWdKNGxjK0tBbkNjc0Nna0pDU2tzQ2drSkNTZGpiMjF3YkdsaGJub3RaMlJ3Y2ljZ1BUNGdZWEp5WVhrb0Nna0pDUWtuUTJ4dmMyVWdaR2xoYkc5bkp5QTlQaUFuVmNXK1pHRnllWFJwSUdScFlXeHZaOFNGSnl3S0NRa0pLU3dLQ1FrcE93b0pmUW9LQ1M4cUtpQlRkU0JyYjI1MFpXdHpkSFU2SUdSdmJXVnVZWE1nUFQ0Z2EyOXVkR1ZyYzNSaGN5QTlQaUIwWld0emRHRnpJRDArSUhabGNuUnBiV0Z6SUNvdkNnbG1kVzVqZEdsdmJpQndaWFJ6YUc5d1gya3hPRzVmYldGd1gyTjBlQ2dwSUhzS0NRbHlaWFIxY200Z1lYSnlZWGtvQ2drSkNTZDNiMjlqYjIxdFpYSmpaU2NnUFQ0Z1lYSnlZWGtvQ2drSkNRa25ZbXh2WTJzZ2RHbDBiR1VuSUQwK0lHRnljbUY1S0FvSkNRa0pDU2REYkdWaGNpQm1hV3gwWlhKekp5QTlQaUFuU2NXaGRtRnNlWFJwSUdacGJIUnlkWE1uTEFvSkNRa0pLU3dLQ1FrSktTd0tDUWtKSjNscGRHZ3RkMjl2WTI5dGJXVnlZMlV0WVdwaGVDMXVZWFpwWjJGMGFXOXVKeUE5UGlCaGNuSmhlU2dLQ1FrSkNTZGJSbEpQVGxSRlRrUmRJRk5vYjNjZ2JXOXlaU0JzYVc1cklHOXVJSFJoZUNCbWFXeDBaWEp6SnlBOVBpQmhjbkpoZVNnS0NRa0pDUWtuVTJodmR5QnRiM0psSnlBOVBpQW5VbTlrZVhScElHUmhkV2RwWVhVbkxBb0pDUWtKS1N3S0NRa0pLU3dLQ1FrcE93b0pmUXA5Q2dwaFpHUmZabWxzZEdWeUtBb0pKMmRsZEhSbGVIUW5MQW9KYzNSaGRHbGpJR1oxYm1OMGFXOXVJQ2dnSkhabGNuUnBiV0Z6TENBa2RHVnJjM1JoY3l3Z0pHUnZiV0ZwYmlBcElIc0tDUWtrYldGd0lEMGdjR1YwYzJodmNGOXBNVGh1WDIxaGNDZ3BPd29KQ1dsbUlDZ2dhWE56WlhRb0lDUnRZWEJiSUNSa2IyMWhhVzRnWFZzZ0pIUmxhM04wWVhNZ1hTQXBJQ2tnZXdvSkNRbHlaWFIxY200Z0pHMWhjRnNnSkdSdmJXRnBiaUJkV3lBa2RHVnJjM1JoY3lCZE93b0pDWDBLQ1FseVpYUjFjbTRnSkhabGNuUnBiV0Z6T3dvSmZTd0tDVEl3TEFvSk13b3BPd29LWVdSa1gyWnBiSFJsY2lnS0NTZG5aWFIwWlhoMFgzZHBkR2hmWTI5dWRHVjRkQ2NzQ2dsemRHRjBhV01nWm5WdVkzUnBiMjRnS0NBa2RtVnlkR2x0WVhNc0lDUjBaV3R6ZEdGekxDQWtZMjl1ZEdWNGRDd2dKR1J2YldGcGJpQXBJSHNLQ1Fra2JXRndJRDBnY0dWMGMyaHZjRjlwTVRodVgyMWhjRjlqZEhnb0tUc0tDUWxwWmlBb0lHbHpjMlYwS0NBa2JXRndXeUFrWkc5dFlXbHVJRjFiSUNSamIyNTBaWGgwSUYxYklDUjBaV3R6ZEdGeklGMGdLU0FwSUhzS0NRa0pjbVYwZFhKdUlDUnRZWEJiSUNSa2IyMWhhVzRnWFZzZ0pHTnZiblJsZUhRZ1hWc2dKSFJsYTNOMFlYTWdYVHNLQ1FsOUNna0pjbVYwZFhKdUlDUjJaWEowYVcxaGN6c0tDWDBzQ2dreU1Dd0tDVFFLS1RzSycpOwogICAgaWYgKCRlcykgewogICAgICAgICR3cGRiLT51cGRhdGUoJHN0LCBhcnJheSgnY29kZSc9PiRrb2RhcywnYWN0aXZlJz0+MSwnbW9kaWZpZWQnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpLCBhcnJheSgnaWQnPT4kZXMtPmlkKSk7CiAgICAgICAgJHJbJ2F0bmF1amludGFzJ10gPSAkZXMtPmlkOwogICAgfSBlbHNlIHsKICAgICAgICAkd3BkYi0+aW5zZXJ0KCRzdCwgYXJyYXkoJ25hbWUnPT4kdmFyZGFzLCdjb2RlJz0+JGtvZGFzLCdzY29wZSc9PidnbG9iYWwnLCdhY3RpdmUnPT4xLAogICAgICAgICAgICAncHJpb3JpdHknPT4xMCwnZGVzY3JpcHRpb24nPT4nJywndGFncyc9PicnLCdtb2RpZmllZCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSkpOwogICAgICAgICRyWydzdWt1cnRhcyddID0gKGludCkgJHdwZGItPmluc2VydF9pZDsKICAgIH0KICAgIHdwX2NhY2hlX2ZsdXNoKCk7CiAgICAkclsncGF0aWtyYSddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoCiAgICAgICAgIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgaWxnaXMgRlJPTSAkc3QgV0hFUkUgbmFtZT0lcyIsICR2YXJkYXMpLCBBUlJBWV9BKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('i18ndeploy.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_dp5=Dp5q2"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 5');
// PATIKRA tikrame HTML
function get(u){ return sh('curl -sSk -m 45 -H "Cache-Control: no-cache" "'+u+'?nc='+Date.now()+'"').out; }
const hp = get(SITE+'/parduotuve/');
const hh = get(SITE+'/');
const hk = get(SITE+'/kontaktai/');
O.patikra = {
  Show_more_liko:      (hp.match(/Show more/g)||[]).length,
  Rodyti_daugiau:      (hp.match(/Rodyti daugiau/g)||[]).length,
  Add_to_cart_aria:    (hp.match(/Add to cart:/g)||[]).length,
  Ideti_i_krepseli:    (hp.match(/Įdėti į krepšelį:/g)||[]).length,
  Submit_liko_home:    (hh.match(/>Submit</g)||[]).length + (hh.match(/aria-label="Submit"/g)||[]).length,
  Ieskoti_home:        (hh.match(/aria-label="Ieškoti"/g)||[]).length,
  Menu_liko:           (hh.match(/aria-label="Menu"/g)||[]).length,
  Meniu_lt:            (hh.match(/aria-label="Meniu"/g)||[]).length,
  Go_to_top_liko:      (hh.match(/Go to top/g)||[]).length,
  Grizti_i_virsu:      (hh.match(/Grįžti į puslapio viršų/g)||[]).length,
  Payment_icons_liko:  (hh.match(/Payment icons/g)||[]).length,
  Mokejimo_budai:      (hh.match(/Mokėjimo būdai/g)||[]).length,
  Kontaktu_Submit:     (hk.match(/Submit/g)||[]).length,
  Kontaktu_Siusti:     (hk.match(/Siųsti/g)||[]).length,
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
putB64('i18ndeploy.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
