import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'usr '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // Customer role useriai
  const r=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/wp/v2/users?roles=customer&per_page=50&context=edit"');
  let arr=[];try{arr=JSON.parse(r);}catch(e){L('parse: '+r.slice(0,300));}
  L('customer role useriai: '+(Array.isArray(arr)?arr.length:'n/a'));
  const toDelete=[];
  if(Array.isArray(arr)) for(const u of arr){
    const email=u.email||'';
    L('  #'+u.id+' '+u.slug+' <'+email+'> reg='+(u.registered_date||'?'));
    if(/^ga4test\d+@petshop\.lt$/.test(email) || email==='terra@gyvunai.lt'){
      toDelete.push({id:u.id,email});
    }
  }
  L('=== Trinsim testinius: '+JSON.stringify(toDelete.map(x=>x.email)));
  for(const u of toDelete){
    // reassign i admin (1), force delete
    const d=sh('curl -s -k -u "'+U+':'+P+'" -X DELETE "'+BASE+'/wp-json/wp/v2/users/'+u.id+'?force=true&reassign=1"');
    let ok='?';try{ok=JSON.parse(d).deleted?'DELETED':'?';}catch(e){ok=d.slice(0,100);}
    L('  DELETE user #'+u.id+' ('+u.email+') -> '+ok);
  }
  L('DONE');
}catch(e){L('!!! '+e);}finally{putText('_run24_log.txt',out);}})();
