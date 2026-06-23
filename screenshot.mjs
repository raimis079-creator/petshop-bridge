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
const TS=String(Date.now());

function wc(path){
  return execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}"`,{encoding:'utf8',env,maxBuffer:50000000});
}

// 1. Surandu Ambrosia prekes - per paieska pavadinime + per brand
let products=[];
for(let page=1; page<=5; page++){
  try{
    const r=JSON.parse(wc(`products?search=Ambrosia&per_page=50&page=${page}&_fields=id,name,status,categories`));
    if(!Array.isArray(r)||r.length===0) break;
    products=products.concat(r);
    if(r.length<50) break;
  }catch(e){ break; }
}
// dedup pagal id
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});

// 2. Kiekvienai prekei skaitau raw content per wp/v2 ir analizuoju sekcijas
function wpraw(id){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000}));
    return (r.content&&r.content.raw)||'';
  }catch(e){ return ''; }
}

function analyze(html){
  const h=html.toLowerCase();
  return {
    len: html.length,
    sudetis: /sudėtis|sudetis/.test(h),
    analitines: /analitin/.test(h),
    priedai: /priedai/.test(h),
    serimas: /šėrim|serim|paros norma|rekomenduojamas kiekis/.test(h),
    table: /<table/.test(h)
  };
}

const out={ts:TS, total:products.length, items:[]};
for(const p of products){
  const raw=wpraw(p.id);
  const a=analyze(raw);
  out.items.push({
    id:p.id, name:p.name.slice(0,60), status:p.status,
    len:a.len, sudetis:a.sudetis, analitines:a.analitines, priedai:a.priedai,
    serimas:a.serimas, lentele:a.table,
    truksta:[!a.sudetis?'Sudetis':null,!a.analitines?'Analitines':null,!a.serimas?'Serimas':null].filter(Boolean).join('+')||'-'
  });
  execSync('sleep 0.3');
}

putResult('ambrosia_'+TS+'.json', JSON.stringify(out,null,2));
console.log('total:'+products.length);
