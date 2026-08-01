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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgTmF2IFZlcmlmeQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbnZmJ10pIHx8ICRfR0VUWydwc19udmYnXSAhPT0gJ052ZjJqJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PiduYXYtdmVyaWZ5LXYxJyk7CiAgICAkdSA9IGdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3MzMjlfdGVzdCcpOwogICAgaWYgKCEkdSkgeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmVyYScpKTsgZXhpdDsgfQogICAgJGNrID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHUtPklELCB0aW1lKCkrMzAwLCAnbG9nZ2VkX2luJyk7CgogICAgZm9yZWFjaCAoYXJyYXkoJ3Bhc2t5cmEnPT4nJywgJ2F1Z2ludGluaXMnPT4nYXVnaW50aW5pcycsICd1enNha3ltYWknPT4nb3JkZXJzJykgYXMgJHZhcmRhcz0+JGVwKSB7CiAgICAgICAgJHVybCA9ICRlcCA/IHdjX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCgkZXApIDogd2NfZ2V0X3BhZ2VfcGVybWFsaW5rKCdteWFjY291bnQnKTsKICAgICAgICAkcmVzcCA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT4zMCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsCiAgICAgICAgICAgICdoZWFkZXJzJz0+YXJyYXkoJ0Nvb2tpZSc9PkxPR0dFRF9JTl9DT09LSUUuJz0nLiRjaykpKTsKICAgICAgICBpZiAoaXNfd3BfZXJyb3IoJHJlc3ApKSB7ICRyWyR2YXJkYXNdID0gJ0VSUiAnLiRyZXNwLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBjb250aW51ZTsgfQogICAgICAgICRoID0gd3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHJlc3ApOwogICAgICAgICRyWyR2YXJkYXNdID0gYXJyYXkoCiAgICAgICAgICAgICd1cmwnICAgICAgICAgICAgPT4gJHVybCwKICAgICAgICAgICAgJ2tvZGFzJyAgICAgICAgICA9PiB3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcmVzcCksCiAgICAgICAgICAgICdteV9hY2NvdW50X25hdicgPT4gKHN0cnBvcygkaCwnbXktYWNjb3VudC1uYXYnKSAhPT0gZmFsc2UpLAogICAgICAgICAgICAnbmF2X3ZlcnRpY2FsJyAgID0+IChzdHJwb3MoJGgsJ25hdi12ZXJ0aWNhbCcpICE9PSBmYWxzZSksCiAgICAgICAgICAgICdmbGF0c29tZV93cmFwJyAgPT4gKHN0cnBvcygkaCwncGFnZS13cmFwcGVyIG15LWFjY291bnQnKSAhPT0gZmFsc2UpLAogICAgICAgICAgICAnYXZhdGFyYXMnICAgICAgID0+IChzdHJwb3MoJGgsJ2F2YXRhcicpICE9PSBmYWxzZSksCiAgICAgICAgICAgICdTa3lkZWxpcycgICAgICAgPT4gKHN0cnBvcygkaCwnU2t5ZGVsaXMnKSAhPT0gZmFsc2UpLAogICAgICAgICAgICAnU3ZlaWtpJyAgICAgICAgID0+IChzdHJwb3MoJGgsJ1N2ZWlraSwnKSAhPT0gZmFsc2UpLAogICAgICAgICAgICAnZXJyb3I0MDQnICAgICAgID0+IChzdHJwb3MoJGgsJ2Vycm9yNDA0JykgIT09IGZhbHNlKSwKICAgICAgICApOwogICAgICAgIGlmICgkdmFyZGFzID09PSAncGFza3lyYScpIHsKICAgICAgICAgICAgJGkgPSBzdHJwb3MoJGgsICdteS1hY2NvdW50LW5hdicpOwogICAgICAgICAgICAkclsnbmF2X2ZyYWdtZW50YXMnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGgsIG1heCgwLCRpLTUwMCksIDE4MDApIDogJ25lcmFzdGEnOwogICAgICAgIH0KICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Nav Verify',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('navverify.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_nvf=Nvf2j"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
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
putB64('navverify.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
