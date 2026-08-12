process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'VALYMAS+FEFO TESTAS', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_f'] ?? '' ) !== 'Fe6tT1' ) return;
  @set_time_limit(180);
  global $wpdb; $t=$wpdb->prefix.'ps_partijos'; $pid=19902;
  $adm=get_users(array('role'=>'administrator','number'=>1)); wp_set_current_user($adm?$adm[0]->ID:0);
  $o=array('marker'=>'FEFO');
  $step=(string)($_GET['step'] ?? '1');

  if ($step==='1') {
    /* FEFO nurasymo testas: likutis 6, partija #17 su 4 vnt. Nurasom -3. */
    $o['pries']=array('stock'=>get_post_meta($pid,'_stock',true),
      'partijos'=>$wpdb->get_results("SELECT id,kiekis_liko,geriausia_iki FROM {$t} WHERE product_id={$pid}", ARRAY_A));
    $_POST=array('priezastis'=>'nurasymas','pakeitimai'=>wp_json_encode(array(array('id'=>$pid,'ivestis'=>'-3'))),'nonce'=>wp_create_nonce('ps_kat'));
    $_REQUEST=$_POST;
    Petshop_Katalogas::ajax_av_irasyti();
  }
  if ($step==='2') {
    $o['po']=array('stock'=>get_post_meta($pid,'_stock',true),
      'partijos'=>$wpdb->get_results("SELECT id,kiekis_liko,geriausia_iki FROM {$t} WHERE product_id={$pid}", ARRAY_A));
    header('Content-Type: application/json'); echo wp_json_encode($o,JSON_UNESCAPED_UNICODE); exit;
  }
  if ($step==='3') {
    /* VALYMAS: testines partijos salinamos, likutis grazinamas i 2 */
    $n=$wpdb->query("DELETE FROM {$t} WHERE product_id={$pid}");
    update_post_meta($pid,'_stock','2'); update_post_meta($pid,'_stock_status','instock');
    $wpdb->update($wpdb->prefix.'wc_product_meta_lookup', array('stock_quantity'=>2), array('product_id'=>$pid));
    update_post_meta($pid,'_cost_price','4.18');
    clean_post_cache($pid); delete_transient('ps_kat_duomenys');
    $o['isvalyta']=$n;
    $o['galutinis']=array('stock'=>get_post_meta($pid,'_stock',true),
      'partiju'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE product_id={$pid}"));
    header('Content-Type: application/json'); echo wp_json_encode($o,JSON_UNESCAPED_UNICODE); exit;
  }
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP FEFO Testas',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
await new Promise(r=>setTimeout(r,4000));
for (const st of ['1','2','3']) {
  try{
    const res=execSync(`curl -sk "${B}/?ps_f=Fe6tT1&step=${st}" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
    out['step'+st]=js(res)||res.slice(0,300);
  }catch(e){ out['step'+st]='ERR'; }
  await new Promise(r=>setTimeout(r,1500));
}
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res fefo',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/fefo.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/fefo.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
