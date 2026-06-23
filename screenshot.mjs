import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=String(Date.now());
function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}
const ids={27132:"Kitten(kat)",27130:"Kids(slob)",27128:"A/S Lamb+Rice",18159:"Balance",18154:"Festival",18149:"Lamb&Rice 12,5kg",18058:"Leger 10kg(kat)",18054:"Leger 2kg(kat)",18051:"Leger 0,9kg(kat)"};
const out={};
for(const id of Object.keys(ids)){
  const h=readRaw(id);
  // istraukiu analitiniu eilute
  let anal="";
  const am=h.match(/Analitin[\s\S]{0,30}?<\/p>\s*<p>([\s\S]*?)<\/p>/);
  if(am) anal=am[1].replace(/<[^>]+>/g,"").trim();
  // istraukiu lentele kaip teksta (eilutemis)
  let tbl="";
  const tm=h.match(/<table>[\s\S]*?<\/table>/);
  if(tm){ tbl=tm[0].replace(/<\/tr>/g,"\n").replace(/<[^>]+>/g," ").replace(/[ \t]+/g," ").replace(/\n /g,"\n").trim(); }
  out[id]={label:ids[id], anal:anal.slice(0,200), tbl};
}
putResult("tables9_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
