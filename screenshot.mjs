import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

// Trumpiausias imanomas: init hook, viena eilute, output
const code_txt = "add_action('init', function(){ if(isset($_GET['pfl'])){ $p=get_posts(['post_type'=>'wpforms','numberposts'=>50,'post_status'=>'any']); foreach($p as $x){ echo $x->ID.'|'.$x->post_status.'|'.$x->post_title.\"\\n\"; } die('END'); } });";

const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP simple list',code:code_txt,scope:'global',active:false});
let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){}
out.sid=sid; out.pre_err=err; out.create_raw=c.slice(0,200);
if(sid && !err){
  const act=api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  const chk=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=active,code_error');
  out.after_activate=chk.slice(0,150);
  out.result=get(DEV+'/?pfl=1');
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('simpleforms.json',JSON.stringify(out));
