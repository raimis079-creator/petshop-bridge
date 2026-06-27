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

// Adult Mini bendra (390/392/396/974/976/978) — visi turi tą pačią lentelę
const adultMiniSimple=[["1 kg","16–30 g"],["2 kg","25–50 g"],["3 kg","35–65 g"],["4 kg","45–80 g"],["5 kg","55–95 g"],["6 kg","65–110 g"],["7 kg","70–125 g"],["8 kg","80–135 g"],["9 kg","85–150 g"],["10 kg","90–160 g"]];
// Tačiau 974/976/978 (naujesni) skiriasi - turi savo PNG su skirtingais skaičiais!
const adultMini974=[["1 kg","20–32 g"],["2 kg","30–55 g"],["3 kg","40–75 g"],["4 kg","50–92 g"],["5 kg","60–110 g"],["6 kg","68–125 g"],["7 kg","75–140 g"],["8 kg","84–155 g"],["9 kg","92–170 g"],["10 kg","100–180 g"]];

// Adult Med&Max bendra (391/393/397/975/977/979) - visi turi tą pačią
const adultMedMaxSimple=[["10 kg","90–160 g"],["15 kg","120–220 g"],["20 kg","150–270 g"],["25 kg","180–320 g"],["30 kg","205–365 g"],["35 kg","230–410 g"],["40 kg","255–450 g"],["50 kg","300–530 g"],["60 kg","350–610 g"],["70 kg","390–685 g"]];
// 975/977/979 senesni - skirtis. Pažiūrim ar tikrai - Med&Max all the same actually.

// Puppy Mini (388) matrica
const puppyMiniWeights=["1,5 kg","2 kg","2,5 kg","3 kg","3,5 kg","4 kg","5 kg","6 kg","7 kg","8 kg","9 kg","10 kg"];
const puppyMiniMatrix=[
  {age:"2 mėn.",vals:["25 g","30 g","35 g","45 g","50 g","55 g","60 g","70 g","75 g","80 g","85 g","95 g"]},
  {age:"3 mėn.",vals:["35 g","45 g","55 g","60 g","70 g","80 g","90 g","95 g","110 g","115 g","120 g","130 g"]},
  {age:"4 mėn.",vals:["40 g","50 g","60 g","65 g","75 g","85 g","95 g","100 g","120 g","130 g","135 g","140 g"]},
  {age:"6 mėn.",vals:["45 g","55 g","60 g","75 g","85 g","95 g","115 g","125 g","140 g","150 g","165 g","175 g"]},
  {age:"10 mėn.",vals:["40 g","55 g","60 g","75 g","80 g","90 g","100 g","115 g","130 g","140 g","150 g","165 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs"]}
];

// Puppy Med&Max (389) matrica
const puppyMedMaxWeights=["10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","45 kg","50 kg","55 kg","60 kg","70 kg"];
const puppyMedMaxMatrix=[
  {age:"2 mėn.",vals:["95 g","125 g","140 g","160 g","185 g","200 g","215 g","230 g","250 g","265 g","280 g","330 g"]},
  {age:"3 mėn.",vals:["130 g","175 g","215 g","245 g","280 g","305 g","335 g","350 g","370 g","375 g","390 g","425 g"]},
  {age:"4 mėn.",vals:["140 g","185 g","230 g","265 g","300 g","325 g","355 g","375 g","395 g","405 g","425 g","450 g"]},
  {age:"6 mėn.",vals:["175 g","240 g","280 g","325 g","370 g","400 g","450 g","480 g","520 g","545 g","585 g","645 g"]},
  {age:"10 mėn.",vals:["165 g","230 g","275 g","310 g","375 g","380 g","415 g","445 g","485 g","505 g","540 g","610 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","360 g","395 g","435 g","465 g","505 g","525 g","560 g","630 g"]},
  {age:"16 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","440 g","470 g","510 g","540 g","585 g","645 g"]}
];

// WP_SKU -> recipe data
const REC={
  // 14535 jau padarytas (pilotas) - praleidžiam
  // Lamb&Blueberry Adult Mini (392) - WP: 33239, 14532
  33239:{type:'simple',rows:adultMiniSimple},
  14532:{type:'simple',rows:adultMiniSimple},
  // Lamb&Blueberry Puppy Mini (388) - WP: 33235, 14528, 14530
  33235:{type:'matrix',weights:puppyMiniWeights,mrows:puppyMiniMatrix},
  14528:{type:'matrix',weights:puppyMiniWeights,mrows:puppyMiniMatrix},
  14530:{type:'matrix',weights:puppyMiniWeights,mrows:puppyMiniMatrix},
  // Wild Boar&Apple Adult Mini (396) - WP: 33243, 14537
  33243:{type:'simple',rows:adultMiniSimple},
  14537:{type:'simple',rows:adultMiniSimple},
  // Wild Boar&Apple Adult Med&Max (397) - WP: 14540, 14539
  14540:{type:'simple',rows:adultMedMaxSimple},
  14539:{type:'simple',rows:adultMedMaxSimple},
  // Lamb&Blueberry Puppy Med&Max (389) - WP: 14534
  14534:{type:'matrix',weights:puppyMedMaxWeights,mrows:puppyMedMaxMatrix},
  // Quail&Pomegr Adult Mini (976) - WP: 14543
  14543:{type:'simple',rows:adultMini974},
  // Quail&Pomegr Adult Med&Max (977) - WP: 14544
  14544:{type:'simple',rows:adultMedMaxSimple},
  // Venison&Apple Adult Med&Max (979) - WP: 14715
  14715:{type:'simple',rows:adultMedMaxSimple},
  // Venison&Apple Adult Mini (978) - WP: 14545
  14545:{type:'simple',rows:adultMini974},
  // Duck&Cantaloupe Adult Med&Max (975) - WP: 14542
  14542:{type:'simple',rows:adultMedMaxSimple},
  // Duck&Cantaloupe Adult Mini (974) - WP: 14541
  14541:{type:'simple',rows:adultMini974}
};

const IDS=Object.keys(REC).map(Number);
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const rep={planned:[],apply:[]};
const builds={};
let allPass=true;
for(const id of IDS){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){rep.planned.push({id,err:'read'});allPass=false;continue;}
  const raw=(j.content&&j.content.raw)||"";
  const r=REC[id];
  // 1) Pirma dekoduojam ZB content (jei dar enkoduotas)
  let zb=raw;
  // patikrinam ar yra jau b2b-black lentelė nuo ankstesnio - jei taip, pašalinam (tik labai konservatyviai)
  const tblStart=zb.indexOf('<style>.b2b-black');
  if(tblStart>=0){const tblEnd=zb.indexOf('</table></div>',tblStart);if(tblEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(tblEnd+'</table></div>'.length);}}
  const decoded=decodeOnce(zb);
  // 2) Surandam Šėrimo instrukcija paragrafo pabaigą
  const sIdx=decoded.indexOf('Šėrimo');
  const pEnd=sIdx>=0?decoded.indexOf('</p>',sIdx):-1;
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker',sIdx,pEnd});allPass=false;continue;}
  const cut=pEnd+4;
  const block=r.type==='matrix'?tableMatrix(r.weights,r.mrows):tableSimple(r.rows);
  const newT=decoded.slice(0,cut)+'\n'+block+decoded.slice(cut);
  // 3) Guard'ai
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
  rep.planned.push({id,status:j.status,oldLen:raw.length,newLen:newT.length,guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("farmina_pumpkin_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

// APPLY
for(const id of IDS){
  const b=builds[id];
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:b.newT}));
  try{
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
    let rb="";execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
    rep.apply.push({id,lossless:md5(rb)===md5(b.newT),status:b.status});
  }catch(e){rep.apply.push({id,err:String(e).slice(0,100)});}
}
commit("farmina_pumpkin_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("APPLY DONE");
