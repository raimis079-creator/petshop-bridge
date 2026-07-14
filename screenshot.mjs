import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_m9_url']) ) { return; }\n  if ( ($_GET['token']??'') !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n  global $wpdb;\n  $user = get_user_by('email', 'terra@gyvunai.lt');\n  if(!$user){ echo json_encode(array('err'=>'no user')); exit; }\n  // Isvalom senus + sukuriam sviezia\n  $wpdb->query(\"DELETE FROM {$wpdb->prefix}ps_action_tokens WHERE subject_email='terra@gyvunai.lt'\");\n  $tok = ps_generate_token(array('purpose'=>'magic_login','subject_id'=>$user->ID,'subject_email'=>'terra@gyvunai.lt','ttl_seconds'=>900));\n  $url = home_url('/petshop-login?token=' . rawurlencode($tok));\n  header('Content-Type: application/json');\n  echo json_encode(array('url'=>$url, 'token_len'=>strlen($tok)));\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let out='';const L=s=>{out+=s+'\n';};
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'M9 URL tmp',desc:'x',code:PHP,scope:'global',active:true,priority:10});
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_m9_url=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('url gen: '+r);
  let loginUrl='';try{loginUrl=JSON.parse(r).url;}catch(e){}
  if(id) api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});

  // GET confirmation page HTML (curl, be browser — greiciau)
  if(loginUrl){
    L('');L('=== GET confirmation page HTML ===');
    const html = sh('curl -s -k --max-time 30 "'+loginUrl+'"');
    // Istraukiam esminius elementus
    L('has_prisijungti_btn: '+(html.includes('Prisijungti')?'yes':'no'));
    L('has_form_post: '+(html.includes('method="POST"')?'yes':'no'));
    L('has_token_input: '+(html.includes('name="token"')?'yes':'no'));
    L('has_nonce: '+(html.includes('ps_nonce')?'yes':'no'));
    L('has_15min: '+(html.includes('15 min')?'yes':'no'));
    L('has_brand_green: '+(html.includes('2D5F3F')?'yes':'no'));
    L('html_len: '+html.length);
    // Peek NETURI keisti status — patikrinam kad po GET token dar active
  }
  putText('m9_visual.txt', out);
  console.log('done');
})();
