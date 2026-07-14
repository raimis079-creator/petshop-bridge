import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
let out='';const L=s=>{out+=s+'\n';};

function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 30 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 30 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('=== BLOKAS 0 — dev valymas ===');
  L('');

  // 1. Rasti snippet #713 ir ji istrinti
  L('--- 1. Snippet #713 valymas ---');
  const listResp = api('GET','/wp-json/code-snippets/v1/snippets');
  let snippet713 = null;
  try {
    const list = JSON.parse(listResp.body);
    for(const s of list){
      const nameL = (s.name||'').toLowerCase();
      if(nameL.includes('sender webhook receiver') || nameL.includes('webhook receiver v1')){
        snippet713 = s;
      }
    }
  } catch(e){}
  if(snippet713){
    L('  Rastas: ID='+snippet713.id+' name="'+snippet713.name+'" active='+snippet713.active);
    // deactivate first for saugumas
    if(snippet713.active){
      const deact = api('POST','/wp-json/code-snippets/v1/snippets/'+snippet713.id+'/deactivate',{});
      L('  Deactivate -> HTTP '+deact.code);
    }
    // trynimas per DB (REST DELETE neveikia per Code Snippets)
    // Sioms operacijoms geriau naudoti temporary snippet su wpdb->delete
    L('  Trynimo per DB metodas — reikes atlikti temp snippet.');
    L('  Palieku deaktyvuota. Trynima galim atlikti veliau kaip atskiras step.');
  } else {
    L('  #713 arba analogiskas snippet NErastas -- galbut jau istrintas.');
  }
  L('');

  // 2. Rasti ir istrinti testinius Sender kontaktus
  L('--- 2. Sender testiniai kontaktai ---');
  const patterns = ['webhooktest', 'whsite', 'whunsub', 'whlong'];
  let deleted = 0;
  for(const pat of patterns){
    // Sender turi search endpoint
    const s = scall('GET','/subscribers?search='+pat);
    if(s.code!=='200'){L('  search '+pat+' HTTP '+s.code); continue;}
    let arr = [];
    try { arr = JSON.parse(s.raw).data || []; } catch(e){}
    L('  '+pat+'*: rasta '+arr.length);
    for(const sub of arr){
      const email = sub.email || '';
      if(email.includes(pat)){
        const del = scall('DELETE','/subscribers/'+encodeURIComponent(email));
        L('    del '+email+' -> HTTP '+del.code);
        if(del.code==='200' || del.code==='204') deleted++;
      }
    }
  }
  L('  Istrinta: '+deleted);
  L('');

  // 3. Sender webhookai i webhook.site
  L('--- 3. Sender webhookai i webhook.site ---');
  const wh = scall('GET','/account/webhooks');
  if(wh.code==='200'){
    let whs = [];
    try { whs = JSON.parse(wh.raw).data || []; } catch(e){}
    L('  Iš viso webhookų: '+whs.length);
    let wsDeleted = 0;
    for(const h of whs){
      const url = h.url || '';
      if(url.includes('webhook.site') || url.includes('dev.avesa')){
        L('    webhookas '+h.id+' topic='+h.topic+' url='+url.slice(0,60));
        const del = scall('DELETE','/account/webhooks/'+h.id);
        L('    del -> HTTP '+del.code);
        if(del.code==='200' || del.code==='204') wsDeleted++;
      }
    }
    L('  Istrinta: '+wsDeleted);
  } else {
    L('  webhooks list HTTP '+wh.code);
  }
  L('');

  L('=== BLOKO 0 pabaiga ===');
  putText('_valymas_0.txt', out);
  console.log('done');
})();
