import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:''};}}
const O={}; const wait=ms=>new Promise(r=>setTimeout(r,ms));
const NR='HC025866203LT';
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';

// 1) laiskas su TIKRU LP numeriu
const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_lp']) || $_GET['ps_lp'] !== 'Lp7h' ) return;
  global $PS_CAP; $PS_CAP=array(); $r=array();
  add_filter('pre_wp_mail', function($n,$a){ global $PS_CAP; $PS_CAP[]=array('s'=>$a['subject'],'b'=>(string)$a['message']); return true; },1,2);
  $ids=wc_get_products(array('limit'=>20,'status'=>'publish','return'=>'ids'));
  $pid=0; foreach((array)$ids as $x){ $q=wc_get_product($x); if($q&&$q->is_purchasable()&&$q->is_in_stock()){$pid=(int)$x;break;} }
  $o=wc_create_order(); if($pid) $o->add_product(wc_get_product($pid),1);
  $o->set_billing_email('raimundas@gyvunai.lt'); $o->set_billing_first_name('Raimis');
  $o->set_payment_method('bacs'); $o->calculate_totals(); $o->save();
  $oid=$o->get_id(); $o->payment_complete('LP-'.$oid);
  $o=wc_get_order($oid);
  $o->update_meta_data('_woo_lithuaniapost_barcode','HC025866203LT');
  $o->save();
  $r['resolve']=Petshop_Event_Emitters::resolve_tracking(wc_get_order($oid));
  $PS_CAP=array();
  wc_get_order($oid)->update_status('completed','lp');
  foreach($PS_CAP as $m){
    $t=trim(preg_replace('/\\s+/',' ',wp_strip_all_tags($m['b'])));
    preg_match_all('#https?://[^\\s"\\'<>]+#',$m['b'],$lm);
    $r['mail']=array('subject'=>$m['s'],'has_nr'=>(strpos($t,'HC025866203LT')!==false)?1:0,
      'excerpt'=>mb_substr($t,0,320),
      'links'=>array_values(array_filter(array_unique($lm[0]),function($x){return strpos($x,'post.lt')!==false;})));
  }
  wc_get_order($oid)->delete(true);
  nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit;
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP LP Real Nr v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_lp=Lp7h"');
  try{O.wp=JSON.parse(g.out);}catch(e){O.wp_raw=g.out.slice(0,400);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}

// 2) narsykle — ar nuoroda rodo TIKRA sekimo istorija
let br;
try{
 br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
 const ctx=await br.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
 const p=await ctx.newPage();
 const url='https://www.post.lt/siuntu-sekimas?parcels='+NR;
 await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); await wait(3000);
 for(const sel of ['button:has-text("Sutinku")','button:has-text("Priimti")','button:has-text("Leidžiu")','#onetrust-accept-btn-handler','.cookie-accept']){
   const b=await p.$(sel); if(b){ await b.click().catch(()=>{}); await wait(2500); break; }
 }
 await wait(5000);
 const txt=await p.evaluate(()=>document.body.innerText);
 O.browser={url:p.url().slice(0,95),
   nr_tekste:txt.includes(NR)?1:0,
   turi_statusa:/pristat|siunt|termin|paimt|gav[eė]j|i[sš]si[uų]st/i.test(txt)?1:0,
   ilgis:txt.length,
   excerpt:txt.replace(/\s+/g,' ').slice(0,700)};
 await p.screenshot({path:'/tmp/lp.png',fullPage:false});
 await ctx.close();
}catch(e){ O.browser={err:String(e).slice(0,200)}; }
try{ if(br) await br.close(); }catch(e){}
putB64('lp.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
try{ putB64('lp.png', fs.readFileSync('/tmp/lp.png').toString('base64')); }catch(e){}
console.log('done');
