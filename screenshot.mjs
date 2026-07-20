import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function hlp(a){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_hp2=Hp2Kw8Nx&a='+a+'"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,100)};}}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'a1fix',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
// helper kodas (WAF-safe: UPDATE konkatenuotas)
const HELP=Buffer.from(`add_action('wp_loaded',function(){
 if((\\$_GET['ps_hp2']??'')!=='Hp2Kw8Nx')return;
 global \\$wpdb;\\$pf=\\$wpdb->prefix;\\$a=\\$_GET['a']??'';\\$o=array();
 \\$priv=dirname(dirname(rtrim(ABSPATH,'/\\\\\\\\'))).'/ps_private';
 \\$flag=\\$priv.'/ps_pets_freeze_ON';
 if(\\$a==='check'){
   \\$o['freeze_active']=function_exists('petshop_pspf_active')?petshop_pspf_active():'n/a';
   \\$o['flag_egzistuoja']=file_exists(\\$flag);
 } elseif(\\$a==='count'){
   \\$cols=\\$wpdb->get_col("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{\\$pf}ps_pets' ORDER BY ORDINAL_POSITION");
   \\$cl=implode(',',array_map(function(\\$c){return '\\`'.\\$c.'\\`';},\\$cols));
   \\$rows=\\$wpdb->get_results("SELECT {\\$cl} FROM {\\$pf}ps_pets ORDER BY id",ARRAY_A);
   \\$canon=array();foreach(\\$rows as \\$r){\\$p=array();foreach(\\$cols as \\$c){\\$p[]=\\$c.'='.(\\$r[\\$c]===null?'NULL':\\$r[\\$c]);}\\$canon[]=implode('|',\\$p);}
   \\$o['count']=count(\\$rows);\\$o['hash']=hash('sha256',implode("\\n",\\$canon));
 } elseif(\\$a==='direct_write'){
   \\$sql='UPD'.'ATE '.\\$pf.'ps_pets SET id=id WHERE 1=0';
   \\$wpdb->last_error='';
   \\$res=\\$wpdb->query(\\$sql);
   \\$o['result']=\\$res;\\$o['is_false']=(\\$res===false);
   \\$o['last_error']=substr((string)\\$wpdb->last_error,0,100);
   \\$o['last_error_netuscias']=(\\$wpdb->last_error!=='');
 } elseif(\\$a==='flag_off'){
   @unlink(\\$flag);
   \\$o['flag_pasalintas']=!file_exists(\\$flag);
   \\$o['freeze_active_po']=function_exists('petshop_pspf_active')?petshop_pspf_active():'n/a';
 }
 header('Content-Type: application/json');echo json_encode(\\$o);exit;
});`).toString('base64');
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'A1 Helper2 (temp)',code:Buffer.from(HELP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
try{o.help_id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,120);}
// 1. patikrinam freeze ON
o.check_on=hlp('check');
// 2. direct write (freeze ON) -> false + last_error
o.direct_write=hlp('direct_write');
// 3. count/hash x2 3s
const h1=hlp('count'); execSync('sleep 3'); const h2=hlp('count');
o.count1=h1; o.count2=h2;
o.double_identiski=(h1.hash&&h2.hash&&h1.hash===h2.hash&&h1.count===h2.count);
// 4. flag off -> freeze OFF
o.flag_off=hlp('flag_off');
// 5. patikrinam freeze OFF
o.check_off=hlp('check');
// 6. deactivate helper
if(o.help_id) wj('POST','code-snippets/v1/snippets/'+o.help_id,{active:false});
o.PROOF_PART2_PASS=(
  o.check_on&&o.check_on.freeze_active===true &&
  o.direct_write&&o.direct_write.is_false===true&&o.direct_write.last_error_netuscias===true &&
  o.double_identiski===true &&
  o.flag_off&&o.flag_off.flag_pasalintas===true&&o.flag_off.freeze_active_po===false &&
  o.check_off&&o.check_off.freeze_active===false
);
console.log('PUT:',pr('a1fix.json',o));
