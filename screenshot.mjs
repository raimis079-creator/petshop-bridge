import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
const IFACE='PD9waHAKLyoqCiAqIFBldHNob3BfTWVzc2FnZV9Qcm92aWRlciDigJQga29udHJha3RzIG1lc3NhZ2UgcHJvdmlkZXInaWFtcyAoU2VuZGVyLCBhdGVpdGllcyBTTVMsIGV0Yy4pCiAqCiAqIFBldHNob3AgY29yZSBORVpJTk8ga29ua3JldGF1cyBwcm92aWRlcidpbyBzcGVjaWZpa29zLiBQcm92aWRlcidpcyAoU2VuZGVyIGFkYXB0ZXIpCiAqIGltcGxlbWVudHVvamEgxaHEryBpbnRlcmZhY2UuIFJldHJ5IHF1ZXVlLCBldmVudCBsb2csIGNvbnNlbnQgc3luYyDigJQga3ZpZcSNaWEKICogcGVyIHNpIGludGVyZmFjZSwgbmUgcGVyIGtvbmtyZXR1IFNlbmRlciBBUEkuCiAqCiAqIE1JR1JBQ0lKQSBpcyBJbnRlcmZhY2VfRVNQX0FkYXB0ZXIgKHBldHNob3AtZXNwKTogdGFzIHBhdHMga29udHJha3RzLCBraXRhcwogKiBwYXZhZGluaW1hcy4gU2VuZGVyIGFkYXB0ZXInaXMgYnVzIGF0bmF1amludGFzIGthZCBpbXBsZW1lbnR1b3R1IMWhxK8uCiAqLwoKaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgewoJZXhpdDsKfQoKaW50ZXJmYWNlIFBldHNob3BfTWVzc2FnZV9Qcm92aWRlciB7CgoJLyoqCgkgKiBQcm92aWRlcidpbyBwYXZhZGluaW1hcyAodW5pa2FsdXMgSUQpLiBOYXVkb2phbWFzIGV2ZW50X2xvZy5hZGFwdGVyX25hbWUgbGF1a2UuCgkgKiBQdnouICdzZW5kZXInLCAnYnJldm8nLCAnc21zX2x0Jy4KCSAqCgkgKiBAcmV0dXJuIHN0cmluZwoJICovCglwdWJsaWMgZnVuY3Rpb24gZ2V0X25hbWUoKTsKCgkvKioKCSAqIEFyIHByb3ZpZGVyJ2lzIHN1a29uZmlndXJ1b3RhcyAodG9rZW5haSwgZW5kcG9pbnQnYWkpLgoJICoKCSAqIEByZXR1cm4gYm9vbAoJICovCglwdWJsaWMgZnVuY3Rpb24gaXNfY29uZmlndXJlZCgpOwoKCS8qKgoJICogR3JlaXRhIDwzcyBwYXRpa3JhIGFyIHByb3ZpZGVyJ2lzIGF0c2FrbyAocHJpZXMgYmF0Y2ggb3BlcmFjaWphcykuCgkgKgoJICogQHJldHVybiBib29sCgkgKi8KCXB1YmxpYyBmdW5jdGlvbiBpc19vcGVyYXRpb25hbCgpOwoKCS8qKgoJICogVXBzZXJ0IGtvbnRha3RvIGF0cmlidXRhaSBwcm92aWRlcidpbyBwdXNlamUuCgkgKgoJICogQHBhcmFtIHN0cmluZyAkZW1haWwKCSAqIEBwYXJhbSBhcnJheSAgJGF0dHJpYnV0ZXMgIFsnUFNfT1JERVJfQ09VTlQnPT41LCAnUFNfTUFSS0VUSU5HX0NPTlNFTlQnPT4ndHJ1ZScsIC4uLl0KCSAqIEByZXR1cm4gYXJyYXkgewoJICogICBAdHlwZSBib29sICAgJG9rCgkgKiAgIEB0eXBlIGJvb2wgICAkc2hvdWxkX3JldHJ5CgkgKiAgIEB0eXBlIHN0cmluZyAkZXJyb3IKCSAqICAgQHR5cGUgbWl4ZWQgICRyYXcKCSAqIH0KCSAqLwoJcHVibGljIGZ1bmN0aW9uIHVwc2VydF9jb250YWN0KCAkZW1haWwsIGFycmF5ICRhdHRyaWJ1dGVzICk7CgoJLyoqCgkgKiBFbWl0J2luYSBldmVudCdhIGkgcHJvdmlkZXInaW8gc3JhdXR1cy4KCSAqCgkgKiBAcGFyYW0gc3RyaW5nICAgICAgJGVtYWlsCgkgKiBAcGFyYW0gc3RyaW5nICAgICAgJGV2ZW50X2lkICAgICBVbmlrYWx1cyBldmVudCBJRCAoaWRlbXBvdGVuY2lqYWkgcHJvdmlkZXInaW8gcHVzZWplKS4KCSAqIEBwYXJhbSBzdHJpbmcgICAgICAkZXZlbnRfbmFtZSAgIEthbm9uaW5pcyBldmVudCB2YXJkYXMuCgkgKiBAcGFyYW0gYXJyYXkgICAgICAgJHBheWxvYWQKCSAqIEBwYXJhbSBzdHJpbmd8bnVsbCAkdGltZXN0YW1wICAgIElTTyA4NjAxIGZvcm1hdGFzOyBudWxsIOKGkiBkYWJhci4KCSAqIEByZXR1cm4gYXJyYXkge29rLCBzaG91bGRfcmV0cnksIGVycm9yLCByYXd9CgkgKi8KCXB1YmxpYyBmdW5jdGlvbiBlbWl0X2V2ZW50KCAkZW1haWwsICRldmVudF9pZCwgJGV2ZW50X25hbWUsIGFycmF5ICRwYXlsb2FkLCAkdGltZXN0YW1wID0gbnVsbCApOwoKCS8qKgoJICogU2l1bsSNaWEgdHJhbnNha2NpbmkgZWwuIGxhaXNza2EgdGllc2lvZ2lhaSAoYmUgZXZlbnQvd29ya2Zsb3cgdGFycG8pLgoJICogS3JpdGluaXMgc3JhdXRhcyAobWFnaWMgbGluaywgcGFzc3dvcmQgcmVzZXQpLiBQcm92aWRlciBnYWxpIG5lcGFsYWlreXRpIOKAlCBncmF6aW5hIHNob3VsZF9yZXRyeT1mYWxzZS4KCSAqCgkgKiBAcGFyYW0gc3RyaW5nICR0b19lbWFpbAoJICogQHBhcmFtIHN0cmluZyAkc3ViamVjdAoJICogQHBhcmFtIHN0cmluZyAkaHRtbF9ib2R5CgkgKiBAcGFyYW0gYXJyYXkgICRtZXRhICAoZnJvbSwgcmVwbHlfdG8sIGhlYWRlcnMsIGV0Yy4pCgkgKiBAcmV0dXJuIGFycmF5IHtvaywgc2hvdWxkX3JldHJ5LCBlcnJvciwgcmF3fQoJICovCglwdWJsaWMgZnVuY3Rpb24gc2VuZF90cmFuc2FjdGlvbmFsX2VtYWlsKCAkdG9fZW1haWwsICRzdWJqZWN0LCAkaHRtbF9ib2R5LCBhcnJheSAkbWV0YSA9IGFycmF5KCkgKTsKCgkvKioKCSAqIFNpdW7EjWlhIFNNUy4gUHJvdmlkZXIgZ2FsaSBuZXBhbGFpa3l0aSAoZ3JhemluYSBzaG91bGRfcmV0cnk9ZmFsc2UsIGVycm9yPSdub3Rfc3VwcG9ydGVkJykuCgkgKgoJICogQHBhcmFtIHN0cmluZyAkcGhvbmVfZTE2NCAgIEUuMTY0IGZvcm1hdGFzICgrMzcwLi4uKS4KCSAqIEBwYXJhbSBzdHJpbmcgJG1lc3NhZ2UKCSAqIEBwYXJhbSBhcnJheSAgJG1ldGEKCSAqIEByZXR1cm4gYXJyYXkge29rLCBzaG91bGRfcmV0cnksIGVycm9yLCByYXd9CgkgKi8KCXB1YmxpYyBmdW5jdGlvbiBzZW5kX3RyYW5zYWN0aW9uYWxfc21zKCAkcGhvbmVfZTE2NCwgJG1lc3NhZ2UsIGFycmF5ICRtZXRhID0gYXJyYXkoKSApOwoKCS8qKgoJICogUGF0aWtyaW5hIHdlYmhvb2sgcGFyYXNhLgoJICoKCSAqIEBwYXJhbSBzdHJpbmcgJHJhd19ib2R5CgkgKiBAcGFyYW0gc3RyaW5nICRzaWduYXR1cmUKCSAqIEByZXR1cm4gYm9vbAoJICovCglwdWJsaWMgZnVuY3Rpb24gdmVyaWZ5X3dlYmhvb2soICRyYXdfYm9keSwgJHNpZ25hdHVyZSApOwoKCS8qKgoJICogUHJvdmlkZXInaW8gaGVhbHRoIG1ldHJpY3MgKHJhdGUgbGltaXQsIGt2b3RhLCBwYXNrdXRpbmUga2xhaWRhKS4KCSAqCgkgKiBAcmV0dXJuIGFycmF5CgkgKi8KCXB1YmxpYyBmdW5jdGlvbiBnZXRfaGVhbHRoX3N0YXR1cygpOwp9Cg==';
(async()=>{
  let out=''; const L=s=>{out+=s+'\n'; console.log(s);};
  L('=== interface patch ===');
  const deployPHP = "if(!defined('ABSPATH'))return;\n" +
    "add_action('wp_loaded', function(){\n" +
    "  if(($_GET['ps_iface_patch']??'')!=='1')return;\n" +
    "  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n" +
    "  $r = @file_put_contents(WP_PLUGIN_DIR.'/petshop-core/includes/interface-message-provider.php', base64_decode('" + IFACE + "'));\n" +
    "  header('Content-Type: application/json'); echo wp_json_encode(array('iface_bytes'=>$r)); exit;\n" +
    "}, 6);";
  const c = api('POST','/wp-json/code-snippets/v1/snippets',{name:'Iface Patch tmp',desc:'token',code:deployPHP,scope:'global',active:true,priority:5});
  let sid=0; try{sid=JSON.parse(c.body).id;}catch(e){}
  execSync('sleep 2');
  L('patch: '+sh('curl -s -k --max-time 30 "'+BASE+'/?ps_iface_patch=1&token=cmplz_6680aa2a42151d54fa8d64ec"'));
  api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});

  execSync('sleep 2');
  const alive = sh('curl -s -k --max-time 30 -o /dev/null -w "HTTP:%{http_code}" "'+BASE+'/"');
  L('Home: '+alive);

  // Ir patikra
  const checkPHP = "if(!defined('ABSPATH'))return;\n" +
    "add_action('wp_loaded', function(){\n" +
    "  if(($_GET['ps_esp4_check']??'')!=='1')return;\n" +
    "  if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;\n" +
    "  $out=array(\n" +
    "    'esp_active'=>is_plugin_active('petshop-esp/petshop-esp.php'),\n" +
    "    'esp_version'=>defined('PETSHOP_ESP_VERSION')?PETSHOP_ESP_VERSION:'?',\n" +
    "    'core_version'=>defined('PETSHOP_CORE_VERSION')?PETSHOP_CORE_VERSION:'?',\n" +
    "    'sender_adapter'=>class_exists('Petshop_Sender_Adapter'),\n" +
    "    'implements_provider'=>function_exists('ps_esp_adapter')?(ps_esp_adapter() instanceof Petshop_Message_Provider?'YES':'NO'):'no_fn',\n" +
    "    'esp_aliases'=>array(\n" +
    "      'Petshop_ESP_Event_Log'=>class_exists('Petshop_ESP_Event_Log'),\n" +
    "      'Petshop_ESP_Consent_Log'=>class_exists('Petshop_ESP_Consent_Log'),\n" +
    "      'Petshop_ESP_Retry_Queue'=>class_exists('Petshop_ESP_Retry_Queue'),\n" +
    "      'Interface_ESP_Adapter'=>interface_exists('Interface_ESP_Adapter'),\n" +
    "    ),\n" +
    "    'sender_adapter_check'=>class_exists('Petshop_Sender_Adapter')?(new Petshop_Sender_Adapter())->get_name():'no_class',\n" +
    "    'consent_test'=>function_exists('ps_get_marketing_consent')?ps_get_marketing_consent('terra@gyvunai.lt'):'no_fn',\n" +
    "  );\n" +
    "  header('Content-Type: application/json'); echo wp_json_encode($out, JSON_PRETTY_PRINT); exit;\n" +
    "}, 6);";
  const c2 = api('POST','/wp-json/code-snippets/v1/snippets',{name:'ESP4 Check tmp',desc:'token',code:checkPHP,scope:'global',active:true,priority:5});
  let sid2=0; try{sid2=JSON.parse(c2.body).id;}catch(e){}
  execSync('sleep 2');
  L(''); L('=== v0.4.0 patikra ==='); L(sh('curl -s -k --max-time 30 "'+BASE+'/?ps_esp4_check=1&token=cmplz_6680aa2a42151d54fa8d64ec"'));
  api('POST','/wp-json/code-snippets/v1/snippets/'+sid2+'/deactivate',{});

  putText('iface_patch.txt', out);
})();
