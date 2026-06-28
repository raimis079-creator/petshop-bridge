import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
// Tikras Prins brando filtras
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?search=PRINS&per_page=100&page=${page}&_fields=id,title,status`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p);
  if(p.length<100)break;page++;
}
const all=acc.map(x=>({id:x.id,title:(x.title&&x.title.rendered||''),status:x.status}));
const prinsDry=all.filter(x=>/PRINS/i.test(x.title)&&!/CONSERV|KONS|wet|paste|pâté|miltai|Treat|skanest/i.test(x.title));
commit("prins_full_list.json",JSON.stringify({total:all.length,prinsDry:prinsDry.length,prinsDryList:prinsDry,all:all.map(x=>({id:x.id,title:x.title.slice(0,80),status:x.status}))},null,1));
console.log("LIST DONE",prinsDry.length);
