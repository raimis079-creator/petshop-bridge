import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ar',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 45 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={before:{},after:{}};
// esama has_archives busena
for(const[id,slug] of [[8,'pa_speciali_mityba'],[7,'pa_be_grudu'],[9,'pa_monoprotein']]){
  const r=api('/wp-json/wc/v3/products/attributes/'+id+'?_fields=id,slug,has_archives');
  out.before[slug]=r.slice(0,150);
}
// ijungiam archyvus
for(const id of [8,7,9]){
  api('/wp-json/wc/v3/products/attributes/'+id,'PUT',{has_archives:true});
}
// flush rewrite rules per snippet
const php=`add_action('init',function(){if(!isset($_GET['flushrw'])||$_GET['flushrw']!=='ps2026')return;flush_rewrite_rules(false);$up=wp_upload_dir();file_put_contents($up['basedir'].'/flushrw_done.txt','flushed '.date('c'));wp_die('FLUSHED');});`;
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP flush rewrites',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.flush_sid=sid;
if(sid){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?flushrw=ps2026');
  out.flush_result=get('/wp-content/uploads/flushrw_done.txt').slice(0,50);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
// verify po ijungimo + flush
const test={
  'sm_hipoalerginis':'/pa_speciali_mityba/hipoalerginis/',
  'sm_jautriam':'/pa_speciali_mityba/jautriam-virskinimui/',
  'sm_odai':'/pa_speciali_mityba/odai-ir-kailiui/',
  'sm_sterilizuot':'/pa_speciali_mityba/sterilizuotiems/',
  'bg':'/pa_be_grudu/be-grudu/',
  'bg_taip':'/pa_be_grudu/taip/',
  'mp_taip':'/pa_monoprotein/taip/',
  'mp_yra':'/pa_monoprotein/yra/'
};
for(const[k,u]of Object.entries(test)) out.after[k]={url:u,http:code(u)};
putFile('archives.json',JSON.stringify(out));
