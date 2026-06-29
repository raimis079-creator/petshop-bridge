import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const base='https://dev.avesa.lt/wp-json';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

// 1. Paimkim VISUS publish produktus
console.log("Fetching all publish products...");
const all=[];
for(let p=1;p<=30;p++){
  try{
    const r=execSync(`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products?per_page=100&page=${p}&status=publish&_fields=id,name,brands,categories,sku"`,{env:env2,encoding:'utf8',maxBuffer:200000000});
    const arr=JSON.parse(r);
    if(!arr||!arr.length)break;
    all.push(...arr);
    if(arr.length<100)break;
  }catch(e){break;}
}
console.log(`Total publish: ${all.length}`);

// 2. Paimkim turinį dideliais batch'ais per wp/v2 - check b2b-black, Šėrim, Šaltinis: gamintojo
// Kad nesusijunktume, parallelize per xargs
fs.writeFileSync('/tmp/ids.txt',all.map(p=>p.id).join('\n'));
fs.mkdirSync('/tmp/contents',{recursive:true});
execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} sh -c 'curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp/v2/product/{}?context=edit&_fields=id,content" > /tmp/contents/{}.json 2>/dev/null'`,{env:env2,stdio:'inherit',maxBuffer:200000000});

// 3. Analyze kiekvieno
const results={};
for(const p of all){
  try{
    const j=JSON.parse(fs.readFileSync(`/tmp/contents/${p.id}.json`,'utf8'));
    const c=(j.content&&j.content.raw)||'';
    results[p.id]={
      hasB2B:c.includes('b2b-black'),
      hasShaltinis:/Šaltinis:\s*gamintojo/i.test(c),
      hasSerimMarker:/Šėrim/i.test(c),
      hasTable:/<table/i.test(c),
      cLen:c.length
    };
  }catch(e){results[p.id]={err:String(e).slice(0,80)};}
}

// 4. Suskaitykim pagal brendą
const brandStats={};
const catStats={};
for(const p of all){
  const brands=(p.brands||[]).map(b=>b.name).join(', ')||'NO_BRAND';
  const cats=(p.categories||[]).map(c=>c.name).join(', ')||'NO_CAT';
  const r=results[p.id]||{};
  brandStats[brands]=brandStats[brands]||{total:0,b2b:0,hasSerim:0,hasTable:0,bare:0};
  brandStats[brands].total++;
  if(r.hasB2B) brandStats[brands].b2b++;
  if(r.hasSerimMarker) brandStats[brands].hasSerim++;
  if(r.hasTable) brandStats[brands].hasTable++;
  if(!r.hasSerimMarker && !r.hasTable) brandStats[brands].bare++;
  
  catStats[cats]=catStats[cats]||{total:0,b2b:0};
  catStats[cats].total++;
  if(r.hasB2B) catStats[cats].b2b++;
}

const report={total:all.length,brandStats,catStats,sampleResults:Object.fromEntries(Object.entries(results).slice(0,5))};
commit('full_diagnostic.json',JSON.stringify(report,null,1));
// Dump details for bare products
const bareList=[];
for(const p of all){
  const r=results[p.id]||{};
  if(!r.hasSerimMarker && !r.hasTable && !r.err) {
    bareList.push({id:p.id,name:p.name,brand:(p.brands||[]).map(b=>b.name).join('|'),cat:(p.categories||[]).map(c=>c.name).join('|'),cLen:r.cLen});
  }
}
commit('full_diagnostic_bare.json',JSON.stringify({bareList,count:bareList.length},null,1));
console.log(`Bare: ${bareList.length}`);
console.log("done");
