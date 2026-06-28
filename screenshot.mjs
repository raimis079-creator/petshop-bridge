import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
let acc=[],page=1;
while(page<=3){const p=cj(`${BASE}/wp/v2/product?product_brand=239&per_page=100&page=${page}&status=publish,draft,private&_fields=id,title,status`);if(!Array.isArray(p)||!p.length)break;acc=acc.concat(p);if(p.length<100)break;page++;}
fs.writeFileSync('/tmp/ids.txt',acc.map(x=>x.id).join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,excerpt,status,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

function parseWeight(title){
  const t=title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  let m=t.match(/(\d+)\s*\+\s*(\d+)\s*kg\b/i); if(m)return parseFloat(m[1])+parseFloat(m[2]);
  m=t.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i); if(m)return parseFloat(m[1].replace(',','.'));
  m=t.match(/(\d+(?:[,.]\d+)?)\s*(gr|g)\b/i); if(m)return parseFloat(m[1].replace(',','.'))/1000;
  return null;
}

const stats={total:acc.length,withTable:[],withVetLife:[],bare:[],dimZero:0,pakuoteCm:0,doubleEnc:0,publish:0,draft:0,priv:0};
const lines={};
for(const x of acc){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+x.id+'.json','utf8'));}catch(e){continue;}
  const raw=(j.content&&j.content.raw)||"";
  const exc=(j.excerpt&&j.excerpt.raw)||"";
  const t=(j.title&&j.title.rendered)||'';
  if(j.status==='publish') stats.publish++;
  else if(j.status==='draft') stats.draft++;
  else stats.priv++;
  // Classify
  if(/<div class="b2b-black">/.test(raw)) stats.withTable.push({id:x.id,title:t,status:j.status});
  else if(/<div class="b2b-vetlife">/.test(raw)) stats.withVetLife.push({id:x.id,title:t,status:j.status});
  else stats.bare.push({id:x.id,title:t,status:j.status,hasSerimo:/Šėrimo instrukcija/.test(raw)||/Šerimo/.test(raw),len:raw.length});
  // Heaters
  if(/Pakuotės dydis.*cm/.test(raw)) stats.pakuoteCm++;
  if(/&lt;p&gt;|&amp;amp;/.test(exc)) stats.doubleEnc++;
  // Lines
  const lineMatch=t.match(/MONGE\s+([A-ZĄČĘĖĮŠŲŪŽa-z&;#]+(?:\s+[A-Za-z&;#]+)*?)\s+[–—-]/);
  const line=lineMatch?lineMatch[1].trim():'(neaiški)';
  lines[line]=(lines[line]||0)+1;
}
commit("monge_recon.json",JSON.stringify({stats:{total:stats.total,publish:stats.publish,draft:stats.draft,priv:stats.priv,withTable:stats.withTable.length,withVetLife:stats.withVetLife.length,bare:stats.bare.length,pakuoteCm:stats.pakuoteCm,doubleEnc:stats.doubleEnc},lines,bareList:stats.bare,tableList:stats.withTable},null,1));
console.log("DONE",acc.length);
