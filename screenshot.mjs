process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'NUOTRAUKA RECON', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}

const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'Nu7tR3' ) return;
  @set_time_limit(180);
  global $wpdb; $p=$wpdb->prefix;
  $o = array('marker'=>'RECON NUOTRAUKA');

  /* 1. Visos „triusio ausys" prekes */
  $ids = $wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft','pending','private') AND post_title LIKE '%riu%io ausys%' ORDER BY ID");
  $sar = array();
  foreach ((array)$ids as $id) {
    $id=(int)$id;
    $th=(int)get_post_meta($id,'_thumbnail_id',true);
    $sar[] = array(
      'id'=>$id,
      'pav'=>get_the_title($id),
      'sku'=>get_post_meta($id,'_sku',true),
      'busena'=>get_post_status($id),
      'sukurta'=>get_post_field('post_date',$id),
      'thumb'=>$th,
      'thumb_yra'=> $th ? (get_post_type($th)==='attachment') : false,
      'thumb_url'=> $th ? (wp_get_attachment_url($th) ?: 'NERA URL') : '',
      'galerija'=>get_post_meta($id,'_product_image_gallery',true),
      'sandelis'=>get_post_meta($id,'_ps_sandelis',true),
    );
  }
  $o['ausys']=$sar;

  /* 2. Naujausios sukurtos prekes (paskutines 10) */
  $nauji = $wpdb->get_results("SELECT ID, post_title, post_status, post_date FROM {$p}posts WHERE post_type='product' ORDER BY ID DESC LIMIT 8", ARRAY_A);
  foreach ($nauji as &$n) {
    $n['thumb']=(int)get_post_meta($n['ID'],'_thumbnail_id',true);
    $n['sku']=get_post_meta($n['ID'],'_sku',true);
  }
  $o['naujausios']=$nauji;

  /* 3. Ar kas nors kabinasi ant thumbnail keitimo */
  $kabliai = array();
  foreach (array('updated_post_meta','added_post_meta','delete_post_meta','save_post_product','woocommerce_new_product','woocommerce_update_product') as $h) {
    global $wp_filter;
    if ( empty($wp_filter[$h]) ) { continue; }
    foreach ($wp_filter[$h]->callbacks as $pr => $cbs) {
      foreach ($cbs as $k => $cb) {
        $f=$cb['function'];
        if (is_array($f)) { $n=(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1]; }
        elseif ($f instanceof Closure) { $n='Closure'; }
        else { $n=(string)$f; }
        if ( stripos($n,'petshop')!==false || stripos($n,'ps_')!==false ) { $kabliai[$h][]=$n.' @'.$pr; }
      }
    }
  }
  $o['kabliai']=$kabliai;

  header('Content-Type: application/json; charset=utf-8');
  echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Nuotrauka Recon v1',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=Nu7tR3" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.recon=js(res)||res.slice(0,1500);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res nuotrauka',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nuotrauka.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/nuotrauka.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,2000));
