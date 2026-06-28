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

// Matisse KITTEN: lentelė pagal amžių (gamintojo formatas)
function buildKittenTable(){
  const rows=[
    ["Nujunkymo metu","30–40 g"],
    ["2–4 mėn.","40–65 g"],
    ["5–7 mėn.","60–75 g"],
    ["8–10 mėn.","70–85 g"],
    ["11–12 mėn.","65–85 g"]
  ];
  let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+=`<tr><td ${TD}><b>Kačiuko amžius</b></td><td ${TD}><b>Kiekis per parą</b></td></tr>\n`;
  for(const [a,d] of rows) s+=`<tr><td ${TD}>${a}</td><td ${TD}>${d}</td></tr>\n`;
  s+='</table></div>'; return s;
}

const IDS=[14700];
const rep={planned:[],apply:[]};
const builds={};
let allPass=true;
for(const id of IDS){
  const j=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=id,content,status,title"`,{env,encoding:'utf8',maxBuffer:200000000}));
  const raw=(j.content&&j.content.raw)||"";
  let zb=raw;
  const tblStart=zb.indexOf('<style>.b2b-black');
  if(tblStart>=0){const tblEnd=zb.indexOf('</table></div>',tblStart);if(tblEnd>=0){zb=zb.slice(0,tblStart).replace(/\s+$/,'')+zb.slice(tblEnd+'</table></div>'.length);}}
  const decoded=decodeOnce(zb);
  const sIdx=decoded.indexOf('Šėrimo');
  const pEnd=sIdx>=0?decoded.indexOf('</p>',sIdx):-1;
  if(sIdx<0||pEnd<0){rep.planned.push({id,err:'marker'});allPass=false;continue;}
  const cut=pEnd+4;
  const block=buildKittenTable();
  const newT=decoded.slice(0,cut)+'\n'+block+decoded.slice(cut);
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(newT),
    hasRealP:/<p>/.test(newT)&&/<\/p>/.test(newT),
    hasSerimo:/Šėrimo instrukcija/.test(newT),
    oneTable:(newT.match(/<table/g)||[]).length===1,
    hasB2bDiv:(newT.match(/<div class="b2b-black">/g)||[]).length===1,
    hasHeader:newT.includes('Kačiuko amžius'),
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(newT)
  };
  const pass=Object.values(g).every(Boolean);
  rep.planned.push({id,guards:g,pass});
  if(!pass){allPass=false;continue;}
  builds[id]={newT,status:j.status};
}
if(!allPass){commit("matisse_kitten_apply_"+Date.now()+".json",JSON.stringify({abort:1,rep},null,1));console.log("ABORT");process.exit(0);}
for(const id of IDS){
  const b=builds[id];
  fs.writeFileSync('/tmp/body.json',JSON.stringify({content:b.newT}));
  execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${id}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});
  execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/rb.json`,{env});
  const rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";
  rep.apply.push({id,lossless:md5(rb)===md5(b.newT)});
}
commit("matisse_kitten_apply_"+Date.now()+".json",JSON.stringify(rep,null,1));
console.log("MATISSE KITTEN DONE");
