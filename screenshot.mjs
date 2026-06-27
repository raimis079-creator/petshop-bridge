import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
// 1) list products matching exclusion (search) across statuses
let prods=[];
for(const st of ['publish','draft','private','pending']){
  for(let pg=1;pg<=3;pg++){
    let arr=[];
    try{const raw=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=exclusion&status=${st}&per_page=100&page=${pg}&_fields=id,name,sku,status,categories"`,{encoding:'utf8',env,maxBuffer:80000000});arr=JSON.parse(raw);}catch(e){break;}
    if(!Array.isArray(arr)||arr.length===0)break;
    prods=prods.concat(arr);
    if(arr.length<100)break;
  }
}
// dedupe
const seen={};prods=prods.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
fs.writeFileSync('/tmp/ids.txt', prods.map(p=>p.id).join("\n"));
// 2) parallel read content
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const MARKTXT='\u0160\u0117rimo instrukcija';
function classify(id){let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return {read:0};}
  const hasMark=T.indexOf(MARKTXT)>-1;
  const hasRealTable=/<table[ >]/i.test(T);
  // feeding prose? kg/g pairs present
  const hasPairs=/(\d+)\s*kg\s*[-\u2013:* ]*\s*\d+\s*[-\u2013]?\s*\d*\s*g/i.test(T)||/(\d+)\s*kg[\s\S]{0,8}\d+\s*g/i.test(T);
  const sud=/Sud\u0117tis|Sudedam/i.test(T);
  const anal=/Analitin/i.test(T);
  const enc=T.indexOf('&lt;p&gt;')>-1||T.indexOf('&lt;strong&gt;')>-1;
  const b2b=T.indexOf('b2b-black')>-1;
  const len=T.length;
  return {read:1,len,hasMark,hasRealTable,hasPairs,sud,anal,enc,b2b};
}
const rows=prods.map(p=>{const c=classify(p.id);const cats=(p.categories||[]).map(x=>x.name).join('/');return {id:p.id,name:(p.name||'').slice(0,55),sku:p.sku,status:p.status,cats,...c};});
// summaries
const byStatus={},byCat={},feed={table:0,prose_only:0,no_feed:0,empty:0};
rows.forEach(r=>{byStatus[r.status]=(byStatus[r.status]||0)+1;byCat[r.cats]=(byCat[r.cats]||0)+1;
  if(!r.read||r.len<50)feed.empty++;else if(r.hasRealTable)feed.table++;else if(r.hasMark||r.hasPairs)feed.prose_only++;else feed.no_feed++;});
commit("excl_audit_"+Date.now()+".json", JSON.stringify({total:rows.length,byStatus,byCat,feed,rows},null,1));
console.log("DONE total="+rows.length);
