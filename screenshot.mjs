process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/stat.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/stat.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const NL = String.fromCharCode(10);
try{
const b64 = fs.readFileSync('deploy/petshop-statistika.php').toString('base64');
const sS = await snip('TEMP STAT SET', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_ss'] ?? '') !== 'SS1x') return;",
" update_option('ps_stat_b64', '"+b64+"', false);",
" header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.set = JSON.parse(await (await fetch(WP+'/?ps_ss=SS1x')).text()); }catch(e){ out.set_e=String(e).slice(0,120); }
await off(sS); await new Promise(r=>setTimeout(r,3000));

const sD = await snip('TEMP STAT DEP', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_sd'] ?? '') !== 'SD1x') return;",
" $o=array(); $b=get_option('ps_stat_b64');",
" if(!$b){ $o['klaida']='tuscia'; }",
" else { $k=base64_decode($b);",
"  try { token_get_all($k, TOKEN_PARSE); $o['sintakse']='OK';",
"   $kl=WPMU_PLUGIN_DIR.'/petshop-statistika.php';",
"   file_put_contents($kl,$k); clearstatcache(true,$kl);",
"   $o['sutampa']=(md5_file($kl)===md5($k));",
"  } catch (ParseError $e){ $o['sintakse']='KLAIDA: '.$e->getMessage(); }",
"  delete_option('ps_stat_b64'); }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_sd=SD1x')).text()); }catch(e){ out.dep_e=String(e).slice(0,150); }
await off(sD); await new Promise(r=>setTimeout(r,3000));

/* patikra: lentele, savikaina, meniu paieska */
const sT = await snip('TEMP STAT TIK', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_st'] ?? '') !== 'ST1x') return;",
" $o=array();",
" $o['klase'] = class_exists('Petshop_Statistika');",
" if ($o['klase']) {",
"  $o['versija'] = Petshop_Statistika::VERSIJA;",
"  Petshop_Statistika::uztikrinti_lentele();",
"  global $wpdb; $t = Petshop_Statistika::lentele();",
"  $o['lentele'] = $wpdb->get_var(\"SHOW TABLES LIKE '$t'\");",
"  $o['stulpeliai'] = $wpdb->get_col(\"SHOW COLUMNS FROM $t\");",
"  $o['aplinka'] = Petshop_Statistika::aplinka();",
"  $o['pradzia'] = Petshop_Statistika::pradzia();",
"  $o['sutikimas'] = Petshop_Statistika::sutikimas() ? 'yra' : 'nera';",
"  $o['irasymas'] = Petshop_Statistika::irasyti('testas', array('deze'=>34942,'preke'=>19570,'verte'=>'1','sesija'=>'abc'));",
"  $o['eiluciu'] = (int) $wpdb->get_var(\"SELECT COUNT(*) FROM $t\");",
"  foreach (array(19570, 17550, 16305) as $pid) {",
"    $r = Petshop_Statistika::savikaina_preke($pid);",
"    $o['savikainos'][$pid] = array(get_the_title($pid), $r[0], $r[1]);",
"  }",
"  $wpdb->query(\"DELETE FROM $t WHERE tipas='testas'\");",
" }",
" $o['meniu'] = array();",
" foreach (glob(WP_CONTENT_DIR.'/plugins/petshop*/*.php') as $f) {",
"   $s = file_get_contents($f);",
"   if (stripos($s,'ataskait')!==false) { $o['meniu'][] = str_replace(WP_CONTENT_DIR,'',$f); }",
" }",
" foreach (glob(WP_CONTENT_DIR.'/themes/*/*.php') as $f) {",
"   $s = @file_get_contents($f);",
"   if ($s && stripos($s,'ataskait')!==false) { $o['meniu'][] = str_replace(WP_CONTENT_DIR,'',$f); }",
" }",
" foreach (glob(WP_CONTENT_DIR.'/themes/*/inc/*.php') as $f) {",
"   $s = @file_get_contents($f);",
"   if ($s && stripos($s,'ataskait')!==false) { $o['meniu'][] = str_replace(WP_CONTENT_DIR,'',$f); }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.patikra = JSON.parse(await (await fetch(WP+'/?ps_st=ST1x')).text()); }catch(e){ out.tik_e=String(e).slice(0,180); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
