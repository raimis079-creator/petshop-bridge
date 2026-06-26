import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wc(path){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 3');}}return null;}
let all=[];
for(const pg of [1,2]){
  const r=wc(`products?search=Josera&per_page=100&page=${pg}&_fields=id,name,status,stock_status,categories`);
  if(Array.isArray(r))all=all.concat(r);
}
function classify(cats){const names=(cats||[]).map(c=>c.name).join(" | ");const isCat=/kat[e\u0117]ms|kat\u0117ms|katems/i.test(names);const isDog=/\u0161unims|sunims/i.test(names);const wet=/[Kk]onservai/i.test(names);const dry=/[Ss]ausas/i.test(names);return {names,sp:isCat?"CAT":(isDog?"DOG":"?"),form:wet?"WET":(dry?"DRY":"?")};}
const groups={CAT_WET:[],CAT_DRY:[],CAT_other:[],DOG_or_other:[]};
for(const p of all){const cl=classify(p.categories);const rec={id:p.id,name:(p.name||"").slice(0,70),status:p.status,stock:p.stock_status,cats:cl.names};
  if(cl.sp==="CAT"&&cl.form==="WET")groups.CAT_WET.push(rec);
  else if(cl.sp==="CAT"&&cl.form==="DRY")groups.CAT_DRY.push(rec);
  else if(cl.sp==="CAT")groups.CAT_other.push(rec);
  else groups.DOG_or_other.push(rec);
}
const summary={total:all.length,counts:{CAT_WET:groups.CAT_WET.length,CAT_DRY:groups.CAT_DRY.length,CAT_other:groups.CAT_other.length,DOG_or_other:groups.DOG_or_other.length}};
commit("josera_cat_recon_"+Date.now()+".json", JSON.stringify({summary,CAT_WET:groups.CAT_WET,CAT_DRY:groups.CAT_DRY,CAT_other:groups.CAT_other},null,1));
console.log("DONE");
