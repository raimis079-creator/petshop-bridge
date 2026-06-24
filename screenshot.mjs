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
// dry ID sarasas (is ankstesnio dry.json - iterpiu cia)
const dryIds=[18112,26407,25443,26423,25233,18109,18106,25479,18101,18098,18095,18092,21846,25455,25451,26362,26449,25415,20440,25229,26453,26431,26371,26457,26387,18088,26441,26383,26375,26445,26391,25617,18084,18080,26411,26925,26368,24644,25471,25475,18077,18074,18065,18062,21740,20445,25419,27019,25625,21707,18046,18043,18040,21752,25403,25399,18036,18032,26296,18029,18026,18022,26884,26418,26365,18018,25411,25407,26901,25391,26435,26438,25387,25383,25435,18014,18011,21728,18000,17995,21024,26414,17992,21785,21789,25463,26395,20450,26403,25241,17986,17983,21762,26399,25237,17978,19921,19920,25439,25261,21321,21043,21041,21045];
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', dryIds.join("\n"));
const U=process.env.WP_USER, P=env.WP_PASS_CLEAN;
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I {} curl -sk --max-time 30 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content,name" -o /tmp/p/{}.json`,{encoding:'utf8',maxBuffer:200000000,timeout:240000});}catch(e){}
const results=[];
for(const id of dryIds){
  let h="",nm="";
  try{const j=JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8'));h=(j.content&&j.content.raw)||"";nm=j.name||"";}catch(e){}
  if(!h){results.push({id,name:nm.slice(0,45),cls:"ERR"});continue;}
  // svari serimo lentele: <table> kurio eiluteje yra "X kg" IR "X g" (TD)
  const cleanTable = /<table[^>]*>[\s\S]*?<td[^>]*>\s*\d+\s*kg\s*<\/td>[\s\S]*?<td[^>]*>\s*\d+\s*g\s*<\/td>[\s\S]*?<\/table>/i.test(h)
                   || /<th[^>]*>\s*\u0160uns svoris/i.test(h);
  // tekstinis serimas: <p> su "X kg" ir gramais, ARBA serimo rekomendacija frazes
  const textFeed = /(\u0160\u0117rimo rekomendacija|Vienam gyv\u016bnui rekomenduojamas|paros norma)/i.test(h)
                 || /<p>[^<]*\d+\s*kg(&nbsp;|\s)+[\s\S]{0,200}?\d+\s*g/i.test(h);
  let cls = cleanTable ? "DONE_table" : (textFeed ? "TEXT_convert" : "EMPTY_fill");
  results.push({id,name:nm.slice(0,45),cls});
}
commit("classify_"+TS+".json", JSON.stringify(results));
console.log("DONE "+TS+" n="+results.length);
