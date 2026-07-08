import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// probe: kokie plugin'ai aktyvus + ar cf7 CPT egzistuoja
const php = `add_action('wp_loaded', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'cf_5m8') { return; }
  $r=array();
  if (function_exists('get_option')) {
    $active=get_option('active_plugins');
    $r['active_plugins']=is_array($active)?array_filter($active,function($p){return preg_match('/contact-form|wpforms|fluentform|gravityforms|forminator/i',$p);}):array();
    $r['cf7_installed']=function_exists('wpcf7_contact_form');
    $r['fluent_installed']=function_exists('wpFluent');
    $r['gravity_installed']=class_exists('GFForms');
    $r['wpforms_installed']=function_exists('wpforms');
    if (function_exists('wpcf7_contact_form')) {
      $forms=get_posts(array('post_type'=>'wpcf7_contact_form','numberposts'=>10));
      $r['cf7_forms']=array_map(function($f){return array('id'=>$f->ID,'title'=>$f->post_title);},$forms);
    }
  }
  header('Content-Type: application/json'); echo json_encode($r); exit;
});`;
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP form probe',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
if(sid){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  out.result=get(DEV+'/?pkey=cf_5m8');
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('checkforms.json',JSON.stringify(out));
console.log('done',sid);
