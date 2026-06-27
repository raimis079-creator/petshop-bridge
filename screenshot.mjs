import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const MSEN={type:'std',
  comp:"Kukurūzai, paukštienos miltai (11,0%), hidrolizuotas paukštienos baltymas (10,0%), kviečiai, sorgas, jautienos taukai, džiovinta cikorijų masė, celiuliozė, bulvių krakmolas, saulėgrąžų aliejus, fruktooligosacharidai (FOS), hidrolizuotos mielės, dumblių aliejus (0,2%), gliukozaminas (0,05%), chondroitinas (0,05%).",
  anal:"Drėgmė 8,0%, žali baltymai 19,5%, žali riebalai 12,5%, žali pelenai 5,0%, žalia ląsteliena 3,5%. Mineralinės medžiagos: kalcis 0,8%, fosforas 0,7%, kalis 0,6%, magnis 0,1%, natris 0,3%.",
  energy:"3676 kcal/kg",cols:["Kūno svoris","Mažas aktyvumas","Vidutinis aktyvumas"],
  rows:[["1","25","30"],["2","40","45"],["3","55","60"],["4","70","75"],["5","80","90"],["6","90","100"],["7","100","115"],["8","110","125"],["9","120","135"],["10","135","145"],["12","155","170"],["14","170","190"],["16","190","210"],["18","200","225"],["20","220","245"]]};
const PLAMB={type:'notable',keepSalmon:true,
  comp:"Kukurūzai, džiovinta ėriena (18%), ryžiai, jautienos taukai, kukurūzų glitimas, džiovinta cikorijų masė, bulvių krakmolas, maltodekstrinas, mineralinės medžiagos (kalio chloridas), mielių hidrolizatas, lašišų aliejus (0,5%), saulėgrąžų aliejus, žolelių ekstraktai ir Schüsslerio druskos (dioskorėja, kurkuligo, dipsakas, drinarija, psoralėja, gudobelė, gallus, Schüsslerio druskos nr. 5, 6, 7, 10) (0,065%), gliukozaminas (500 mg), chondroitinas (500 mg), fruktooligosacharidai (FOS) (400 mg).",
  anal:"Drėgmė 9,0%, žali baltymai 18,0%, žali riebalai 13,0%, žali pelenai 7,0%, žalia ląsteliena 4,0%, angliavandeniai 49,0%. Mineralinės medžiagos: kalcis 1,5%, fosforas 1,0%, kalis 0,7%, magnis 0,1%, natris 0,4%.",
  energy:"3850 kcal/kg"};
const REC={16810:MSEN,16805:MSEN,16794:PLAMB,16791:PLAMB};
const IDS=Object.keys(REC).map(Number);
function tblStd(cols,rows){const head='<tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';const body=rows.map(r=>'<tr>'+r.map((v,i)=>'<td>'+v+(i===0?' kg':' g')+'</td>').join('')+'</tr>').join('');return '<div class="b2b-black"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';}
function build(intro,r){let blk;
  if(r.type==='notable')blk='';
  else blk='\n<p>Rekomenduojama paros dozė (g):</p>'+tblStd(r.cols,r.rows);
  return intro.replace(/\s+$/,'')
  +'\n\n<p><strong>Sudėtis:</strong> '+r.comp+'</p>'
  +'\n\n<p><strong>Analitinės sudedamosios dalys:</strong> '+r.anal+' Energetinė vertė: '+r.energy+'.</p>'
  +'\n\n<p><strong>Šėrimo rekomendacija:</strong></p>'+blk
  +'\n<p>'+INSTR+'</p>'
  +'\n\n<p><strong>Pagaminta:</strong> Olandijoje (Nyderlanduose).</p>';}
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 4 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status,sku" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={},rep={};let ok=true;
for(const id of IDS){let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep[id]={err:'read'};ok=false;continue;}
  const T=(j.content||{}).raw||"";const r=REC[id];
  const marks=[/Analiz/i,/Sud\u0117tis/i,/Nurodym/i,/Rekomenduojama paros/i,/\u0160\u0117rim/i];
  let mi=-1;for(const re of marks){const k=T.search(re);if(k>=0&&(mi<0||k<mi))mi=k;}
  if(mi<0){rep[id]={err:'no_marker',len:T.length};ok=false;continue;}
  let b=T.lastIndexOf('<p',mi); if(b<0)b=mi;
  let intro=T.slice(0,b);
  if(!r.keepSalmon){intro=intro.replace(/la\u0161i\u0161\u0173\s+aliejais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+taukais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+tauk[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161os\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi');}
  const newT=build(intro,r);const isN=r.type==='notable';const thCount=(newT.match(/<th>/g)||[]).length;const trtd=(newT.match(/<tr><td>/g)||[]).length;
  const g={introNoAnaliz:!/Analiz/i.test(intro),introNoNurodym:!/Nurodym/i.test(intro),introNoSalmon:r.keepSalmon?true:!/la\u0161i\u0161/i.test(intro),introNoKcal:!/kcal/i.test(intro),
    hasSud:/<strong>Sud\u0117tis:<\/strong>/.test(newT),hasAnalitin:/Analitin\u0117s sudedamosios/.test(newT),hasSerimo:/\u0160\u0117rimo rekomendacija/.test(newT),hasPagaminta:/<strong>Pagaminta:<\/strong>/.test(newT),introMin:intro.replace(/<[^>]+>/g,'').trim().length>=80};
  if(!isN){g.tbl=/<table/.test(newT);g.rowCount=(trtd===r.rows.length);g.colCount=(thCount===r.cols.length);}
  else {g.noTable=!/<table/.test(newT);}
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,type:r.type,introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,sample:isN?null:'245 g',status:j.status};
}
if(!ok){commit("prins_fin_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";if(builds[id].status==='publish'){try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}}
  const s=builds[id].sample;
  wres[id]={lossless:md5(rb)===md5(newT),fe:builds[id].status==='publish'?{analitin:fe.includes('Analitin\u0117s'),tbl:fe.includes('<table'),sample:s?fe.includes(s):'n/a'}:'draft'};
}
commit("prins_fin_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("FIN DONE");
