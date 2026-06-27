import { execSync } from "child_process";
import crypto from "crypto";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const BASE="https://dev.avesa.lt/wp-json";
function cj(u){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "${u}" -o /tmp/r.json`,{env,maxBuffer:200000000});return JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));}catch(e){return {err:String(e).slice(0,120)};}}
const TD='style="border-bottom: 2px solid #d3d3d3;padding: 7px;"';
function buildTable(rows){
  let s='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style><div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  s+=`<tr><td ${TD}><b>Šuns svoris</b></td><td ${TD}><b>Kiekis per parą</b></td></tr>\n`;
  for(const [w,d] of rows) s+=`<tr><td ${TD}>${w}</td><td ${TD}>${d}</td></tr>\n`;
  s+='</table></div>';
  return s;
}
// dekodavimas: ZB feed yra dvigubai užkoduotas. Atstatom vieną sluoksnį.
function decodeOnce(s){
  return s
    .replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>')
    .replace(/&amp;amp;/g,'&amp;')      // dvigubai užkoduotas &
    .replace(/&amp;nbsp;/g,'&nbsp;')
    .replace(/&amp;quot;/g,'"')
    .replace(/&amp;#39;/g,"'");
}
const ID=14535;
const rows=[["10 kg","90–160 g"],["15 kg","120–220 g"],["20 kg","150–270 g"],["25 kg","180–320 g"],["30 kg","205–365 g"],["35 kg","230–410 g"],["40 kg","255–450 g"],["50 kg","300–530 g"],["60 kg","350–610 g"],["70 kg","390–685 g"]];
const block=buildTable(rows);

const j=cj(`${BASE}/wp/v2/product/${ID}?context=edit&_fields=id,status,content`);
const raw=(j.content&&j.content.raw)||"";

// 1) Atskiriam: ar yra jau įdėta b2b-black lentelė iš ankstesnio piloto?
const tblStart = raw.indexOf('<style>.b2b-black');
let zb = raw, existingTable = '';
if(tblStart>=0){
  const tblEnd = raw.indexOf('</table></div>', tblStart);
  if(tblEnd>=0){
    existingTable = raw.slice(tblStart, tblEnd+'</table></div>'.length);
    zb = raw.slice(0, tblStart).replace(/\s+$/,'') + raw.slice(tblEnd+'</table></div>'.length);
  }
}
// 2) Dekoduojam ZB turinį
const decoded = decodeOnce(zb);

// 3) Surandam Šėrimo instrukcija paragrafo pabaigą (dabar jau realiame HTML)
const sIdx = decoded.indexOf('Šėrimo');
const pEnd = sIdx>=0 ? decoded.indexOf('</p>', sIdx) : -1;
const out={id:ID,status:j.status,rawLen:raw.length,existingTableFound:!!existingTable,zbLen:zb.length,decodedLen:decoded.length,sIdx,pEnd};
if(sIdx<0||pEnd<0){out.err='marker';commit("farmina_pilotB_"+Date.now()+".json",JSON.stringify(out,null,1));console.log("ABORT marker");process.exit(0);}

const cut = pEnd + 4; // po </p>
const newT = decoded.slice(0,cut) + '\n' + block + decoded.slice(cut);

// 4) Guardai
const g={
  noEncodedP: !/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(newT),
  noDoubleEntities: !/&amp;amp;|&amp;nbsp;|&amp;lt;|&amp;gt;/.test(newT),
  hasRealP: /<p>/.test(newT) && /<\/p>/.test(newT),
  hasSudetis: /<strong>Sudėtis/.test(newT) || /Sudėtis:/.test(newT),
  hasAnalitin: /Analitinės sudedamosios/.test(newT),
  hasSerimo: /Šėrimo instrukcija/.test(newT),
  hasPakuotes: /Pakuotės dydis/.test(newT),
  oneTable: (newT.match(/<table/g)||[]).length === 1,
  hasB2b: /b2b-black/.test(newT),
  hasWeightSample: newT.includes('90–160 g') && newT.includes('70 kg'),
  hasHeader: newT.includes('Kiekis per parą') && newT.includes('Šuns svoris'),
  pakuoteAfterTable: newT.indexOf('Pakuotės dydis') > newT.indexOf('</table>'),
  energyKept: newT.includes('3926'),
  rowCount: (block.match(/<tr>/g)||[]).length === rows.length+1,
  introMin: newT.length >= 2500
};
out.guards=g; out.pass=Object.values(g).every(Boolean); out.newLen=newT.length;
if(!out.pass){out.snippet=newT.slice(0,400); commit("farmina_pilotB_"+Date.now()+".json",JSON.stringify(out,null,1));console.log("ABORT guard");process.exit(0);}

// 5) Įrašom
fs.writeFileSync('/tmp/body.json',JSON.stringify({content:newT}));
try{execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" "${BASE}/wp/v2/product/${ID}" -d @/tmp/body.json -o /tmp/w.json`,{env,maxBuffer:200000000});}catch(e){}
let rb="";try{execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/${ID}?context=edit&_fields=content" -o /tmp/rb.json`,{env});rb=(JSON.parse(fs.readFileSync('/tmp/rb.json','utf8')).content||{}).raw||"";}catch(e){}
out.lossless = md5(rb) === md5(newT);
out.readback_head = rb.slice(0, 400);
commit("farmina_pilotB_"+Date.now()+".json",JSON.stringify(out,null,1));
console.log("PILOTB DONE");
