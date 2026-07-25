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
  if(!isset($_GET['ps_lr']) || $_GET['ps_lr']!=='Lr25x') return;
  $dir=WP_PLUGIN_DIR.'/petshop-core/'; $o=array();
  // pagrindinis plugin failas - kur require classiu + init()
  $main=null;
  foreach(glob($dir.'*.php') as $f){ $c=file_get_contents($f);
    if(strpos($c,'Petshop_Pet_UI')!==false || strpos($c,'class-pet-ui')!==false){ $main=basename($f);
      // istraukiam require + init blokus pet klasiu
      preg_match_all('/(require[^;]*class-pet[^;]*;|Petshop_Pet_[A-Za-z_]+::init\\(\\);|require[^;]*class-reminders[^;]*;)/',$c,$m);
      $o['main_file']=$main; $o['load_lines']=$m[1]; break; }
  }
  // ar Petshop_Pet_Notes jau kur uzkrautas
  $o['notes_referenced']=false;
  foreach(glob($dir.'*.php') as $f){ if(strpos(file_get_contents($f),'Petshop_Pet_Notes')!==false){ $o['notes_referenced']=basename($f); break; } }
  $o['notes_file_exists']=file_exists($dir.'includes/class-pet-notes.php');
  header('Content-Type: application/json'); echo json_encode($o); exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'LR (temp)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  const r=execSync('curl -sk "https://dev.avesa.lt/?ps_lr=Lr25x"',{maxBuffer:5e6,timeout:60000}).toString();
  const a=r.indexOf('{'),b=r.lastIndexOf('}'); o.result=(a>=0&&b>a)?JSON.parse(r.slice(a,b+1)):r.slice(0,250);
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){o.err=String(e).slice(0,200);}
putB64('loadrecon.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
