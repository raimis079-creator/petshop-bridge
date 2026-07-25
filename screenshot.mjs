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
const o={batches:[]};
// batch delete po 60, LIMIT viduje. Kviesime kelis kartus is JS.
const CODE=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_batch']) || $_GET['ps_batch']!=='Batch25x') return;
  global $wpdb; $pf=$wpdb->prefix; $t=$pf.'snippets';
  $rows = $wpdb->get_results("SELECT id FROM `$t` WHERE id>=611 AND (name LIKE '%(temp)%' OR name LIKE '%tmp%') AND code NOT LIKE '%ps_batch%' LIMIT 60", ARRAY_A);
  $del=0;
  foreach($rows as $r){ $id=(int)$r['id']; $wpdb->update($t,array('active'=>0),array('id'=>$id)); if($wpdb->delete($t,array('id'=>$id))) $del++; }
  $remaining = (int)$wpdb->get_var("SELECT COUNT(*) FROM `$t` WHERE id>=611 AND (name LIKE '%(temp)%' OR name LIKE '%tmp%') AND code NOT LIKE '%ps_batch%'");
  header('Content-Type: application/json'); echo '###B###'.json_encode(array('deleted'=>$del,'remaining'=>$remaining)).'###E###'; exit;
});`;
try{
  const mk=wj('POST','code-snippets/v1/snippets',{name:'BatchDel (self-batch)',code:CODE,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,100);}
  o.sid=sid;
  execSync('sleep 4');
  // kvieciame kol remaining>0 arba max 12 batch
  for(let i=0;i<12;i++){
    try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_batch=Batch25x"',{maxBuffer:5e6,timeout:60000}).toString();
      const a=r.indexOf('###B###'),b=r.indexOf('###E###');
      if(a>=0&&b>a){ const d=JSON.parse(r.slice(a+7,b)); o.batches.push(d); if(d.remaining<=0) break; }
      else { o.batches.push({raw:r.slice(0,80)}); break; }
    }catch(e){ o.batches.push({err:String(e).slice(0,80)}); break; }
    execSync('sleep 1');
  }
  // istrinu save (self-batch turi ps_batch tekste, nesitrina auto)
  if(sid!=null){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){}
    try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
  // galutine nepriklausoma patikra
  execSync('sleep 2');
  try{ const l=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?n='+Math.random()+'"',{maxBuffer:80e6,timeout:45000}).toString();
    const arr=JSON.parse(l); o.final_total=arr.length;
    o.final_temp=arr.filter(function(s){return /\(temp\)|tmp/i.test(s.name);}).length;
    o.final_active_temp=arr.filter(function(s){return s.active && /\(temp\)|tmp/i.test(s.name);}).map(function(s){return s.id+':'+s.name;});
  }catch(e){o.finalerr=String(e).slice(0,100);}
}catch(e){o.err=String(e).slice(0,200);}
putB64('tmpbatch.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
