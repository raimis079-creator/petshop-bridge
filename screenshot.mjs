import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_cat77']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $out=array('parent'=>array());\n  $p=get_term(77,'product_cat');\n  $out['parent']=array('id'=>$p->term_id,'name'=>$p->name,'slug'=>$p->slug,'count'=>$p->count,'link'=>get_term_link($p));\n  $kids=get_terms(array('taxonomy'=>'product_cat','parent'=>77,'hide_empty'=>false));\n  $out['children']=array();\n  foreach($kids as $c){\n    $out['children'][]=array('id'=>$c->term_id,'name'=>$c->name,'slug'=>$c->slug,'count'=>$c->count,'link'=>get_term_link($c));\n  }\n  // maisto subkat padengimas (jei yra Sausas/Konservai katems)\n  $foodkids=array();\n  foreach($kids as $c){\n    if(mb_stripos($c->name,'maist')!==false || mb_stripos($c->name,'konserv')!==false || mb_stripos($c->name,'sausas')!==false){\n      $sub=get_terms(array('taxonomy'=>'product_cat','parent'=>$c->term_id,'hide_empty'=>false));\n      $subarr=array();\n      foreach($sub as $s){ $subarr[]=array('id'=>$s->term_id,'name'=>$s->name,'count'=>$s->count); }\n      $foodkids[]=array('id'=>$c->term_id,'name'=>$c->name,'count'=>$c->count,'sub'=>$subarr);\n    }\n  }\n  $out['food']=$foodkids;\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Cat77 tmp',desc:'token',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L2('id='+id);
  function L2(s){console.log(s);}
  if(!id){putText('_cat77.txt','fail '+c.body.slice(0,200));return;}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 45 "'+BASE+'/?ps_cat77=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('cat77.json', r);
  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});}
  putText('_cat77.txt','len='+r.length+' ID='+id);
}catch(e){putText('_cat77.txt','!!! '+e);}})();
