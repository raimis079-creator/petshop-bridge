import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
for(const pid of ['18545','18557','18560']){
  let h=''; try{ h=execSync('curl -Lsk "https://dev.avesa.lt/?p='+pid+'"',{maxBuffer:30*1024*1024}).toString(); }catch(e){}
  const summaries=(h.match(/<summary[^>]*>(.*?)<\/summary>/g)||[]).map(s=>s.replace(/<[^>]+>/g,'').trim()).filter(x=>x.length<40);
  o[pid]={
    has_140_155: h.indexOf('140–155')!==-1 || h.indexOf('140&ndash;155')!==-1,
    has_150_170: h.indexOf('150–170')!==-1,
    serim_sections: summaries.filter(s=>s.indexOf('rimo')!==-1).length,
    feeding_tables: (h.match(/Kiekis \/ 24 val\./g)||[]).length,
    old_intro: h.indexOf('Rekomenduojamas pašaro')!==-1
  };
}
console.log('PUT:',pr('finalverify.json',{d:o}));
