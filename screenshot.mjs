import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
const CS="https://dev.avesa.lt/wp-json/code-snippets/v1/snippets";
function csGet(id){try{execSync(`curl -sk --max-time 25 -o /tmp/x.json -w "%{http_code}" -u "$WP_USER:$WP_PASS_CLEAN" "${CS}/${id}" > /tmp/c.txt`,{env});return {code:fs.readFileSync('/tmp/c.txt','utf8').trim(),body:(()=>{try{return fs.readFileSync('/tmp/x.json','utf8').slice(0,120);}catch(e){return '';}})()};}catch(e){return {code:'ERR'};}}
function csDeactivate(id){try{execSync(`curl -sk --max-time 25 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":false}' "${CS}/${id}"`,{env});}catch(e){}}
function csDelete(id){try{return execSync(`curl -sk --max-time 25 -o /dev/null -w "%{http_code}" -X DELETE -u "$WP_USER:$WP_PASS_CLEAN" "${CS}/${id}"`,{encoding:'utf8',env}).trim();}catch(e){return 'ERR';}}
const report={};
// A) cleanup 516
csDeactivate(516);
report.del516=csDelete(516);
report.chk516=csGet(516);
// B) create REST-route snippet
const code=[
"/** Petshop Import Audit TEMP rest */",
"if (!defined('ABSPATH')) return;",
"add_action('rest_api_init', function(){",
"  register_rest_route('psia/v1','/audit', array(",
"    'methods'=>'GET',",
"    'permission_callback'=>function(){ return current_user_can('manage_options'); },",
"    'callback'=>function(){",
"      global $wpdb;",
"      $t=$wpdb->prefix.'pmxi_imports';",
"      $rows=$wpdb->get_results(\"SELECT id,name,friendly_name,scheduled,path,options FROM {$t}\",ARRAY_A);",
"      $out=array('imports'=>array());",
"      if(is_array($rows)) foreach($rows as $r){",
"        $opt=@unserialize($r['options']); $flags=array();",
"        if(is_array($opt)){ foreach(array('is_update_content','update_content_logic','is_update_title','is_update_excerpt','is_keep_former_posts','update_all_data','is_update_custom_fields','is_update_status') as $k){ if(array_key_exists($k,$opt)) $flags[$k]=$opt[$k]; } }",
"        $out['imports'][]=array('id'=>$r['id'],'name'=>$r['name'],'friendly'=>$r['friendly_name'],'scheduled'=>$r['scheduled'],'path'=>substr((string)$r['path'],-45),'flags'=>$flags);",
"      }",
"      $pt=$wpdb->prefix.'pmxi_posts';",
"      $out['eukanuba_owner']=$wpdb->get_results(\"SELECT post_id,import_id FROM {$pt} WHERE post_id IN (14794,12452,12455,33452,12466)\",ARRAY_A);",
"      return $out;",
"    }",
"  ));",
"});"
].join("\n");
fs.writeFileSync('/tmp/cre.json',JSON.stringify({name:"Petshop Import Audit TEMP2", code, scope:"global", active:true}));
const cr=execSync(`curl -sk --max-time 40 -o /tmp/cre_resp.json -w "%{http_code}" -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/cre.json "${CS}"`,{encoding:'utf8',env}).trim();
let newId=null;try{newId=JSON.parse(fs.readFileSync('/tmp/cre_resp.json','utf8')).id;}catch(e){}
report.create_code=cr;report.new_id=newId;
if(newId){execSync(`curl -sk --max-time 25 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":true}' "${CS}/${newId}"`,{env});}
execSync('sleep 2');
// C) call REST route (basic auth -> authenticated)
let aud='';try{execSync(`curl -sk --max-time 30 -o /tmp/aud.json -w "%{http_code}" -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/psia/v1/audit" > /tmp/ac.txt`,{env});report.audit_http=fs.readFileSync('/tmp/ac.txt','utf8').trim();aud=fs.readFileSync('/tmp/aud.json','utf8');}catch(e){aud='ERR';}
try{report.audit=JSON.parse(aud);}catch(e){report.audit_raw=aud.slice(0,300);}
// D) cleanup TEMP2
if(newId){csDeactivate(newId);report.del2=csDelete(newId);report.chk2=csGet(newId);}
commit("import_audit2_"+Date.now()+".json", JSON.stringify(report,null,1));
console.log("DONE");
