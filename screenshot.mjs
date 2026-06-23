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
// 12 prekiu is anksto - tikrinu TIKSLIAI ar turi serimo lentele
const ids=[14793,14791,14768,14478,14477,12915,12464,12463,12462,12461,12460,12459];
function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}
const out={ts:TS, items:[]};
for(const id of ids){
  const h=readRaw(id);
  // serimo lentele: <table> kurioje yra "kg" ir gramu (g su bet kokiu dash)
  const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];
  let feedTable=false, rows=0;
  for(const t of tables){
    const txt=t.replace(/<[^>]+>/g,' ');
    const hasKg=/\d+\s*kg/i.test(txt);
    const hasG=/\d+\s*[-–—]?\s*\d*\s*g\b/i.test(txt);
    if(hasKg && hasG){ feedTable=true; rows=(t.match(/<tr/gi)||[]).length; break; }
  }
  out.items.push({
    id, len:h.length,
    has_serimo_word:/\u0160\u0117rimo\s+instrukcija|maitinimo\s+norma/i.test(h),
    has_feed_table:feedTable, table_rows:rows,
    total_tables:tables.length
  });
  execSync('sleep 0.25');
}
out.summary={
  total:out.items.length,
  has_feed_table:out.items.filter(i=>i.has_feed_table).length,
  NO_feed_table:out.items.filter(i=>!i.has_feed_table).length
};
putResult('euktable2_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
