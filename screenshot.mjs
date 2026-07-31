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

// snippetas: sukuria krepseli, grazina tokena, ir ATSKIRAI leidzia isbandyti atkurima PHP viduje
const php = Buffer.from(`<?php
add_action('wp_loaded', function(){
  if ( ! isset($_GET['ps_pd']) ) return;
  $k=$_GET['ps_pd']; global $wpdb; $T=Petshop_Cart_Tracker::table(); $CID='c_pdiag';
  if ($k==='setup') {
    $ids=wc_get_products(array('limit'=>30,'status'=>'publish','return'=>'ids'));
    $a=0; foreach((array)$ids as $x){ $p=wc_get_product($x); if($p&&$p->is_purchasable()&&$p->is_in_stock()){$a=(int)$x;break;} }
    $items=array(array('product_id'=>$a,'variation_id'=>0,'quantity'=>2,'variation'=>array(),'item_data'=>array()));
    $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    $now=current_time('mysql',true);
    $wpdb->insert($T,array('cart_id'=>$CID,'email'=>'pd@example.com','last_cart_activity_at'=>$now,
      'cart_hash'=>'hpd','snapshot_json'=>wp_json_encode($items),'snapshot_version'=>1,
      'status'=>'abandoned','status_changed_at'=>$now,'created_at'=>$now,'updated_at'=>$now));
    $link=Petshop_Cart_Recovery::link($CID);
    parse_str(parse_url($link,PHP_URL_QUERY),$q);
    nocache_headers(); header('Content-Type: application/json');
    echo wp_json_encode(array('link'=>$link,'token'=>$q['t']??'','preke'=>$a),JSON_UNESCAPED_SLASHES); exit;
  }
  if ($k==='wc') {
    // ar WC()->cart pasiekiamas template_redirect kontekste
    $r=array('WC_exists'=>function_exists('WC')?1:0,
      'wc_obj'=>function_exists('WC')&&WC()?1:0,
      'cart_obj'=>function_exists('WC')&&WC()->cart?1:0,
      'session_obj'=>function_exists('WC')&&WC()->session?1:0,
      'wc_load_cart_exists'=>function_exists('wc_load_cart')?1:0);
    if (function_exists('wc_load_cart')) { wc_load_cart(); $r['po_load_cart']=WC()->cart?1:0; }
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode($r); exit;
  }
  if ($k==='cleanup') { $wpdb->query($wpdb->prepare("DELETE FROM $T WHERE cart_id=%s",$CID));
    nocache_headers(); header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }
},1);`).toString('base64');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Recovery POST Diag v1',code:Buffer.from(php,'base64').toString('utf8'),scope:'global',active:true}));
let sid=null;
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
O.sid=sid;
if(sid){
  sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_pd=setup"');
  try{O.setup=JSON.parse(g.out);}catch(e){O.setup_raw=g.out.slice(0,300);}
  const w=sh('curl -sSk "'+SITE+'/?ps_pd=wc"');
  try{O.wc=JSON.parse(w.out);}catch(e){O.wc_raw=w.out.slice(0,300);}

  const tok=O.setup && O.setup.token;
  if(tok){
    // GET su cookie jar
    const gg=sh('curl -sSk -c /tmp/cj.txt -o /tmp/get.html -w "%{http_code}" "'+SITE+'/atkurti-krepseli/?t='+encodeURIComponent(tok)+'"');
    O.get_code=gg.out.trim();
    const html=fs.readFileSync('/tmp/get.html','utf8');
    const m=html.match(/name="_psnonce"\s+value="([^"]+)"/);
    O.nonce=m?m[1]:null;
    if(m){
      // POST su ta pacia sesija
      const pp=sh('curl -sSk -b /tmp/cj.txt -c /tmp/cj.txt -o /tmp/post.html -w "%{http_code}|%{redirect_url}" -X POST '
        +'--data-urlencode "t='+tok+'" --data-urlencode "_psnonce='+m[1]+'" '
        +'"'+SITE+'/atkurti-krepseli/"');
      O.post_result=pp.out.trim();
      const body=fs.readFileSync('/tmp/post.html','utf8');
      O.post_body=body.replace(/\s+/g,' ').slice(0,900);
      O.post_len=body.length;
    }
  }
  sh('curl -sSk -o /dev/null "'+SITE+'/?ps_pd=cleanup"');
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('pdiag.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
