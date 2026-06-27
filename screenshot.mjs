import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
function decodeOnce(s){return s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;amp;/g,'&amp;').replace(/&amp;nbsp;/g,'&nbsp;').replace(/&amp;quot;/g,'"').replace(/&amp;#39;/g,"'");}
const TD='style="border-bottom: 2px solid #d3d3d3;padding: 7px;"';
function tableSimple(rows){let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+=`<tr><td ${TD}><b>Šuns svoris</b></td><td ${TD}><b>Kiekis per parą</b></td></tr>\n`;
  for(const [w,d] of rows) s+=`<tr><td ${TD}>${w}</td><td ${TD}>${d}</td></tr>\n`;
  s+='</table></div>'; return s;}
function tableMatrix(weights,mrows){let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+='<tr><td '+TD+'><b>Amžius</b></td>'+weights.map(w=>'<td '+TD+'><b>'+w+'</b></td>').join('')+'</tr>\n';
  for(const r of mrows) s+='<tr><td '+TD+'>'+r.age+'</td>'+r.vals.map(v=>'<td '+TD+'>'+v+'</td>').join('')+'</tr>\n';
  s+='</table></div>'; return s;}

// === Pumpkin Chicken Pomegr Puppy Mini (716) — 5 amžiai, 12 svorių ===
const cpPuppyMiniW=["1,5 kg","2 kg","2,5 kg","3 kg","3,5 kg","4 kg","5 kg","6 kg","7 kg","8 kg","9 kg","10 kg"];
const cpPuppyMiniM=[
  {age:"2 mėn.",vals:["25 g","30 g","35 g","45 g","50 g","55 g","60 g","70 g","75 g","80 g","85 g","95 g"]},
  {age:"3 mėn.",vals:["35 g","45 g","55 g","60 g","70 g","80 g","90 g","95 g","110 g","115 g","120 g","130 g"]},
  {age:"4 mėn.",vals:["40 g","50 g","60 g","65 g","75 g","85 g","95 g","100 g","120 g","130 g","135 g","140 g"]},
  {age:"6 mėn.",vals:["45 g","55 g","60 g","75 g","85 g","95 g","115 g","125 g","140 g","150 g","165 g","175 g"]},
  {age:"10 mėn.",vals:["40 g","55 g","60 g","75 g","80 g","90 g","100 g","115 g","130 g","140 g","150 g","165 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs"]}
];

// === Pumpkin Chicken Pomegr Starter All Breed (715) — 6 savaičių, 14 svorių ===
// Starter feeding tipo - parinksim paprastesnį vaizdą: pagal amžių savaitėmis su 4 atstovingais svoriais (5, 10, 25, 50 kg)
// arba lieka tas pats - matricos formatas. Padarom kaip yra: 6 amžiai (2-3, 3-4, 4-5, 5-6, 6-7, 7-8 sav.) x 14 svorių
const cpStarterW=["1 kg","2 kg","3 kg","5 kg","7 kg","10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","50 kg","60 kg","70 kg"];
const cpStarterM=[
  {age:"2–3 sav.",vals:["–","–","–","–","–","–","–","–","25 g","25 g","30 g","30 g","30 g","30 g","30 g"]},
  {age:"3–4 sav.",vals:["10 g","10 g","10 g","10 g","10 g","30 g","30 g","75 g","80 g","100 g","100 g","110 g","120 g","130 g","135 g"]},
  {age:"4–5 sav.",vals:["25 g","25 g","25 g","25 g","30 g","65 g","90 g","145 g","145 g","155 g","155 g","165 g","180 g","200 g","210 g"]},
  {age:"5–6 sav.",vals:["30 g","30 g","55 g","80 g","80 g","110 g","125 g","155 g","155 g","175 g","175 g","190 g","200 g","220 g","235 g"]},
  {age:"6–7 sav.",vals:["35 g","35 g","70 g","110 g","110 g","135 g","170 g","210 g","210 g","225 g","225 g","245 g","265 g","280 g","300 g"]},
  {age:"7–8 sav.",vals:["45 g","45 g","90 g","135 g","135 g","180 g","220 g","265 g","265 g","300 g","300 g","320 g","345 g","375 g","400 g"]}
];

// === N&D Prime Adult Mini (587, 589, 591) - identiškos lentelės ===
const primeAdultMini=[["1 kg","16–30 g"],["2 kg","30–50 g"],["3 kg","40–65 g"],["4 kg","45–80 g"],["5 kg","55–95 g"],["6 kg","60–110 g"],["7 kg","70–125 g"],["8 kg","80–135 g"],["9 kg","85–150 g"],["10 kg","90–160 g"]];

// === N&D Prime Adult Med&Max (588, 590, 592) - identiškos ===
const primeAdultMedMax=[["10 kg","90–160 g"],["15 kg","125–230 g"],["20 kg","155–270 g"],["25 kg","180–330 g"],["30 kg","210–365 g"],["35 kg","235–410 g"],["40 kg","260–455 g"],["50 kg","305–540 g"],["60 kg","350–615 g"],["70 kg","390–690 g"]];

// === N&D Prime Chicken Pomegr Puppy Mini (585) ===
const primePuppyMiniW=["1,5 kg","2 kg","2,5 kg","3 kg","3,5 kg","4 kg","5 kg","6 kg","7 kg","8 kg","9 kg","10 kg"];
const primePuppyMiniM=[
  {age:"2 mėn.",vals:["25 g","30 g","35 g","45 g","50 g","55 g","60 g","70 g","75 g","80 g","85 g","90 g"]},
  {age:"3 mėn.",vals:["35 g","45 g","55 g","60 g","70 g","80 g","85 g","95 g","110 g","115 g","120 g","130 g"]},
  {age:"4 mėn.",vals:["40 g","50 g","60 g","60 g","75 g","85 g","90 g","100 g","120 g","130 g","135 g","140 g"]},
  {age:"6 mėn.",vals:["45 g","55 g","60 g","75 g","85 g","95 g","115 g","125 g","140 g","150 g","165 g","175 g"]},
  {age:"10 mėn.",vals:["40 g","55 g","60 g","75 g","80 g","90 g","100 g","115 g","130 g","140 g","150 g","160 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs"]}
];

// === N&D Prime Chicken Pomegr Puppy Med&Max (586) ===
const primePuppyMedMaxW=["10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","45 kg","50 kg","55 kg","60 kg","70 kg"];
const primePuppyMedMaxM=[
  {age:"2 mėn.",vals:["90 g","120 g","140 g","160 g","185 g","210 g","225 g","245 g","260 g","270 g","295 g","340 g"]},
  {age:"3 mėn.",vals:["130 g","175 g","215 g","245 g","290 g","320 g","350 g","365 g","410 g","430 g","445 g","460 g"]},
  {age:"4 mėn.",vals:["160 g","200 g","240 g","280 g","330 g","350 g","370 g","390 g","540 g","575 g","610 g","670 g"]},
  {age:"6 mėn.",vals:["175 g","235 g","280 g","330 g","380 g","435 g","470 g","500 g","540 g","575 g","610 g","670 g"]},
  {age:"10 mėn.",vals:["170 g","220 g","270 g","315 g","360 g","410 g","450 g","480 g","505 g","540 g","570 g","635 g"]},
  {age:"12 mėn.",vals:["165 g","225 g","280 g","320 g","375 g","420 g","460 g","490 g","525 g","560 g","585 g","655 g"]},
  {age:"16 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","480 g","520 g","550 g","590 g","610 g","680 g"]}
];

// WP_SKU -> recipe
const REC={};
// Pumpkin Chicken Pomegranate Starter Puppy All Br (715): WP 14524 (800g), 14525 (2,5 kg pak.4)
REC[14524]={type:'matrix',weights:cpStarterW,mrows:cpStarterM};
REC[14525]={type:'matrix',weights:cpStarterW,mrows:cpStarterM};
// Pumpkin Chicken Pomegranate Puppy Mini (716): WP 14526 (800 g)
REC[14526]={type:'matrix',weights:cpPuppyMiniW,mrows:cpPuppyMiniM};

// === Prime DOG WP SKUs ===
// Iš recon: Prime DOG aprasymai - ieskoma WP per regex "PRIME" ir "DOG Dry"
// Žinome iš pavadinimo: Wild Boar&Apple - 14523, 14522, Lamb&Blueberry Adult Mini - 14517, 14516, 
// Lamb&Blueberry Adult Med&Max - 14523? Tikrinu - papraščiausia: paimam pagal pavadinimą.
// Iš recon sąrašo Prime DOG: 14523 (Wild Boar ADULT MED&MAX 12kg), 14522 (Wild Boar ADULT MED&MAX 2,5kg), 
// 14521 (Wild Boar ADULT MINI 7kg), 14520 (Wild Boar ADULT MINI 2,5kg), 14519 (Wild Boar ADULT MINI 800g),
// 14517 (Lamb ADULT MINI 2,5kg), 14516 (Lamb ADULT MINI 800g),
// 33231 (Lamb ADULT MINI 7kg), 14515 (Chicken Pomegranate PUPPY MED&MAX 12kg)
// Nereikia naujausių (Chicken Adult Mini/MedMax + Lamb Adult MedMax) jei jų nėra WP -- patikrinsim. 
// Prime DOG Adult Mini Lamb&Blueberry (591) -> 14517, 14516, 33231:
REC[14517]={type:'simple',rows:primeAdultMini};
REC[14516]={type:'simple',rows:primeAdultMini};
REC[33231]={type:'simple',rows:primeAdultMini};
// Prime Wild Boar Adult Mini (589) -> 14521 (7kg), 14520 (2,5kg), 14519 (800g):
REC[14521]={type:'simple',rows:primeAdultMini};
REC[14520]={type:'simple',rows:primeAdultMini};
REC[14519]={type:'simple',rows:primeAdultMini};
// Prime Wild Boar Adult Med&Max (590) -> 14523 (12kg), 14522 (2,5kg):
REC[14523]={type:'simple',rows:primeAdultMedMax};
REC[14522]={type:'simple',rows:primeAdultMedMax};
// Prime Chicken Pomegranate Puppy Med&Max (586) -> 14515:
REC[14515]={type:'matrix',weights:primePuppyMedMaxW,mrows:primePuppyMedMaxM};

const IDS=Object.keys(REC).map(Number);
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 10 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep={planned:[],apply:[]};
const builds={};
let allPass=true;
for(const id of IDS){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep.planned.push({id,err:'read'});allPass=false;continue;}
  const raw=(j.content&&j.content.raw)||"";
  const r=REC[id];
  let zb=raw;
  const tblStart=zb.indexOf('<style>.b2b-black');
  if(tblStart>=0){const tblEnd=zb.indexOf('</table></div>',tblStart);if(tblEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(tblEnd+'</table></div>'.length);}}
  const decoded=decodeOnce(zb);
  const sIdx=decoded.indexOf('Šėrimo');
  const pEnd=sIdx>=0?decoded.indexOf('</p>',sIdx):-1;
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker',title:(j.title&&j.title.rendered)||''});allPass=false;continue;}
  const cut=pEnd+4;
  const block=r.type==='matrix'?tableMatrix(r.weights,r.mrows):tableSimple(r.rows);
  const newT=decoded.slice(0,cut)+'\n'+block+decoded.slice(cut);
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(newT),
    hasRealP:/<p>/.test(newT)&&/<\/p>/.test(newT),
    hasSerimo:/Šėrimo instrukcija/.test(newT),
    oneTable:(newT.match(/<table/g)||[]).length===1,
    hasB2b:/b2b-black/.test(newT),
    hasHeader:newT.includes('Šuns svoris')||newT.includes('Amžius'),
    introMin:newT.length>=2000,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(newT)
  };
  const pass=Object.values(g).every(Boolean);
  rep.planned.push({id,title:(j.title&&j.title.rendered)||'',type:r.type,oldLen:raw.length,newLen:newT.length,guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("farmina_pumpkin_prime_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

for(const id of IDS){
  const b=builds[id];
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:b.newT}));
  try{
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
    let rb="";execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
    rep.apply.push({id,lossless:md5(rb)===md5(b.newT)});
  }catch(e){rep.apply.push({id,err:String(e).slice(0,100)});}
}
commit("farmina_pumpkin_prime_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("DONE",IDS.length,'products');
