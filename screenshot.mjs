import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wc(page){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Josera&per_page=100&page=${page}&_fields=id,name,sku,status,categories" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
let all=[];for(let p=1;p<=3;p++){const r=wc(p);if(!r||!Array.isArray(r)||r.length===0)break;all=all.concat(r);if(r.length<100)break;}
const dog=all.filter(p=>(p.categories||[]).some(c=>c.name==="Sausas maistas \u0161unims"));
// parallel fetch descriptions
execSync('rm -rf /tmp/p && mkdir -p /tmp/p',{env});
const ids=dog.map(d=>d.id);
fs.writeFileSync('/tmp/ids.txt', ids.join("\n"));
const cmd=`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/{}?_fields=id,description" -o /tmp/p/{}.json`;
try{execSync(cmd,{env,maxBuffer:200000000});}catch(e){}
const MARK='\u0160\u0117rimo instrukcija';
const res=dog.map(d=>{let desc="";try{desc=(JSON.parse(fs.readFileSync('/tmp/p/'+d.id+'.json','utf8')).description||"");}catch(e){desc="__READ_FAIL__";}
  return {id:d.id,sku:d.sku,status:d.status,name:(d.name||"").slice(0,52),
    mark:desc.indexOf(MARK)>-1, legacy:desc.indexOf("Rekomenduojamas kiekis per par")>-1, serim:desc.indexOf("\u0160\u0117rim")>-1||desc.indexOf("&Scaron;\u0117rim")>-1, fail:desc==="__READ_FAIL__"};});
commit("josdog_status_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE dog="+res.length);
