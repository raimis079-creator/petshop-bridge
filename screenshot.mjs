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
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:''};}}
const O={}; const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';

const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_cv']) ) return;
  $k=$_GET['ps_cv']; global $wpdb; $T=Petshop_Cart_Tracker::table(); $CID='c_cv_test';
  if ($k==='setup') {
    $ids=wc_get_products(array('limit'=>30,'status'=>'publish','return'=>'ids'));
    $a=0;$b=0; foreach((array)$ids as $x){ $p=wc_get_product($x);
      if($p&&$p->is_purchasable()&&$p->is_in_stock()){ if(!$a){$a=(int)$x;} elseif(!$b){$b=(int)$x;break;} } }
    $items=array(
      array('product_id'=>$a,'variation_id'=>0,'quantity'=>2,'variation'=>array(),'item_data'=>array()),
      array('product_id'=>$b,'variation_id'=>0,'quantity'=>1,'variation'=>array(),'item_data'=>array()));
    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    $now=current_time('mysql',true);
    $wpdb->insert($T,array('cart_id'=>$CID,'email'=>'cv@example.com','last_cart_activity_at'=>$now,
      'cart_hash'=>'hcv','snapshot_json'=>wp_json_encode($items),'snapshot_version'=>1,
      'status'=>'abandoned','status_changed_at'=>$now,'created_at'=>$now,'updated_at'=>$now));
    $link=Petshop_Cart_Recovery::link($CID);
    parse_str(parse_url($link,PHP_URL_QUERY),$q);
    $pa=wc_get_product($a); $pb=wc_get_product($b);
    nocache_headers(); header('Content-Type: application/json');
    echo wp_json_encode(array('token'=>$q['t']??'','a'=>$a,'b'=>$b,
      'a_name'=>$pa?mb_substr($pa->get_name(),0,30):'','b_name'=>$pb?mb_substr($pb->get_name(),0,30):''),JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit;
  }
  if ($k==='cleanup') { $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Cart Verify v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
if(sid){
  sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_cv=setup"');
  try{O.setup=JSON.parse(g.out);}catch(e){O.setup_raw=g.out.slice(0,300);}
  const tok=O.setup&&O.setup.token;
  if(tok){
    sh('rm -f /tmp/cj2.txt');
    // 1) krepselis PRIES (sukuria sesija)
    sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/c0.html "'+SITE+'/cart/"');
    const c0=fs.readFileSync('/tmp/c0.html','utf8');
    O.pries={turi_A:c0.includes(O.setup.a_name)?1:0,turi_B:c0.includes(O.setup.b_name)?1:0,len:c0.length};
    // 2) GET recovery
    sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/g1.html "'+SITE+'/atkurti-krepseli/?t='+encodeURIComponent(tok)+'"');
    const g1=fs.readFileSync('/tmp/g1.html','utf8');
    const m=g1.match(/name="_psnonce"\s+value="([^"]+)"/);
    O.nonce=!!m;
    // 3) krepselis PO GET
    sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/c1.html "'+SITE+'/cart/"');
    const c1=fs.readFileSync('/tmp/c1.html','utf8');
    O.po_GET={turi_A:c1.includes(O.setup.a_name)?1:0,turi_B:c1.includes(O.setup.b_name)?1:0};
    if(m){
      // 4) POST
      const pp=sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/p1.html -w "%{http_code}|%{redirect_url}" -X POST '
        +'--data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" "'+SITE+'/atkurti-krepseli/"');
      O.post=pp.out.trim();
      // 5) krepselis PO POST
      sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/c2.html "'+SITE+'/cart/"');
      const c2=fs.readFileSync('/tmp/c2.html','utf8');
      const qty=[...c2.matchAll(/name="cart\\[[^\\]]+\\]\\[qty\\]"[^>]*value="(\\d+)"/g)].map(x=>x[1]);
      O.po_POST={turi_A:c2.includes(O.setup.a_name)?1:0,turi_B:c2.includes(O.setup.b_name)?1:0,
        kiekiai:qty, eiluciu:(c2.match(/cart_item/g)||[]).length, len:c2.length};
      // 6) pakartotinis POST
      const pp2=sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/p2.html -w "%{http_code}" -X POST '
        +'--data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" "'+SITE+'/atkurti-krepseli/"');
      const p2=fs.readFileSync('/tmp/p2.html','utf8');
      O.pakartotinis={code:pp2.out.trim(),tekstas:p2.replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').slice(0,160)};
      // 7) krepselis po pakartotinio — NETURI dubliuotis
      sh('curl -sSk -c /tmp/cj2.txt -b /tmp/cj2.txt -o /tmp/c3.html "'+SITE+'/cart/"');
      const c3=fs.readFileSync('/tmp/c3.html','utf8');
      const qty3=[...c3.matchAll(/name="cart\\[[^\\]]+\\]\\[qty\\]"[^>]*value="(\\d+)"/g)].map(x=>x[1]);
      O.po_pakartotinio={kiekiai:qty3, eiluciu:(c3.match(/cart_item/g)||[]).length};
    }
  }
  sh('curl -sSk -o /dev/null "'+SITE+'/?ps_cv=cleanup"');
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('cverify.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
