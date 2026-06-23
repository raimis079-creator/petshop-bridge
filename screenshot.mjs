import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const env2=env;
const START=parseInt(process.env.SCAN_START||'0');
const COUNT=parseInt(process.env.SCAN_COUNT||'400');
const TS=String(Date.now());

// Imu food ID is anksciau issaugoto failo repo
const idsRaw=execSync(`curl -s -H "Authorization: Bearer ${process.env.GH_TOKEN}" "https://api.github.com/repos/${process.env.GH_REPO}/contents/screenshots?ref=main&t=${Date.now()}"`,{encoding:'utf8'});
const idsFile=(idsRaw.match(/"foodids_\d+\.json"/g)||[]).map(s=>s.replace(/"/g,'')).sort().pop();
const idsContent=execSync(`curl -s "https://raw.githubusercontent.com/${process.env.GH_REPO}/main/screenshots/${idsFile}"`,{encoding:'utf8'});
let allIds=JSON.parse(idsContent);
const ids=allIds.slice(START, START+COUNT);

function wpraw(id){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,title,content"`,{encoding:'utf8',env:env2,maxBuffer:20000000}));
    return {raw:(r.content&&r.content.raw)||'', title:(r.title&&r.title.raw)||''};
  }catch(e){ return {raw:'',title:'',err:1}; }
}

// Sudetis: standartinis "Sudetis:" ARBA "Sudedamosios dalys:" ARBA tekste ingredientu sarasas
function hasSudetis(h){
  const l=h.toLowerCase();
  return /sud\u0117tis\s*:|sudedamosios\s+dalys|ingredient|sestav/i.test(l);
}
// Serimas: visi variantai
function hasSerimas(h){
  const l=h.toLowerCase();
  return /\u0161\u0117rim|serim|maitinimo\s+norma|paros\s+norma|rekomenduojamas\s+kiekis|g\/per\s+dien|\u0161uns\s+svoris|kat\u0117s\s+svoris/i.test(l);
}
// Analitines
function hasAnalitines(h){
  const l=h.toLowerCase();
  return /analitin|\u017eali\s+baltym|\u017ealieji\s+riebal|\u017ealias\s+baltym/i.test(l);
}

const out={ts:TS, start:START, count:ids.length, total:allIds.length, items:[]};
for(const id of ids){
  const d=wpraw(id);
  const empty=d.raw.length<30;
  out.items.push({
    id, len:d.raw.length, empty,
    sudetis:hasSudetis(d.raw),
    analitines:hasAnalitines(d.raw),
    serimas:hasSerimas(d.raw)
  });
  execSync('sleep 0.15');
}
putResult('foodscan_'+START+'_'+TS+'.json', JSON.stringify(out));
console.log('scanned '+ids.length+' from '+START);
