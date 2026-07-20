import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
const B='https://dev.avesa.lt/wp-json/petshop/v1';
function hlp(a){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_hp=HpKw8Nx&a='+a+'"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,120)};}}
function req(method,url,extra){
  let cmd='curl -sk -o /tmp/rr -w "%{http_code}" '+AUTH+' -X '+method+' '+(extra||'')+' "'+url+'"';
  const c=execSync(cmd,{maxBuffer:10*1024*1024}).toString().trim();
  return {code:c, body:fs.readFileSync('/tmp/rr','utf8').slice(0,100)};
}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'a1proof',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
// baseline pries
o.before=hlp('count');
// --- REST testai (BE bypass antraštės -> guard blokuoja) ---
fs.writeFileSync('/tmp/empty.json','{}');
o.post_profile      = req('POST',   B+'/pet-profile', '-H "Content-Type: application/json" -d @/tmp/empty.json');           // tuscias payload
o.patch_profile     = req('PATCH',  B+'/pet-profile/999999999', '-H "Content-Type: application/json" -d @/tmp/empty.json'); // neegz pet_id
o.delete_profile    = req('DELETE', B+'/pet-profile/999999999');
o.post_photo        = req('POST',   B+'/pet-photo/999999999', '-H "Content-Type: application/json" -d @/tmp/empty.json');
// override scenarijai
o.post_override_get = req('POST',   B+'/pet-profile', '-H "X-HTTP-Method-Override: GET" -H "Content-Type: application/json" -d @/tmp/empty.json'); // POST+override GET -> 503
o.get_override_del  = req('GET',    B+'/pet-profile/999999999', '-H "X-HTTP-Method-Override: DELETE"');                     // GET+override DELETE -> 503
// paprastas GET (read) -> ne 503
o.get_plain         = req('GET',    'https://dev.avesa.lt/wp-json/petshop/v1/');
// --- tiesioginis $wpdb write (nedestruktyvus no-op) -> false + last_error ---
o.direct_write=hlp('direct_write');
// --- count/hash nepakito + dvigubas 3s ---
o.after=hlp('count');
o.write_nepakeite=(o.before&&o.after&&o.before.count===o.after.count&&o.before.hash===o.after.hash);
const h1=hlp('count'); execSync('sleep 3'); const h2=hlp('count');
o.double={c1:h1.count,c2:h2.count,identiski:(h1.hash===h2.hash&&h1.count===h2.count)};
// --- verdiktas ---
o.PROOF_PASS=(
  o.post_profile.code==='503' && o.patch_profile.code==='503' && o.delete_profile.code==='503' &&
  o.post_photo.code==='503' && o.post_override_get.code==='503' && o.get_override_del.code==='503' &&
  o.get_plain.code==='200' &&
  o.direct_write && o.direct_write.is_false===true && o.direct_write.last_error_netuscias===true &&
  o.write_nepakeite===true && o.double.identiski===true
);
// --- flag OFF (proof pabaiga) ---
o.flag_off=hlp('flag_off');
console.log('PUT:',pr('a1proof.json',o));
