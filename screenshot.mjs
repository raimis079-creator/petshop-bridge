import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const IDS=[33370,33231,14651,14650,14634,14633,14630,14516,14517];
const out={planned:[],wres:{ok:0,fail:0,errs:[]}};
for(const id of IDS){
  const j=cj(`${BASE}/wp/v2/product/${id}?context=edit&_fields=id,content`);
  const raw=(j.content&&j.content.raw)||"";
  // patobulintas regex: leidžia bet kokius vidinius tag'us prieš ir po "Pakuotės dydis"
  // Forma: &lt;p&gt; [anything] Pakuotės dydis...cm. [anything] &lt;/p&gt;
  let newRaw=raw.replace(/\n?&lt;p&gt;(?:(?!&lt;\/p&gt;)[\s\S])*?Pakuotės dydis:(?:(?!&lt;\/p&gt;)[\s\S])*?&lt;\/p&gt;/g,'');
  newRaw=newRaw.replace(/\n?<p>(?:(?!<\/p>)[\s\S])*?Pakuotės dydis:(?:(?!<\/p>)[\s\S])*?<\/p>/g,'');
  const removed=!/Pakuotės dydis/.test(newRaw);
  const g={removed,nonempty:newRaw.length>=300,noBreakage:!/<\/p><\/p>|<p><p>/.test(newRaw),changed:md5(raw)!==md5(newRaw)};
  const pass=Object.values(g).every(Boolean);
  out.planned.push({id,oldLen:raw.length,newLen:newRaw.length,guards:g,pass});
  if(!pass){out.wres.fail++;out.wres.errs.push({id,reason:'guard',g});continue;}
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newRaw}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
    let rb="";execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
    if(md5(rb)!==md5(newRaw))throw new Error('lossless_fail');
    out.wres.ok++;
  }catch(e){out.wres.fail++;out.wres.errs.push({id,err:String(e).slice(0,80)});}
}
commit("farmina_pak_fix_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("FIX DONE",JSON.stringify(out.wres));
