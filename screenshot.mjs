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
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const EMAIL='e2e-unsub@example.com';

// --- 1) PHP: sugeneruoti TIKRA marketingo laisko HTML ir istraukti footerio nuoroda
const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_e2u']) ) return;
  $k=$_GET['ps_e2u']; global $wpdb;
  $E='${EMAIL}';
  $ST=Petshop_Email_Suppression::table(); $ct=$wpdb->prefix.'ps_consent_log';

  if ($k==='setup') {
    $wpdb->query($wpdb->prepare("DELETE FROM $ST WHERE email=%s",$E));
    $wpdb->query($wpdb->prepare("DELETE FROM $ct WHERE email=%s",$E));
    ps_set_marketing_consent($E,true,'e2e_setup',0);
    // TIKRAS marketingo laisko HTML per karkasa
    $body  = Petshop_Email_Layout::p('Testinis marketingo laiskas E2E patikrai.');
    $body .= Petshop_Email_Layout::button(home_url('/'),'Peržiūrėti');
    $html  = Petshop_Email_Layout::wrap(array(
      'subject'=>'E2E atsisakymo testas','preheader'=>'testas',
      'body'=>$body,'flow_class'=>'marketing','email'=>$E,
      'reason'=>'Gavote šį laišką, nes sutikote gauti Petshop.lt naujienas.'));
    preg_match('#href="([^"]*atsisakyti[^"]*)"#',$html,$m);
    $r=array('html_len'=>strlen($html),
      'unsub_url'=>isset($m[1])?html_entity_decode($m[1]):null,
      'consent'=>ps_get_marketing_consent($E),
      'has_consent'=>Petshop_Contact_Policy::has_consent($E)?1:0,
      'suppressed'=>Petshop_Email_Suppression::is_suppressed($E,'marketing')?1:0);
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r,JSON_UNESCAPED_SLASHES); exit;
  }
  if ($k==='state') {
    $r=array('consent_raw'=>ps_get_marketing_consent($E),
      'has_consent'=>Petshop_Contact_Policy::has_consent($E)?1:0,
      'marketing_supp'=>Petshop_Email_Suppression::is_suppressed($E,'marketing')?1:0,
      'transact_supp'=>Petshop_Email_Suppression::is_suppressed($E,'transactional')?1:0,
      'elig_marketing'=>Petshop_Email_Dispatch::check_eligibility('marketing',$E,'win_back_60')['allowed'],
      'elig_service'=>Petshop_Email_Dispatch::check_eligibility('service',$E,'post_purchase_2d')['allowed'],
      'elig_transact'=>Petshop_Email_Dispatch::check_eligibility('transactional',$E,'order_paid')['allowed']);
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r,JSON_UNESCAPED_SLASHES); exit;
  }
  if ($k==='cleanup') {
    $wpdb->query($wpdb->prepare("DELETE FROM $ST WHERE email=%s",$E));
    $wpdb->query($wpdb->prepare("DELETE FROM $ct WHERE email=%s",$E));
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
  }
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP E2E Unsub v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
O.sid=sid;
const call=(k)=>{ const g=sh('curl -sSk "'+SITE+'/?ps_e2u='+k+'"'); try{return JSON.parse(g.out);}catch(e){return {raw:g.out.slice(0,300)};} };
if(!sid){ putB64('ue2e.json',Buffer.from(JSON.stringify(O)).toString('base64')); console.log('no sid'); }
else {
 sh('sleep 3');
 O.setup=call('setup');
 const URL=O.setup && O.setup.unsub_url;
 O.url=URL;
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1100,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();

  // --- 2/3) GET
  const resp=await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
  await wait(2000);
  O.get={status:resp?resp.status():null, url:p.url(), https:p.url().startsWith('https://')?1:0,
    title:await p.title(),
    text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,400),
    turi_forma:!!(await p.$('form')), turi_mygtuka:!!(await p.$('button[type=submit]'))};
  O.po_GET=call('state');

  // --- 4) POST
  const btn=await p.$('button[type=submit]');
  if(btn){ await btn.click(); await wait(3500); }
  O.post={url:p.url(), text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,400)};
  O.po_POST=call('state');

  // --- 5) pakartotinis
  await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  O.pakartotinis={text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,300),
                  turi_forma:!!(await p.$('form'))};

  // --- 6) blogi tokenai
  for (const [name,u] of [['sugadintas',SITE+'/atsisakyti/?t=abcINVALIDxyz'],['tuscias',SITE+'/atsisakyti/']]) {
    await p.goto(u,{waitUntil:'domcontentloaded',timeout:60000}); await wait(1500);
    const t=(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ');
    O[name]={text:t.slice(0,220), atskleidzia_pasta:t.includes('e2e-unsub')?'TAIP_BLOGAI':'NE'};
  }
  await p.screenshot({path:'/tmp/unsub.png',fullPage:false});
  await ctx.close();
 }catch(e){ O.browser_err=String(e).slice(0,300); }
 try{ if(br) await br.close(); }catch(e){}
 call('cleanup');
 fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
 sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
 putB64('ue2e.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
 try{ putB64('unsub.png', fs.readFileSync('/tmp/unsub.png').toString('base64')); }catch(e){}
}
console.log('done');
