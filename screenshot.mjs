import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };

const php = `
// TEMP Zaislu Preset Maker - dry/apply, gated
add_action('init', function(){
  if ( ! isset($_GET['ps_make_zaislu_preset']) ) return;
  if ( ($_GET['k'] ?? '') !== 'ps2026' ) { status_header(403); echo 'no'; exit; }
  $mode = $_GET['ps_make_zaislu_preset'];
  header('Content-Type: application/json; charset=utf-8');

  $tpl = get_page_by_path('dubeneliu-filtras', OBJECT, 'yith_wcan_preset');
  if ( ! $tpl ) { echo wp_json_encode(array('error'=>'no template')); exit; }
  $filters = get_post_meta($tpl->ID, '_filters', true);
  if ( is_string($filters) ) { $filters = maybe_unserialize($filters); }
  if ( ! is_array($filters) ) { echo wp_json_encode(array('error'=>'bad filters')); exit; }

  $f_tipas = $filters[1];
  $f_medz  = $filters[2];
  $f_brand = $filters[3];

  $f1 = $f_tipas;
  $f1['taxonomy'] = 'pa_zaislo_tipas';
  $f1['title']    = "\\u{017D}aislo tipas";
  $f1['toggle_style'] = 'opened';

  $f2 = $f_medz;
  $f2['taxonomy'] = 'pa_medziaga';
  $f2['toggle_style'] = 'closed';

  $f3 = $f_medz;
  $f3['taxonomy'] = 'pa_dydis';
  $f3['title']    = 'Dydis';
  $f3['toggle_style'] = 'closed';

  $f4 = $f_brand;

  $new_filters = array( 1=>$f1, 2=>$f2, 3=>$f3, 4=>$f4 );

  if ( $mode === 'dry' ) {
    $plan = array();
    foreach ($new_filters as $i=>$f) { $plan[] = array('pos'=>$i,'title'=>$f['title'],'taxonomy'=>$f['taxonomy'],'design'=>$f['filter_design'],'toggle'=>$f['toggle_style']); }
    echo wp_json_encode(array('mode'=>'dry','template_id'=>$tpl->ID,'plan'=>$plan));
    exit;
  }
  if ( $mode === 'apply' ) {
    $existing = get_page_by_path('zaislu-filtras', OBJECT, 'yith_wcan_preset');
    if ( $existing ) { $pid = $existing->ID; }
    else {
      $pid = wp_insert_post(array('post_title'=>"\\u{017D}aisl\\u{0173} filtras",'post_name'=>'zaislu-filtras','post_type'=>'yith_wcan_preset','post_status'=>'publish'));
    }
    if ( ! $pid || is_wp_error($pid) ) { echo wp_json_encode(array('error'=>'insert failed')); exit; }
    update_post_meta($pid, '_enabled', 'yes');
    update_post_meta($pid, '_layout', 'default');
    update_post_meta($pid, '_filters', $new_filters);
    echo wp_json_encode(array('mode'=>'apply','preset_id'=>$pid,'slug'=>'zaislu-filtras','filters'=>count($new_filters)));
    exit;
  }
  echo wp_json_encode(array('error'=>'unknown mode'));
  exit;
}, 99);
`;

const out = {};
fs.writeFileSync("/tmp/snip.json", JSON.stringify({ name: "Petshop Zaislu Preset Maker TEMP", code: php, scope: "global", active: true }));
try {
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/snip.json "${base}/wp-json/code-snippets/v1/snippets"`, { encoding: "utf8", env }).trim();
  out.create_code = cr;
  try { const j = JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")); out.maker_id = j.id; out.active = j.active; } catch(e){ out.create_head = fs.readFileSync("/tmp/cr.txt","utf8").slice(0,200); }
} catch(e){ out.create_err = String(e).slice(0,150); }
try {
  execSync("sleep 2");
  const dry = execSync(`curl -sk --max-time 30 "${base}/?ps_make_zaislu_preset=dry&k=ps2026"`, { encoding: "utf8", env });
  out.dry = dry.slice(0, 2000);
} catch(e){ out.dry_err = String(e).slice(0,150); }
fs.writeFileSync("screenshots/maker.txt", JSON.stringify(out, null, 2));
