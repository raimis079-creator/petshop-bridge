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
const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/17978?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));
const h=(r.content&&r.content.raw)||"";
const out={
  len:h.length,
  serimo_count:(h.match(/\u0160\u0117rimo/g)||[]).length,
  table_count:(h.match(/<table>/g)||[]).length,
  paros_count:(h.match(/paros norma|per par|Futtermenge|maitinimo norma|\u0161\u0117rimo lentel/gi)||[]).length,
  empty_p:(h.match(/<p>(&nbsp;|\s)*<\/p>/g)||[]).length,
  br_count:(h.match(/<br\s*\/?>/g)||[]).length,
  full:h
};
commit("diag17978_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
