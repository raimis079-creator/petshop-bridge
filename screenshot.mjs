import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
import crypto from "crypto";
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const WH_URL=BASE+'/wp-json/petshop/v1/sender-webhook';
const WH_SECRET='uD5RdRkIjPorxrlouQDahacEyHxxoEO0TcemLKnX';
let out='';const L=s=>{out+=s+'\n';};
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  return {code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?', raw:r.replace(/\nHTTP:\S+$/,'')};
}
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  const testEmail = 'wh_e2e_test@example.com';
  L('=== POC #4 uzbaigimas: end-to-end webhook ===');
  L('');

  // ---- DALIS A: Tikras HTTP POST i musu endpoint su HMAC parašu ----
  // (simuliuoja ka Sender realiai siunčia; irodo kad endpoint prieina + verify veikia + consent atsinaujina)
  L('--- A. Realus HTTP POST i webhook endpoint (su HMAC) ---');

  // Pirma nustatom consent TRUE per WP, kad turetume ka nuimti
  const setupPHP = "if(!defined('ABSPATH'))return;add_action('wp_loaded',function(){if(($_GET['ps_wh_setup']??'')!=='1')return;if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;global $wpdb;$ct=$wpdb->prefix.'ps_consent_log';$wpdb->query(\"DELETE FROM `$ct` WHERE email='wh_e2e_test@example.com'\");ps_set_marketing_consent('wh_e2e_test@example.com',true,'checkout',0);header('Content-Type:application/json');echo wp_json_encode(array('setup'=>Petshop_ESP_Consent_Log::current_value('wh_e2e_test@example.com','marketing_consent')));exit;},6);";
  const cs=api('POST','/wp-json/code-snippets/v1/snippets',{name:'WH Setup tmp',desc:'token',code:setupPHP,scope:'global',active:true,priority:5});
  let csid=0;try{csid=JSON.parse(cs.body).id;}catch(e){}
  execSync('sleep 2');
  const setup=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_wh_setup=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('  setup consent: '+setup.trim());
  if(csid) api('POST','/wp-json/code-snippets/v1/snippets/'+csid+'/deactivate',{});

  // Sudarom payload + HMAC parašą (kaip Sender darytu)
  const payload = JSON.stringify({type:'subscribers/unsubscribed', data:{email:testEmail}});
  const sig = crypto.createHmac('sha256', WH_SECRET).update(payload).digest('hex');
  L('  payload: '+payload);
  L('  x-sender-signature: '+sig.slice(0,24)+'...');

  // POST i endpoint (be auth — tik HMAC)
  fs.writeFileSync('/tmp/wh.json', payload);
  const post = sh('curl -s -k --max-time 30 -w "\nHTTP:%{http_code}" -X POST -H "Content-Type: application/json" -H "x-sender-signature: '+sig+'" --data-binary @/tmp/wh.json "'+WH_URL+'"');
  L('  endpoint atsakymas:');
  L('  '+post.replace(/\n/g,'\n  '));
  L('');

  // Patikrinam ar consent_log atsinaujino i false su source=webhook
  const checkPHP = "if(!defined('ABSPATH'))return;add_action('wp_loaded',function(){if(($_GET['ps_wh_check']??'')!=='1')return;if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;$e='wh_e2e_test@example.com';$hist=Petshop_ESP_Consent_Log::history($e,5);$out=array('current'=>Petshop_ESP_Consent_Log::current_value($e,'marketing_consent'),'history'=>array_map(function($h){return array('from'=>$h->from_value,'to'=>$h->to_value,'source'=>$h->source);},$hist));header('Content-Type:application/json');echo wp_json_encode($out,JSON_PRETTY_PRINT);exit;},6);";
  const cc=api('POST','/wp-json/code-snippets/v1/snippets',{name:'WH Check tmp',desc:'token',code:checkPHP,scope:'global',active:true,priority:5});
  let ccid=0;try{ccid=JSON.parse(cc.body).id;}catch(e){}
  execSync('sleep 2');
  const check=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_wh_check=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('--- consent_log po webhook POST ---');
  L(check.trim());
  if(ccid) api('POST','/wp-json/code-snippets/v1/snippets/'+ccid+'/deactivate',{});
  L('');

  // ---- DALIS B: Blogas parašas → turi buti atmestas 401 ----
  L('--- B. Blogo parašo atmetimas ---');
  const badPost = sh('curl -s -k --max-time 30 -w "\nHTTP:%{http_code}" -X POST -H "Content-Type: application/json" -H "x-sender-signature: blogas123" --data-binary @/tmp/wh.json "'+WH_URL+'"');
  L('  '+badPost.replace(/\n/g,'\n  '));
  L('');

  // ---- DALIS C: Ar API unsubscribe fire'ina Sender webhook realiai? ----
  L('--- C. API unsubscribe → ar Sender fire\'ina webhook? (POC #4 klausimas) ---');
  // Sukuriam Sender kontakta
  const create = scall('POST','/subscribers', {email: testEmail, firstname:'E2E'});
  L('  kontakto sukurimas: HTTP '+create.code);
  execSync('sleep 1');
  // Unsubscribe per API — atnaujinam status
  const unsub = scall('PATCH','/subscribers/'+testEmail, {status:{email:'unsubscribed'}});
  L('  API unsubscribe: HTTP '+unsub.code+' | '+unsub.raw.slice(0,120));
  L('  (jei Sender webhook fire\'intu — total_deliveries padidetu; tikrinam po 5s)');
  execSync('sleep 5');
  const whStat = scall('GET','/account/webhooks');
  try { const d=JSON.parse(whStat.raw).data||[]; for(const w of d){ L('  webhook '+w.id+': deliveries='+w.total_deliveries+', failures='+w.total_failures); } } catch(e){}

  putText('wh_e2e.txt', out);
  console.log('done');
})();
