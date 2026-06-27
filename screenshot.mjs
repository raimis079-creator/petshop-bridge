import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const INSTR="Paros normą padalinkite į bent du maitinimus per dieną. Visada užtikrinkite, kad šuo turėtų gaivaus geriamojo vandens. Pereinant prie naujo maisto, bent 7 dienas palaipsniui maišykite jį su senuoju maistu, kol visiškai pakeisite.";
const C_LOSS=["Tikslinis svoris","Mažas aktyvumas","Vidutinis aktyvumas","Didelis aktyvumas"];
const C_KEEP=["Kūno svoris","Mažas aktyvumas","Vidutinis aktyvumas","Didelis aktyvumas"];
const LIGHT={comp:"Paukštienos miltai (26,0%), kviečiai, kukurūzai, celiuliozė (8,8%), kukurūzų glitimas, hidrolizuotas paukštienos baltymas (4,5%), džiovinta cikorijų masė (4,0%), jautienos taukai, saulėgrąžų aliejus, fruktooligosacharidai (FOS) (0,5%), hidrolizuotos mielės, dumblių aliejus (0,2%).",
  anal:"Drėgmė 8,0%, žali baltymai 28,0%, žali riebalai 8,5%, žali pelenai 8,0%, žalia ląsteliena 11,0%. Mineralinės medžiagos: kalcis 1,6%, fosforas 1,1%, kalis 0,6%, magnis 0,1%, natris 0,3%.",
  energy:"2927 kcal/kg",
  tables:[
   {cap:"Rekomenduojama paros dozė (g) – svorio metimui (tikslinis svoris):",cols:C_LOSS,
    rows:[["2,5","50","60","70"],["5","90","105","120"],["7,5","120","140","165"],["10","150","170","200"],["15","200","230","270"],["20","250","290","340"],["25","290","340","400"],["30","335","390","455"],["35","375","435","510"],["40","415","480","570"],["45","450","525","620"],["50","490","570","670"],["55","530","610","720"],["60","560","650","770"],["65","595","690","815"],["70","630","730","860"],["80","695","810","950"]]},
   {cap:"Rekomenduojama paros dozė (g) – svorio palaikymui (kūno svoris):",cols:C_KEEP,
    rows:[["2,5","65","75","90"],["5","110","130","150"],["7,5","150","175","205"],["10","185","215","250"],["15","250","290","340"],["20","310","360","425"],["25","365","425","500"],["30","420","485","570"],["35","470","545","640"],["40","520","600","710"],["45","565","655","775"],["50","615","710","840"],["55","660","760","900"],["60","700","815","960"],["65","745","865","1020"],["70","790","910","1075"],["80","870","1010","1190"]]}
  ]};
const REC={16839:LIGHT,16833:LIGHT};
const IDS=Object.keys(REC).map(Number);
function tbl(cols,rows){const head='<tr>'+cols.map(c=>'<th>'+c+'</th>').join('')+'</tr>';const body=rows.map(r=>'<tr>'+r.map((v,i)=>'<td>'+v+(i===0?' kg':' g')+'</td>').join('')+'</tr>').join('');return '<div class="b2b-black"><table><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>';}
function build(intro,r){let blocks='';for(const t of r.tables){blocks+='\n<p>'+t.cap+'</p>'+tbl(t.cols,t.rows);}
  return intro.replace(/\s+$/,'')
  +'\n\n<p><strong>Sudėtis:</strong> '+r.comp+'</p>'
  +'\n\n<p><strong>Analitinės sudedamosios dalys:</strong> '+r.anal+' Energetinė vertė: '+r.energy+'.</p>'
  +'\n\n<p><strong>Šėrimo rekomendacija:</strong></p>'+blocks
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
  const newT=build(intro,r);
  const totRows=r.tables.reduce((a,t)=>a+t.rows.length,0);
  const totCols=r.tables.reduce((a,t)=>a+t.cols.length,0);
  const g={introNoAnaliz:!/Analiz/i.test(intro),introNoNurodym:!/Nurodym/i.test(intro),introNoSalmon:!/la\u0161i\u0161/i.test(intro),introNoKcal:!/kcal/i.test(intro),
    hasSud:/<strong>Sud\u0117tis:<\/strong>/.test(newT),hasAnalitin:/Analitin\u0117s sudedamosios/.test(newT),hasSerimo:/\u0160\u0117rimo rekomendacija/.test(newT),hasPagaminta:/<strong>Pagaminta:<\/strong>/.test(newT),
    tblCount:(newT.match(/<table/g)||[]).length===r.tables.length,rowCount:(newT.match(/<tr><td>/g)||[]).length===totRows,colCount:(newT.match(/<th>/g)||[]).length===totCols,introMin:intro.replace(/<[^>]+>/g,'').trim().length>=80};
  const allg=Object.values(g).every(Boolean);
  rep[id]={status:j.status,sku:j.sku,introLen:intro.length,newLen:newT.length,guards:g,pass:allg};
  if(!allg){ok=false;continue;}
  builds[id]={newT,sample:'810 g',status:j.status};
}
if(!ok){commit("prins_light_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
const wres={};
for(const id of IDS){const newT=builds[id].newT;
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
  try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
  let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
  let fe="";if(builds[id].status==='publish'){try{execSync(`curl -skL -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/fe.html`,{env,maxBuffer:200000000});fe=fs.readFileSync('/tmp/fe.html','utf8');}catch(e){}}
  wres[id]={lossless:md5(rb)===md5(newT),fe:builds[id].status==='publish'?{analitin:fe.includes('Analitin\u0117s'),tbls:(fe.match(/<table/g)||[]).length}:'draft'};
}
commit("prins_light_"+Date.now()+".json",JSON.stringify({rep,wres},null,1));
console.log("LIGHT DONE");
