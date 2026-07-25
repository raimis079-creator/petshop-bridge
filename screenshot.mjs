import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_mxd']) || $_GET['ps_mxd']!=='Mxd25x') return;
  global $wpdb;
  // 1. siteurl/home
  $out=array('siteurl'=>get_option('siteurl'),'home'=>get_option('home'));
  // 2. ar Complianz saugo http URL kur nors options
  $rows=$wpdb->get_results("SELECT option_name FROM {$wpdb->options} WHERE (option_name LIKE '%complianz%' OR option_name LIKE '%cmplz%') AND option_value LIKE '%http://dev.avesa%' LIMIT 20", ARRAY_A);
  $out['cmplz_http_options']=array_map(function($r){return $r['option_name'];}, $rows);
  // 3. ar failas fiziskai turi http:// viduje
  $css=WP_CONTENT_DIR.'/uploads/complianz/css/banner-1-optin.css';
  $out['css_exists']=file_exists($css);
  if(file_exists($css)){ $c=file_get_contents($css); $out['css_has_http']=strpos($c,'http://dev.avesa')!==false; $out['css_size']=strlen($c); }
  // 4. Complianz versija
  $out['cmplz_active']=is_plugin_active('complianz-gdpr/complianz-gpdr.php')||is_plugin_active('complianz-gdpr-premium/complianz-gpdr-premium.php');
  header('Content-Type: application/json'); echo '###M###'.json_encode($out).'###E###'; exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'MXD (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,100);}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_mxd=Mxd25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('###M###'),b=r.indexOf('###E###'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a+7,b)):r.slice(0,200);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('mxdiag.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
