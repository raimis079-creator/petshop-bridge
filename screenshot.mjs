import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}

// Svorio parser pagal pavadinimą
function parseWeight(title){
  // Normalize
  const t=title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  // 4+1 kg → 5
  let m=t.match(/(\d+)\s*\+\s*(\d+)\s*kg\b/i);
  if(m) return {kg:(parseFloat(m[1])+parseFloat(m[2])).toFixed(3), source:`${m[1]}+${m[2]} kg`};
  // 12 kg, 2,5 kg, 1.5 kg
  m=t.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i);
  if(m) return {kg:parseFloat(m[1].replace(',','.')).toFixed(3), source:`${m[1]} kg`};
  // 800 g / 800 gr
  m=t.match(/(\d+(?:[,.]\d+)?)\s*(gr|g)\b/i);
  if(m) return {kg:(parseFloat(m[1].replace(',','.'))/1000).toFixed(3), source:`${m[1]} ${m[2]}`};
  return {kg:null, source:null};
}

// Visus Farmina produktus
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id,title`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p.map(x=>({id:x.id,title:(x.title&&x.title.rendered)||''})));
  if(p.length<100)break;page++;
}
fs.writeFileSync('/tmp/ids.txt',acc.map(x=>x.id).join("\n"));

// WC svoris paraleliai
execSync('rm -rf /tmp/wc && mkdir -p /tmp/wc',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wc/v3/products/{}?_fields=id,name,weight,dimensions,sku" -o /tmp/wc/{}.json`,{env,maxBuffer:200000000});}catch(e){}

// Aprašymas (turi „Pakuotės dydis" ar ne) — paraleliai
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep=[];const fails=[];
const dimsZeroCount={true:0,false:0,missing:0};
const pakDydisCount={present:0,absent:0};
const weightSourceHist={};
for(const x of acc){
  let wc={},co={};
  try{wc=JSON.parse(fs.readFileSync('/tmp/wc/'+x.id+'.json','utf8'));}catch(e){}
  try{co=JSON.parse(fs.readFileSync('/tmp/c/'+x.id+'.json','utf8'));}catch(e){}
  const raw=(co.content&&co.content.raw)||"";
  const titleClean=x.title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  const pw=parseWeight(titleClean);
  const dims=wc.dimensions||{};
  const dimsAllZero = (dims.length==='0.0000'||dims.length==='0'||!dims.length) && (dims.width==='0.0000'||dims.width==='0'||!dims.width) && (dims.height==='0.0000'||dims.height==='0'||!dims.height);
  if(!dims.length && !dims.width && !dims.height) dimsZeroCount.missing++;
  else dimsZeroCount[dimsAllZero]++;
  const hasPak = /Pakuotės dydis/.test(raw);
  pakDydisCount[hasPak?'present':'absent']++;
  weightSourceHist[pw.source||'(NONE)'] = (weightSourceHist[pw.source||'(NONE)']||0)+1;
  const row={id:x.id, title:titleClean, sku:wc.sku, currentWeight:wc.weight, dimsAllZero, parsedKg:pw.kg, parsedFrom:pw.source, hasPakDydisInDesc:hasPak};
  rep.push(row);
  if(!pw.kg) fails.push(row);
}
const out={
  total:acc.length,
  weightSourceHistogram:weightSourceHist,
  failedToParseWeight:fails.length,
  failsList:fails,
  dimsAllZeroDistribution:dimsZeroCount,
  pakuoteDydisInDescription:pakDydisCount,
  fullRows:rep
};
commit("farmina_global_dryrun.json",JSON.stringify(out,null,1));
console.log("DRY DONE");
