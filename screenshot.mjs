import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={};
const r=sh('curl -sSk '+AUTH+' "'+API+'/472"').out;
try{
 const j=JSON.parse(r); const c=String(j.code);
 O.full_code_b64=Buffer.from(c).toString('base64');
 O.hooks=[...new Set((c.match(/add_(?:action|filter)\s*\(\s*['"][^'"]+['"]/g)||[]).map(x=>x.replace(/\s+/g,'')))];
 O.writes=[...new Set((c.match(/wp_set_object_terms|update_post_meta|wp_insert_term|\$wpdb->(?:query|update|insert|delete)|wp_update_post/g)||[]))];
 O.guards=[...new Set((c.match(/\$_GET\[[^\]]+\]|current_user_can\([^)]*\)|is_user_logged_in\(\)|is_admin\(\)|WP_CLI|defined\([^)]*\)/g)||[]))].slice(0,20);
}catch(e){ O.err=r.slice(0,300); }
putB64('s472.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
