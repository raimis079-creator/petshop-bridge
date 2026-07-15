import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
// S211-A: optimizuotos iliustracijos. Originalai (200-345 KB) lieka avatarams,
// mygtukams generuojam 96/192 px webp + png fallback.
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_gen']) || $_GET['ps_gen'] !== 'Gn8Rr4Tt' ) { return; }
	$dir = WP_PLUGIN_DIR.'/petshop-core/assets/images';
	$species = array('dog','cat','bird','rodent','fish','reptile','other');
	$o = array('made'=>array(), 'skipped'=>array());
	foreach ($species as $s) {
		$src = $dir.'/pet-'.$s.'.png';
		if ( ! file_exists($src) ) { $o['skipped'][] = $s.' (nera originalo)'; continue; }
		$im = @imagecreatefrompng($src);
		if ( ! $im ) { $o['skipped'][] = $s.' (dekodavimas nepavyko)'; continue; }
		$w = imagesx($im); $h = imagesy($im);
		foreach (array(96, 192) as $size) {
			$dst = imagecreatetruecolor($size, $size);
			// alfa islaikom
			imagealphablending($dst, false);
			imagesavealpha($dst, true);
			$transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
			imagefilledrectangle($dst, 0, 0, $size, $size, $transparent);
			imagealphablending($dst, true);
			// proporcingai i kvadrata (contain)
			$scale = min($size / $w, $size / $h);
			$nw = (int) round($w * $scale); $nh = (int) round($h * $scale);
			$ox = (int) round(($size - $nw) / 2); $oy = (int) round(($size - $nh) / 2);
			imagecopyresampled($dst, $im, $ox, $oy, 0, 0, $nw, $nh, $w, $h);
			imagesavealpha($dst, true);
			$wpath = $dir.'/pet-'.$s.'-'.$size.'.webp';
			$ppath = $dir.'/pet-'.$s.'-'.$size.'.png';
			$okw = function_exists('imagewebp') ? @imagewebp($dst, $wpath, 82) : false;
			$okp = @imagepng($dst, $ppath, 9);
			$o['made']['pet-'.$s.'-'.$size] = array(
				'webp' => $okw && file_exists($wpath) ? filesize($wpath) : 'FAIL',
				'png'  => $okp && file_exists($ppath) ? filesize($ppath) : 'FAIL',
			);
			imagedestroy($dst);
		}
		imagedestroy($im);
	}
	// originalu dydziai palyginimui
	$o['original'] = array();
	foreach (array('dog','cat','other') as $s) {
		$f = $dir.'/pet-'.$s.'.png';
		if (file_exists($f)) $o['original']['pet-'.$s] = filesize($f);
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Gen', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_gen=Gn8Rr4Tt"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,300); }
// Ar realiai pasiekiami per HTTP?
for (const f of ['pet-dog-96.webp','pet-dog-192.webp','pet-cat-96.webp','pet-other-96.webp']) {
  out['http_'+f] = sh(`curl -sk -o /dev/null -w "%{http_code} %{size_download}" --max-time 20 "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/images/${f}"`);
}
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k6'])||$_GET['ps_k6']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w6', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k6=Rr3Ww8Yy"');
ghPut('screenshots/m8_gen.json', Buffer.from(JSON.stringify(out)), 'gen');
console.log('DONE');
