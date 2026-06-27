import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function sh(cmd){try{return execSync(cmd,{encoding:'utf8',env,maxBuffer:50000000});}catch(e){try{return e.stdout||'';}catch(_){return '';}}}
const CS="https://dev.avesa.lt/wp-json/code-snippets/v1/snippets";
const report={steps:[]};
try{
// 1) list all snippets, find TEMP ones
const list=sh(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${CS}?limit=300"`);
let arr=[];try{arr=JSON.parse(list);}catch(e){}
const temps=arr.filter(s=>/Import Audit TEMP/i.test(s.name||'')).map(s=>({id:s.id,name:s.name,active:s.active}));
report.found_temps=temps;
// 2) delete each temp
report.cleanup=[];
for(const t of temps){
  sh(`curl -sk --max-time 25 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":false}' "${CS}/${t.id}"`);
  const d=sh(`curl -sk --max-time 25 -o /dev/null -w "%{http_code}" -X DELETE -u "$WP_USER:$WP_PASS_CLEAN" "${CS}/${t.id}"`).trim();
  report.cleanup.push({id:t.id,del:d});
}
// 3) re-list to confirm none remain
const list2=sh(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${CS}?limit=300"`);
let arr2=[];try{arr2=JSON.parse(list2);}catch(e){}
report.temps_remaining=arr2.filter(s=>/Import Audit TEMP/i.test(s.name||'')).map(s=>s.id);
// 4) create fresh REST-route audit snippet
const code=[
"/** PS Import Audit T */","if (!defined('ABSPATH')) return;",
"add_action('rest_api_init', function(){",
"  register_rest_route('psiax/v1','/a', array('methods'=>'GET','permission_callback'=>function(){ return current_user_can('manage_options'); },'callback'=>function(){",
"    global $wpdb; $t=$wpdb->prefix.'pmxi_imports';",
"    $rows=$wpdb->get_results(\"SELECT id,name,friendly_name,scheduled,path,options FROM {$t}\",ARRAY_A);",
"    $out=array('imports'=>array());",
"    if(is_array($rows)) foreach($rows as $r){ $opt=@unserialize($r['options']); $flags=array();",
"      if(is_array($opt)){ foreach(array('is_update_content','update_content_logic','is_update_title','is_keep_former_posts','update_all_data') as $k){ if(array_key_exists($k,$opt)) $flags[$k]=$opt[$k]; } }",
"      $out['imports'][]=array('id'=>$r['id'],'name'=>$r['name'],'friendly'=>$r['friendly_name'],'scheduled'=>$r['scheduled'],'path'=>substr((string)$r['path'],-45),'flags'=>$flags); }",
"    $pt=$wpdb->prefix.'pmxi_posts';",
"    $out['euk_owner']=$wpdb->get_results(\"SELECT post_id,import_id FROM {$pt} WHERE post_id IN (14794,12452,12455,33452,12466)\",ARRAY_A);",
"    return $out; }));",
"});"
].join("\n");
fs.writeFileSync('/tmp/cre.json',JSON.stringify({name:"PS Import Audit TEMP", code, scope:"global", active:true}));
const cr=sh(`curl -sk --max-time 40 -o /tmp/cre_resp.json -w "%{http_code}" -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/cre.json "${CS}"`).trim();
let newId=null;try{newId=JSON.parse(fs.readFileSync('/tmp/cre_resp.json','utf8')).id;}catch(e){}
report.create_code=cr;report.new_id=newId;
if(newId) sh(`curl -sk --max-time 25 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":true}' "${CS}/${newId}"`);
sh('sleep 2');
// 5) call REST route
const aud=sh(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/psiax/v1/a"`);
try{report.audit=JSON.parse(aud);}catch(e){report.audit_raw=aud.slice(0,300);}
// 6) cleanup fresh snippet
if(newId){ sh(`curl -sk --max-time 25 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":false}' "${CS}/${newId}"`);
  report.del_new=sh(`curl -sk --max-time 25 -o /dev/null -w "%{http_code}" -X DELETE -u "$WP_USER:$WP_PASS_CLEAN" "${CS}/${newId}"`).trim();
  const chk=sh(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "${CS}/${newId}"`);report.new_gone=chk.indexOf('"id":'+newId)<0;}
}catch(e){report.FATAL=String(e).slice(0,200);}
commit("import_audit3_"+Date.now()+".json", JSON.stringify(report,null,1));
console.log("DONE");
