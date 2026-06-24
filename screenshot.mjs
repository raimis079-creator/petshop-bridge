import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
const ids=[18112,18109,18106,18101,18098,18095,18092,18088,18077,18074,18065,18062,21707,18046,18043,18040,18036,18032,18029,18026,18022,18018,18014,18011,18000,17995,17992,17986,17983,17978];
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', ids.join("\n"));
const U=process.env.WP_USER,P=env.WP_PASS_CLEAN;
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I {} curl -sk --max-time 30 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/p/{}.json`,{encoding:'utf8',maxBuffer:200000000,timeout:200000});}catch(e){}

function analyze(h){
  // serimo zona (po pirmo serimo markerio)
  const si=h.search(/\u0160\u0117rimo rekomendacija|\u0160\u0117rimo norm|Rekomenduojam[a-z]* pa\u0161aro/i);
  if(si<0) return {cls:"NO_ZONE"};
  const zoneEnd = Math.min(h.length, si+2000);
  const zone=h.slice(si, zoneEnd);
  // specialios
  if(/Kal\u0117s|N\u0117\u0161tum/i.test(zone)) return {cls:"SPECIAL_pregnancy"};
  if(/Am\u017eius|m\u0117nesiais|k\u016bno svorio|kg k\u016bno/i.test(zone)) return {cls:"SPECIAL_age"};
  if(/\d+\s*(&ndash;|[-\u2013])\s*\d+\s*kg/i.test(zone.replace(/&nbsp;/g,' '))) return {cls:"SPECIAL_range"};
  // standartine: header su Svoris...aktyvus
  const hm=zone.match(/<p>[^<]*Svoris[^<]*aktyvus[^<]*<\/p>/i);
  if(!hm) return {cls:"NO_HEADER"};
  // eilutes
  const z2=zone.replace(/&nbsp;/g,' ');
  const pRe=/<p>([\s\S]*?)<\/p>/g; let m; const rows=[]; let started=false;
  while((m=pRe.exec(z2))!==null){
    const inner=m[1];
    if(/Svoris[\s\S]*aktyvus/i.test(inner)){started=true;continue;}
    if(!started) continue;
    const wt=inner.match(/(\d+)\s*kg/i);
    const grams=[...inner.matchAll(/(\d+)\s*g\b/gi)].map(x=>+x[1]);
    if(wt && grams.length===3){ rows.push([+wt[1],grams[0],grams[1],grams[2]]); }
    else if(rows.length>0 && inner.replace(/[\s]/g,'')!=='') break;
  }
  const kgCount=(zone.replace(/&nbsp;/g,' ').match(/\b\d+\s*kg\b/gi)||[]).length;
  if(rows.length<4) return {cls:"FEW_ROWS",rows:rows.length};
  return {cls:"STD_DOG", rows, kgInZone:kgCount, rowsMatchKg: rows.length===kgCount};
}
const out=[];
for(const id of ids){
  let h="";try{h=(JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){}
  if(!h){out.push({id,cls:"ERR"});continue;}
  out.push({id, ...analyze(h)});
}
commit("dryconv_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
