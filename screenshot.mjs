import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lpf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,dataStr){ fs.writeFileSync('/tmp/body.json', dataStr||'{}'); let cmd='curl -sk -u "$WPU:$WPP" '; if(method==='POST') cmd+='-X POST -H "Content-Type: application/json" -d @/tmp/body.json '; else if(method==='PUT') cmd+='-X PUT -H "Content-Type: application/json" -d @/tmp/body.json '; else if(method==='DELETE') cmd+='-X DELETE '; cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

const php = `/**
 * Petshop LP Terminalu Svorio Riba v1 (29.90kg)
 * Krepselio svoris > 29.90kg -> paslepia LP Express TERMINAL metodus (plan=TERMINAL).
 * Lieka LP Express kurjeris + Venipak kurjeris. Venipak terminalus tvarko native maximum_weight=24.90.
 */
add_filter('woocommerce_package_rates', function($rates, $package){
    $limit = 29.90;
    $weight = 0;
    if (!empty($package['contents'])) {
        foreach ($package['contents'] as $item) {
            if (!empty($item['data']) && is_object($item['data'])) {
                $w = (float) $item['data']->get_weight();
                $weight += $w * (int) $item['quantity'];
            }
        }
    }
    if ($weight <= $limit) { return $rates; }
    foreach ($rates as $rate_id => $rate) {
        if (strpos($rate->get_method_id(), 'lpexpress_terminal') !== false) {
            $opt = 'woocommerce_' . $rate->get_method_id() . '_' . $rate->get_instance_id() . '_settings';
            $s = get_option($opt);
            $plan = (is_array($s) && isset($s['plan'])) ? $s['plan'] : '';
            if ($plan === 'TERMINAL') {
                unset($rates[$rate_id]);
            }
        }
    }
    return $rates;
}, 20, 2);`;

const out={};
const create=api('/wp-json/code-snippets/v1/snippets','POST', JSON.stringify({name:'Petshop LP Terminalu Svorio Riba v1 (29.90kg)',code:php,scope:'global',active:true}));
let sid=0,active=false,err=''; try{ const j=JSON.parse(create); sid=j.id; active=j.active; err=j.code_error||''; }catch(e){ err='parse:'+create.slice(0,100); }
out.created_id=sid; out.active=active; out.code_error=err;
// verify: re-fetch snippeta
if(sid){
  const chk=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=id,name,active,code_error');
  out.verify=chk.slice(0,300);
}
putFile('lpfilter.json',JSON.stringify(out));
console.log('done',sid,active);
