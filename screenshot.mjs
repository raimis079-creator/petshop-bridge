import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function hlp(a){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_mu=MuKw8Nx&a='+a+'"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,120)};}}
function code(method,url,body){
  let cmd='curl -sk -o /tmp/r -w "%{http_code}" '+AUTH+' -X '+method+' "'+url+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',body); cmd='curl -sk -o /tmp/r -w "%{http_code}" '+AUTH+' -X '+method+' -H "Content-Type: application/json" -d @/tmp/b.json "'+url+'"'; }
  const c=execSync(cmd,{maxBuffer:10*1024*1024}).toString().trim();
  return {code:c, body:fs.readFileSync('/tmp/r','utf8').slice(0,120)};
}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'muproof',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const B='https://dev.avesa.lt/wp-json/petshop/v1';
const o={};
o.before=hlp('count');
o.flag_on=hlp('flag_on');
// PROOF is atskiru request'u:
o.post_profile=code('POST',B+'/pet-profile','{"species":"cat","pet_name":"FREEZE_TEST"}');
o.patch_profile=code('PATCH',B+'/pet-profile/999999','{"pet_name":"X"}');
o.delete_profile=code('DELETE',B+'/pet-profile/999999');
o.post_photo=code('POST',B+'/pet-photo/999999','{}');
o.get_namespace=code('GET','https://dev.avesa.lt/wp-json/petshop/v1/');
o.test_direct_write=hlp('test_write');
o.after=hlp('count');
o.write_blocked_count=(o.before&&o.after&&o.before.count===o.after.count);
const h1=hlp('count'); execSync('sleep 3'); const h2=hlp('count');
o.double={c1:h1.count,c2:h2.count,LYGUS:(h1.hash===h2.hash && h1.count===h2.count)};
o.flag_off=hlp('flag_off');
// verdiktas
o.PROOF_PASS=(
  o.post_profile.code==='503' && o.patch_profile.code==='503' && o.delete_profile.code==='503' &&
  o.post_photo.code==='503' && o.get_namespace.code==='200' &&
  o.test_direct_write && o.test_direct_write.blocked===true &&
  o.write_blocked_count===true && o.double.LYGUS===true
);
console.log('PUT:',pr('muproof.json',o));
