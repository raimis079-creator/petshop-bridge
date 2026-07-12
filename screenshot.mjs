import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_widrecon']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  global $wp_registered_sidebars;\n  $sw = get_option('sidebars_widgets');\n  $out = array('sidebars'=>array(),'registered'=>array(),'widget_titles'=>array());\n  foreach($sw as $area=>$widgets){\n    if(!is_array($widgets)) continue;\n    $out['sidebars'][$area]=$widgets;\n  }\n  foreach($wp_registered_sidebars as $id=>$info){\n    $out['registered'][$id]=isset($info['name'])?$info['name']:'';\n  }\n  // widget instance titles for woocommerce product widgets\n  foreach(array('woocommerce_products','woocommerce_top_rated_products','woocommerce_recently_viewed_products','woocommerce_recent_reviews') as $base){\n    $inst=get_option('widget_'.$base);\n    if(is_array($inst)){\n      foreach($inst as $k=>$v){\n        if(is_array($v)&&isset($v['title'])) $out['widget_titles'][$base.'-'.$k]=$v['title'];\n      }\n    }\n  }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop WidRecon tmp',desc:'token',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); if(!id){L('fail '+c.body.slice(0,200));putText('_widrecon.txt',out);return;}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 45 "'+BASE+'/?ps_widrecon=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('wid_recon.json', r); L('len='+r.length);
}catch(e){L('!!! '+e);}
finally{ if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deact '+id);} putText('_widrecon.txt',out+'\nID='+id); }
})();
