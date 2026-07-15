import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(path, buf, msg) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: msg, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,400); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	$K = 'Zz6Xx4Cc';
	// A: priverstinai apdoroti eventa 120
	if ( isset($_GET['ps_proc']) && $_GET['ps_proc'] === $K ) {
		global $wpdb;
		$id = absint($_GET['id'] ?? 120);
		$o = array('id'=>$id);
		$o['before'] = $wpdb->get_row($wpdb->prepare("SELECT status,attempts,last_error,esp_response FROM {$wpdb->prefix}ps_event_log WHERE id=%d",$id), ARRAY_A);
		if ( class_exists('Petshop_Retry_Queue') ) {
			Petshop_Retry_Queue::handle_process_event($id);
			$o['handler'] = 'ivykdytas';
		} else { $o['handler'] = 'klase nerasta'; }
		$o['after'] = $wpdb->get_row($wpdb->prepare("SELECT status,attempts,last_error,esp_response FROM {$wpdb->prefix}ps_event_log WHERE id=%d",$id), ARRAY_A);
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
	// B: valymas per null
	if ( isset($_GET['ps_clr']) && $_GET['ps_clr'] === $K ) {
		$o = array();
		$a = ps_esp_adapter();
		$o['before'] = array('name'=>$a->get_contact_field('terra@petshop.lt','PS_PET_NAME'), 'species'=>$a->get_contact_field('terra@petshop.lt','PS_PET_SPECIES'));
		$o['try_null'] = $a->upsert_contact('terra@petshop.lt', array(
			'PS_PET_SPECIES'=>null,'PS_PET_NAME'=>null,'PS_PET_LIFE_STAGE'=>null,
			'PS_DOG_SIZE'=>null,'PS_FEEDING_TYPE'=>null,'PS_PRIMARY_NEED'=>null,
		));
		$o['after_null'] = array('name'=>$a->get_contact_field('terra@petshop.lt','PS_PET_NAME'), 'species'=>$a->get_contact_field('terra@petshop.lt','PS_PET_SPECIES'));
		header('Content-Type: application/json'); echo wp_json_encode($o); exit;
	}
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 Proc', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const p = sh('curl -sk --max-time 45 "https://dev.avesa.lt/?ps_proc=Zz6Xx4Cc&id=120"');
try { out.proc = JSON.parse(p); } catch(e){ out.proc_raw = p.slice(0,600); }
const c = sh('curl -sk --max-time 45 "https://dev.avesa.lt/?ps_clr=Zz6Xx4Cc"');
try { out.clr = JSON.parse(c); } catch(e){ out.clr_raw = c.slice(0,600); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8kb'])||$_GET['ps_m8kb']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vB', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8kb=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_proc.json', Buffer.from(JSON.stringify(out)), 'proc');
console.log('DONE');
