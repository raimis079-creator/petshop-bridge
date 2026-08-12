process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'ATSTATYMAS DRY2', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const php = `
add_action('init', function(){
  if ( ( $_GET['ps_rec'] ?? '' ) !== 'At5tR9' ) return;
  @set_time_limit(240);
  global $wpdb; $p=$wpdb->prefix; $z=$p.'ps_ivykiai';
  $o=array('marker'=>'ATSTATYMAS APPLY');
  /* TIK tos, kurias ZMOGUS isieme ir AUTOMATIKA grazino. Preke #34907
     i sarasa buvo patekusi klaidingai: ji sukurta juodrastyje ir ZMOGAUS
     publikuota — jokio automatikos isikisimo ten nebuvo. */
  $ids = array(26471, 26473, 25319);
  $sar=array();
  foreach($ids as $pid){
    $pries = get_post_status($pid);
    $isimta = $wpdb->get_var($wpdb->prepare(
      "SELECT MAX(laikas) FROM {$z} WHERE product_id=%d AND laukas='post_status'
        AND nauja='draft' AND saltinis='zmogus'", $pid));
    if ( ! $isimta ) { $sar[]=array('id'=>$pid,'praleista'=>'nerasta rankinio isemimo'); continue; }
    update_post_meta($pid,'_ps_ranka_isimta','taip');
    update_post_meta($pid,'_ps_ranka_isimta_kada',$isimta);
    if ( get_post_meta($pid,'_ps_ranka_isimta_kas',true) === '' ) {
      update_post_meta($pid,'_ps_ranka_isimta_kas','Rai');
    }
    if ( $pries === 'publish' ) { wp_update_post(array('ID'=>$pid,'post_status'=>'draft')); clean_post_cache($pid); }
    $sar[]=array('id'=>$pid,'pav'=>mb_substr(html_entity_decode(get_the_title($pid)),0,44),
      'buvo'=>$pries,'tapo'=>get_post_status($pid),
      'zyme'=>get_post_meta($pid,'_ps_ranka_isimta',true),'isimta'=>$isimta);
  }
  $o['rezultatas']=$sar;
  delete_transient('ps_kat_duomenys');
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;

const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Atstatymas v3',code:php,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_rec=At5tR9" --max-time 150`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.dry=js(res)||res.slice(0,900);
}catch(e){ out.err=String(e).slice(0,300); }
if(j1&&j1.id) await wp('/wp-json/code-snippets/v1/snippets/'+j1.id,{method:'DELETE'});
const body={message:'res atst2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atst3.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atst3.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
