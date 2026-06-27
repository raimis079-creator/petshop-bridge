import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
let acc=[],page=1;
while(page<=3){const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id,title`);if(!Array.isArray(p)||!p.length)break;acc=acc.concat(p);if(p.length<100)break;page++;}
fs.writeFileSync('/tmp/ids.txt',acc.map(x=>x.id).join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const hits=[];
for(const x of acc){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+x.id+'.json','utf8'));}catch(e){continue;}
  const raw=(j.content&&j.content.raw)||"";
  if(/Pakuot[ėeĖE]\S* dyd/i.test(raw)){
    // ištraukiam kontekstą
    const m=raw.match(/.{0,40}Pakuot[^<]{0,80}/i);
    hits.push({id:x.id,title:(j.title&&j.title.rendered)||'',ctx:m?m[0]:''});
  }
}
commit("farmina_pak_scan.json",JSON.stringify({total:acc.length,hits},null,1));
console.log("DONE hits:",hits.length);
