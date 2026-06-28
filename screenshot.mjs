import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";

// Visi 81 Farmina SKU su lentelemis + 41 Prins
const FARMINA=[
  // Pumpkin DOG (19)
  14535, 33239,14532, 33235,14528,14530, 14534,
  33243,14537, 14540,14539, 14543, 14544, 14715, 14545, 14542, 14541,
  14524,14525, 14526,
  // Prime DOG (9)
  14517,14516,33231, 14521,14520,14519, 14523,14522, 14515,
  // Ocean DOG (12)
  14504, 14503, 14505,14506,14507, 14508,14509, 14510,14511,14512, 14513,14514,
  // Quinoa DOG (14)
  14552,14550, 14551, 14549,14548, 14560,14561, 14559,14558,
  14556, 14554, 14553, 14547,14546,
  // Brown DOG (6)
  33229, 14498, 14502, 14501, 14497, 14500,
  // White DOG (6)
  33253, 14578, 14577, 14581, 14580, 14579,
  // Tropical Selection DOG (14)
  33249, 33251, 14564,14565, 14566,14567, 14568,14569, 14570,14571,
  14572,14573, 14574,14575,
  // Ancestral Grain DOG (1)
  14496
];

const PRINS=[
  // 41 ProCare prekes is Prins katalogo - reikia atstatyti is sesijos
  // Imam visus prins brando dog dry SKU per WP filtra
];

// Pirmiausia patikrinkime Farmina (81)
fs.writeFileSync('/tmp/ids.txt',FARMINA.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,excerpt,status,title,modified_gmt" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const farminaResults=[];
for(const id of FARMINA){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){farminaResults.push({id,err:'read'});continue;}
  const raw=(j.content&&j.content.raw)||"";
  const exc=(j.excerpt&&j.excerpt.raw)||"";
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(raw),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(raw),
    hasSerimo:/Šėrimo instrukcija/.test(raw),
    hasOneB2bTable:(raw.match(/b2b-black/g)||[]).length===1,
    hasTableTag:(raw.match(/<table/g)||[]).length===1,
    hasHeader:raw.includes('Šuns svoris')||raw.includes('Amžius'),
    introMin:raw.length>=2000,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(raw),
    excerptDecoded:!/&lt;p&gt;|&amp;amp;/.test(exc) || exc.length===0
  };
  const pass=Object.values(g).every(Boolean);
  farminaResults.push({id,status:j.status,modified:j.modified_gmt,title:(j.title&&j.title.rendered||'').slice(0,60),len:raw.length,guards:g,pass});
}

// Surenkam ir Prins is brando - parodom atskirai vargana lista
// Prins brand SKU is paieskos
let prinsIds=[];
try{
  // Prins brand: search by product_brand taxonomy
  for(let page=1;page<=2;page++){
    const cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product?search=PRINS&per_page=100&page=${page}&_fields=id,title"`;
    execSync(cmd+' -o /tmp/prins_p.json',{env,maxBuffer:200000000});
    const p=JSON.parse(fs.readFileSync('/tmp/prins_p.json','utf8'));
    if(!Array.isArray(p)||!p.length)break;
    prinsIds=prinsIds.concat(p.filter(x=>{
      const t=(x.title&&x.title.rendered||'').toUpperCase();
      return t.includes('PRINS') && (t.includes('PROCARE')||t.includes('DRY')||t.includes('PROTECTION'));
    }).map(x=>x.id));
    if(p.length<100)break;
  }
}catch(e){}

fs.writeFileSync('/tmp/pids.txt',prinsIds.join("\n"));
execSync('rm -rf /tmp/p && mkdir -p /tmp/p',{env});
try{execSync(`cat /tmp/pids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status,title,modified_gmt" -o /tmp/p/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const prinsResults=[];
for(const id of prinsIds){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8'));}catch(e){prinsResults.push({id,err:'read'});continue;}
  const raw=(j.content&&j.content.raw)||"";
  const g={
    hasAccordion:/ps_desc=1|prins-accordion|tab-pane|accordion-collapse|<details/.test(raw)||raw.includes('Sudėtis')||raw.includes('Analitinės'),
    hasSudetis:raw.includes('Sudėtis')||raw.includes('sudėtis')||raw.includes('Composition'),
    hasAnalitine:raw.includes('Analitinės')||raw.includes('analitinė'),
    hasSerimo:raw.includes('Šėrimo')||raw.includes('Šerti'),
    noEnc:!/&lt;p&gt;/.test(raw),
    introMin:raw.length>=1500
  };
  const pass=Object.values(g).every(Boolean);
  prinsResults.push({id,status:j.status,modified:j.modified_gmt,title:(j.title&&j.title.rendered||'').slice(0,60),len:raw.length,guards:g,pass});
}

const farminaPassed=farminaResults.filter(r=>r.pass).length;
const prinsPassed=prinsResults.filter(r=>r.pass).length;
const summary={
  farmina:{total:farminaResults.length,passed:farminaPassed,fails:farminaResults.filter(r=>!r.pass)},
  prins:{total:prinsResults.length,passed:prinsPassed,fails:prinsResults.filter(r=>!r.pass)}
};
commit("health_check_"+Date.now()+".json",JSON.stringify(summary,null,1));
console.log("HEALTH DONE Farmina:"+farminaPassed+"/"+farminaResults.length+" Prins:"+prinsPassed+"/"+prinsResults.length);
