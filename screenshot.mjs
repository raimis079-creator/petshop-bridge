import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const base='https://dev.avesa.lt/wp-json';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

// 1. Paimkim VISUS publish - per wc/v3 batches
console.log("Fetching all publish products...");
const all=[];
for(let p=1;p<=30;p++){
  try{
    const r=execSync(`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products?per_page=100&page=${p}&status=publish&_fields=id,name,brands,categories"`,{env:env2,encoding:'utf8',maxBuffer:200000000});
    const arr=JSON.parse(r);
    if(!arr||!arr.length)break;
    all.push(...arr);
    if(arr.length<100)break;
  }catch(e){console.log(`page ${p} err:`,e.message.slice(0,80));break;}
}
console.log(`Total publish: ${all.length}`);
commit('diag_full_list.json',JSON.stringify(all,null,1));

// 2. Paimkim turinį per parallel curls
console.log("Fetching contents in parallel...");
fs.mkdirSync('/tmp/cnt',{recursive:true});
const idStr=all.map(p=>p.id).join('\n');
fs.writeFileSync('/tmp/ids.txt',idStr);

const wpUser=process.env.WP_USER;
const wpPass=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
// Use xargs explicitly with wpUser/wpPass injected
try{
  execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 15 -u "${wpUser}:${wpPass}" "${base}/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/cnt/{}.json`,{encoding:'utf8',stdio:'pipe',maxBuffer:500000000,timeout:600000});
}catch(e){console.log("xargs err",e.message.slice(0,200));}

// 3. Analyze
const results={};
let okCount=0;
for(const p of all){
  try{
    const fp=`/tmp/cnt/${p.id}.json`;
    if(!fs.existsSync(fp)){results[p.id]={err:'no_file'};continue;}
    const j=JSON.parse(fs.readFileSync(fp,'utf8'));
    const c=(j.content&&j.content.raw)||'';
    if(!c){results[p.id]={err:'no_content'};continue;}
    results[p.id]={
      hasB2B:c.includes('b2b-black'),
      hasShaltinis:/Šaltinis:\s*gamintojo/i.test(c),
      hasSerimMarker:/Šėrim/i.test(c),
      hasTable:/<table/i.test(c),
      cLen:c.length
    };
    okCount++;
  }catch(e){results[p.id]={err:String(e).slice(0,80)};}
}
console.log(`Processed: ${okCount}/${all.length}`);

// 4. Brand stats
const brandStats={};
for(const p of all){
  const brand=(p.brands||[]).map(b=>b.name).join('|')||'NO_BRAND';
  const r=results[p.id]||{};
  brandStats[brand]=brandStats[brand]||{total:0,b2b:0,shaltinis:0,hasSerim:0,hasTable:0,bare:0,err:0};
  brandStats[brand].total++;
  if(r.err){brandStats[brand].err++;continue;}
  if(r.hasB2B) brandStats[brand].b2b++;
  if(r.hasShaltinis) brandStats[brand].shaltinis++;
  if(r.hasSerimMarker) brandStats[brand].hasSerim++;
  if(r.hasTable) brandStats[brand].hasTable++;
  if(!r.hasSerimMarker && !r.hasTable && !r.err) brandStats[brand].bare++;
}

// 5. Bare list
const bareList=[];
for(const p of all){
  const r=results[p.id]||{};
  if(!r.hasSerimMarker && !r.hasTable && !r.err) {
    const brand=(p.brands||[]).map(b=>b.name).join('|');
    const cat=(p.categories||[]).map(c=>c.name).join('|');
    bareList.push({id:p.id,name:p.name?.substring(0,80),brand,cat,cLen:r.cLen||0});
  }
}

commit('diag_stats.json',JSON.stringify({total:all.length,processed:okCount,brandStats,bareCount:bareList.length},null,1));
commit('diag_bare.json',JSON.stringify({count:bareList.length,bareList},null,1));
console.log(`Brand stats: ${Object.keys(brandStats).length}, bare: ${bareList.length}`);
