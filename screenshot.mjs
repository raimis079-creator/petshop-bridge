import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_photo_recon']) ) { return; }\n  if ( ($_GET['token']??'') !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  $out = array();\n\n  // Image libs\n  $out['gd'] = extension_loaded('gd');\n  $out['imagick'] = extension_loaded('imagick');\n  if(function_exists('gd_info')){ $gd=gd_info(); $out['gd_jpeg']=$gd['JPEG Support']??false; $out['gd_png']=$gd['PNG Support']??false; $out['gd_webp']=$gd['WebP Support']??false; }\n\n  // WP image editor\n  $out['wp_image_editor'] = class_exists('WP_Image_Editor');\n\n  // Uploads dir\n  $u = wp_upload_dir();\n  $out['upload_basedir'] = $u['basedir'];\n  $out['upload_baseurl'] = $u['baseurl'];\n  $out['upload_writable'] = is_writable($u['basedir']);\n\n  // finfo (MIME tikrinimui)\n  $out['finfo'] = class_exists('finfo');\n\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode($out, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -A "Mozilla/5.0" --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -A "Mozilla/5.0" --max-time 60 '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'');}return r;}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{let id=0;
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Photo Recon',desc:'x',code:PHP,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c).id;}catch(e){}
  execSync('sleep 2');
  const r=sh('curl -s -k -A "Mozilla/5.0" --max-time 45 "'+BASE+'/?ps_photo_recon=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('photo_recon.json', r);
  if(id) api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});
})();
