import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'recon0707',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }
function wp(path,extra){ try{ return execSync('curl -sk -u "$WPU:$WPP" '+(extra||'')+' "'+BASE+path+'"',{encoding:'utf8',maxBuffer:100000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+(e.message||'').slice(0,200); } }
function wpHead(path){ try{ return execSync('curl -skI -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={env:{wpu:!!WPU,wpp:!!WPP},ts:new Date().toISOString()};
try{
  // 1. Snippetu inventorius
  let raw=wp('/wp-json/code-snippets/v1/snippets');
  try{ const arr=JSON.parse(raw); out.snip_total=arr.length; out.snip_active=arr.filter(s=>s.active).map(s=>({id:s.id,name:(s.name||'').slice(0,60)})); }catch(e){ out.snip_err=String(raw).slice(0,300); }
  // 2. Plugin versijos
  raw=wp('/wp-json/wp/v2/plugins');
  try{ const arr=JSON.parse(raw); out.plugins=arr.map(p=>({n:(p.name||'').slice(0,40),v:p.version,s:p.status})); }catch(e){ out.plug_err=String(raw).slice(0,200); }
  // 3. Katalogo skaiciai
  let h=wpHead('/wp-json/wc/v3/products?status=publish&per_page=1'); out.publish=(h.match(/x-wp-total:\s*(\d+)/i)||[])[1]||h.slice(0,100);
  h=wpHead('/wp-json/wc/v3/products?status=draft&per_page=1'); out.draft=(h.match(/x-wp-total:\s*(\d+)/i)||[])[1]||null;
  // 4. Probe: sukurti, aktyvuoti, kviesti, deaktyvuoti
  const php=`add_action('wp_loaded', function(){ if ( ($_GET['ps_probe'] ?? '') !== 'ps2026' ) return; if ( is_admin() ) return; global $wpdb; $r=array(); $r['zb_cost']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_zb_cost'"); $r['zb_init']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_zb_price_initialized' AND meta_value='yes'"); $r['manual_override']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_manual_price_override' AND meta_value='yes'"); $r['cost_price_filled']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_cost_price' AND meta_value<>''"); $r['src_vf']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_active_fulfillment_source' AND meta_value='vf_dropship'"); $r['src_zb']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT post_id) FROM {$wpdb->postmeta} WHERE meta_key='_active_fulfillment_source' AND meta_value='zb_dropship'"); wp_send_json($r); });`;
  const body=JSON.stringify({name:'PS Recon Probe 0707 (laikinas)',code:php,scope:'global',active:true,priority:10});
  fs.writeFileSync('/tmp/snip.json',body);
  raw=execSync('curl -sk -u "$WPU:$WPP" -X POST -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}});
  let sid=null; try{ sid=JSON.parse(raw).id; }catch(e){ out.probe_create_err=String(raw).slice(0,300); }
  out.probe_id=sid;
  if(sid){
    const pr=wp('/?ps_probe=ps2026');
    try{ out.zb=JSON.parse(pr); }catch(e){ out.probe_call_err=String(pr).slice(0,300); }
    // deaktyvuoti
    const d=execSync('curl -sk -u "$WPU:$WPP" -X DELETE "'+BASE+'/wp-json/code-snippets/v1/snippets/'+sid+'"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}});
    out.probe_deactivated=String(d).slice(0,120);
    // patikra ar tikrai neaktyvus
    const chk=wp('/wp-json/code-snippets/v1/snippets/'+sid);
    try{ out.probe_active_after=JSON.parse(chk).active; }catch(e){}
  }
}catch(e){ out.fatal=String(e.message||e).slice(0,400); }
putResult('recon0707.json',out);
