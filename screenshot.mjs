import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lpt2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const php = [
"add_action('wp_loaded', function(){",
"  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'lpt2_8k') { return; }",
"  if (!function_exists('WC') || !WC()->shipping()) { echo json_encode(array('err'=>'no WC ship')); exit; }",
"  $prods = wc_get_products(array('limit'=>80,'return'=>'objects'));",
"  $heavy=null; foreach($prods as $p){ if((float)$p->get_weight() > 0 && $p->needs_shipping()){ $heavy=$p; break; } }",
"  if(!$heavy){ echo json_encode(array('err'=>'no weighted product')); exit; }",
"  $w=(float)$heavy->get_weight();",
"  $mk=function($qty) use($heavy,$w){",
"    return array(",
"      'contents'=>array($heavy->get_id().'x'=>array('data'=>$heavy,'product_id'=>$heavy->get_id(),'variation_id'=>0,'quantity'=>$qty,'line_total'=>10*$qty,'line_subtotal'=>10*$qty)),",
"      'contents_cost'=>10*$qty,'applied_coupons'=>array(),'user'=>array('ID'=>0),",
"      'destination'=>array('country'=>'LT','state'=>'','postcode'=>'01001','city'=>'Vilnius','address'=>'','address_2'=>'')",
"    );",
"  };",
"  $calc=function($pkg){ $r=WC()->shipping()->calculate_shipping_for_package($pkg); $ids=array(); if(!empty($r['rates'])){ foreach($r['rates'] as $rate){ $ids[]=$rate->get_id(); } } return $ids; };",
"  $qtyH=(int)ceil(31.0/max($w,0.1));",
"  $res=array('product'=>$heavy->get_name(),'unit_w'=>$w,",
"    'light_w'=>$w*1,'light_rates'=>$calc($mk(1)),",
"    'heavy_w'=>$w*$qtyH,'heavy_qty'=>$qtyH,'heavy_rates'=>$calc($mk($qtyH)));",
"  header('Content-Type: application/json'); echo json_encode($res); exit;",
"});"
].join("\n");
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP lp test2',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){ api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true}); out.test=get(DEV+'/?pkey=lpt2_8k'); api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE'); }
putFile('lptest2.json',JSON.stringify(out));
console.log('done',sid);
