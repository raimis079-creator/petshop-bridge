import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
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

// QUINOA Neutered Mini (689) — Adult 1-10kg
const quinoaNeuteredMini=[["1 kg","16–30 g"],["2 kg","30–50 g"],["3 kg","38–70 g"],["4 kg","45–85 g"],["5 kg","55–100 g"],["6 kg","65–115 g"],["7 kg","70–130 g"],["8 kg","78–145 g"],["9 kg","85–158 g"],["10 kg","92–170 g"]];
// QUINOA Neutered Med&Max (690) — 10-70kg
const quinoaNeuteredMedMax=[["10 kg","92–170 g"],["15 kg","125–230 g"],["20 kg","155–285 g"],["25 kg","180–335 g"],["30 kg","210–390 g"],["35 kg","235–435 g"],["40 kg","258–480 g"],["50 kg","305–570 g"],["60 kg","350–650 g"],["70 kg","395–730 g"]];
// QUINOA Digestion Mini (691) — 2-10 kg
const quinoaDigestionMini=[["2 kg","30–52 g"],["3 kg","42–72 g"],["4 kg","52–90 g"],["5 kg","60–100 g"],["6 kg","72–122 g"],["7 kg","80–138 g"],["8 kg","90–150 g"],["9 kg","98–165 g"],["10 kg","105–180 g"]];
// QUINOA Weight Management Mini (692) — 2-10kg
const quinoaWeightMini=[["2 kg","25–44 g"],["3 kg","33–60 g"],["4 kg","42–75 g"],["5 kg","50–90 g"],["6 kg","58–102 g"],["7 kg","65–115 g"],["8 kg","72–126 g"],["9 kg","80–138 g"],["10 kg","85–150 g"]];
// QUINOA Skin&Coat Mini (693/694/695/696) — identiškos: 2-10kg
const quinoaSkinMini=[["2 kg","30–52 g"],["3 kg","42–72 g"],["4 kg","52–90 g"],["5 kg","60–100 g"],["6 kg","72–122 g"],["7 kg","80–138 g"],["8 kg","90–150 g"],["9 kg","98–165 g"],["10 kg","105–180 g"]];
// QUINOA Digestion Med&Max (1029), Skin&Coat Quail Med&Max (1031), Duck Med&Max (443) — identiškos
const quinoaDigestionMedMax=[["5 kg","60–110 g"],["10 kg","105–180 g"],["15 kg","140–245 g"],["20 kg","175–310 g"],["30 kg","235–415 g"],["40 kg","290–515 g"],["50 kg","345–610 g"],["60 kg","400–680 g"],["70 kg","450–750 g"]];
// QUINOA Skin&Coat Venison Med&Max (1032) — turi 1kg eilutę papildomai
const quinoaVenisonMedMax=[["1 kg","18–32 g"],["5 kg","60–110 g"],["10 kg","105–180 g"],["20 kg","175–310 g"],["30 kg","235–415 g"],["40 kg","290–515 g"],["50 kg","345–610 g"],["60 kg","400–680 g"],["70 kg","450–750 g"]];
// QUINOA Weight Mgmt Med&Max (1034)
const quinoaWeightMedMax=[["5 kg","50–90 g"],["10 kg","85–150 g"],["15 kg","115–205 g"],["20 kg","145–255 g"],["30 kg","195–345 g"],["40 kg","240–425 g"],["50 kg","285–500 g"],["60 kg","325–575 g"],["70 kg","365–620 g"]];

// BROWN Adult Mini (1010)
const brownAdultMini=[["1 kg","18–33 g"],["2 kg","30–55 g"],["3 kg","40–75 g"],["4 kg","50–94 g"],["5 kg","60–110 g"],["6 kg","68–125 g"],["7 kg","76–142 g"],["8 kg","85–158 g"],["9 kg","92–172 g"],["10 kg","100–186 g"]];
// BROWN Adult Med&Max (1146)
const brownAdultMedMax=[["10 kg","100–186 g"],["15 kg","135–253 g"],["20 kg","170–315 g"],["25 kg","200–370 g"],["30 kg","230–425 g"],["35 kg","255–475 g"],["40 kg","285–525 g"],["50 kg","335–625 g"],["60 kg","385–715 g"],["70 kg","430–800 g"]];
// BROWN Puppy Mini matrica (1149) — 1.5, 3, 4, 5, 6, 8, 10, 12, 15 kg × 2, 3, 4, 6, 10, 12 mėn
const brownPuppyMiniW=["1,5 kg","3 kg","4 kg","5 kg","6 kg","8 kg","10 kg","12 kg","15 kg"];
const brownPuppyMiniM=[
  {age:"2 mėn.",vals:["30 g","50 g","60 g","70 g","75 g","85 g","100 g","115 g","135 g"]},
  {age:"3 mėn.",vals:["40 g","70 g","80 g","95 g","105 g","125 g","145 g","165 g","190 g"]},
  {age:"4 mėn.",vals:["40 g","70 g","85 g","100 g","110 g","135 g","155 g","175 g","200 g"]},
  {age:"6 mėn.",vals:["50 g","80 g","100 g","125 g","140 g","165 g","190 g","220 g","260 g"]},
  {age:"10 mėn.",vals:["45 g","90 g","95 g","110 g","135 g","160 g","185 g","215 g","250 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","120 g","140 g","170 g","190 g","210 g","230 g"]}
];
// BROWN Puppy Med&Max matrica (1150) — 5,10,15,20,25,30,35,40,50,60,70 kg × 2,3,4,6,10,12,16 mėn
const brownPuppyMedMaxW=["5 kg","10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","50 kg","60 kg","70 kg"];
const brownPuppyMedMaxM=[
  {age:"2 mėn.",vals:["70 g","100 g","135 g","155 g","175 g","200 g","220 g","235 g","270 g","310 g","355 g"]},
  {age:"3 mėn.",vals:["95 g","145 g","190 g","235 g","270 g","310 g","335 g","365 g","405 g","420 g","460 g"]},
  {age:"4 mėn.",vals:["100 g","155 g","200 g","250 g","290 g","325 g","355 g","385 g","430 g","460 g","490 g"]},
  {age:"6 mėn.",vals:["125 g","190 g","260 g","305 g","365 g","405 g","450 g","490 g","565 g","635 g","700 g"]},
  {age:"10 mėn.",vals:["105 g","180 g","240 g","300 g","345 g","385 g","420 g","450 g","530 g","585 g","660 g"]},
  {age:"12 mėn.",vals:["115 g","185 g","250 g","315 g","355 g","395 g","430 g","470 g","550 g","605 g","680 g"]},
  {age:"16 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","395 g","410 g","440 g","480 g","550 g","635 g","700 g"]}
];

// WHITE - panašu į BROWN (skiriasi tik baltymas)
// White Adult Mini (1006) - identiška Brown Adult Mini
const whiteAdultMini=brownAdultMini;
// White Adult Med&Max (1145) - kiek kitokios cup vertės bet g identiškos
const whiteAdultMedMax=brownAdultMedMax;
// White Puppy Mini (1147) - kiek skiriasi nuo Brown puppy mini
const whitePuppyMiniW=["1,5 kg","3 kg","4 kg","5 kg","6 kg","8 kg","10 kg","12 kg","15 kg"];
const whitePuppyMiniM=[
  {age:"2 mėn.",vals:["30 g","50 g","60 g","70 g","75 g","85 g","100 g","115 g","135 g"]},
  {age:"3 mėn.",vals:["40 g","70 g","80 g","95 g","110 g","130 g","145 g","160 g","195 g"]},
  {age:"4 mėn.",vals:["50 g","70 g","85 g","100 g","115 g","140 g","160 g","170 g","205 g"]},
  {age:"6 mėn.",vals:["45 g","80 g","100 g","125 g","140 g","170 g","190 g","220 g","260 g"]},
  {age:"10 mėn.",vals:["45 g","85 g","90 g","105 g","130 g","160 g","180 g","205 g","245 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","135 g","165 g","185 g","210 g","255 g"]}
];
// White Puppy Med&Max (1148)
const whitePuppyMedMaxW=["5 kg","10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","50 kg","60 kg","70 kg"];
const whitePuppyMedMaxM=[
  {age:"2 mėn.",vals:["70 g","100 g","135 g","160 g","175 g","205 g","225 g","240 g","275 g","315 g","365 g"]},
  {age:"3 mėn.",vals:["95 g","145 g","195 g","240 g","270 g","310 g","345 g","370 g","405 g","435 g","470 g"]},
  {age:"4 mėn.",vals:["100 g","160 g","205 g","255 g","290 g","330 g","365 g","390 g","435 g","470 g","545 g"]},
  {age:"6 mėn.",vals:["125 g","200 g","260 g","315 g","370 g","410 g","465 g","500 g","575 g","650 g","715 g"]},
  {age:"10 mėn.",vals:["105 g","180 g","245 g","300 g","355 g","390 g","430 g","465 g","535 g","600 g","675 g"]},
  {age:"12 mėn.",vals:["115 g","185 g","255 g","310 g","365 g","400 g","445 g","480 g","555 g","620 g","690 g"]},
  {age:"16 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","400 g","415 g","455 g","490 g","575 g","650 g","710 g"]}
];

// TROPICAL Adult Mini (1012/1015/1016/1017 - visi identiški)
const tropicalAdultMini=[["1 kg","20–34 g"],["2 kg","30–55 g"],["3 kg","40–75 g"],["4 kg","50–95 g"],["5 kg","60–110 g"],["6 kg","70–125 g"],["7 kg","80–145 g"],["8 kg","85–160 g"],["9 kg","95–175 g"],["10 kg","100–190 g"]];
// TROPICAL Adult Med&Max (1020-1023 identiški)
const tropicalAdultMedMax=[["10 kg","100–190 g"],["15 kg","145–255 g"],["20 kg","170–315 g"],["25 kg","200–375 g"],["30 kg","230–430 g"],["35 kg","260–480 g"],["40 kg","285–530 g"],["50 kg","340–630 g"],["60 kg","390–720 g"],["70 kg","435–800 g"]];
// TROPICAL Puppy Mini (1018) - 12 svorių
const tropicalPuppyMiniW=["1,5 kg","2 kg","2,5 kg","3 kg","3,5 kg","4 kg","5 kg","6 kg","7 kg","8 kg","9 kg","10 kg"];
const tropicalPuppyMiniM=[
  {age:"2 mėn.",vals:["25 g","30 g","35 g","45 g","50 g","55 g","60 g","70 g","75 g","80 g","85 g","95 g"]},
  {age:"3 mėn.",vals:["35 g","45 g","55 g","60 g","70 g","80 g","90 g","95 g","110 g","115 g","120 g","130 g"]},
  {age:"4 mėn.",vals:["40 g","50 g","60 g","65 g","75 g","85 g","95 g","100 g","120 g","130 g","135 g","140 g"]},
  {age:"6 mėn.",vals:["45 g","55 g","60 g","75 g","85 g","95 g","115 g","125 g","140 g","150 g","165 g","175 g"]},
  {age:"10 mėn.",vals:["40 g","55 g","60 g","75 g","80 g","90 g","100 g","115 g","130 g","140 g","150 g","165 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs"]}
];
// TROPICAL Puppy Med&Max (1019)
const tropicalPuppyMedMaxW=["10 kg","15 kg","20 kg","25 kg","30 kg","35 kg","40 kg","45 kg","50 kg","55 kg","60 kg","70 kg"];
const tropicalPuppyMedMaxM=[
  {age:"2 mėn.",vals:["95 g","125 g","140 g","160 g","185 g","200 g","215 g","230 g","250 g","265 g","280 g","330 g"]},
  {age:"3 mėn.",vals:["130 g","175 g","215 g","245 g","280 g","305 g","335 g","350 g","370 g","375 g","390 g","425 g"]},
  {age:"4 mėn.",vals:["140 g","185 g","230 g","265 g","300 g","325 g","355 g","375 g","395 g","405 g","425 g","450 g"]},
  {age:"6 mėn.",vals:["175 g","240 g","280 g","325 g","370 g","400 g","450 g","480 g","520 g","545 g","585 g","645 g"]},
  {age:"10 mėn.",vals:["165 g","230 g","275 g","310 g","375 g","380 g","415 g","445 g","485 g","505 g","540 g","610 g"]},
  {age:"12 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","360 g","395 g","435 g","465 g","505 g","525 g","560 g","630 g"]},
  {age:"16 mėn.",vals:["Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","Suaugęs","440 g","470 g","510 g","540 g","585 g","645 g"]}
];

// ANCESTRAL Senior Mini (596)
const ancestralSeniorMini=[["1 kg","15–28 g"],["2 kg","25–50 g"],["3 kg","35–65 g"],["4 kg","42–80 g"],["5 kg","50–95 g"],["6 kg","60–110 g"],["7 kg","70–120 g"],["8 kg","75–125 g"],["9 kg","80–155 g"],["10 kg","85–160 g"]];

// === WP_SKU -> recipe ===
const REC={};
// Quinoa
REC[14552]={type:'simple',rows:quinoaNeuteredMedMax};
REC[14550]={type:'simple',rows:quinoaNeuteredMini};
REC[14551]={type:'simple',rows:quinoaNeuteredMedMax};
REC[14549]={type:'simple',rows:quinoaNeuteredMini};
REC[14548]={type:'simple',rows:quinoaNeuteredMini};
REC[14560]={type:'simple',rows:quinoaWeightMedMax};
REC[14561]={type:'simple',rows:quinoaWeightMedMax};
REC[14559]={type:'simple',rows:quinoaWeightMini};
REC[14558]={type:'simple',rows:quinoaWeightMini};
REC[14556]={type:'simple',rows:quinoaVenisonMedMax};
REC[14554]={type:'simple',rows:quinoaDigestionMedMax}; // Skin&Coat Quail Med&Max = 1031
REC[14553]={type:'simple',rows:quinoaDigestionMedMax}; // Skin&Coat Duck Med&Max = 443 (identiškos kvail)
REC[14547]={type:'simple',rows:quinoaDigestionMedMax};
REC[14546]={type:'simple',rows:quinoaDigestionMedMax};
// Brown
REC[33229]={type:'simple',rows:brownAdultMini}; // ADULT MINI 5kg
REC[14498]={type:'simple',rows:brownAdultMini}; // ADULT MINI 2kg
REC[14502]={type:'simple',rows:brownAdultMedMax}; // ADULT MED&MAX 7kg
REC[14501]={type:'simple',rows:brownAdultMedMax}; // ADULT MED&MAX 2kg
REC[14497]={type:'matrix',weights:brownPuppyMiniW,mrows:brownPuppyMiniM};
REC[14500]={type:'matrix',weights:brownPuppyMedMaxW,mrows:brownPuppyMedMaxM};
// White
REC[33253]={type:'matrix',weights:whitePuppyMiniW,mrows:whitePuppyMiniM}; // PUPPY MINI 1,5kg
REC[14578]={type:'simple',rows:whiteAdultMini}; // ADULT MINI 5kg
REC[14577]={type:'simple',rows:whiteAdultMini}; // ADULT MINI 2kg
REC[14581]={type:'simple',rows:whiteAdultMedMax}; // ADULT MED&MAX 7kg
REC[14580]={type:'simple',rows:whiteAdultMedMax}; // ADULT MED&MAX 2kg
REC[14579]={type:'matrix',weights:whitePuppyMedMaxW,mrows:whitePuppyMedMaxM};
// Tropical
REC[33249]={type:'matrix',weights:tropicalPuppyMiniW,mrows:tropicalPuppyMiniM}; // Lamb Puppy Mini 1,5kg
REC[33251]={type:'matrix',weights:tropicalPuppyMiniW,mrows:tropicalPuppyMiniM}; // Lamb Puppy Mini 5kg
REC[14564]={type:'simple',rows:tropicalAdultMini};
REC[14565]={type:'simple',rows:tropicalAdultMini};
REC[14566]={type:'simple',rows:tropicalAdultMedMax};
REC[14567]={type:'simple',rows:tropicalAdultMedMax};
REC[14568]={type:'simple',rows:tropicalAdultMini};
REC[14569]={type:'simple',rows:tropicalAdultMini};
REC[14570]={type:'simple',rows:tropicalAdultMedMax};
REC[14571]={type:'simple',rows:tropicalAdultMedMax};
REC[14572]={type:'simple',rows:tropicalAdultMini};
REC[14573]={type:'simple',rows:tropicalAdultMini};
REC[14574]={type:'simple',rows:tropicalAdultMedMax};
REC[14575]={type:'simple',rows:tropicalAdultMedMax};
// Ancestral
REC[14496]={type:'simple',rows:ancestralSeniorMini};

const IDS=Object.keys(REC).map(Number);
fs.writeFileSync('/tmp/ids.txt',IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,status,title" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

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
  rep.planned.push({id,title:(j.title&&j.title.rendered)||'',type:r.type,guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("farmina_d_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

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
commit("farmina_d_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("D APPLY DONE",IDS.length);
