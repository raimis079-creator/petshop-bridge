import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lpt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const php = [
"add_action('wp_loaded', function(){",
"  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'lpt_6h2') { return; }",
"  if (!class_exists('WC_Shipping_Rate')) { echo json_encode(array('err'=>'no WC')); exit; }",
"  $lp = new WC_Shipping_Rate('woo_lithuaniapost_lpexpress_terminal:12','LP Terminal',1.78,array(),'woo_lithuaniapost_lpexpress_terminal',12);",
"  $vp = new WC_Shipping_Rate('shopup_venipak_shipping_courier_method:2','Venipak Kurjeris',3.30,array(),'shopup_venipak_shipping_courier_method',2);",
"  $rates = array($lp->get_id()=>$lp, $vp->get_id()=>$vp);",
"  $prods = wc_get_products(array('limit'=>80,'return'=>'objects'));",
"  $heavy=null; foreach($prods as $p){ if((float)$p->get_weight() > 0){ $heavy=$p; break; } }",
"  if(!$heavy){ echo json_encode(array('err'=>'no weighted product')); exit; }",
"  $w=(float)$heavy->get_weight();",
"  $result=array('test_product'=>$heavy->get_name(),'unit_weight'=>$w);",
"  // LENGVAS krepselis (1 vnt)",
"  $pkgL=array('contents'=>array(array('data'=>$heavy,'quantity'=>1)));",
"  $rL=apply_filters('woocommerce_package_rates', $rates, $pkgL);",
"  $result['light_weight']=$w*1; $result['light_rates']=array_keys($rL);",
"  // SUNKUS krepselis (>29.90kg)",
"  $qty=(int)ceil(31.0/max($w,0.1));",
"  $pkgH=array('contents'=>array(array('data'=>$heavy,'quantity'=>$qty)));",
"  $rH=apply_filters('woocommerce_package_rates', $rates, $pkgH);",
"  $result['heavy_weight']=$w*$qty; $result['heavy_qty']=$qty; $result['heavy_rates']=array_keys($rH);",
"  header('Content-Type: application/json'); echo json_encode($result); exit;",
"});"
].join("\n");
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP lp test',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  out.test=get(DEV+'/?pkey=lpt_6h2');
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('lptest.json',JSON.stringify(out));
console.log('done',sid);
