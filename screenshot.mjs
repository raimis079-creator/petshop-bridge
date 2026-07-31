import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,200)};}}
const O={}; const NR='106200460';
// 1) ar musu URL veikia
for (const u of ['https://venipak.lt/track?code='+NR,
                 'https://venipak.com/lt/siuntos-sekimas/?code='+NR,
                 'https://go.venipak.lt/'+NR]) {
  const r=sh('curl -sSkI -L --max-time 20 "'+u+'" -o /dev/null -w "%{http_code} -> %{url_effective}"');
  O[u]=r.out.trim().slice(0,160);
}
// 2) laiskas su TIKRU numeriu
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_vr']) || $_GET['ps_vr'] !== 'Vr9x' ) return;
  global $PS_CAP; $PS_CAP=array();
  add_filter('pre_wp_mail', function($n,$a){ global $PS_CAP; $PS_CAP[]=array('s'=>$a['subject'],'b'=>(string)$a['message']); return true; },1,2);
  $ids=wc_get_products(array('limit'=>20,'status'=>'publish','return'=>'ids'));
  $pid=0; foreach((array)$ids as $c){ $p=wc_get_product($c); if($p&&$p->is_purchasable()&&$p->is_in_stock()){$pid=(int)$c;break;} }
  $o=wc_create_order(); if($pid) $o->add_product(wc_get_product($pid),1);
  $o->set_billing_email('raimundas@gyvunai.lt'); $o->set_billing_first_name('Raimis');
  $o->set_payment_method('bacs'); $o->calculate_totals(); $o->save();
  $oid=$o->get_id(); $o->payment_complete('VTEST-'.$oid);
  $o=wc_get_order($oid);
  $o->update_meta_data('venipak_shipping_order_data', json_encode(array('status'=>'sent','pack_numbers'=>array('106200460'))));
  $o->save();
  $r=array('order'=>$oid);
  $r['resolve']=Petshop_Event_Emitters::resolve_tracking(wc_get_order($oid));
  $PS_CAP=array();
  wc_get_order($oid)->update_status('completed','vtest');
  foreach($PS_CAP as $m){
    $t=trim(preg_replace('/\\s+/',' ',wp_strip_all_tags($m['b'])));
    preg_match_all('#https?://[^\\s"\\'<>]+#',$m['b'],$lm);
    $r['mail'][]=array('subject'=>$m['s'],
      'has_number'=>(strpos($t,'106200460')!==false)?1:0,
      'excerpt'=>mb_substr($t,0,400),
      'links'=>array_values(array_unique($lm[0])));
  }
  wc_get_order($oid)->delete(true);
  nocache_headers(); header('Content-Type: application/json; charset=utf-8');
  echo wp_json_encode($r,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit;
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Venipak Real Nr v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else { O.create_err=r.out.slice(0,200); sh('sleep 4'); }
}
O.sid=sid;
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_vr=Vr9x"');
  try{O.mailtest=JSON.parse(g.out);}catch(e){O.raw=g.out.slice(0,600);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('vtest.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
