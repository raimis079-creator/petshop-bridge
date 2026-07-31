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

const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_re']) ) return;
  $k=$_GET['ps_re']; global $wpdb; $T=Petshop_Cart_Tracker::table();
  $CID='c_e2e_recovery';
  if ($k==='setup') {
    $ids=wc_get_products(array('limit'=>30,'status'=>'publish','return'=>'ids'));
    $a=0;$b=0;
    foreach((array)$ids as $x){ $p=wc_get_product($x);
      if($p&&$p->is_purchasable()&&$p->is_in_stock()){ if(!$a){$a=(int)$x;} elseif(!$b){$b=(int)$x;break;} } }
    $items=array(
      array('product_id'=>$a,'variation_id'=>0,'quantity'=>2,'variation'=>array(),'item_data'=>array()),
      array('product_id'=>$b,'variation_id'=>0,'quantity'=>1,'variation'=>array(),'item_data'=>array()),
    );
    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    $now=current_time('mysql',true);
    $wpdb->insert($T,array('cart_id'=>$CID,'email'=>'rec-e2e@example.com','email_source'=>'checkout',
      'last_cart_activity_at'=>$now,'cart_hash'=>'he2e','snapshot_json'=>wp_json_encode($items),
      'snapshot_version'=>1,'status'=>'abandoned','status_changed_at'=>$now,'created_at'=>$now,'updated_at'=>$now));
    $r=array('cart_id'=>$CID,'prekes'=>array($a,$b),'link'=>Petshop_Cart_Recovery::link($CID));
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r,JSON_UNESCAPED_SLASHES); exit;
  }
  if ($k==='cleanup') {
    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
  }
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP E2E Recovery v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
O.sid=sid;
const call=(k)=>{ const g=sh('curl -sSk "'+SITE+'/?ps_re='+k+'"'); try{return JSON.parse(g.out);}catch(e){return {raw:g.out.slice(0,300)};} };
if(sid){
 sh('sleep 3');
 O.setup=call('setup');
 const URL=O.setup && O.setup.link;
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1100,height:1000},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();

  // krepselis PRIES
  await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(2500);
  O.krepselis_pries=(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,180);

  // GET
  const resp=await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  O.get={status:resp?resp.status():null,https:p.url().startsWith('https://')?1:0,
    title:await p.title(),
    text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,500),
    forma:!!(await p.$('form')), mygtukas:!!(await p.$('button[type=submit]'))};

  // krepselis po GET — turi likti TUSCIAS
  await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:60000}); await wait(2500);
  const t1=(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ');
  O.krepselis_po_GET={tuscias:/tušč|tusc|empty/i.test(t1)?1:0, tekstas:t1.slice(0,180)};

  // POST
  await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  const b=await p.$('button[type=submit]');
  if(b){
    try{
      await Promise.all([
        p.waitForNavigation({waitUntil:'domcontentloaded',timeout:45000}),
        b.click()
      ]);
    }catch(e){ O.nav_warn=String(e).slice(0,140); }
    await wait(4000);
    // jei liko ant tarpinio — einam i krepseli
    if(!/cart|krepsel/i.test(p.url())){
      try{ await p.goto(SITE+'/cart/',{waitUntil:'domcontentloaded',timeout:45000}); await wait(2500); }catch(e){}
    }
  }
  O.po_POST={url:p.url(),
    krepselio_psl:/cart|krepsel/i.test(p.url())?1:0,
    text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,500)};
  const rows=await p.$$eval('.cart_item, tr.woocommerce-cart-form__cart-item', es=>es.map(e=>(e.innerText||'').replace(/\s+/g,' ').slice(0,120)));
  O.krepselio_eilutes=rows;

  // pakartotinis tokenas
  await p.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await wait(2000);
  O.pakartotinis={text:(await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,250),
                  forma:!!(await p.$('form'))};
  await p.screenshot({path:'/tmp/rec.png',fullPage:false});
  await ctx.close();
 }catch(e){ O.browser_err=String(e).slice(0,300); }
 try{ if(br) await br.close(); }catch(e){}
 call('cleanup');
 fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
 sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('re2e.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
try{ putB64('rec.png', fs.readFileSync('/tmp/rec.png').toString('base64')); }catch(e){}
console.log('done');
