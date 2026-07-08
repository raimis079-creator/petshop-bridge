import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,dataStr){ fs.writeFileSync('/tmp/body.json', dataStr||'{}'); let cmd='curl -sk -u "$WPU:$WPP" '; if(method==='POST') cmd+='-X POST -H "Content-Type: application/json" -d @/tmp/body.json '; else if(method==='DELETE') cmd+='-X DELETE '; cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// MINIMALUS: tik Venipak pickup 3,9,5 -> 24.90, su verifikacija. Jokio LP, jokiu form_fields.
const php = `add_action('wp_loaded', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'vp_9k4') { return; }
  $r=array();
  foreach(array(3,9,5) as $i){
    $opt='woocommerce_shopup_venipak_shipping_pickup_method_'.$i.'_settings';
    $s=get_option($opt);
    if(is_array($s)){
      $old=isset($s['maximum_weight'])?$s['maximum_weight']:'(nera)';
      $s['maximum_weight']='24.90';
      update_option($opt,$s);
      $chk=get_option($opt);
      $r[$i]=array('old'=>$old,'new'=>$chk['maximum_weight']);
    } else { $r[$i]='NOT_FOUND'; }
  }
  header('Content-Type: application/json'); echo json_encode($r); exit;
});`;
const create=api('/wp-json/code-snippets/v1/snippets','POST', JSON.stringify({name:'TEMP vp weight',code:php,scope:'global',active:true}));
let sid=''; try{ sid=JSON.parse(create).id; }catch(e){}
out.create_id=sid; out.create_raw=create.slice(0,120);
if(sid){ out.result=get(DEV+'/?pkey=vp_9k4'); api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE'); out.deleted=true; }
putFile('vponly.json',JSON.stringify(out));
console.log('done',sid);
