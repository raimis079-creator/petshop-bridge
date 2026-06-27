import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[16763,16760,16769,16766];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,excerpt,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const out={};
for(const id of IDS){let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){out[id]={err:'read'};continue;}
  const exc=(j.excerpt||{}).raw||"";const cont=(j.content||{}).raw||"";
  out[id]={excerptLen:exc.length,exc_salmon:/la\u0161i\u0161/i.test(exc),exc_head:exc.slice(0,260),
    content_salmon:/la\u0161i\u0161/i.test(cont),content_has_new_anal:/Analitin\u0117s/.test(cont),content_old_energy:/3880/.test(cont)};
}
commit("prins_b1_exc_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("EXC DONE");
