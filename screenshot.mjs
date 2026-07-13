import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_rvclear']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $confirm = isset($_GET['confirm']) && $_GET['confirm']==='CLEAR_RV';\n  $sw = get_option('sidebars_widgets');\n  $ss = isset($sw['shop-sidebar']) && is_array($sw['shop-sidebar']) ? $sw['shop-sidebar'] : array();\n  $target = 'woocommerce_recently_viewed_products-8';\n  $out = array('shop_sidebar_before'=>$ss,'target'=>$target,'applied'=>false);\n  $pos = array_search($target, $ss, true);\n  $out['found'] = ($pos !== false);\n  if ($confirm && $pos !== false){\n    if(!get_option('ps_shop_sidebar_backup')){ update_option('ps_shop_sidebar_backup', $ss, false); $out['backup']='sukurtas'; } else { $out['backup']='jau_buvo'; }\n    unset($ss[$pos]);\n    $ss = array_values($ss);\n    $sw['shop-sidebar'] = $ss;\n    if(!isset($sw['wp_inactive_widgets'])||!is_array($sw['wp_inactive_widgets'])) $sw['wp_inactive_widgets']=array();\n    $sw['wp_inactive_widgets'][] = $target;\n    update_option('sidebars_widgets', $sw);\n    $out['applied']=true;\n    $out['shop_sidebar_after']=$ss;\n  }\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function chk(u){try{return execSync('curl -s -k --max-time 30 "'+u+'"',{encoding:'utf8',maxBuffer:30000000});}catch(e){return '';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop RVClear tmp',desc:'token clear rv',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  if(!id){L('fail '+c.body.slice(0,200));putText('_rvclear.txt',out);return;}
  execSync('sleep 2');
  const r=execSync('curl -s -k --max-time 45 "'+BASE+'/?ps_rvclear=1&confirm=CLEAR_RV&token=cmplz_6680aa2a42151d54fa8d64ec"',{encoding:'utf8'});
  L('CLEAR: '+r.slice(0,400));
  execSync('sleep 2');
  const cat=chk(BASE+'/kategorija/sunims/maistas-sunims/');
  L('/maistas-sunims/ RecentlyViewed(turi_but_false)='+(cat.indexOf('Recently Viewed')>-1 || cat.indexOf('RECENTLY VIEWED')>-1)+' priceFilter(liko)='+(cat.indexOf('price_slider')>-1||cat.indexOf('FILTRUOTI PAGAL')>-1||cat.indexOf('woocommerce-widget-layered-nav')>-1));
}catch(e){L('!!! '+e);}
finally{ if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});} putText('_rvclear.txt',out+'\nID='+id); }
})();
