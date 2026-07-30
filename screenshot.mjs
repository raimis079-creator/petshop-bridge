import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
const MK=process.env.SENDER_MARKETING_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const API='https://api.sender.net/v2';
const H='-H "Authorization: Bearer '+MK+'" -H "Content-Type: application/json" -H "Accept: application/json"';
function call(m,p,body){ let c='curl -sSk -X '+m+' '+H+' "'+API+p+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "'+API+p+'"'; }
  const r=sh(c); try{return JSON.parse(r.out);}catch(e){return {__raw:r.out.slice(0,200)};} }
const O={};

// --- 1) uzregistruoti subscribers/updated webhook
const cur=call('GET','/account/webhooks');
const have=((cur&&cur.data)||[]).map(w=>w.topic);
O.existing=have;
if (!have.includes('subscribers/updated')) {
  const res=call('POST','/account/webhooks',{url:SITE+'/wp-json/petshop/v1/sender-webhook',topic:'subscribers/updated'});
  O.registered=JSON.stringify(res).slice(0,220);
} else O.registered='jau buvo';
O.after=(((call('GET','/account/webhooks'))||{}).data||[]).map(w=>({t:w.topic,s:w.status,u:String(w.url).slice(0,55)}));

// --- 2) istrinti mail-tester kontakta
const subs=((call('GET','/subscribers?limit=100')||{}).data||[]);
const mt=subs.filter(s=>/mail-tester/i.test(s.email)).map(s=>s.email);
O.mailtester=mt;
if (mt.length) { O.deleted=JSON.stringify(call('DELETE','/subscribers',{subscribers:mt})).slice(0,150); sh('sleep 10'); }
O.subs_after=((call('GET','/subscribers?limit=100')||{}).data||[]).map(s=>s.email);

// --- 3) kanalinio eligibility patikra per WP (srautas BE custom filtro)
const AUTH='-u "'+WU+':'+WP+'"', SAPI=SITE+'/wp-json/code-snippets/v1/snippets';
const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_ck']) || $_GET['ps_ck'] !== 'Ck9n' ) return;
  global $wpdb; $E='chan2@example.com'; $r=array();
  $wpdb->query($wpdb->prepare("DELETE FROM ".Petshop_Email_Suppression::table()." WHERE email=%s",$E));
  Petshop_Email_Suppression::apply_status($E, array('email'=>'unsubscribed','temail'=>'active'), 'test');
  // post_purchase_2d = service, BE custom eligibility filtro
  $r['service_post_purchase'] = Petshop_Email_Dispatch::check_eligibility('service',$E,'post_purchase_2d');
  $r['transactional']         = Petshop_Email_Dispatch::check_eligibility('transactional',$E,'order_paid');
  $r['marketing']             = Petshop_Email_Dispatch::check_eligibility('marketing',$E,'win_back_60');
  $r['sup_marketing']=Petshop_Email_Suppression::is_suppressed($E,'marketing')?1:0;
  $r['sup_transact'] =Petshop_Email_Suppression::is_suppressed($E,'transactional')?1:0;
  $wpdb->query($wpdb->prepare("DELETE FROM ".Petshop_Email_Suppression::table()." WHERE email=%s",$E));
  nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r,JSON_UNESCAPED_SLASHES); exit;
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S314 Channel Check v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+SAPI+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_ck=Ck9n"');
  try{O.channel_check=JSON.parse(g.out);}catch(e){O.channel_raw=g.out.slice(0,400);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+SAPI+'/'+sid+'"');
}
putB64('fin14.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
