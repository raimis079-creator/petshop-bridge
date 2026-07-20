import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=`-u "${U}:${P}"`;
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync(`echo ${b}|base64 -d|curl -sk ${AUTH} -X ${m} -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/${path}"`,{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'freeze',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pj.json "${u}"`).toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const GUARD='YWRkX2ZpbHRlcigncmVzdF9wcmVfZGlzcGF0Y2gnLCBmdW5jdGlvbigkcmVzdWx0LCAkc2VydmVyLCAkcmVxdWVzdCl7CglpZiAoZ2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpICE9PSAnMScpIHJldHVybiAkcmVzdWx0OwoJJHJvdXRlID0gJHJlcXVlc3QtPmdldF9yb3V0ZSgpOwoJJG1ldGhvZCA9ICRyZXF1ZXN0LT5nZXRfbWV0aG9kKCk7CglpZiAoIWluX2FycmF5KCRtZXRob2QsIGFycmF5KCdQT1NUJywnUFVUJywnUEFUQ0gnLCdERUxFVEUnKSwgdHJ1ZSkpIHJldHVybiAkcmVzdWx0OwoJaWYgKHByZWdfbWF0Y2goJyNeL3BldHNob3AvdjEvcGV0LXByb2ZpbGUjJywgJHJvdXRlKSB8fCBwcmVnX21hdGNoKCcjXi9wZXRzaG9wL3YxL3BldC1waG90byMnLCAkcm91dGUpKSB7CgkJcmV0dXJuIG5ldyBXUF9FcnJvcigncHNfcGV0c193cml0ZV9mcm96ZW4nLCAncHNfcGV0cyB3cml0ZSBmcmVlemUgYWt0eXZ1cyAobWlncmFjaWphKScsIGFycmF5KCdzdGF0dXMnPT41MDMpKTsKCX0KCXJldHVybiAkcmVzdWx0Owp9LCA1LCAzKTsKYWRkX2ZpbHRlcigncXVlcnknLCBmdW5jdGlvbigkcSl7CglpZiAoZ2V0X29wdGlvbigncGV0c2hvcF9wc19wZXRzX3dyaXRlX2ZyZWV6ZScpICE9PSAnMScpIHJldHVybiAkcTsKCWlmIChwcmVnX21hdGNoKCcvXlxzKihJTlNFUlR8VVBEQVRFfERFTEVURXxSRVBMQUNFKVxiL2knLCAkcSkKCQkmJiBwcmVnX21hdGNoKCcvXGJnYWo2X3BzX3BldHNcYi9pJywgJHEpCgkJJiYgIXByZWdfbWF0Y2goJy9nYWo2X3BzX3BldHNfKGJha3xmYWlsZWQpL2knLCAkcSkpIHsKCQlyZXR1cm4gJ0RPIDAnOwoJfQoJcmV0dXJuICRxOwp9KTsK';
// helper snippetas: valdo flag + count/hash + guard install/remove
const HELP=Buffer.from(`add_action('wp_loaded',function(){
 if(($_GET['ps_hlp']??'')!=='HlpKw8Nx')return;
 global $wpdb;$pf=$wpdb->prefix;$a=$_GET['a']??'';$out=array();
 if($a==='flag_on'){ update_option('petshop_ps_pets_write_freeze','1'); $out['flag']=get_option('petshop_ps_pets_write_freeze'); }
 elseif($a==='flag_off'){ delete_option('petshop_ps_pets_write_freeze'); $out['flag']=get_option('petshop_ps_pets_write_freeze','NEDEFINED'); }
 elseif($a==='count_hash'){
   $cols=$wpdb->get_col("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='{$pf}ps_pets' ORDER BY ORDINAL_POSITION");
   $cl=implode(',',array_map(function($c){return '`'.$c.'`';},$cols));
   $rows=$wpdb->get_results("SELECT {$cl} FROM {$pf}ps_pets ORDER BY id",ARRAY_A);
   $canon=array();foreach($rows as $r){$p=array();foreach($cols as $c){$p[]=$c.'='.($r[$c]===null?'NULL':$r[$c]);}$canon[]=implode('|',$p);}
   $out['count']=count($rows);$out['hash']=hash('sha256',implode("\\n",$canon));
   $out['reader_ok']=true;
 }
 header('Content-Type: application/json');echo json_encode($out);exit;
});`).toString('base64');
// 1. install guard + helper (abu aktyvus)
const mkG=wj('POST','code-snippets/v1/snippets',{name:'PS ps_pets Write-Freeze Guard (temp)',code:Buffer.from(GUARD,'base64').toString('utf8'),scope:'front-end',active:true,priority:1});
const mkH=wj('POST','code-snippets/v1/snippets',{name:'PS Freeze Helper (temp)',code:Buffer.from(HELP,'base64').toString('utf8'),scope:'front-end',active:true,priority:2});
try{o.guard_id=JSON.parse(mkG).id;}catch(e){o.mkG=mkG.slice(0,150);}
try{o.help_id=JSON.parse(mkH).id;}catch(e){o.mkH=mkH.slice(0,150);}

// 2. pet count PRIES
function hlp(a){const r=execSync(`curl -sk ${AUTH} "https://dev.avesa.lt/?ps_hlp=HlpKw8Nx&a=${a}"`,{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{"');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,200)};}}
o.before=hlp('count_hash');

// 3. flag ON
o.flag_on=hlp('flag_on');

// 4. PROOF is atskiro request'o: POST pet-profile -> laukiam 503
const postCode=execSync(`curl -sk -o /tmp/post_resp -w "%{http_code}" ${AUTH} -X POST -H "Content-Type: application/json" -d '{"species":"cat","pet_name":"FREEZE_TEST"}' "https://dev.avesa.lt/wp-json/petshop/v1/pet-profile"`,{maxBuffer:10*1024*1024}).toString().trim();
o.post_status=postCode;
o.post_body=fs.readFileSync('/tmp/post_resp','utf8').slice(0,200);

// 5. GET veikia (read route) -> laukiam ne 503
const getCode=execSync(`curl -sk -o /tmp/get_resp -w "%{http_code}" ${AUTH} "https://dev.avesa.lt/wp-json/petshop/v1/feeding/calculate" -X GET`,{maxBuffer:10*1024*1024}).toString().trim();
// feeding/calculate yra POST-only; geriau testuojam bendra GET read: pet-dashboard reikia id. Naudojam wp/v2 read kaip GET proof
const getRead=execSync(`curl -sk -o /dev/null -w "%{http_code}" ${AUTH} "https://dev.avesa.lt/wp-json/petshop/v1/"`,{maxBuffer:10*1024*1024}).toString().trim();
o.get_namespace_status=getRead;

// 6. count PO POST (ar neatsirado irasas)
o.after_post=hlp('count_hash');
o.write_blocked=(o.before && o.after_post && o.before.count===o.after_post.count);

// 7. dvigubas count/hash 2-3s tarpu
const h1=hlp('count_hash'); 
execSync('sleep 3');
const h2=hlp('count_hash');
o.double_hash={h1:h1.hash,h2:h2.hash,count1:h1.count,count2:h2.count,LYGUS:(h1.hash===h2.hash && h1.count===h2.count)};

// 8. flag OFF + deactivate guard+helper
o.flag_off=hlp('flag_off');
if(o.guard_id) wj('POST',`code-snippets/v1/snippets/${o.guard_id}`,{active:false});
if(o.help_id) wj('POST',`code-snippets/v1/snippets/${o.help_id}`,{active:false});
o.cleaned=true;
console.log('PUT:',pr('freeze.json',o));
