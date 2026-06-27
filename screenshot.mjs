import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');

const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const SA_COMP="Paukštienos miltai (21,0%), kukurūzai, kviečiai, sorgas, jautienos taukai, hidrolizuotas paukštienos baltymas (7,5%), džiovinta cikorijų masė (2,0%), celiuliozė, saulėgrąžų aliejus, fruktooligosacharidai (FOS) (0,5%), dumblių aliejus (0,2%), hidrolizuotos mielės.";
const SA_ANAL="Drėgmė 8,0%, žali baltymai 26,5%, žali riebalai 16,0%, žali pelenai 7,0%, žalia ląsteliena 3,5%. Mineralinės medžiagos: kalcis 1,4%, fosforas 1,0%, kalis 0,6%, magnis 0,1%, natris 0,4%.";
const SA_E="3804 kcal/kg";
const COLS=["Kūno svoris","Vidutinis aktyvumas","Didelis aktyvumas"];
const SA_ROWS=[["2,5","60","70"],["5","100","115"],["7,5","135","155"],["10","165","195"],["15","225","265"],["20","275","325"],["25","325","385"],["30","375","440"],["35","420","495"],["40","460","545"],["45","505","595"],["50","545","645"],["55","585","695"],["60","625","740"],["65","665","785"],["70","700","830"],["80","775","915"]];
const SAM_ROWS=[["1","30","35"],["2","50","60"],["3","70","80"],["4","85","100"],["5","100","115"],["6","115","135"],["7","125","150"],["8","140","165"],["9","155","180"],["10","165","195"],["12","190","225"],["14","210","250"],["16","235","275"],["18","255","300"],["20","275","325"]];
const SA={comp:SA_COMP,anal:SA_ANAL,energy:SA_E,cols:COLS,rows:SA_ROWS};
const SAM={comp:SA_COMP,anal:SA_ANAL,energy:SA_E,cols:COLS,rows:SAM_ROWS};
const REC={16751:SA,16754:SA,16748:SA,16800:SAM,16797:SAM};
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
try{execSync(`cat /tmp/ids.txt | xargs -P 5 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status,sku" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const builds={},rep={};let ok=true;
for(const id of IDS){let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep[id]={err:'read'};ok=false;continue;}
  const T=(j.content||{}).raw||"";const r=REC[id];
  const marks=[/Analiz/i,/Sud\u0117tis/i,/Nurodym/i,/Rekomenduojama paros/i,/\u0160\u0117rim/i];
  let mi=-1;for(const re of marks){const k=T.search(re);if(k>=0&&(mi<0||k<mi))mi=k;}
  if(mi<0){rep[id]={err:'no_marker',len:T.length};ok=false;continue;}
  let b=T.lastIndexOf('<p',mi); if(b<0)b=mi;
  let intro=T.slice(0,b).replace(/la\u0161i\u0161\u0173\s+aliejais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi');
  const newT=build(intro,r);
  const thCount=(newT.match(/<th>/g)||[]).length;
  const g={introNoAnaliz:!/Analiz/i.test(intro),introNoNurodym:!/Nurodym/i.test(intro),introNoSalmon:!/la\u0161i\u0161/i.test(intro),introNoKcal:!/kcal/i.test(intro),
    hasSud:/<strong>Sud\u0117tis:<\/strong>/.test(newT),hasAnalitin:/Analitin\u0117s sudedamosios/.test(newT),hasSerimo:/\u0160\u0117rimo rekomendacija/.test(newT),hasPagaminta:/<strong>Pagaminta:<\/strong>/.test(newT),
    rowCount:(newT.match(/<tr><td>/g)||[]).length===r.rows.length,colCount:thCount===r.cols.length,introMin:intro.replace(/<[^>]+>/g,'').trim().length>=80};
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,recipe:(r===SA?'SA':'SA-MINI'),introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,sample:r.rows[0][1]+' g'};
}
if(!ok){commit("prins_b2a_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}
  wres[id]={lossless:md5(rb)===md5(newT),fe_analitin:fe.includes('Analitin\u0117s'),fe_tbl:fe.includes('<table'),fe_sample:fe.includes(builds[id].sample),fe_no_old:!/kcal\/kg.{0,8}38|3950|3880/i.test(fe)};
}
commit("prins_b2a_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("B2A DONE");
