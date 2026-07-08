import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const php = "add_action('wp_loaded', function(){ if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'lf_2n7') return; $forms=get_posts(array('post_type'=>'wpforms','numberposts'=>50,'post_status'=>'any')); $out=array(); foreach($forms as $f){ $out[]=array('id'=>$f->ID,'title'=>$f->post_title,'status'=>$f->post_status); } header('Content-Type: application/json'); echo json_encode($out); exit; });";
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP list forms',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
if(sid){ api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true}); out.result=get(DEV+'/?pkey=lf_2n7'); api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE'); }
// ir istrinam pries tai bulusi TEMP mk form 589
api('/wp-json/code-snippets/v1/snippets/589','DELETE');
out.cleaned_589=true;
putFile('listforms.json',JSON.stringify(out));
