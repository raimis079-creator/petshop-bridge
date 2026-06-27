import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const SC={comp:"Paukštienos miltai (28,5%), bulvių krakmolas, žirniai, hidrolizuotas paukštienos baltymas, jautienos taukai, cikorijų masė, celiuliozė, saulėgrąžų aliejus, fruktooligosacharidai (FOS), dumblių aliejus (0,2%), mielių hidrolizatas, kalio chloridas.",
  anal:"Drėgmė 9,0%, žali baltymai 26,5%, žali riebalai 10,0%, žali pelenai 7,5%, žalia ląsteliena 3,5%, linolo rūgštis 2,2%. Mineralinės medžiagos: kalcis 1,3%, fosforas 0,9%, kalis 0,6%, magnis 0,1%, natris 0,4%.",
  energy:"3476 kcal/kg",
  cols:["Kūno svoris","Mažas aktyvumas","Vidutinis aktyvumas","Didelis aktyvumas"],
  rows:[["2,5","55","65","75"],["5","95","110","130"],["7,5","125","145","170"],["10","155","180","215"],["15","210","245","290"],["20","260","300","355"],["25","310","355","420"],["30","355","410","480"],["35","395","460","540"],["40","435","505","595"],["45","475","550","650"],["50","515","595","705"],["55","555","640","760"],["60","590","685","810"],["65","630","725","860"],["70","665","770","910"],["80","735","850","1005"]]};
const REC={16862:SC,16857:SC};
const IDS=Object.keys(REC).map(Number);
function tbl(cols,rows){const head='<tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';const body=rows.map(r=>'<tr>'+r.map((v,i)=>'<td>'+v+(i===0?' kg':' g')+'</td>').join('')+'</tr>').join('');return '<div class="b2b-black"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';}
function build(intro,r){return intro.replace(/\s+$/,'')
  +'\n\n<p><strong>Sudėtis:</strong> '+r.comp+'</p>'
  +'\n\n<p><strong>Analitinės sudedamosios dalys:</strong> '+r.anal+' Energetinė vertė: '+r.energy+'.</p>'
  +'\n\n<p><strong>Šėrimo rekomendacija:</strong></p>\n<p>Rekomenduojama paros dozė (g):</p>'+tbl(r.cols,r.rows)
  +'\n<p>'+INSTR+'</p>'
  +'\n\n<p><strong>Pagaminta:</strong> Olandijoje (Nyderlanduose).</p>';}
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 2 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status,sku" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={},rep={};let ok=true;
for(const id of IDS){let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep[id]={err:'read'};ok=false;continue;}
  const T=(j.content||{}).raw||"";const r=REC[id];
  const marks=[/Analiz/i,/Sud\u0117tis/i,/Nurodym/i,/Rekomenduojama paros/i,/\u0160\u0117rim/i];
  let mi=-1;for(const re of marks){const k=T.search(re);if(k>=0&&(mi<0||k<mi))mi=k;}
  if(mi<0){rep[id]={err:'no_marker',len:T.length};ok=false;continue;}
  let b=T.lastIndexOf('<p',mi); if(b<0)b=mi;
  let intro=T.slice(0,b)
    .replace(/la\u0161i\u0161\u0173\s+aliejais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+taukais/gi,'dumbli\u0173 aliejumi')
    .replace(/la\u0161i\u0161\u0173\s+tauk[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161os\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi');
  const newT=build(intro,r);const thCount=(newT.match(/<th>/g)||[]).length;
  const g={introNoAnaliz:!/Analiz/i.test(intro),introNoNurodym:!/Nurodym/i.test(intro),introNoSalmon:!/la\u0161i\u0161/i.test(intro),introNoKcal:!/kcal/i.test(intro),
    hasSud:/<strong>Sud\u0117tis:<\/strong>/.test(newT),hasAnalitin:/Analitin\u0117s sudedamosios/.test(newT),hasSerimo:/\u0160\u0117rimo rekomendacija/.test(newT),hasPagaminta:/<strong>Pagaminta:<\/strong>/.test(newT),
    rowCount:(newT.match(/<tr><td>/g)||[]).length===r.rows.length,colCount:thCount===r.cols.length,introMin:intro.replace(/<[^>]+>/g,'').trim().length>=80};
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,sample:'480 g',status:j.status};
}
if(!ok){commit("prins_sc_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";if(builds[id].status==='publish'){try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}}
  wres[id]={lossless:md5(rb)===md5(newT),fe:builds[id].status==='publish'?{analitin:fe.includes('Analitin\u0117s'),tbl:fe.includes('<table'),sample:fe.includes(builds[id].sample)}:'draft'};
}
commit("prins_sc_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("SC DONE");
