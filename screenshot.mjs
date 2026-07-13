import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  let j=null;try{j=JSON.parse(raw);}catch(e){}
  return {code, raw, j};
}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
function wpapi(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{
  const WH_URL = BASE + '/wp-json/petshop/v1/sender-webhook';
  // re-activate receiver snippet 713
  wpapi('POST','/wp-json/code-snippets/v1/snippets/713/activate',{});
  execSync('sleep 2');
  // clear log
  sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&clear=1&token=cmplz_6680aa2a42151d54fa8d64ec"');

  L('TESTAS #4 — webhookai su teisingais topics');
  L('');
  // register 2 webhooks: subscribers/unsubscribed + bounces/new
  const topics=['subscribers/unsubscribed','bounces/new','subscribers/updated'];
  const created=[];
  for(const t of topics){
    const r=scall('POST','/account/webhooks',{url:WH_URL, topic:t});
    let ok=(r.code==='200'||r.code==='201');
    L('  register topic="'+t+'" HTTP '+r.code+' '+(ok?'✅':'❌ '+r.raw.slice(0,120)));
    if(ok){try{const id=(r.j&&r.j.data&&r.j.data.id)||(r.j&&r.j.id);created.push({t,id});}catch(e){}}
  }
  L('');
  // list webhooks
  L('--- Registruoti webhookai ---');
  const list=scall('GET','/account/webhooks');
  if(list.j){
    const arr=(list.j.data||list.j||[]);
    L('  Rasta: '+JSON.stringify(Array.isArray(arr)?arr.map(w=>({topic:w.topic,url:(w.url||'').slice(-40),id:w.id})):arr).slice(0,400));
    // find signing secret
    if(list.j.signing_secret||list.j.secret) L('  Signing secret yra: taip');
  }
  L('');
  // trigger unsubscribe: update subscriber to unsubscribed (or re-subscribe then unsub)
  L('--- Trigger: unsubscribe event ---');
  // first resubscribe temail then unsubscribe to fire event... safer: PATCH subscriber to trigger updated
  const trig=scall('PATCH','/subscribers/terra@gyvunai.lt',{fields:{PS_ORDER_COUNT:8}});
  L('  PATCH subscriber (trigger updated) HTTP '+trig.code);
  execSync('sleep 6');
  L('');
  // check webhook log
  L('--- Woo webhook log (ką gavo) ---');
  const log=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_webhook_log=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  let logArr=[];try{logArr=JSON.parse(log);}catch(e){}
  L('  Gauta webhook kvietimų: '+logArr.length);
  for(const e of logArr.slice(-5)){
    L('    ['+e.received_at+'] sig:'+e.signature_present+' | '+(JSON.stringify(e.parsed||e.body)).slice(0,180));
  }
  putText('_test4b.txt', out);
  console.log('done');
})();
