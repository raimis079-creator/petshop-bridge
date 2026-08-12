process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'SANDELIU RECON', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Sn4tD1' ) return;
  @set_time_limit(240);
  global $wpdb; $p=$wpdb->prefix;
  $o=array('marker'=>'SANDELIAI');

  /* kiek prekiu pagal sandeli + kiek ju turi likuti */
  $o['pagal_sandeli']=$wpdb->get_results(
    "SELECT COALESCE(m.meta_value,'(nėra)') sand, COUNT(*) kiek,
            SUM(CASE WHEN po.post_status='publish' THEN 1 ELSE 0 END) prekyboje
       FROM {$p}posts po
       LEFT JOIN {$p}postmeta m ON m.post_id=po.ID AND m.meta_key='_ps_sandelis'
      WHERE po.post_type='product' AND po.post_status IN ('publish','draft')
      GROUP BY sand ORDER BY kiek DESC", ARRAY_A);

  /* ar _own_stock_qty apskritai naudojamas */
  $o['own_stock_kiek']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_own_stock_qty'");

  /* stock service ir sources */
  $o['klases']=array(
    'stock_service'=>class_exists('Petshop_Stock_Service'),
    'sources'=>class_exists('Petshop_Sources'),
    'fulfillment'=>class_exists('Petshop_Fulfillment_Source'),
    'av_stock'=>class_exists('Petshop_AV_Stock'),
  );
  if (class_exists('Petshop_Stock_Service')) {
    $o['stock_metodai']=get_class_methods('Petshop_Stock_Service');
  }

  /* ps_sources lentele */
  $t=$p.'ps_sources';
  if ($wpdb->get_var("SHOW TABLES LIKE '{$t}'")===$t) {
    $o['sources_stulpeliai']=$wpdb->get_col("SHOW COLUMNS FROM {$t}");
    $o['sources_pagal_tipa']=$wpdb->get_results("SELECT source, COUNT(*) kiek, SUM(qty) viso FROM {$t} GROUP BY source", ARRAY_A);
  }

  /* pavyzdys: ambrosia/prins/quattro preke */
  foreach (array('ambrosia','prins','quattro','belcor_tofu') as $sd) {
    $pid=(int)$wpdb->get_var($wpdb->prepare("SELECT post_id FROM {$p}postmeta WHERE meta_key='_ps_sandelis' AND meta_value=%s LIMIT 1",$sd));
    if(!$pid) { $o['pvz_'.$sd]='nerasta'; continue; }
    $pr=wc_get_product($pid);
    $o['pvz_'.$sd]=array('id'=>$pid,'pav'=>mb_substr(get_the_title($pid),0,34),
      '_stock'=>get_post_meta($pid,'_stock',true),
      '_own_stock_qty'=>get_post_meta($pid,'_own_stock_qty',true),
      'manage_stock'=>$pr?($pr->get_manage_stock()?'taip':'ne'):'?',
      'stock_status'=>$pr?$pr->get_stock_status():'?',
      'parduodama'=>$pr?$pr->get_stock_quantity():'?');
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Sandeliu Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Sn4tD1" --max-time 150`,{encoding:'utf8',maxBuffer:40*1024*1024});
  out.recon=js(res)||res.slice(0,1200);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res sand',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sand.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sand.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
