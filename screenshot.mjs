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
const o={}; const shots=[];
const PID=144, UID=1;
try{
  const SEED=`<?php
add_action('wp_loaded', function(){
  if(isset($_GET['ps_go4'])){ $tok=sanitize_text_field($_GET['ps_go4']); $uid=get_transient('psg4_'.$tok);
    if($uid){ wp_set_auth_cookie($uid,false); wp_set_current_user($uid); wp_safe_redirect('https://dev.avesa.lt/my-account/augintinis/'); exit; } }
  if(isset($_GET['ps_mk4']) && $_GET['ps_mk4']==='Mk4x'){
    global $wpdb; $pf=$wpdb->prefix; $pid=`+PID+`; $uid=`+UID+`;
    $prod=$wpdb->get_var("SELECT ID FROM {$pf}posts WHERE post_type='product' AND post_status='publish' LIMIT 1");
    $wpdb->update("{$pf}ps_pets", array('primary_product_id'=>$prod,'primary_product_name'=>'Royal Canin Sterilised (TEST)','primary_product_package'=>'2 kg'), array('id'=>$pid));
    $wpdb->query("DELETE FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'");
    $wpdb->insert("{$pf}ps_reminders", array('user_id'=>$uid,'pet_id'=>$pid,'reminder_type'=>'flea_tick','reminder_label'=>'Apsauga nuo erkiu (TEST)','due_date'=>date('Y-m-d', time()+5*86400),'notify_email'=>1,'created_at'=>current_time('mysql')));
    $rt=$pf.'ps_refill_tracking';
    if($wpdb->get_var("SHOW TABLES LIKE '$rt'")){ $wpdb->query("DELETE FROM $rt WHERE pet_id=$pid");
      $wpdb->insert($rt, array('user_id'=>$uid,'pet_id'=>$pid,'product_id'=>$prod,'predicted_empty_date'=>date('Y-m-d', time()+9*86400),'avg_interval_days'=>30,'purchase_count'=>3,'confidence'=>0.8,'last_purchase_date'=>date('Y-m-d', time()-21*86400),'status'=>'active')); }
    $tok=wp_generate_password(20,false); set_transient('psg4_'.$tok,$uid,300);
    header('Content-Type: application/json'); echo '###T###'.$tok.'###E###'; exit; }
});`;
  const mk=wj('POST','code-snippets/v1/snippets',{name:'BSHOT2 (temp)',code:SEED,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  let token=null;
  try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_mk4=Mk4x"',{maxBuffer:5e6,timeout:60000}).toString();
    const a=r.indexOf('###T###'),b=r.indexOf('###E###'); if(a>=0&&b>a) token=r.slice(a+7,b); }catch(e){}
  o.gotToken=!!token;

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1700 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto('https://dev.avesa.lt/?ps_go4='+token, { waitUntil:'domcontentloaded', timeout:40000 });
  // laukiam kol profilis surenderina (REST fetch)
  await page.waitForTimeout(8000);
  try { await page.evaluate(() => { document.querySelectorAll('[id*="cmplz"],[class*="cmplz"]').forEach(function(e){if(e&&e.remove)e.remove();}); }); } catch(e){}
  await page.waitForTimeout(1000);
  o.snap = await page.evaluate(() => {
    var prof=document.querySelector('.pspet-profile'); var t = prof ? prof.innerText : '';
    return {
      hasProfile: !!prof,
      petName: prof ? (prof.innerText.split('\n')[0]||'').slice(0,20) : null,
      hasNow: !!document.querySelector('.pspet-now'),
      nowTitle: document.querySelector('.pspet-now-t')?document.querySelector('.pspet-now-t').innerText.trim().slice(0,60):null,
      feedingPlan: t.includes('Peržiūrėti planą'),
      shelf: t.includes('Maisto dar ~'),
      refillFb: t.includes('Dar liko'),
      repeat: t.includes('Įprasti pirkiniai'),
      testProduct: t.includes('TEST')
    };
  });
  try { const buf=await page.screenshot({ fullPage:true, timeout:30000 }); fs.writeFileSync('/tmp/bcshot.png', buf); shots.push('bcshot'); }
  catch(e){ o.shoterr=String(e).slice(0,100); try{ const b2=await page.screenshot({ timeout:20000 }); fs.writeFileSync('/tmp/bcshot.png', b2); shots.push('bcshot'); }catch(e2){} }

  await browser.close();

  // CLEAN
  const CLEAN=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_c9']) || $_GET['ps_c9']!=='C9x') return;
  global $wpdb; $pf=$wpdb->prefix; $pid=`+PID+`;
  $wpdb->update("{$pf}ps_pets", array('primary_product_id'=>null,'primary_product_name'=>null,'primary_product_package'=>null), array('id'=>$pid));
  $wpdb->query("DELETE FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'");
  $rt=$pf.'ps_refill_tracking'; if($wpdb->get_var("SHOW TABLES LIKE '$rt'")){ $wpdb->query("DELETE FROM $rt WHERE pet_id=$pid"); }
  header('Content-Type: application/json'); echo '###C###'.json_encode(array('food'=>$wpdb->get_var("SELECT primary_product_name FROM {$pf}ps_pets WHERE id=$pid"),'rem'=>$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'"),'rt'=>$wpdb->get_var("SELECT COUNT(*) FROM $rt WHERE pet_id=$pid"))).'###E###'; exit;
});`;
  const mkc=wj('POST','code-snippets/v1/snippets',{name:'C8 (temp)',code:CLEAN,scope:'front-end',active:true,priority:5});
  let sidc=null; try{sidc=JSON.parse(mkc).id;}catch(e){}
  execSync('sleep 4');
  try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_c9=C9x"',{maxBuffer:5e6,timeout:60000}).toString();
    const a=r.indexOf('###C###'),b=r.indexOf('###E###'); o.clean=(a>=0&&b>a)?r.slice(a+7,b):r.slice(0,60); }catch(e){o.clean='ERR';}
  [sid,sidc].forEach(function(id){ if(id!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+id+'"');}catch(e){} } });
}catch(e){ o.fatal=String(e).slice(0,300); }
for (const n of shots) { try { putB64(n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); } catch(e){} }
putB64('bcshot.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
