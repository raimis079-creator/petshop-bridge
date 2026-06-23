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
let products=[];
for(let page=1;page<=3;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Jose&per_page=100&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    products=products.concat(r); if(r.length<100)break;
  }catch(e){break;}
}
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
products=products.filter(p=>{
  const n=p.name.toLowerCase();
  if(/ambrosia|trixie|biovet/i.test(n)) return false;
  if(!/josera|josi|josidog|josicat/i.test(n)) return false;
  if(/koj|trach|sausgysl|ausis|kramt/i.test(n)) return false;
  return true;
});
fs.writeFileSync('/tmp/jfids.txt', products.map(p=>p.id).join('\n'));
const user=process.env.WP_USER, pass=env.WP_PASS_CLEAN;
execSync('mkdir -p /tmp/jf');
execSync(`cat /tmp/jfids.txt | xargs -P 10 -I{} sh -c 'curl -sk --max-time 20 -u "${user}:${pass}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/jf/{}.json 2>/dev/null'`,{maxBuffer:200000000, timeout:300000});

function hasFeedTable(h){const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];for(const t of tables){const txt=t.replace(/<[^>]+>/g,' ');if(/\d+\s*kg/i.test(txt)&&/\d+\s*[-\u2013\u2014]?\s*\d*\s*g\b/i.test(txt))return true;}return false;}
// Sudetis: zymeklis ARBA ingredientu sarasas
function hasSudetis(h){return /sud\u0117tis\s*:|sudedamosios\s+dalys|sudedam/i.test(h);}
// Analitines: garantuota analize - "Zali baltymai X%" arba "baltymai X %" su procentais
function hasAnalitines(h){
  const l=h.toLowerCase();
  // tikra analize - baltymai + procentai
  return /(\u017eali\s+baltym|\u017ealias?\s+baltym|analitin)/i.test(l) && /\d+[\.,]?\d*\s*%/.test(h);
}
function isKonservai(n){return /konserv|pat[eé]|filet|meat lovers|85\s*g|pure beef/i.test(n.toLowerCase());}

const out={ts:TS, items:[]};
for(const p of products){
  let h=''; try{ h=(JSON.parse(fs.readFileSync('/tmp/jf/'+p.id+'.json','utf8')).content||{}).raw||''; }catch(e){}
  out.items.push({
    id:p.id, name:p.name.slice(0,52), len:h.length, empty:h.length<30,
    kons:isKonservai(p.name),
    sud:hasSudetis(h), anal:hasAnalitines(h), table:hasFeedTable(h)
  });
}
const sausas=out.items.filter(i=>!i.kons&&!i.empty);
out.summary={
  sausas_total:sausas.length,
  no_sudetis:sausas.filter(i=>!i.sud).length,
  no_analitines:sausas.filter(i=>!i.anal).length,
  no_feed_table:sausas.filter(i=>!i.table).length,
  // prekes kurioms truksta KELIU dalyku
  no_sud_AND_anal:sausas.filter(i=>!i.sud&&!i.anal).length,
  pilnai_truksta:sausas.filter(i=>!i.sud&&!i.anal&&!i.table).length
};
// detalus problematisku sarasas
out.problems=sausas.filter(i=>!i.sud||!i.anal||!i.table).map(i=>({
  id:i.id, name:i.name,
  truksta:[!i.sud?'Sudetis':null,!i.anal?'Analitines':null,!i.table?'Serimas':null].filter(Boolean).join('+')
}));
putResult('josfull_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
