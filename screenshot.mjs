import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[17299,17296,16234,16210,16204,17272,16222,17210];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm))/i;
const out=IDS.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";
  // find <p>/<h3> start before heading
  const hp=T.search(HEAD);
  let s=-1;for(const tag of ['<p','<h2','<h3','<h4']){const i=T.lastIndexOf(tag,hp);if(i>s)s=i;}
  const raw=hp>-1?T.slice(s, s+1500):'(no heading)';
  return {id,startTag:T.slice(s,s+4),raw};
});
commit("ont_B_raw_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
