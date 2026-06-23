import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
const IDS=[18014,27019,26925,26901,26884,26457,26453,26449,26445,26441,26438,26435,26431,26423,26418,26414,26411,26407,26403,26399,26395,26391,26387,26383,26375,26371,26368,26365,26362,26296,25625,25617,25479,25475,25471,25463,25455,25451,25443,25439,25435,25419,25415,25411,25407,25403,25399,25391,25387,25383,25261,25241,25237,25233,25229,24644,21846,21789,21785,21762,21752,21740,21728,21707,21321,21045,21043,21041,21024,21014,20450,20445,20440,19921,19920,18112,18109,18106,18101,18098,18095,18092,18088,18084,18080,18077,18074,18065,18062,18046,18043,18040,18036,18032,18029,18026,18022,18018,18011,18000,17995,17992,17986,17983,17978];
function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}
const items=[];
for(const id of IDS){
  const h=readRaw(id);
  if(h==='ERR'||h.length<20){ items.push({id, cls:'ERR'}); continue; }
  const isNew = /b2b-black/.test(h) || /<h4[^>]*>Analitin/.test(h);
  const oldAnchor = /Analitin[\s\S]{0,40}?<\/p>\s*<p>[\s\S]*?<\/p>/.test(h);
  const hasFeedTable = /<table>[\s\S]*?svoris[\s\S]*?<\/table>/i.test(h) || /\u0160\u0117rimo/.test(h);
  let cls;
  if(hasFeedTable) cls='HAS_FEED';
  else if(isNew) cls='NEW_RICH';
  else if(oldAnchor) cls='OLD_OK';
  else cls='OTHER';
  items.push({id, cls, len:h.length});
}
const sum={};
items.forEach(i=>sum[i.cls]=(sum[i.cls]||0)+1);
commit("dryclass_"+TS+".json", JSON.stringify({sum, items},null,1));
console.log("DONE "+TS+" "+JSON.stringify(sum));
