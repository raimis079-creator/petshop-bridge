import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');

const COMP="Paukštienos miltai (21,0%), kukurūzai, kviečiai, sorgas, hidrolizuotas paukštienos baltymas (4,5%), džiovinta cikorijų masė (2,0%), jautienos taukai, celiuliozė, saulėgrąžų aliejus, fruktooligosacharidai (FOS) (0,5%), dumblių aliejus (0,2%), hidrolizuotos mielės.";
const ANAL="Drėgmė 8,0%, žali baltymai 25,0%, žali riebalai 11,0%, žali pelenai 7,0%, žalia ląsteliena 4,0%, linolo rūgštis 2,0%. Mineralinės medžiagos: kalcis 1,3%, fosforas 1,0%, kalis 0,6%, magnis 0,1%, natris 0,3%.";
const ENERGY="3537 kcal/kg";
const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const ROWS_SF=[["2,5","55","65","75"],["5","90","105","125"],["7,5","125","145","170"],["10","155","175","210"],["15","205","240","285"],["20","255","295","350"],["25","305","350","415"],["30","345","400","475"],["35","390","450","530"],["40","430","495","585"],["45","470","545","640"],["50","505","585","695"],["55","545","630","745"],["60","580","675","795"],["65","615","715","845"],["70","650","755","890"],["80","720","835","985"]];
const ROWS_SFM=[["1","30","35","40"],["2","50","55","65"],["3","65","75","85"],["4","80","90","105"],["5","90","105","125"],["6","105","120","145"],["7","120","135","160"],["8","130","150","175"],["9","140","165","195"],["10","155","175","210"],["12","175","205","240"],["14","195","230","270"],["16","215","250","295"],["18","235","275","325"],["20","255","295","350"]];
const MAP={16763:ROWS_SF,16760:ROWS_SF,16769:ROWS_SFM,16766:ROWS_SFM};

function tbl(rows){return '<div class="b2b-black"><table><thead><tr><th>Kūno svoris</th><th>Mažas aktyvumas</th><th>Vidutinis aktyvumas</th><th>Didelis aktyvumas</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+x[0]+' kg</td><td>'+x[1]+' g</td><td>'+x[2]+' g</td><td>'+x[3]+' g</td></tr>').join('')+'</tbody></table></div>';}
function build(intro,rows){
  return intro.replace(/\s+$/,'')
   +'\n\n<p><strong>Sudėtis:</strong> '+COMP+'</p>'
   +'\n\n<p><strong>Analitinės sudedamosios dalys:</strong> '+ANAL+' Energetinė vertė: '+ENERGY+'.</p>'
   +'\n\n<p><strong>Šėrimo rekomendacija:</strong></p>\n<p>Rekomenduojama paros dozė (g):</p>'+tbl(rows)
   +'\n<p>'+INSTR+'</p>'
   +'\n\n<p><strong>Pagaminta:</strong> Olandijoje (Nyderlanduose).</p>';
}

const IDS=[16763,16760,16769,16766];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status,sku" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={};const rep={};let ok=true;
for(const id of IDS){let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep[id]={err:'read'};ok=false;continue;}
  const T=(j.content||{}).raw||"";
  const marks=[/Analiz/i,/Sud\u0117tis/i,/Nurodym/i,/Rekomenduojama paros/i,/\u0160\u0117rim/i];
  let mi=-1;for(const re of marks){const k=T.search(re);if(k>=0&&(mi<0||k<mi))mi=k;}
  if(mi<0){rep[id]={err:'no_marker'};ok=false;continue;}
  let b=T.lastIndexOf('<p',mi); if(b<0)b=mi;
  let intro=T.slice(0,b);
  const hadSalmon=/la\u0161i\u0161/i.test(intro);
  intro=intro.replace(/la\u0161i\u0161\u0173\s+aliejais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi');
  const rows=MAP[id];const newT=build(intro,rows);
  // GUARDS
  const g={
    introNoAnaliz: !/Analiz/i.test(intro),
    introNoNurodym: !/Nurodym/i.test(intro),
    introNoSalmon: !/la\u0161i\u0161/i.test(intro),
    hasSud: /<strong>Sud\u0117tis:<\/strong>/.test(newT),
    hasAnalitin: /Analitin\u0117s sudedamosios/.test(newT),
    hasSerimo: /\u0160\u0117rimo rekomendacija/.test(newT),
    hasPagaminta: /<strong>Pagaminta:<\/strong>/.test(newT),
    rowCount: (newT.match(/<tr><td>/g)||[]).length===rows.length,
    noOldEnergy: !/3880/.test(newT),
    introMin: intro.replace(/<[^>]+>/g,'').trim().length>=80
  };
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,recipe:(rows===ROWS_SF?'SF':'SF-MINI'),hadSalmon,introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,rows,sample:rows[0][1]+' g'};
}
if(!ok){commit("prins_b1_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT - guards failed");process.exit(0);}
// APPLY
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}
  wres[id]={lossless:md5(rb)===md5(newT),
    fe_sudetis:fe.includes('Sud\u0117tis'),fe_analitin:fe.includes('Analitin\u0117s'),fe_serimo:fe.includes('\u0160\u0117rimo'),fe_tbl:fe.includes('<table'),fe_sample:fe.includes(builds[id].sample),fe_pagaminta:fe.includes('Pagaminta'),
    fe_no_old_energy:!fe.includes('3880'),fe_no_salmon:!/la\u0161i\u0161/i.test(fe)};
}
commit("prins_b1_apply_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("APPLY DONE");
