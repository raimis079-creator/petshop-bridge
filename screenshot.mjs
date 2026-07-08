import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lp2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ 
  let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" ';
  if(method) cmd+='-X '+method+' ';
  if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; }
  cmd+='"'+DEV+path+'"';
  try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+String(e).slice(0,100); }
}
const out={steps:[]};
// PHP be docblock, paprasciau
const php = [
"add_filter('woocommerce_package_rates', function($rates, $package){",
"  $limit = 29.90; $weight = 0;",
"  if (!empty($package['contents'])) {",
"    foreach ($package['contents'] as $item) {",
"      if (!empty($item['data']) && is_object($item['data'])) {",
"        $weight += ((float) $item['data']->get_weight()) * ((int) $item['quantity']);",
"      }",
"    }",
"  }",
"  if ($weight <= $limit) { return $rates; }",
"  foreach ($rates as $rid => $rate) {",
"    if (strpos($rate->get_method_id(), 'lpexpress_terminal') !== false) {",
"      $s = get_option('woocommerce_' . $rate->get_method_id() . '_' . $rate->get_instance_id() . '_settings');",
"      if (is_array($s) && isset($s['plan']) && $s['plan'] === 'TERMINAL') { unset($rates[$rid]); }",
"    }",
"  }",
"  return $rates;",
"}, 20, 2);"
].join("\n");

// 1. kuriam NEAKTYVU
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'Petshop LP Terminalu Svorio Riba v1 (29.90kg)',code:php,scope:'global',active:false});
out.create_raw=c.slice(0,400);
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){
  // 2. skaitom code_error
  const chk=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=id,active,code_error');
  out.check_inactive=chk.slice(0,300);
  let err=''; try{ err=JSON.parse(chk).code_error; }catch(e){}
  // 3. jei nera klaidos -> aktyvuojam
  if(!err || err==='null' || err===null){
    const act=api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    out.activate_raw=act.slice(0,300);
    const chk2=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=id,active,code_error');
    out.check_active=chk2.slice(0,300);
  } else {
    out.aborted='code_error: '+err;
  }
}
putFile('lpfilter2.json',JSON.stringify(out));
console.log('done',sid);
