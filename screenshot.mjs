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
const ids=[27130,26925,26901,26884,26457,26453,26441,26438,26435,26431,26418,26414,26411,26407,26399,26387,26383,26375,26371,26368,26365,26362,26296,25479,25475,25471,25455,25451,25439,25411,25407,25403,25399,25391,25387,25383,25261,25237,25233,25229,24644,21321,21045,21043,21041];
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', ids.join("\n"));
const U=process.env.WP_USER,P=env.WP_PASS_CLEAN;
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I {} curl -sk --max-time 30 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content,title" -o /tmp/p/{}.json`,{encoding:'utf8',maxBuffer:200000000,timeout:200000});}catch(e){}
const out=[];
for(const id of ids){
  let h="",nm="";try{const j=JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8'));h=(j.content&&j.content.raw)||"";nm=((j.title&&j.title.raw)||"").slice(0,55);}catch(e){}
  const z=h.replace(/&nbsp;/g,' ').replace(/&ndash;/g,'\u2013');
  const kgTable=/<table[^>]*>[\s\S]*?<td[^>]*>\s*\d+\s*kg\s*<\/td>[\s\S]*?<td[^>]*>\s*\d+\s*g/i.test(h) || /<th[^>]*>\s*\u0160uns svoris/i.test(h);
  const anyTable=/<table/i.test(h);
  const ageTable=/Am\u017eius|m\u0117nesiais|savait/i.test(z) && anyTable;
  const textKg=(z.match(/\d+\s*kg[\s\S]{0,300}?\d+\s*g/gi)||[]).length;
  const range=/\d+\s*\u2013\s*\d+\s*kg/i.test(z);
  let form = kgTable?"KG_TABLE": ageTable?"AGE_TABLE": range?"RANGE_TEXT": (textKg>=3?"TEXT_KG": (anyTable?"TABLE_other":"EMPTY"));
  out.push({id,nm,form,textKg,anyTable});
}
commit("recon45_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
