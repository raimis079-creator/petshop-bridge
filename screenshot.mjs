import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_catesrecon']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $out = array();\n  // 1. visos parent-0 (rusys)\n  $roots = get_terms(array('taxonomy'=>'product_cat','parent'=>0,'hide_empty'=>false));\n  $out['roots']=array();\n  $cat_parent=0;\n  foreach($roots as $r){\n    $out['roots'][]=array('id'=>$r->term_id,'name'=>$r->name,'slug'=>$r->slug,'count'=>$r->count);\n    if(mb_stripos($r->name,'kat')!==false && mb_stripos($r->name,'grau')===false) $cat_parent=$r->term_id;\n  }\n  $out['cat_parent_guess']=$cat_parent;\n  // 2. kates vaikai\n  if($cat_parent){\n    $kids=get_terms(array('taxonomy'=>'product_cat','parent'=>$cat_parent,'hide_empty'=>false));\n    $out['cat_children']=array();\n    foreach($kids as $c){\n      $out['cat_children'][]=array('id'=>$c->term_id,'name'=>$c->name,'slug'=>$c->slug,'count'=>$c->count,'link'=>get_term_link($c));\n    }\n  }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop KatesRecon tmp',desc:'token',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); if(!id){L('fail '+c.body.slice(0,200));putText('_catesrecon.txt',out);return;}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 45 "'+BASE+'/?ps_catesrecon=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('cates_recon.json', r); L('len='+r.length);
}catch(e){L('!!! '+e);}
finally{ if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deact '+id);} putText('_catesrecon.txt',out+'\nID='+id); }
})();
