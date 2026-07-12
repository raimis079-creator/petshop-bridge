import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_catrecon']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $parent = get_term(70, 'product_cat');\n  $children = get_terms(array('taxonomy'=>'product_cat','parent'=>70,'hide_empty'=>false));\n  $out = array('parent'=>array('id'=>$parent->term_id,'name'=>$parent->name,'slug'=>$parent->slug,'link'=>get_term_link($parent)),'children'=>array());\n  foreach($children as $c){\n    $out['children'][] = array('id'=>$c->term_id,'name'=>$c->name,'slug'=>$c->slug,'count'=>$c->count,'link'=>get_term_link($c));\n  }\n  // patikrinam 8 pagrindiniu ID\n  $main = array(71,95,115,116,82,101,233,111);\n  $out['main_check']=array();\n  foreach($main as $tid){\n    $t=get_term($tid,'product_cat');\n    $out['main_check'][$tid]= is_wp_error($t)||!$t ? 'NERA' : array('name'=>$t->name,'parent'=>$t->parent);\n  }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop CatRecon tmp',desc:'token',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); if(!id){L('fail '+c.body.slice(0,200));putText('_catrecon.txt',out);return;}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 45 "'+BASE+'/?ps_catrecon=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('cat_recon.json', r); L('len='+r.length);
}catch(e){L('!!! '+e);}
finally{ if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deact '+id);} putText('_catrecon.txt',out+'\nID='+id); }
})();
