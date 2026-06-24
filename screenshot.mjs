import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
// visi josera
let prods=[];
for(let page=1;page<=5;page++){
  try{const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Josera&per_page=50&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));if(!Array.isArray(r)||r.length===0)break;prods=prods.concat(r);if(r.length<50)break;}catch(e){break;}
}
const seen={};prods=prods.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', prods.map(p=>p.id).join("\n"));
const U=process.env.WP_USER,P=env.WP_PASS_CLEAN;
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I {} curl -sk --max-time 25 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/p/{}.json`,{encoding:'utf8',maxBuffer:200000000,timeout:240000});}catch(e){}
const isWet=n=>/konserv|pate|Meat Lovers|filet|Soup|, 85|, 70|85 ?g|70 ?g|400 ?g\b|800 ?g/i.test(n);
let dryClean=0,dryTextStd=0,dryTextSpecial=0,dryEmpty=0,dryTotal=0, wet=0;
const emptyIds=[],specialIds=[];
for(const p of prods){
  let h="";try{h=(JSON.parse(fs.readFileSync('/tmp/p/'+p.id+'.json','utf8')).content||{}).raw||"";}catch(e){}
  if(isWet(p.name)){wet++;continue;}
  dryTotal++;
  if(!h)continue;
  const clean=/<th[^>]*>\s*\u0160uns svoris/i.test(h) || /<table[^>]*>[\s\S]*?<td[^>]*>\s*\d+\s*kg\s*<\/td>[\s\S]*?<td[^>]*>\s*\d+\s*g\s*<\/td>/i.test(h);
  if(clean){dryClean++;continue;}
  const z=h.replace(/&nbsp;/g,' ').replace(/&ndash;/g,'\u2013');
  const range=/\d+\s*\u2013\s*\d+\s*kg/i.test(z), age=/Am\u017eius|m\u0117nesiais|kg k\u016bno/i.test(z), preg=/Kal\u0117s|N\u0117\u0161tum/i.test(z);
  const single=(z.match(/<p[^>]*>[^<]*\d+\s*kg[\s\S]{0,400}?\d+\s*g[\s\S]{0,200}?\d+\s*g/gi)||[]).length;
  if(range||age||preg){dryTextSpecial++;specialIds.push(p.id);}
  else if(single>=3){dryTextStd++;specialIds.push(p.id);}
  else {dryEmpty++;emptyIds.push(p.id);}
}
const out={total:prods.length,dryTotal,dryClean,dryTextStd,dryTextSpecial,dryEmpty,wet,emptyIds,specialIds};
commit("finalstate_"+TS+".json", JSON.stringify(out));
console.log("DONE "+TS);
