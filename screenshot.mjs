import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
function decodeOnce(s){
  return s
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>')
    .replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;')
    .replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'");
}
// All Farmina IDs
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p.map(x=>x.id));
  if(p.length<100)break;page++;
}
fs.writeFileSync('/tmp/ids.txt',acc.join("\n"));
// Pull excerpts paraleliai per wp/v2
execSync('rm -rf /tmp/e && mkdir -p /tmp/e',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,excerpt" -o /tmp/e/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const wres={dims_ok:0,dims_fail:0,excerpt_changed:0,excerpt_unchanged:0,excerpt_fail:0,errs:[]};
const sample=[];

for(const id of acc){
  // 1) Clear dimensions to empty strings via wc/v3
  fs.writeFileSync('/tmp/dbody.json',JSON.stringify({dimensions:{length:"",width:"",height:""}}));
  try{
    execSync(`curl -sk -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wc/v3/products/${id}" -d @/tmp/dbody.json -o /tmp/dr.json`,{env,maxBuffer:200000000});
    let dr={};try{dr=JSON.parse(fs.readFileSync('/tmp/dr.json','utf8'));}catch(e){}
    const d=dr.dimensions||{};
    if(d.length===''&&d.width===''&&d.height==='')wres.dims_ok++;
    else {wres.dims_fail++; wres.errs.push({id,kind:'dims',got:d});}
  }catch(e){wres.dims_fail++;wres.errs.push({id,kind:'dims_err',e:String(e).slice(0,80)});}

  // 2) Decode + de-duplicate excerpt (short description)
  let ej={};try{ej=JSON.parse(fs.readFileSync('/tmp/e/'+id+'.json','utf8'));}catch(e){}
  const exRaw=(ej.excerpt&&ej.excerpt.raw)||"";
  if(!exRaw){wres.excerpt_unchanged++;continue;}
  let newEx=exRaw;
  // dekoduojam vieną sluoksnį
  newEx=decodeOnce(newEx);
  // jei buvo dviguba <p><p>...</p></p> struktūra po wp velka — pašalinam dviem dvigubinimą
  newEx=newEx.replace(/^\s*<p>(\s*<p>[\s\S]*<\/p>\s*)<\/p>\s*$/,'$1');
  // Guard: jokio &lt;, jokio dvigubo &amp;amp
  const g={noEnc:!/&lt;|&gt;|&amp;amp;|&amp;nbsp;/.test(newEx), changed:newEx!==exRaw, nonempty:newEx.length>=10};
  if(!g.noEnc||!g.nonempty){wres.excerpt_fail++;wres.errs.push({id,kind:'excerpt_guard',g,newEx:newEx.slice(0,150)});continue;}
  if(!g.changed){wres.excerpt_unchanged++;continue;}
  fs.writeFileSync('/tmp/exbody.json',JSON.stringify({excerpt:newEx}));
  try{
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/exbody.json -o /tmp/exr.json`,{env,maxBuffer:200000000});
    // verify
    let rb={};try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=excerpt" -o /tmp/exrb.json`,{env});rb=JSON.parse(fs.readFileSync('/tmp/exrb.json','utf8'));}catch(e){}
    const back=(rb.excerpt&&rb.excerpt.raw)||"";
    if(md5(back)===md5(newEx))wres.excerpt_changed++;
    else {wres.excerpt_fail++; wres.errs.push({id,kind:'excerpt_lossless_fail',sent:newEx.slice(0,150),back:back.slice(0,150)});}
    if(sample.length<3)sample.push({id,old:exRaw,new:newEx,back});
  }catch(e){wres.excerpt_fail++;wres.errs.push({id,kind:'excerpt_err',e:String(e).slice(0,80)});}
}
commit("farmina_fix2_"+Date.now()+".json",JSON.stringify({total:acc.length,wres,sample},null,1));
console.log("FIX2 DONE",JSON.stringify(wres));
