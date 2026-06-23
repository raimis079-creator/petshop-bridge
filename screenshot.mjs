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
let products=[];
for(let page=1;page<=4;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Eukanuba&per_page=50&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    products=products.concat(r); if(r.length<50)break;
  }catch(e){break;}
}
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});

function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}

// Tikra serimo lentele: <table> su svoriu->gramai ARBA "X kg ... Y g" poromis
function realFeedingTable(h){
  // ieskau serimo zonos
  const l=h.toLowerCase();
  // 1. ar yra <table>?
  const hasTable=/<table/i.test(h);
  // 2. ar lenteleje/tekste yra svoris->gramai poros? (skaiciai su kg ir g)
  // pvz "5 kg ... 80 g" arba "2-5 ... 40-70"
  const tableContent = (h.match(/<table[\s\S]*?<\/table>/gi)||[]).join(' ');
  const gramPairs = (tableContent.match(/\d+\s*(?:g|gr|gramai?)\b/gi)||[]).length;
  const kgRefs = (tableContent.match(/\d+[\.,]?\d*\s*kg/gi)||[]).length;
  // 3. serimo skaiciai tiesiog tekste (jei nera lenteles)
  const textFeedNums = (h.match(/\d+\s*[-–]\s*\d+\s*g\b/gi)||[]).length;
  // analitiniu skaiciai (% kad atskirtume nuo serimo)
  const analitNums = (h.match(/\d+[\.,]?\d*\s*%/g)||[]).length;
  return {
    has_table:hasTable,
    table_gram_count:gramPairs,
    table_kg_count:kgRefs,
    text_feed_ranges:textFeedNums,
    analit_percent:analitNums,
    // VERDIKTAS: ar yra REALUS serimo duomenys
    has_real_feeding: (gramPairs>=2 && kgRefs>=2) || textFeedNums>=2
  };
}

const out={ts:TS, total:products.length, items:[]};
for(const p of products){
  const h=readRaw(p.id);
  const f=realFeedingTable(h);
  out.items.push({
    id:p.id, name:p.name.slice(0,45), len:h.length,
    has_serimo_word: /\u0161\u0117rim|maitinimo\s+norma|paros\s+norma/i.test(h.toLowerCase()),
    has_table:f.has_table,
    table_gram:f.table_gram_count,
    table_kg:f.table_kg_count,
    text_ranges:f.text_feed_ranges,
    has_real_feeding:f.has_real_feeding
  });
  execSync('sleep 0.25');
}
out.summary={
  total:out.items.length,
  has_serimo_word:out.items.filter(i=>i.has_serimo_word).length,
  has_real_feeding_data:out.items.filter(i=>i.has_real_feeding).length,
  word_but_NO_real_data:out.items.filter(i=>i.has_serimo_word&&!i.has_real_feeding).length
};
putResult('euktable_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
