import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const N=null;
const PJ_COMP="Paukštienos miltai (21,0%), kukurūzai, kviečiai, sorgas, jautienos taukai, hidrolizuotas paukštienos baltymas (7,5%), džiovinta cikorijų masė, celiuliozė, saulėgrąžų aliejus, fruktooligosacharidai (FOS), dumblių aliejus (0,3%), hidrolizuotos mielės.";
const PJ_ANAL="Drėgmė 8,0%, žali baltymai 26,5%, žali riebalai 16,0%, žali pelenai 7,0%, žalia ląsteliena 3,5%. Mineralinės medžiagos: kalcis 1,4%, fosforas 1,0%, kalis 0,6%, magnis 0,1%, natris 0,4%.";
const PJREG={type:'matrix',comp:PJ_COMP,anal:PJ_ANAL,energy:"3804 kcal/kg",
  weights:[1,2,3,4,5,10,15,20,25,30,35,40,45,50,55,60],
  mrows:[
   {age:"1–2 mėn.",vals:[60,95,130,160,185,N,N,N,N,N,N,N,N,N,N,N]},
   {age:"3–4 mėn.",vals:[50,80,105,135,155,315,425,525,620,N,N,N,N,N,N,N]},
   {age:"5–6 mėn.",vals:[40,65,85,105,155,260,355,440,515,590,665,N,N,N,N,N]},
   {age:"7–9 mėn.",vals:[N,N,N,N,125,260,355,440,515,590,665,735,N,N,N,N]},
   {age:"10–12 mėn.",vals:[N,N,N,N,N,210,285,350,415,475,665,735,800,865,930,995]},
   {age:"13–18 mėn.",vals:[N,N,N,N,N,N,N,N,N,N,530,590,640,695,745,795]}
  ]};
const MINIPJ={type:'matrix',comp:PJ_COMP,anal:PJ_ANAL,energy:"3804 kcal/kg",
  weights:[1,2,3,4,5,6,7,8,9,10,12,14,16,18,20],
  mrows:[
   {age:"1–2 mėn.",vals:[60,95,130,160,185,N,N,N,N,N,N,N,N,N,N]},
   {age:"3–4 mėn.",vals:[50,80,105,135,155,215,240,265,290,N,N,N,N,N,N]},
   {age:"5–6 mėn.",vals:[40,65,85,105,155,180,200,220,240,260,300,N,N,N,N]},
   {age:"7–9 mėn.",vals:[N,N,N,N,125,180,200,220,240,260,300,335,N,N,N]},
   {age:"10–12 mėn.",vals:[N,N,N,N,N,145,160,180,195,210,300,335,370,405,440]}
  ]};
const LRSEN={type:'std',comp:"Kukurūzai, ryžiai (25,0%), ėrienos miltai (10,0%), kukurūzų glitimas, jautienos taukai, bulvių baltymas, bulvių krakmolas, džiovinta cikorijų masė (2,0%), celiuliozė, saulėgrąžų aliejus, fruktooligosacharidai (FOS) (0,5%), mineralinės medžiagos (kalio chloridas), dumblių aliejus (0,3%), hidrolizuotos mielės, gliukozaminas (0,05%), chondroitinas (0,05%).",
  anal:"Drėgmė 8,0%, žali baltymai 20,0%, žali riebalai 11,5%, žali pelenai 5,0%, žalia ląsteliena 5,0%. Mineralinės medžiagos: kalcis 0,8%, fosforas 0,7%, kalis 0,6%, magnis 0,1%, natris 0,3%.",
  energy:"3543 kcal/kg",cols:["Kūno svoris","Mažas aktyvumas","Vidutinis aktyvumas"],
  rows:[["2,5","50","55"],["5","80","90"],["7,5","115","125"],["10","140","155"],["15","185","205"],["20","230","255"],["25","270","300"],["30","310","345"],["35","350","390"],["40","385","430"],["45","425","470"],["50","455","505"],["55","490","545"],["60","520","580"],["65","555","615"],["70","585","650"],["80","650","720"]]};
const REC={16776:PJREG,16772:PJREG,16745:LRSEN,16816:MINIPJ,16813:MINIPJ};
const IDS=Object.keys(REC).map(Number);
function tblStd(cols,rows){const head='<tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';const body=rows.map(r=>'<tr>'+r.map((v,i)=>'<td>'+v+(i===0?' kg':' g')+'</td>').join('')+'</tr>').join('');return '<div class="b2b-black"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';}
function tblMatrix(weights,mrows){const head='<tr><th>Amžius</th>'+weights.map(w=>'<th>'+w+' kg</th>').join('')+'</tr>';const body=mrows.map(r=>'<tr><td>'+r.age+'</td>'+r.vals.map(v=>'<td>'+(v!=null?v+' g':'–')+'</td>').join('')+'</tr>').join('');return '<div class="b2b-black"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';}
function build(intro,r){let blk;if(r.type==='matrix')blk='\n<p>Rekomenduojama paros dozė (g) – šuniukams pagal kūno svorį ir amžių:</p>'+tblMatrix(r.weights,r.mrows);else blk='\n<p>Rekomenduojama paros dozė (g):</p>'+tblStd(r.cols,r.rows);
  return intro.replace(/\s+$/,'')
  +'\n\n<p><strong>Sudėtis:</strong> '+r.comp+'</p>'
  +'\n\n<p><strong>Analitinės sudedamosios dalys:</strong> '+r.anal+' Energetinė vertė: '+r.energy+'.</p>'
  +'\n\n<p><strong>Šėrimo rekomendacija:</strong></p>'+blk
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
  let intro=T.slice(0,b).replace(/la\u0161i\u0161\u0173\s+aliejais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+taukais/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+tauk[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161os\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi').replace(/la\u0161i\u0161\u0173\s+aliej[a-z\u0105-\u017E]*/gi,'dumbli\u0173 aliejumi');
  const newT=build(intro,r);const thCount=(newT.match(/<th>/g)||[]).length;const trtd=(newT.match(/<tr><td>/g)||[]).length;const isM=r.type==='matrix';
  const g={introNoAnaliz:!/Analiz/i.test(intro),introNoNurodym:!/Nurodym/i.test(intro),introNoSalmon:!/la\u0161i\u0161/i.test(intro),introNoKcal:!/kcal/i.test(intro),
    hasSud:/<strong>Sud\u0117tis:<\/strong>/.test(newT),hasAnalitin:/Analitin\u0117s sudedamosios/.test(newT),hasSerimo:/\u0160\u0117rimo rekomendacija/.test(newT),hasPagaminta:/<strong>Pagaminta:<\/strong>/.test(newT),
    tbl:/<table/.test(newT),introMin:intro.replace(/<[^>]+>/g,'').trim().length>=80,
    rowCount:isM?(trtd===r.mrows.length):(trtd===r.rows.length),colCount:isM?(thCount===r.weights.length+1):(thCount===r.cols.length)};
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,type:r.type,introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,sample:isM?(r===MINIPJ?'440 g':'735 g'):'720 g',status:j.status};
}
if(!ok){commit("prins_b5b_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";if(builds[id].status==='publish'){try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}}
  wres[id]={lossless:md5(rb)===md5(newT),fe:builds[id].status==='publish'?{analitin:fe.includes('Analitin\u0117s'),tbl:fe.includes('<table'),sample:fe.includes(builds[id].sample)}:'draft'};
}
commit("prins_b5b_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("B5B DONE");
