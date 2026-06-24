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
const ids=[18112,18095,18000,17992,18077,18036,18014,18088];
function readRaw(id){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 2');}}return '';}
const out={};
for(const id of ids){
  const h=readRaw(id);
  // istraukiu serimo zona: nuo "serim" iki galo arba iki "Sudetis" jei serimas po jos
  let zone="";
  const si=h.search(/\u0160\u0117rimo rekomendacija|\u0160\u0117rimo norm|Rekomenduojam|Svoris[\s\S]{0,40}aktyvus/i);
  if(si>-1) zone=h.slice(si, si+1600);
  out[id]=zone.replace(/&nbsp;/g,' ').replace(/\s{2,}/g,' ');
}
commit("feedtext_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
