import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,dataStr){
  fs.writeFileSync('/tmp/body.json', dataStr||'{}');
  let cmd='curl -sk -u "$WPU:$WPP" ';
  if(method==='POST') cmd+='-X POST -H "Content-Type: application/json" -d @/tmp/body.json ';
  else if(method==='DELETE') cmd+='-X DELETE ';
  cmd+='"'+DEV+path+'"';
  try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+String(e).slice(0,80); }
}
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

const out={};
// PHP probe: wp_loaded + early exit + is_user_logged_in + dumpina shipping options
const php = `add_action('wp_loaded', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'ship_9x7') { return; }
  if (!is_user_logged_in()) { return; }
  global $wpdb;
  $rows = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE '%venipak%' OR option_name LIKE '%lpexpress%' OR option_name LIKE '%lp_express%' OR option_name LIKE '%lithuaniapost%' OR (option_name LIKE 'woocommerce_%settings' AND (option_value LIKE '%venipak%' OR option_value LIKE '%pastomat%' OR option_value LIKE '%kurjer%'))", ARRAY_A);
  header('Content-Type: application/json');
  echo json_encode($rows);
  exit;
});`;
// 1. sukuriam snippet (active)
const create=api('/wp-json/code-snippets/v1/snippets','POST', JSON.stringify({name:'TEMP ship probe',code:php,scope:'global',active:true}));
let sid=''; try{ sid=JSON.parse(create).id; }catch(e){}
out.create_id=sid; out.create_raw=create.slice(0,200);
// 2. triggerinam
if(sid){
  out.probe=get(DEV+'/?pkey=ship_9x7').slice(0,15000);
  // 3. deaktyvuojam + trinam
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  out.deleted=true;
}
putFile('shipconfig.json',JSON.stringify(out));
console.log('done sid',sid);
