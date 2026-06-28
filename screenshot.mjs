import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function decodeOnce(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'");}

const BLOCK = '<style>.b2b-vetlife { color:#000 !important; padding:12px 16px; background:#f7f9fb; border-left:3px solid #2e7d32; margin:14px 0; }</style>\n<div class="b2b-vetlife">\n<p><b>Šėrimo rekomendacija (Farmina Vet Life):</b></p>\n<p>Šis dietetinis pašaras skirtas specialiems mitybos poreikiams ir naudojamas pagal veterinarijos gydytojo rekomendaciją. Tikslią paros normą turi nustatyti <b>veterinarijos gydytojas</b>, atsižvelgdamas į gyvūno svorį, amžių, fizinę būklę bei sveikatos būklę.</p>\n</div>';

// Vet Life DOG 23 + CAT 15 = 38 SKU
const IDS=[
  // DOG
  33370,14652,14642,14639,14650,14651,14649,14648,14647,14644,14643,14645,14635,14634,14633,14632,14637,14641,14640,14638,14636,14631,14630,
  // CAT
  33394,33390,14678,14677,14674,14675,14662,14665,14671,14670,14669,14664,14661,14657,14660
];
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep={planned:[],apply:[]};
const builds={};
let allPass=true;
for(const id of IDS){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep.planned.push({id,err:'read'});allPass=false;continue;}
  const raw=(j.content&&j.content.raw)||"";
  let zb=raw;
  // pasalinam senas b2b lenteles/blokus jei buvo (apsauga nuo dublikacijos)
  const tblStart=zb.indexOf('<style>.b2b-black');
  if(tblStart>=0){const tblEnd=zb.indexOf('</table></div>',tblStart);if(tblEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(tblEnd+'</table></div>'.length);}}
  const vlStart=zb.indexOf('<style>.b2b-vetlife');
  if(vlStart>=0){const vlEnd=zb.indexOf('</div>',vlStart);if(vlEnd>=0){zb=zb.slice(0,vlStart).replace(/\s+$/,'')+zb.slice(vlEnd+'</div>'.length);}}
  const decoded=decodeOnce(zb);
  const sIdx=decoded.indexOf('Šėrimo');
  const pEnd=sIdx>=0?decoded.indexOf('</p>',sIdx):-1;
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker',title:(j.title&&j.title.rendered)||''});allPass=false;continue;}
  const cut=pEnd+4;
  const newT=decoded.slice(0,cut)+'\n'+BLOCK+decoded.slice(cut);
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(newT),
    hasRealP:/<p>/.test(newT)&&/<\/p>/.test(newT),
    hasSerimo:/Šėrimo instrukcija/.test(newT),
    noTable:!/<table/.test(newT),
    oneVetlifeBlock:(newT.match(/<div class="b2b-vetlife">/g)||[]).length===1,
    hasRecText:newT.includes('Šėrimo rekomendacija')&&newT.includes('veterinarijos gydytojas'),
    introMin:newT.length>=1500,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(newT)
  };
  const pass=Object.values(g).every(Boolean);
  rep.planned.push({id,title:(j.title&&j.title.rendered)||'',guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("farmina_vl_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

for(const id of IDS){
  const b=builds[id];
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:b.newT}));
  try{
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
    execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});
    const rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
    rep.apply.push({id,lossless:md5(rb)===md5(b.newT)});
  }catch(e){rep.apply.push({id,err:String(e).slice(0,100)});}
}
commit("farmina_vl_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("VL APPLY DONE",IDS.length);
