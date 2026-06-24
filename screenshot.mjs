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
function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return '';}}
// mano irasytos prekes
const mine=[24644,25471,25475,26449,25415,25419,21707,25443,26423, 19921,19920,17978,25463,26395,20450,26445,26391,25617, 20445,27019,25625,18046,26403,25241,17995,21024];
// keletas neliestu "trukstamu"
const untouched=[18112,26407,25233,26362,18000,25439];
const out={mine:[],untouched:[]};
for(const id of mine){
  const h=readRaw(id);
  const oldText=/(\u0160\u0117rimo rekomendacija|Svoris\s*(&nbsp;|\s)*neaktyvus|Vienam gyv\u016bnui rekomenduojamas)/i.test(h);
  const myTable=/<th>\u0160uns svoris<\/th>/.test(h);
  out.mine.push({id, oldText, myTable, dup: oldText&&myTable});
}
for(const id of untouched){
  const h=readRaw(id);
  out.untouched.push({id, hasTextFeeding:/(\u0160\u0117rimo rekomendacija|Svoris\s*(&nbsp;|\s)*neaktyvus|Vienam gyv\u016bnui rekomenduojamas|paros norma)/i.test(h), hasTable:/<table>/.test(h)});
}
commit("dupscan_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
