import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[17188,17176,17182,17153];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`for id in ${IDS.join(' ')}; do curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/$id?context=edit&_fields=id,content" -o /tmp/c/$id.json; done`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/\u0160\u0117rimo\s+(?:rekomendacij|instrukcij)/i;
const out=IDS.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";
  const m=T.match(HEAD);const pos=m?m.index:-1;
  // find opening tag start before heading text (look back for < or &lt;)
  let openStart=pos;
  const back=T.slice(Math.max(0,pos-80),pos);
  return {id, total:T.length, pos, before:T.slice(Math.max(0,pos-60),pos), region:T.slice(pos,pos+560)};
});
commit("ont_A_raw_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
