import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const wpUser=process.env.WP_USER;
const wpPass=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const baseAuth='-u "'+wpUser+':'+wpPass+'"';
const base='https://dev.avesa.lt/wp-json';

// 1. List
console.log("Fetching publish list...");
const all=[];
for(let p=1;p<=30;p++){
  try{
    const r=execSync(`curl -sk --max-time 60 ${baseAuth} "${base}/wc/v3/products?per_page=100&page=${p}&status=publish&_fields=id,name,brands,categories"`,{encoding:'utf8',maxBuffer:200000000});
    const arr=JSON.parse(r);
    if(!arr||!Array.isArray(arr)||!arr.length)break;
    all.push(...arr);
    console.log(`page ${p}: +${arr.length} (total ${all.length})`);
    if(arr.length<100)break;
  }catch(e){console.log(`page ${p} err: ${e.message.slice(0,100)}`);break;}
}
console.log(`Total publish: ${all.length}`);

// 2. Fetch content sekvenciniai bet greitai (visi ids -> /tmp file -> read)
fs.mkdirSync('/tmp/cnt',{recursive:true});
const idsFile='/tmp/ids.txt';
fs.writeFileSync(idsFile,all.map(p=>p.id).join('\n'));

// Naudokim parallel via shell -c su explicit env eksportu
const shellCmd=`cat ${idsFile} | xargs -P 12 -I{} sh -c 'curl -sk --max-time 12 -u "${wpUser}:${wpPass}" "${base}/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/cnt/{}.json'`;
console.log("Fetching contents...");
try{
  execSync(shellCmd,{encoding:'utf8',stdio:'pipe',maxBuffer:500000000,timeout:900000});
}catch(e){console.log("xargs warn (some may have failed):",e.message?.slice(0,100));}

// 3. Analyze
const results={};
let okCount=0;
for(const p of all){
  try{
    const fp=`/tmp/cnt/${p.id}.json`;
    if(!fs.existsSync(fp)){results[p.id]={err:'no_file'};continue;}
    const fs_size=fs.statSync(fp).size;
    if(fs_size<10){results[p.id]={err:'empty'};continue;}
    const raw=fs.readFileSync(fp,'utf8');
    const j=JSON.parse(raw);
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
console.log(`Processed OK: ${okCount}/${all.length}`);

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
console.log(`Done. brands=${Object.keys(brandStats).length}, bare=${bareList.length}`);
