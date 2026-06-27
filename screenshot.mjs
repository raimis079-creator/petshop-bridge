import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
const KEY="psia_7Kq9x";
const code = [
"/** Petshop Import Audit TEMP recon */",
"if (!defined('ABSPATH')) return;",
"add_action('wp_loaded', function(){",
"  if (!isset($_GET['ps_import_audit']) || $_GET['ps_import_audit'] !== '"+KEY+"') return;",
"  if (!is_user_logged_in()) return;",
"  global $wpdb;",
"  $t = $wpdb->prefix.'pmxi_imports';",
"  $rows = $wpdb->get_results(\"SELECT id, name, friendly_name, scheduled, path, options FROM {$t}\", ARRAY_A);",
"  $out = array('imports'=>array());",
"  if (is_array($rows)) foreach($rows as $r){",
"    $opt = @unserialize($r['options']);",
"    $flags = array();",
"    if (is_array($opt)){",
"      foreach(array('is_update_content','update_content_logic','is_update_title','is_update_excerpt','is_keep_former_posts','update_all_data','is_update_custom_fields','is_update_status') as $k){",
"        if (array_key_exists($k,$opt)) $flags[$k]=$opt[$k];",
"      }",
"    }",
"    $out['imports'][] = array('id'=>$r['id'],'name'=>$r['name'],'friendly'=>$r['friendly_name'],'scheduled'=>$r['scheduled'],'path'=>substr((string)$r['path'],-40),'flags'=>$flags);",
"  }",
"  $pt = $wpdb->prefix.'pmxi_posts';",
"  $out['eukanuba_owner'] = $wpdb->get_results(\"SELECT post_id, import_id FROM {$pt} WHERE post_id IN (14794,12452,12455,33452,12466)\", ARRAY_A);",
"  header('Content-Type: application/json');",
"  echo json_encode($out);",
"  exit;",
"});"
].join("\n");
// 1. create snippet
const createBody=JSON.stringify({name:"Petshop Import Audit TEMP", code, scope:"global", active:true});
fs.writeFileSync('/tmp/cre.json',createBody);
const cr=execSync(`curl -sk --max-time 40 -o /tmp/cre_resp.json -w "%{http_code}" -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/cre.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();
let newId=null,createResp='';try{createResp=fs.readFileSync('/tmp/cre_resp.json','utf8');newId=JSON.parse(createResp).id;}catch(e){}
const report={create_code:cr,new_id:newId,create_active:null};
try{report.create_active=JSON.parse(createResp).active;}catch(e){}
// 1b. ensure active
if(newId){execSync(`curl -sk --max-time 30 -o /dev/null -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"active":true}' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/${newId}"`,{env});}
execSync('sleep 2');
// 2. hit endpoint
let audit='';try{execSync(`curl -skL --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?ps_import_audit=${KEY}" -o /tmp/audit.txt`,{env,maxBuffer:50000000});audit=fs.readFileSync('/tmp/audit.txt','utf8');}catch(e){audit='ERR';}
// extract JSON (endpoint echoes pure json + exit, but may have leading output; try parse)
let parsed=null;try{const i=audit.indexOf('{"imports"');parsed=JSON.parse(i>-1?audit.slice(i):audit);}catch(e){report.audit_raw=audit.slice(0,400);}
report.audit=parsed;
// 3. delete temp snippet
if(newId){const del=execSync(`curl -sk --max-time 30 -o /dev/null -w "%{http_code}" -X DELETE -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/${newId}"`,{encoding:'utf8',env}).trim();report.delete_code=del;
  // verify gone
  const chk=execSync(`curl -sk --max-time 20 -o /dev/null -w "%{http_code}" -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/${newId}"`,{encoding:'utf8',env}).trim();report.verify_gone=chk;}
commit("import_audit_"+Date.now()+".json", JSON.stringify(report,null,1));
console.log("DONE");
