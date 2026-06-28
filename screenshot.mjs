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
  s+=`<tr><td ${TD}><b>Katės svoris</b></td><td ${TD}><b>Kiekis per parą</b></td></tr>\n`;
  for(const [w,d] of rows) s+=`<tr><td ${TD}>${w}</td><td ${TD}>${d}</td></tr>\n`;
  s+='</table></div>'; return s;}
function tableMatrix(weights,mrows,wlabel,alabel){let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+='<tr><td '+TD+'><b>'+(alabel||'Amžius')+'</b></td>'+weights.map(w=>'<td '+TD+'><b>'+w+'</b></td>').join('')+'</tr>\n';
  for(const r of mrows) s+='<tr><td '+TD+'>'+r.age+'</td>'+r.vals.map(v=>'<td '+TD+'>'+v+'</td>').join('')+'</tr>\n';
  s+='</table></div>'; return s;}
function tableMatisse(rows){let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+=`<tr><td ${TD}><b>Katės svoris</b></td><td ${TD}><b>Liesa</b></td><td ${TD}><b>Normali</b></td><td ${TD}><b>Antsvoris</b></td></tr>\n`;
  for(const r of rows) s+=`<tr><td ${TD}>${r[0]}</td><td ${TD}>${r[1]}</td><td ${TD}>${r[2]}</td><td ${TD}>${r[3]||'-'}</td></tr>\n`;
  s+='</table></div>'; return s;}

// ===== LENTELES PAGAL RECEPTUS =====

// PUMPKIN CAT 434 Venison&Apple Adult (2-6,5 kg)
const pumpkin_venison=[["2 kg","22–36 g"],["2,5 kg","25–42 g"],["3 kg","28–48 g"],["3,5 kg","32–52 g"],["4 kg","35–58 g"],["4,5 kg","38–62 g"],["5 kg","40–68 g"],["5,5 kg","42–72 g"],["6 kg","45–76 g"],["6,5 kg","48–80 g"]];
// PUMPKIN CAT 435 Quail&Pomegr NEUTERED
const pumpkin_quail=[["2 kg","25–33 g"],["2,5 kg","30–40 g"],["3 kg","32–44 g"],["3,5 kg","36–48 g"],["4 kg","40–52 g"],["4,5 kg","42–56 g"],["5 kg","45–60 g"],["5,5 kg","48–65 g"],["6 kg","52–68 g"],["6,5 kg","55–72 g"]];
// PUMPKIN CAT 710 Lamb&Blueberry NEUTERED
const pumpkin_lamb=[["2 kg","25–33 g"],["2,5 kg","30–40 g"],["3 kg","32–44 g"],["3,5 kg","36–48 g"],["4 kg","40–52 g"],["4,5 kg","42–56 g"],["5 kg","45–60 g"],["5,5 kg","48–65 g"],["6 kg","52–68 g"],["6,5 kg","56–72 g"]];

// PRIME CAT 144 Chicken Pomegranate KITTEN - matrica
const primeKittenW=["0,5 kg","1 kg","1,5 kg","2 kg","2,5 kg","3 kg","4 kg"];
const primeKittenM=[
  {age:"Nutraukimas",vals:["22–35 g","18–30 g","-","-","-","-","-"]},
  {age:"1–3 mėn.",vals:["23–27 g","36–45 g","54–63 g","63–72 g","-","-","-"]},
  {age:"4–6 mėn.",vals:["18–23 g","32–36 g","45–54 g","54–60 g","63–68 g","-","-"]},
  {age:"7–12 mėn.",vals:["-","-","36–45 g","45–50 g","54–60 g","60–65 g","63–80 g"]}
];
// PRIME CAT 146 Chicken Pomegranate NEUTERED
const prime_chicken_neutered=[["2 kg","24–32 g"],["2,5 kg","28–38 g"],["3 kg","32–42 g"],["3,5 kg","36–48 g"],["4 kg","40–52 g"],["4,5 kg","42–56 g"],["5 kg","45–60 g"],["5,5 kg","48–65 g"],["6 kg","52–68 g"],["6,5 kg","54–72 g"]];
// PRIME CAT 147 Wild Boar&Apple Adult
const prime_boar=[["2 kg","22–36 g"],["2,5 kg","25–42 g"],["3 kg","28–48 g"],["3,5 kg","32–52 g"],["4 kg","35–58 g"],["4,5 kg","38–62 g"],["5 kg","40–66 g"],["5,5 kg","42–70 g"],["6 kg","45–75 g"],["6,5 kg","48–80 g"]];

// OCEAN CAT 495 Herring Pumpkin&Orange Adult
const ocean_herring_pumpkin=[["2 kg","22–36 g"],["2,5 kg","25–42 g"],["3 kg","28–48 g"],["3,5 kg","32–52 g"],["4 kg","35–58 g"],["4,5 kg","38–62 g"],["5 kg","40–68 g"],["5,5 kg","42–70 g"],["6 kg","45–76 g"],["6,5 kg","48–80 g"]];
// OCEAN CAT 708 NEUTERED Herring&Orange Adult
const ocean_neutered=[["2 kg","25–33 g"],["2,5 kg","30–40 g"],["3 kg","32–44 g"],["3,5 kg","36–48 g"],["4 kg","40–52 g"],["4,5 kg","42–56 g"],["5 kg","45–60 g"],["5,5 kg","48–65 g"],["6 kg","52–68 g"],["6,5 kg","56–72 g"]];
// OCEAN CAT 709 KITTEN Cod Shrimp Pumpkin Cantaloupe - matrica
const oceanKittenW=["0,5 kg","1 kg","1,5 kg","2 kg","2,5 kg","3 kg","4 kg"];
const oceanKittenM=[
  {age:"Nutraukimas",vals:["25–40 g","20–40 g","-","-","-","-","-"]},
  {age:"2–3 mėn.",vals:["25–28 g","35–45 g","55–65 g","60–70 g","-","-","-"]},
  {age:"4–6 mėn.",vals:["20–25 g","35–40 g","45–55 g","55–60 g","60–65 g","65–70 g","70–80 g"]},
  {age:"7–12 mėn.",vals:["-","-","38–55 g","45–55 g","55–60 g","60–65 g","65–75 g"]}
];

// QUINOA CAT 437 Skin&Coat Quail Coconut
const quinoa_skin=[["2 kg","23–38 g"],["2,5 kg","26–44 g"],["3 kg","30–50 g"],["3,5 kg","33–55 g"],["4 kg","36–60 g"],["4,5 kg","40–65 g"],["5 kg","42–70 g"],["5,5 kg","45–75 g"],["6 kg","50–80 g"],["6,5 kg","54–85 g"]];
// QUINOA CAT 438 Urinary Duck Cranberry
const quinoa_urinary=[["2 kg","23–38 g"],["2,5 kg","26–44 g"],["3 kg","30–50 g"],["3,5 kg","33–55 g"],["4 kg","36–60 g"],["4,5 kg","40–65 g"],["5 kg","42–70 g"],["5,5 kg","45–75 g"],["6 kg","47–78 g"],["6,5 kg","50–80 g"]];
// QUINOA CAT 697 NEUTERED Duck Broccoli Asparagus
const quinoa_neutered=[["2 kg","30–38 g"],["2,5 kg","34–45 g"],["3 kg","40–50 g"],["3,5 kg","42–56 g"],["4 kg","46–62 g"],["4,5 kg","50–66 g"],["5 kg","58–76 g"],["5,5 kg","58–76 g"],["6 kg","60–80 g"],["6,5 kg","64–85 g"]];

// TROPICAL CAT 1013 NEUTERED Chicken (identiska 1014)
const tropical_neutered=[["2 kg","27–36 g"],["2,5 kg","32–42 g"],["3 kg","36–47 g"],["3,5 kg","40–52 g"],["4 kg","43–57 g"],["4,5 kg","46–62 g"],["5 kg","50–67 g"],["5,5 kg","54–71 g"],["6 kg","57–75 g"],["6,5 kg","60–80 g"]];

// MATISSE 155 Chicken & Rice
const matisse_chicken_rice=[["1–3 kg","30–60 g","25–50 g","-"],["3–5 kg","60–80 g","50–65 g","40–60 g"],["5–7 kg","80–100 g","65–80 g","60–70 g"]];
// MATISSE 156 Chicken & Turkey Vegetables (identical to 155)
const matisse_chicken_turkey=[["1–3 kg","30–60 g","25–50 g","-"],["3–5 kg","60–80 g","50–65 g","40–60 g"],["5–7 kg","80–100 g","65–80 g","60–70 g"]];
// MATISSE 157 Salmon & Tuna (identical)
const matisse_salmon_tuna=[["1–3 kg","30–60 g","25–50 g","-"],["3–5 kg","60–80 g","50–65 g","40–60 g"],["5–7 kg","80–100 g","65–80 g","60–70 g"]];
// MATISSE 158 NEUTERED
const matisse_neutered=[["1–3 kg","25–50 g","20–40 g","-"],["3–5 kg","50–70 g","40–55 g","35–50 g"],["5–7 kg","70–90 g","55–70 g","50–60 g"]];
// MATISSE 159 NEUTERED SALMON
const matisse_neutered_salmon=[["1–3 kg","25–50 g","20–40 g","-"],["3–5 kg","50–70 g","40–55 g","35–50 g"],["5–7 kg","70–90 g","55–70 g","50–60 g"]];

// === WP_SKU -> recipe ===
const REC={};
// PUMPKIN CAT (6)
REC[33285]={type:'simple',rows:pumpkin_venison};
REC[14608]={type:'simple',rows:pumpkin_venison};
REC[33289]={type:'simple',rows:pumpkin_lamb};
REC[14611]={type:'simple',rows:pumpkin_lamb};
REC[14604]={type:'simple',rows:pumpkin_quail};
REC[14605]={type:'simple',rows:pumpkin_quail};
// PRIME CAT (5)
REC[14593]={type:'matrix',weights:primeKittenW,mrows:primeKittenM,alabel:'Amžius'};
REC[14595]={type:'simple',rows:prime_chicken_neutered};
REC[27564]={type:'simple',rows:prime_chicken_neutered};
REC[33275]={type:'simple',rows:prime_boar};
REC[14600]={type:'simple',rows:prime_boar};
// OCEAN CAT (6)
REC[33259]={type:'matrix',weights:oceanKittenW,mrows:oceanKittenM,alabel:'Amžius'};
REC[14584]={type:'matrix',weights:oceanKittenW,mrows:oceanKittenM,alabel:'Amžius'};
REC[14591]={type:'simple',rows:ocean_herring_pumpkin};
REC[14590]={type:'simple',rows:ocean_herring_pumpkin};
REC[14588]={type:'simple',rows:ocean_neutered};
REC[14587]={type:'simple',rows:ocean_neutered};
// QUINOA CAT (6)
REC[33293]={type:'simple',rows:quinoa_neutered};
REC[14614]={type:'simple',rows:quinoa_neutered};
REC[14619]={type:'simple',rows:quinoa_urinary};
REC[14620]={type:'simple',rows:quinoa_urinary};
REC[14617]={type:'simple',rows:quinoa_skin};
REC[14616]={type:'simple',rows:quinoa_skin};
// TROPICAL CAT (6, visi NEUTERED identiski)
REC[33303]={type:'simple',rows:tropical_neutered};
REC[33305]={type:'simple',rows:tropical_neutered};
REC[14628]={type:'simple',rows:tropical_neutered};
REC[14623]={type:'simple',rows:tropical_neutered};
REC[14624]={type:'simple',rows:tropical_neutered};
REC[14622]={type:'simple',rows:tropical_neutered};
// MATISSE (5 - be KITTEN 14700)
REC[14703]={type:'matisse',rows:matisse_chicken_rice};
REC[14706]={type:'matisse',rows:matisse_chicken_turkey};
REC[14711]={type:'matisse',rows:matisse_salmon_tuna};
REC[14708]={type:'matisse',rows:matisse_neutered};
REC[14714]={type:'matisse',rows:matisse_neutered_salmon};

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
  // remove also vet-life block if present
  const vlStart=zb.indexOf('<style>.b2b-vetlife');
  if(vlStart>=0){const vlEnd=zb.indexOf('</div>',vlStart);if(vlEnd>=0){zb=zb.slice(0,vlStart).replace(/\s+$/,'')+zb.slice(vlEnd+'</div>'.length);}}
  const decoded=decodeOnce(zb);
  const sIdx=decoded.indexOf('Šėrimo');
  const pEnd=sIdx>=0?decoded.indexOf('</p>',sIdx):-1;
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker',title:(j.title&&j.title.rendered)||''});allPass=false;continue;}
  const cut=pEnd+4;
  let block;
  if(r.type==='matrix') block=tableMatrix(r.weights,r.mrows,null,r.alabel);
  else if(r.type==='matisse') block=tableMatisse(r.rows);
  else block=tableSimple(r.rows);
  const newT=decoded.slice(0,cut)+'\n'+block+decoded.slice(cut);
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(newT),
    hasRealP:/<p>/.test(newT)&&/<\/p>/.test(newT),
    hasSerimo:/Šėrimo instrukcija/.test(newT),
    oneTable:(newT.match(/<table/g)||[]).length===1,
    hasB2bDiv:(newT.match(/<div class="b2b-black">/g)||[]).length===1,
    hasHeader:newT.includes('Katės svoris')||newT.includes('Amžius'),
    introMin:newT.length>=1500,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(newT)
  };
  const pass=Object.values(g).every(Boolean);
  rep.planned.push({id,title:(j.title&&j.title.rendered)||'',type:r.type,guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("farmina_cat_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}

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
commit("farmina_cat_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("CAT APPLY DONE",IDS.length);
