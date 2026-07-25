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
try{
  // 1. Rasti kuris augintinis yra ADMIN vartotojo primary (ta dashboard rodys pirma)
  const FIND=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_find']) || $_GET['ps_find']!=='Find25x') return;
  global $wpdb; $pf=$wpdb->prefix;
  $admin=get_user_by('login', '`+U+`');
  $uid=$admin?$admin->ID:1;
  // pirmas augintinis to vartotojo (is_primary arba maziausias id)
  $pet=$wpdb->get_row($wpdb->prepare("SELECT id,pet_name,species,is_primary FROM {$pf}ps_pets WHERE user_id=%d AND (deleted_at IS NULL OR deleted_at='0000-00-00 00:00:00') ORDER BY is_primary DESC, id ASC LIMIT 1", $uid), ARRAY_A);
  $prod=$wpdb->get_var("SELECT ID FROM {$pf}posts WHERE post_type='product' AND post_status='publish' LIMIT 1");
  header('Content-Type: application/json');
  echo '###FIND###'.json_encode(array('uid'=>$uid,'pet'=>$pet,'prod'=>$prod)).'###END###'; exit;
});`;
  const mkf=wj('POST','code-snippets/v1/snippets',{name:'FIND (temp)',code:FIND,scope:'front-end',active:true,priority:5});
  let sidf=null; try{sidf=JSON.parse(mkf).id;}catch(e){}
  execSync('sleep 4');
  let petId=null, uid=null, prod=null;
  try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_find=Find25x"',{maxBuffer:5e6,timeout:60000}).toString();
    const a=r.indexOf('###FIND###'),b=r.indexOf('###END###');
    if(a>=0&&b>a){ const d=JSON.parse(r.slice(a+10,b)); o.find=d; petId=d.pet?d.pet.id:null; uid=d.uid; prod=d.prod; } }catch(e){o.finderr=String(e).slice(0,100);}
  if(sidf!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sidf+'"');}catch(e){} }

  if(!petId){ o.fatal='no primary pet'; putB64('bcseed.json', Buffer.from(JSON.stringify(o)).toString('base64')); console.log('done'); }
  else {
    // 2. Seed to primary augintinio
    const SEED=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_seed2']) || $_GET['ps_seed2']!=='Seed2x') return;
  global $wpdb; $pf=$wpdb->prefix; $pid=`+petId+`; $uid=`+uid+`; $prod=`+prod+`;
  $wpdb->update("{$pf}ps_pets", array('primary_product_id'=>$prod,'primary_product_name'=>'Royal Canin Sterilised (TEST)','primary_product_package'=>'2 kg'), array('id'=>$pid));
  $wpdb->query("DELETE FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'");
  $wpdb->insert("{$pf}ps_reminders", array('user_id'=>$uid,'pet_id'=>$pid,'reminder_type'=>'flea_tick','reminder_label'=>'Apsauga nuo erkiu (TEST)','due_date'=>date('Y-m-d', time()+5*86400),'notify_email'=>1,'created_at'=>current_time('mysql')));
  $rt=$pf.'ps_refill_tracking';
  if($wpdb->get_var("SHOW TABLES LIKE '$rt'")){ $wpdb->query("DELETE FROM $rt WHERE pet_id=$pid");
    $wpdb->insert($rt, array('user_id'=>$uid,'pet_id'=>$pid,'product_id'=>$prod,'predicted_empty_date'=>date('Y-m-d', time()+9*86400),'avg_interval_days'=>30,'purchase_count'=>3,'confidence'=>0.8,'last_purchase_date'=>date('Y-m-d', time()-21*86400),'status'=>'active')); }
  header('Content-Type: application/json'); echo '###OK###'; exit;
});`;
    const mks=wj('POST','code-snippets/v1/snippets',{name:'SEED2 (temp)',code:SEED,scope:'front-end',active:true,priority:5});
    let sids=null; try{sids=JSON.parse(mks).id;}catch(e){}
    execSync('sleep 4');
    try{ execSync('curl -sk "https://dev.avesa.lt/?ps_seed2=Seed2x"',{maxBuffer:5e6,timeout:60000}); }catch(e){}
    o.seededPet=petId;

    // 3. Screenshot (primary augintinis rodomas automatiskai)
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ args: ['--no-sandbox'] });
    const ctx = await browser.newContext({ viewport: { width: 1000, height: 1500 }, ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    await page.goto('https://dev.avesa.lt/wp-login.php', { timeout: 30000 });
    await page.waitForSelector('#user_login', { timeout: 10000 });
    await page.fill('#user_login', U); await page.fill('#user_pass', P);
    await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle' }), page.click('#wp-submit')]);
    await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil: 'networkidle', timeout: 40000 });
    await page.waitForTimeout(3500);
    try { await page.evaluate(() => { document.querySelectorAll('[id*="cmplz"],[class*="cmplz"]').forEach(function(e){if(e&&e.remove)e.remove();}); }); } catch(e){}
    await page.waitForTimeout(1500);
    try {
      o.snap = await page.evaluate(() => {
        var main=document.querySelector('.woocommerce-MyAccount-content')||document.body;
        var t = main ? main.innerText : '';
        return {
          hasNow: !!document.querySelector('.pspet-now'),
          nowTitle: document.querySelector('.pspet-now-t')?document.querySelector('.pspet-now-t').innerText.trim():null,
          feedingPlan: t.includes('Peržiūrėti planą'),
          shelf: t.includes('Maisto dar ~'),
          refillFb: t.includes('Dar liko'),
          repeat: t.includes('Įprasti pirkiniai')
        };
      });
    } catch(e){ o.snaperr=String(e).slice(0,120); }
    const buf=await page.screenshot({ fullPage:true }); fs.writeFileSync('/tmp/bcseed.png', buf); shots.push('bcseed');
    await browser.close();

    // 4. Isvalau
    const CLEAN=`<?php
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_cl2']) || $_GET['ps_cl2']!=='Cl2x') return;
  global $wpdb; $pf=$wpdb->prefix; $pid=`+petId+`;
  $wpdb->update("{$pf}ps_pets", array('primary_product_id'=>null,'primary_product_name'=>null,'primary_product_package'=>null), array('id'=>$pid));
  $wpdb->query("DELETE FROM {$pf}ps_reminders WHERE pet_id=$pid AND reminder_label LIKE '%TEST%'");
  $rt=$pf.'ps_refill_tracking'; if($wpdb->get_var("SHOW TABLES LIKE '$rt'")){ $wpdb->query("DELETE FROM $rt WHERE pet_id=$pid"); }
  header('Content-Type: application/json'); echo '###CLEANOK###'; exit;
});`;
    const mkc=wj('POST','code-snippets/v1/snippets',{name:'CL2 (temp)',code:CLEAN,scope:'front-end',active:true,priority:5});
    let sidc=null; try{sidc=JSON.parse(mkc).id;}catch(e){}
    execSync('sleep 4');
    try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_cl2=Cl2x"',{maxBuffer:5e6,timeout:60000}).toString(); o.clean=r.includes('CLEANOK')?'OK':r.slice(0,60); }catch(e){o.clean='ERR';}
    [sids,sidc].forEach(function(id){ if(id!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+id+'"');}catch(e){} } });
  }
}catch(e){ o.fatal=String(e).slice(0,300); }
for (const n of shots) { try { putB64(n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); } catch(e){} }
putB64('bcseed.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
