import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ff',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:30000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// istrinam likusi TEMP lp test 583
api('/wp-json/code-snippets/v1/snippets/583','DELETE');
out.cleaned_583=true;
const php = [
"add_action('wp_loaded', function(){",
"  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'ff_5t8') { return; }",
"  $res=array();",
"  // 1. theme functions.php + mu-plugins fee paieska",
"  $files=array(get_stylesheet_directory().'/functions.php', get_template_directory().'/functions.php');",
"  $wpc=WP_CONTENT_DIR.'/mu-plugins';",
"  if(is_dir($wpc)){ foreach(glob($wpc.'/*.php') as $f){ $files[]=$f; } }",
"  $found=array();",
"  foreach($files as $f){ if(is_readable($f)){ $c=file_get_contents($f); if(stripos($c,'calculate_fees')!==false || stripos($c,'add_fee')!==false || stripos($c,'mazo')!==false){",
"    foreach(explode(chr(10),$c) as $ln=>$line){ if(stripos($line,'fee')!==false||stripos($line,'8')!==false&&stripos($line,'cart')!==false||stripos($line,'mazo')!==false){ } }",
"    // istraukiam calculate_fees bloka konteksta",
"    $pos=stripos($c,'calculate_fees'); if($pos===false) $pos=stripos($c,'add_fee');",
"    if($pos!==false){ $found[basename($f)]=substr($c,max(0,$pos-200),700); }",
"  }}}",
"  $res['fee_code']=$found;",
"  // 2. realus krepselio testas - pridedam pigu produkta, tikrinam fee ties skirtingom sumom",
"  if(is_null(WC()->cart)) wc_load_cart();",
"  $cheap=null; foreach(wc_get_products(array('limit'=>200,'return'=>'objects')) as $p){ $pr=(float)$p->get_price(); if($pr>=1 && $pr<=4 && $p->is_in_stock() && $p->needs_shipping()){ $cheap=$p; break; } }",
"  if($cheap){",
"    $price=(float)$cheap->get_price();",
"    $test=function($qty) use($cheap){ WC()->cart->empty_cart(); WC()->cart->add_to_cart($cheap->get_id(),$qty); WC()->cart->calculate_totals(); $fees=array(); foreach(WC()->cart->get_fees() as $fe){ $fees[]=$fe->name.'='.$fe->amount; } return array('subtotal'=>WC()->cart->get_subtotal(),'fees'=>$fees); };",
"    $res['cheap_product']=$cheap->get_name(); $res['cheap_price']=$price;",
"    $res['test_1x']=$test(1); $res['test_3x']=$test(3); $res['test_5x']=$test(5);",
"    WC()->cart->empty_cart();",
"  } else { $res['cheap']='nerasta pigaus produkto 1-4eur'; }",
"  header('Content-Type: application/json'); echo json_encode($res); exit;",
"});"
].join("\n");
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP fee find',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){ api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true}); out.test=get(DEV+'/?pkey=ff_5t8'); api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE'); }
putFile('feefind.json',JSON.stringify(out));
console.log('done',sid);
