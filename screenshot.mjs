import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function api(path){try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/${path}" -o /tmp/a.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/a.json','utf8'));}catch(e){return null;}}
// 1) brand term id
let bid=null;const bt=api('wp/v2/product_brand?slug=prins&_fields=id,slug');if(Array.isArray(bt)&&bt[0])bid=bt[0].id;
// 2) collect ids: brand + search
const ids=new Set();
if(bid){for(let pg=1;pg<=3;pg++){const a=api(`wp/v2/product?product_brand=${bid}&per_page=100&page=${pg}&_fields=id`);if(!Array.isArray(a)||!a.length)break;a.forEach(x=>ids.add(x.id));}}
for(let pg=1;pg<=3;pg++){const a=api(`wc/v3/products?search=Prins&per_page=100&page=${pg}&_fields=id`);if(!Array.isArray(a)||!a.length)break;a.forEach(x=>ids.add(x.id));}
const ID=[...ids];
// 3) read each: content + meta + status + cats
fs.writeFileSync('/tmp/ids.txt',ID.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/{}?_fields=id,name,status,categories,meta_data,sku" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
// also wp/v2 content.raw for feeding detection
execSync('mkdir -p /tmp/r',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/r/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm)|Rekomenduojam\w*\s+(?:paros|kiekis|\u0161\u0117rim)|paros\s+norma)/i;
const PAIR=/\d+(?:,\d+)?\s*kg\b[\s\S]{0,40}?\d+\s*g\b/i;
function manuf(md){if(!Array.isArray(md))return'';const m=md.find(x=>x.key==='_legacy_manufacturer');return m?String(m.value||''):'';}
const buckets={OK_TABLE:[],FIXHEAD:[],HEAD_NODATA:[],PROSE:[],NOFEED:[],EMPTY:[]};
const catCount={};
let prinsConfirmed=0;
for(const id of ID){let p={},T="";
  try{p=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){}
  try{T=(JSON.parse(fs.readFileSync('/tmp/r/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){}
  const mf=manuf(p.meta_data);
  const isPrins = /prins/i.test(mf) || /prins/i.test(p.name||'');
  if(!isPrins) continue;
  prinsConfirmed++;
  const cat=(p.categories||[]).map(c=>c.name).join('/')||'(none)';catCount[cat]=(catCount[cat]||0)+1;
  const hm=T.match(HEAD);const hasHead=!!hm;
  const hasTbl=/<table/i.test(T);const hasB2b=/b2b-black/i.test(T);const hasPair=PAIR.test(T);
  const norma=/\u0160\u0117rimo norma \(g\/d\.\)/.test(T);
  const head=hm?T.slice(Math.max(0,hm.index-6),hm.index+34).replace(/\s+/g,' '):'';
  let b;
  if(!T.trim())b='EMPTY';
  else if(hasTbl && hasHead) b = (norma||!hasB2b)?'FIXHEAD':'OK_TABLE';
  else if(hasTbl) b='OK_TABLE';
  else if(hasHead && hasPair) b='PROSE';
  else if(hasHead) b='HEAD_NODATA';
  else b='NOFEED';
  buckets[b].push({id,status:p.status,sku:p.sku,b2b:hasB2b,head,name:(p.name||'').slice(0,46),mf:mf.slice(0,20)});
}
const summary={brandTermId:bid,collected:ID.length,prinsConfirmed,bucketCounts:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,v.length])),catCount};
commit("prins_audit_"+Date.now()+".json",JSON.stringify({summary,buckets},null,1));
console.log(JSON.stringify(summary,null,1));
console.log("\n--- buckets ---");
for(const [b,arr] of Object.entries(buckets)){if(!arr.length)continue;console.log('\n== '+b+' ('+arr.length+') ==');arr.forEach(x=>console.log('  '+x.id+' ['+x.status+'] '+x.sku+' b2b='+x.b2b+' | head="'+x.head+'" | '+x.name));}
