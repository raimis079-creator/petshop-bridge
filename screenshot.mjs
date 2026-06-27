import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
function parseWeight(title){
  const t=title.replace(/&amp;/g,'&').replace(/&#8211;/g,'-');
  let m=t.match(/(\d+)\s*\+\s*(\d+)\s*kg\b/i);
  if(m) return (parseFloat(m[1])+parseFloat(m[2])).toFixed(3);
  m=t.match(/(\d+(?:[,.]\d+)?)\s*kg\b/i);
  if(m) return parseFloat(m[1].replace(',','.')).toFixed(3);
  m=t.match(/(\d+(?:[,.]\d+)?)\s*(gr|g)\b/i);
  if(m) return (parseFloat(m[1].replace(',','.'))/1000).toFixed(3);
  return null;
}
// Get all Farmina IDs + titles
let acc=[],page=1;
while(page<=3){
  const p=cj(`${BASE}/wp/v2/product?product_brand=301&per_page=100&page=${page}&_fields=id,title`);
  if(!Array.isArray(p)||!p.length)break;
  acc=acc.concat(p.map(x=>({id:x.id,title:(x.title&&x.title.rendered)||''})));
  if(p.length<100)break;page++;
}
fs.writeFileSync('/tmp/ids.txt',acc.map(x=>x.id).join("\n"));
// Pull content paraleliai
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

// Build per-product plan
const plan=[];const skipped=[];
for(const x of acc){
  const w=parseWeight(x.title);
  if(!w){skipped.push({id:x.id,reason:'no_weight'});continue;}
  let co={};try{co=JSON.parse(fs.readFileSync('/tmp/c/'+x.id+'.json','utf8'));}catch(e){}
  const raw=(co.content&&co.content.raw)||"";
  if(!raw){skipped.push({id:x.id,reason:'no_content'});continue;}
  // Remove „Pakuotės dydis" paragrafą - tiek encoded tiek decoded variantą + jo notionvc komentarą
  // Forma 1: &lt;p&gt;Pakuotės dydis...&lt;/p&gt;
  // Forma 2: <p>Pakuotės dydis...</p>
  let newRaw=raw;
  // Encoded variantas su notionvc
  newRaw=newRaw.replace(/\n?&lt;p&gt;Pakuotės dydis:[^]*?&lt;\/p&gt;/g,'');
  // Decoded variantas su notionvc
  newRaw=newRaw.replace(/\n?<p>Pakuotės dydis:[^]*?<\/p>/g,'');
  // Likučiai - kitos formos jei neapėmiau
  const stillHas=/Pakuotės dydis/.test(newRaw);
  // Guard'ai
  const g={
    weightValid:parseFloat(w)>0,
    contentNotEmpty:newRaw.length>=300,
    pakuoteRemovedIfWasPresent: !stillHas,
    noBreakage: !/<\/p><\/p>|<p><p>/.test(newRaw),
    contentHashChangedIfPakWas: /Pakuotės dydis/.test(raw) ? (md5(raw)!==md5(newRaw)) : true,
    contentSameIfNoPak: /Pakuotės dydis/.test(raw) ? true : (md5(raw)===md5(newRaw))
  };
  const pass=Object.values(g).every(Boolean);
  if(!pass){skipped.push({id:x.id,reason:'guard',guards:g,len:newRaw.length});continue;}
  plan.push({id:x.id,title:x.title,weight:w,oldLen:raw.length,newLen:newRaw.length,hadPak:/Pakuotės dydis/.test(raw),newRaw});
}

// APPLY: 1) update content (jei pakeitė) 2) update weight via wc/v3
const wres={ok:0,contentOnly:0,weightOnly:0,both:0,fail:0,errs:[]};
for(const p of plan){
  let contentChanged = p.oldLen !== p.newLen;
  let writeErr = null;
  // 1) Content via wp/v2 (jei keitėsi)
  if(contentChanged){
    fs.writeFileSync('/tmp/body.json',JSON.stringify({content:p.newRaw}));
    try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${p.id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
      // verify lossless
      let rb="";execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${p.id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
      if(md5(rb)!==md5(p.newRaw)){writeErr='lossless_fail';}
    }catch(e){writeErr='content_err';}
  }
  // 2) Weight via wc/v3 — tik weight, nieko daugiau
  let weightChanged=false;
  if(!writeErr){
    fs.writeFileSync('/tmp/wbody.json',JSON.stringify({weight:p.weight}));
    try{execSync(`curl -sk -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wc/v3/products/${p.id}" -d @/tmp/wbody.json -o /tmp/wcw.json`,{env,maxBuffer:200000000});
      let wcr={};try{wcr=JSON.parse(fs.readFileSync('/tmp/wcw.json','utf8'));}catch(e){}
      if(wcr.weight && parseFloat(wcr.weight)===parseFloat(p.weight))weightChanged=true;
      else writeErr='weight_verify_fail';
    }catch(e){writeErr='weight_err';}
  }
  if(writeErr){wres.fail++;wres.errs.push({id:p.id,err:writeErr});}
  else {
    if(contentChanged && weightChanged)wres.both++;
    else if(contentChanged)wres.contentOnly++;
    else if(weightChanged)wres.weightOnly++;
    wres.ok++;
  }
}
commit("farmina_global_apply_"+Date.now()+".json",JSON.stringify({planned:plan.length,skipped,wres},null,1));
console.log("APPLY DONE",JSON.stringify(wres));
