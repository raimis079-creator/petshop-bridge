import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ct',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const php = [
"add_action('wp_loaded', function(){",
"  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'ct_3p7') { return; }",
"  if (!function_exists('WC')) { echo json_encode(array('err'=>'no WC')); exit; }",
"  if (is_null(WC()->cart)) { wc_load_cart(); }",
"  $pid = 16810;",
"  $calc=function($qty) use($pid){",
"    WC()->cart->empty_cart();",
"    WC()->cart->add_to_cart($pid, $qty);",
"    WC()->customer->set_shipping_country('LT');",
"    WC()->customer->set_shipping_state('');",
"    WC()->customer->set_shipping_postcode('01001');",
"    WC()->customer->set_shipping_city('Vilnius');",
"    WC()->cart->calculate_shipping();",
"    $w = WC()->cart->get_cart_contents_weight();",
"    $ids=array();",
"    foreach (WC()->shipping()->get_packages() as $pkg){ if(!empty($pkg['rates'])){ foreach($pkg['rates'] as $rate){ $ids[]=$rate->get_id().' ('.$rate->get_label().')'; } } }",
"    return array('weight'=>$w,'rates'=>$ids);",
"  };",
"  $res=array('product_id'=>$pid,'light'=>$calc(1),'heavy'=>$calc(3));",
"  WC()->cart->empty_cart();",
"  header('Content-Type: application/json'); echo json_encode($res); exit;",
"});"
].join("\n");
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP cart test',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){ api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true}); out.test=get(DEV+'/?pkey=ct_3p7'); api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE'); }
putFile('carttest.json',JSON.stringify(out));
console.log('done',sid);
