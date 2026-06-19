import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const v7 = Buffer.from("Ci8qKgogKiBQZXRzaG9wIEZpbHRydSBLb250ZWtzdGFzIHY3IFtWSVNBREEgQUtUWVZVU10KICoKICogQ29kZSBTbmlwcGV0cyBwYXZhZGluaW1hczogUGV0c2hvcCBGaWx0cnUgS29udGVrc3RhcyB2NyBbVklTQURBIEFLVFlWVVNdCiAqIFRpcGFzOiAiUnVuIHNuaXBwZXQgZXZlcnl3aGVyZSIKICoKICogUGFyZW5rYSBZSVRIIHByZXNldCBwYWdhbCBrYXRlZ29yaWphOgogKiAgIC0gc2thbmVzdHUga2F0ZWdvcmlqb3MgICAgLT4gc2thbmVzdHUtZmlsdHJhcwogKiAgIC0gdml0YW1pbnUvcGFwaWxkdSBrYXQuICAgLT4gdml0YW1pbnUtZmlsdHJhcwogKiAgIC0gYW50a2FrbGl1L3BhdmFkZWxpdSBrYXQgLT4gYW50a2FrbGl1LWZpbHRyYXMKICogICAtIGR1YmVuZWxpdSBrYXQgICAgICAgICAgIC0+IGR1YmVuZWxpdS1maWx0cmFzCiAqICAgLSBndW9saXUvdHJhbnNwL25hcnZ1IGthdCAtPiBndW9saXUtdHJhbnNwb3J0by1maWx0cmFzICAoTkFVSkEgdjUpCiAqICAgLSB6YWlzbHUga2F0ZWdvcmlqb3MgICAgICAtPiB6YWlzbHUtZmlsdHJhcyAgICAgICAgICAgICAgKE5BVUpBIHY2KQogKiAgIC0ga3JhaWt1IGthdGVnb3JpamEgICAgICAgIC0+IGtyYWlrdS1maWx0cmFzICAgICAgICAgICAgICAoTkFVSkEgdjcpCiAqICAgLSBtYWlzdG8ga2F0ZWdvcmlqb3MgICAgICAtPiBtYWlzdG8tZmlsdHJhcwogKiAgIC0ga2l0b3MgICAgICAgICAgICAgICAgICAgLT4gTkVLRUlDSUEgKGxpZWthIHdpZGdldCBudW1hdHl0YXNpcykKICoKICogVmVpa2lhIHBlciB3aWRnZXRfZGlzcGxheV9jYWxsYmFjazoga2FpIHJlbmRlcmluYW1hcyBZSVRIIHByZXNldAogKiB3aWRnZXQsIHBha2VpY2lhIHByZXNldCBzbHVnIHBhZ2FsIGRhYmFydGluZSBrYXRlZ29yaWphLgogKgogKiBUdmFya28gbWFpc3RhICsgc2thbmVzdHVzICsgcGFwaWxkdXMuIEFrc2VzdWFyYWkgLyBkcCBtaXNyaSAtCiAqIG5lcGFsaWVzdGEsIGtvbCBqb21zIGJ1cyBzdWt1cnRpIGF0c2tpcmkgcHJlc2V0J2FpLgogKgogKiBTbHVnJ2FpOiBtYWlzdG8tZmlsdHJhcywgc2thbmVzdHUtZmlsdHJhcywgdml0YW1pbnUtZmlsdHJhcywgYW50a2FrbGl1LWZpbHRyYXMsIGR1YmVuZWxpdS1maWx0cmFzLCBndW9saXUtdHJhbnNwb3J0by1maWx0cmFzLCB6YWlzbHUtZmlsdHJhcywga3JhaWt1LWZpbHRyYXMuCiAqIEFTQ0lJLW9ubHkgUEhQIGtvbWVudGFyYWkuCiAqLwoKZGVmaW5lZCggJ0FCU1BBVEgnICkgfHwgZXhpdDsKCi8qKgogKiBOdXN0YXRvLCBrdXJpcyBwcmVzZXQgc2x1ZyB0aW5rYSBkYWJhcnRpbmVpIGthdGVnb3JpamFpLgogKiBHcmF6aW5hICcnIGplaSBrYXRlZ29yaWphIG5ldHZhcmtvbWEgKG5la2VpY2lhbSkuCiAqLwpmdW5jdGlvbiBwZXRzaG9wX2ZpbHRlcl9wcmVzZXRfZm9yX2N1cnJlbnQoKSB7CgoJaWYgKCAhIGlzX3Byb2R1Y3RfY2F0ZWdvcnkoKSAmJiAhIGlzX3RheCgncHJvZHVjdF9jYXQnKSApIHsKCQlyZXR1cm4gJyc7Cgl9CgkkdGVybSA9IGdldF9xdWVyaWVkX29iamVjdCgpOwoJaWYgKCAhICR0ZXJtIHx8IGVtcHR5KCR0ZXJtLT5zbHVnKSApIHsKCQlyZXR1cm4gJyc7Cgl9Cgkkc2x1ZyA9IHN0cnRvbG93ZXIoICR0ZXJtLT5zbHVnICk7CgoJLy8gU0tBTkVTVEFJICh0aWtyaW5hbSBwaXJtYSAtICJza2FuZXN0IiBhaXNrdXMgc2lnbmFsYXMpCgkkc2thbmVzdF93b3JkcyA9IGFycmF5KCdza2FuZXN0Jywna3JhbXQnKTsKCWZvcmVhY2ggKCAkc2thbmVzdF93b3JkcyBhcyAkdyApIHsKCQlpZiAoIHN0cnBvcygkc2x1ZywgJHcpICE9PSBmYWxzZSApIHsKCQkJcmV0dXJuICdza2FuZXN0dS1maWx0cmFzJzsKCQl9Cgl9CgoJLy8gVklUQU1JTkFJIC8gUEFQSUxEQUkgKE5BVUpBIHYyIC0gcHJpZXMgbWFpc3RhLCBrYWQgbmVzdXNpa2lyc3R1KQoJLy8gcGFwaWxkdSBzbHVnJ2FpOiB2aXRhbWluYWktaXItcGFwaWxkYWktc3VuaW1zIC8gLWthdGVtcwoJJHBhcGlsZF93b3JkcyA9IGFycmF5KCdwYXBpbGQnLCd2aXRhbWluJyk7Cglmb3JlYWNoICggJHBhcGlsZF93b3JkcyBhcyAkdyApIHsKCQlpZiAoIHN0cnBvcygkc2x1ZywgJHcpICE9PSBmYWxzZSApIHsKCQkJcmV0dXJuICd2aXRhbWludS1maWx0cmFzJzsKCQl9Cgl9CgoJLy8gQU5US0FLTElBSSAvIFBBVkFERUxJQUkgKE5BVUpBIHYzIC0gcHJpZXMgbWFpc3RhKQoJLy8gc2x1ZydhaTogYW50a2FrbGlhaS1wYXZhZGVsaWFpLXN1bmltcwoJJGFua193b3JkcyA9IGFycmF5KCdhbnRrYWtsJywncGF2YWRlbCcsJ3BldG5lcycpOwoJZm9yZWFjaCAoICRhbmtfd29yZHMgYXMgJHcgKSB7CgkJaWYgKCBzdHJwb3MoJHNsdWcsICR3KSAhPT0gZmFsc2UgKSB7CgkJCXJldHVybiAnYW50a2FrbGl1LWZpbHRyYXMnOwoJCX0KCX0KCgkvLyBEVUJFTkVMSUFJIChOQVVKQSB2NCkKCS8vIHNsdWc6IGR1YmVuZWxpYWktc3VuaW1zCgkkZHViX3dvcmRzID0gYXJyYXkoJ2R1YmVuZWwnKTsKCWZvcmVhY2ggKCAkZHViX3dvcmRzIGFzICR3ICkgewoJCWlmICggc3RycG9zKCRzbHVnLCAkdykgIT09IGZhbHNlICkgewoJCQlyZXR1cm4gJ2R1YmVuZWxpdS1maWx0cmFzJzsKCQl9Cgl9CgoJLy8gR1VMT0xJQUkgLyBUUkFOU1BPUlRBUyAvIE5BUlZBSSAvIEtFTElPTklVIChOQVVKQSB2NSkKCS8vIHNsdWcnYWk6IGd1b2xpYWktYm9rc2FpLXN1bmltcywgZ3VvbGlhaS1rYXRlbXMsIHRyYW5zcG9ydGF2aW1vLWRlemVzLSosCgkvLyAgICAgICAgICBuYXJ2YWkgKFRJS1NMSUFJLCBuZSBuYXJ2YWktZ3JhdXppa2FtcyksIGtlbGlvbml1LWlyYW5nYQoJaWYgKCBzdHJwb3MoJHNsdWcsICdndW9saWFpJykgIT09IGZhbHNlCgkgIHx8IHN0cnBvcygkc2x1ZywgJ3RyYW5zcG9ydGF2aW1vLWRlemVzJykgIT09IGZhbHNlCgkgIHx8IHN0cnBvcygkc2x1ZywgJ2tlbGlvbml1LWlyYW5nYScpICE9PSBmYWxzZQoJICB8fCAkc2x1ZyA9PT0gJ25hcnZhaScgKSB7CgkJcmV0dXJuICdndW9saXUtdHJhbnNwb3J0by1maWx0cmFzJzsKCX0KCgkvLyBaQUlTTEFJIChOQVVKQSB2NikKCS8vIHNsdWcnYWk6IHphaXNsYWktc3VuaW1zLCB6YWlzbGFpLWthdGVtcwoJaWYgKCBzdHJwb3MoJHNsdWcsICd6YWlzbCcpICE9PSBmYWxzZSApIHsKCQlyZXR1cm4gJ3phaXNsdS1maWx0cmFzJzsKCX0KCgkvLyBLUkFJS0FJIChOQVVKQSB2NykKCS8vIHNsdWc6IGtyYWlrYWkta2FjaXUtdHVhbGV0YW1zCglpZiAoIHN0cnBvcygkc2x1ZywgJ2tyYWlrYWkta2FjaXUnKSAhPT0gZmFsc2UgKSB7CgkJcmV0dXJuICdrcmFpa3UtZmlsdHJhcyc7Cgl9CgoJLy8gTUFJU1RBUwoJJG1haXN0YXNfd29yZHMgPSBhcnJheSgnbWFpc3QnLCdzYXVzYXMnLCdrb25zZXJ2JywncHJlbWl1bScsJ2xlc2FsJyk7Cglmb3JlYWNoICggJG1haXN0YXNfd29yZHMgYXMgJHcgKSB7CgkJaWYgKCBzdHJwb3MoJHNsdWcsICR3KSAhPT0gZmFsc2UgKSB7CgkJCXJldHVybiAnbWFpc3RvLWZpbHRyYXMnOwoJCX0KCX0KCS8vIHNwZWNpZmluZXMgbWFpc3RvIGthdGVnb3Jpam9zIGJlIGFpc2thdXMgem9kemlvCgkkbWFpc3Rhc19leGFjdCA9IGFycmF5KAoJCSdha3Zhcml1bW8tenV2eWNpdS1tYWlzdGFzJywKCQkndHZlbmtpbml1LXp1dnUtbWFpc3RhcycsCgkJJ2FuaW1vbmRhLWtvbnNlcnZhaS1zdW5pbXMnLAoJCSdoaXBvYWxlcmdpbmlzLW1haXN0YXMtc3VuaW1zJywKCSk7CglpZiAoIGluX2FycmF5KCRzbHVnLCAkbWFpc3Rhc19leGFjdCwgdHJ1ZSkgKSB7CgkJcmV0dXJuICdtYWlzdG8tZmlsdHJhcyc7Cgl9CgoJLy8ga2l0YSAtIG5la2VpY2lhbQoJcmV0dXJuICcnOwp9CgovKioKICogWUlUSCB3aWRnZXQgcmVuZGVyaW5hIHByZXNldCBwYWdhbCBwYXNpcmlua3RhIHNsdWcuCiAqIFBha2VpY2lhbSBzbHVnIHBhZ2FsIGtvbnRla3N0YSAoamVpIHR2YXJrb21hIGthdGVnb3JpamEpLgogKi8KYWRkX2ZpbHRlciggJ3dpZGdldF9kaXNwbGF5X2NhbGxiYWNrJywgZnVuY3Rpb24oICRpbnN0YW5jZSwgJHdpZGdldCwgJGFyZ3MgKSB7CgoJLy8gdGlrIFlJVEggQWpheCBmaWx0ZXIgcHJlc2V0IHdpZGdldAoJJHdpZCA9IGlzX29iamVjdCgkd2lkZ2V0KSA/ICggJHdpZGdldC0+aWRfYmFzZSA/PyAnJyApIDogJyc7CglpZiAoIHN0cnBvcyggKHN0cmluZykgJHdpZCwgJ3lpdGgnICkgPT09IGZhbHNlICYmIHN0cnBvcyggKHN0cmluZykgJHdpZCwgJ3l3Y2FuJyApID09PSBmYWxzZSApIHsKCQlyZXR1cm4gJGluc3RhbmNlOwoJfQoJaWYgKCAhIGlzX2FycmF5KCRpbnN0YW5jZSkgKSB7CgkJcmV0dXJuICRpbnN0YW5jZTsKCX0KCgkkd2FudCA9IHBldHNob3BfZmlsdGVyX3ByZXNldF9mb3JfY3VycmVudCgpOwoJaWYgKCAkd2FudCA9PT0gJycgKSB7CgkJcmV0dXJuICRpbnN0YW5jZTsgLy8gbmVrZWljaWFtCgl9CgoJLy8gcmFzdGkgcHJlc2V0IElEIHBhZ2FsIHNsdWcKCSRwcmVzZXQgPSBnZXRfcGFnZV9ieV9wYXRoKCAkd2FudCwgT0JKRUNULCAneWl0aF93Y2FuX3ByZXNldCcgKTsKCWlmICggISAkcHJlc2V0ICkgewoJCXJldHVybiAkaW5zdGFuY2U7Cgl9CgoJLy8gWUlUSCBpbnN0YW5jZSBsYXVrYXMgZ2FsaSBidXRpICdwcmVzZXQnLCAncHJlc2V0X2lkJyBhcmJhICdwcmVzZXRfc2x1ZycKCWlmICggYXJyYXlfa2V5X2V4aXN0cygncHJlc2V0JywgJGluc3RhbmNlKSApIHsKCQkkaW5zdGFuY2VbJ3ByZXNldCddID0gJHByZXNldC0+SUQ7Cgl9CglpZiAoIGFycmF5X2tleV9leGlzdHMoJ3ByZXNldF9pZCcsICRpbnN0YW5jZSkgKSB7CgkJJGluc3RhbmNlWydwcmVzZXRfaWQnXSA9ICRwcmVzZXQtPklEOwoJfQoJaWYgKCBhcnJheV9rZXlfZXhpc3RzKCdwcmVzZXRfc2x1ZycsICRpbnN0YW5jZSkgKSB7CgkJJGluc3RhbmNlWydwcmVzZXRfc2x1ZyddID0gJHdhbnQ7Cgl9CgoJcmV0dXJuICRpbnN0YW5jZTsKCn0sIDIwLCAzICk7Cg==", "base64").toString("utf8");
const out = {};

const makerPhp = `
add_action('init', function(){
  if ( ! isset(\['ps_make_kraiku_preset']) ) return;
  if ( (\['k'] ?? '') !== 'ps2026' ) { status_header(403); echo 'no'; exit; }
  header('Content-Type: application/json; charset=utf-8');
  \ = get_page_by_path('dubeneliu-filtras', OBJECT, 'yith_wcan_preset');
  if(!\){ echo wp_json_encode(array('error'=>'no tpl')); exit; }
  \ = get_post_meta(\->ID,'_filters',true);
  if(is_string(\)) \ = maybe_unserialize(\);
  if(!is_array(\)){ echo wp_json_encode(array('error'=>'bad filters')); exit; }
  \ = \[1]; \['taxonomy']='pa_kraiko_tipas'; \['title']='Kraiko tipas'; \['toggle_style']='opened';
  \ = \[2]; \['taxonomy']='pa_kvapas';      \['title']='Kvapas';      \['toggle_style']='closed';
  \ = \[3];
  \ = array(1=>\, 2=>\, 3=>\);
  \ = get_page_by_path('kraiku-filtras', OBJECT, 'yith_wcan_preset');
  \ = \ ? \->ID : wp_insert_post(array('post_title'=>"Kraik\u{0173} filtras",'post_name'=>'kraiku-filtras','post_type'=>'yith_wcan_preset','post_status'=>'publish'));
  if(!\ || is_wp_error(\)){ echo wp_json_encode(array('error'=>'insert fail')); exit; }
  update_post_meta(\,'_enabled','yes');
  update_post_meta(\,'_layout','default');
  update_post_meta(\,'_filters',\);
  echo wp_json_encode(array('preset_id'=>\,'slug'=>'kraiku-filtras','filters'=>count(\)));
  exit;
}, 99);
`;

// 1) deploy maker
fs.writeFileSync("/tmp/mk.json", JSON.stringify({ name:"Petshop Kraiku Preset Maker TEMP", code: makerPhp, scope:"global", active:true }));
try {
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/mk.json "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env}).trim();
  out.maker_create = cr;
  try { out.maker_id = JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")).id; } catch(e){ out.mk_head=fs.readFileSync("/tmp/cr.txt","utf8").slice(0,150); }
} catch(e){ out.maker_err=String(e).slice(0,120); }
// 2) run maker
try { execSync("sleep 2"); out.preset = execSync(`curl -sk --max-time 30 "${base}/?ps_make_kraiku_preset=1&k=ps2026"`,{encoding:"utf8",env}).slice(0,300); } catch(e){ out.preset_err=String(e).slice(0,120); }
// 3) update Kontekstas 332 -> v7
fs.writeFileSync("/tmp/upd.json", JSON.stringify({ id:332, name:"Petshop Filtru Kontekstas v7 [VISADA AKTYVUS]", code:v7, scope:"global", active:true }));
try {
  const up = execSync(`curl -sk -o /tmp/up.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/upd.json "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env}).trim();
  out.kontekstas_update = up;
  try { const j=JSON.parse(fs.readFileSync("/tmp/up.txt","utf8")); out.k_name=j.name; out.k_has_kraik=(j.code||"").indexOf("kraiku-filtras")>=0; } catch(e){}
} catch(e){ out.k_err=String(e).slice(0,120); }
// 4) deactivate maker
if(out.maker_id){ try { execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/code-snippets/v1/snippets/${out.maker_id}"`,{encoding:"utf8",env}); out.maker_deactivated=true; } catch(e){} }
fs.writeFileSync("screenshots/kraikai_preset.txt", JSON.stringify(out,null,2));
