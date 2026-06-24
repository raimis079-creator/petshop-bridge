import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
// 1. visi Josera ID+name
let prods=[];
for(let page=1;page<=5;page++){
  try{const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Josera&per_page=50&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));if(!Array.isArray(r)||r.length===0)break;prods=prods.concat(r);if(r.length<50)break;}catch(e){break;}
}
const seen={};prods=prods.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
// 2. lygiagretus skaitymas su xargs -P 10
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', prods.map(p=>p.id).join("\n"));
const U=process.env.WP_USER, P=env.WP_PASS_CLEAN;
const cmd=`cat /tmp/ids.txt | xargs -P 10 -I {} curl -sk --max-time 25 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/p/{}.json`;
try{execSync(cmd,{encoding:'utf8',maxBuffer:200000000,timeout:240000});}catch(e){}
// 3. assess
const isWet=n=>/konserv|Meat Lovers|pate|filet|Soup|Cat 6\d\d|85\s*g|70\s*g|800\s*g|, 85|, 70/i.test(n);
const results=[];
for(const p of prods){
  let h="";try{const j=JSON.parse(fs.readFileSync('/tmp/p/'+p.id+'.json','utf8'));h=(j.content&&j.content.raw)||"";}catch(e){h="";}
  if(!h){results.push({id:p.id,name:p.name.slice(0,55),err:1});continue;}
  const hasTable=/<table>/.test(h);
  const realTable=hasTable && /<table>[\s\S]*?\d+\s*g[\s\S]*?<\/table>/.test(h);
  results.push({id:p.id,name:p.name.slice(0,55),wet:isWet(p.name),
    sud:h.indexOf("Sud\u0117tis")>-1, anal:h.indexOf("Analitin")>-1, ser:realTable});
}
commit("jstate_"+TS+".json", JSON.stringify(results));
console.log("DONE "+TS+" n="+results.length);
