import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };

// PHP dump kodas (be <?php, ASCII komentarai)
const php = `
// TEMP Preset Dump - read-only, gated tokenu
add_action('init', function(){
  if ( ! isset($_GET['ps_preset_dump']) ) return;
  if ( ($_GET['k'] ?? '') !== 'ps2026' ) { status_header(403); echo 'no'; exit; }
  header('Content-Type: application/json; charset=utf-8');
  $out = array('presets'=>array());
  $posts = get_posts(array('post_type'=>'yith_wcan_preset','numberposts'=>-1,'post_status'=>'any'));
  foreach($posts as $p){
    $out['presets'][] = array('ID'=>$p->ID,'slug'=>$p->post_name,'title'=>$p->post_title);
  }
  $tpl = get_page_by_path('dubeneliu-filtras', OBJECT, 'yith_wcan_preset');
  if($tpl){
    $out['template'] = array('ID'=>$tpl->ID,'slug'=>$tpl->post_name,'meta'=>get_post_meta($tpl->ID));
    $fs = get_posts(array('post_type'=>'yith_wcan_filter','numberposts'=>-1,'post_status'=>'any','post_parent'=>$tpl->ID));
    $out['template_filters'] = array();
    foreach($fs as $f){ $out['template_filters'][] = array('ID'=>$f->ID,'title'=>$f->post_title,'meta'=>get_post_meta($f->ID)); }
  }
  echo wp_json_encode($out);
  exit;
});
`;

const out = {};
// 1) CREATE snippet (active)
fs.writeFileSync("/tmp/snip.json", JSON.stringify({ name: "Petshop Preset Dump TEMP", code: php, scope: "global", active: true }));
try {
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/snip.json "${base}/wp-json/code-snippets/v1/snippets"`, { encoding: "utf8", env }).trim();
  out.create_code = cr;
  let sid = null;
  try { const j = JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")); sid = j.id; out.snippet_id = sid; out.active = j.active; }
  catch(e){ out.create_head = fs.readFileSync("/tmp/cr.txt","utf8").slice(0,200).replace(/\s+/g," "); }
  // 2) jei nesuaktyvejo - bandom activate route
  if (sid && !out.active) {
    try { const ac = execSync(`curl -sk -o /tmp/ac.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X POST "${base}/wp-json/code-snippets/v1/snippets/${sid}/activate"`, { encoding: "utf8", env }).trim(); out.activate_code = ac; } catch(e){ out.activate_err = String(e).slice(0,100); }
  }
  out.saved_sid = sid;
} catch(e){ out.create_err = String(e).slice(0,150); }

// 3) fetch dump URL (viesas)
try {
  execSync(`sleep 2`);
  const dump = execSync(`curl -sk --max-time 30 "${base}/?ps_preset_dump=1&k=ps2026"`, { encoding: "utf8", env, maxBuffer: 10*1024*1024 });
  fs.writeFileSync("screenshots/dump.txt", dump.slice(0, 200000));
  out.dump_len = dump.length;
  out.dump_head = dump.slice(0, 120);
} catch(e){ out.dump_err = String(e).slice(0,150); }

fs.writeFileSync("screenshots/deploy.txt", JSON.stringify(out, null, 2));
