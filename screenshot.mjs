import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php='<?php add_action("wp_loaded",function(){ if(!isset($_GET["ps_ax2"])||$_GET["ps_ax2"]!=="Ax2x") return; global $wpdb; $o=array(); '
   +'$r=$wpdb->prefix."ps_feeding_rows"; '
   +'$o["dims"]=$wpdb->get_results("SELECT condition_dimensions d, COUNT(*) c, COUNT(DISTINCT feeding_table_id) t FROM $r '
   +'WHERE condition_dimensions IS NOT NULL AND condition_dimensions<>\'\' GROUP BY condition_dimensions ORDER BY c DESC LIMIT 12",ARRAY_A); '
   +'$o["raw"]=$wpdb->get_results("SELECT DISTINCT condition_raw FROM $r WHERE condition_raw IS NOT NULL AND condition_raw<>\'\' LIMIT 12",ARRAY_A); '
   +'$o["su_asimi_lenteliu"]=(int)$wpdb->get_var("SELECT COUNT(DISTINCT feeding_table_id) FROM $r WHERE condition_dimensions IS NOT NULL AND condition_dimensions<>\'\'"); '
   +'$o["viso_lenteliu"]=(int)$wpdb->get_var("SELECT COUNT(DISTINCT feeding_table_id) FROM $r"); '
   +'header("Content-Type: application/json"); echo json_encode($o); exit; });';
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'AX2 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,120);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_ax2=Ax2x"',{maxBuffer:8e6,timeout:85000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1));
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('ax2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
