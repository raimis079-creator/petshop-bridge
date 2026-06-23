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

// FILTRAS: tik TIKRA Josera/Josi/JosiDog/JosiCat (pavadinime), NE Ambrosia/Trixie/skanestai
products=products.filter(p=>{
  const n=p.name.toLowerCase();
  if(/ambrosia|trixie|biovet/i.test(n)) return false; // svetimi brendai
  if(!/josera|josi|josidog|josicat/i.test(n)) return false; // tik josera seima
  // atmetu skanestus (kojos, trachejos, sausgysles)
  if(/koj|trach|sausgysl|ausis|kramt|skanest|snack/i.test(n)) return false;
  return true;
});

// klasifikuoju: sausas vs konservai
function isKonservai(n){return /konserv|pat[eé]|filet|meat lovers|85\s*g|400\s*g\b|pure/i.test(n.toLowerCase());}

fs.writeFileSync('/tmp/jcids.txt', products.map(p=>p.id).join('\n'));
const user=process.env.WP_USER, pass=env.WP_PASS_CLEAN;
execSync('mkdir -p /tmp/jc');
execSync(`cat /tmp/jcids.txt | xargs -P 10 -I{} sh -c 'curl -sk --max-time 20 -u "${user}:${pass}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/jc/{}.json 2>/dev/null'`,{maxBuffer:200000000, timeout:300000});

function hasFeedTable(h){const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];for(const t of tables){const txt=t.replace(/<[^>]+>/g,' ');if(/\d+\s*kg/i.test(txt)&&/\d+\s*[-\u2013\u2014]?\s*\d*\s*g\b/i.test(txt))return true;}return false;}

const out={ts:TS, items:[]};
for(const p of products){
  let h=''; try{ h=(JSON.parse(fs.readFileSync('/tmp/jc/'+p.id+'.json','utf8')).content||{}).raw||''; }catch(e){}
  const kons=isKonservai(p.name);
  out.items.push({id:p.id, name:p.name.slice(0,55), kons, feedTable:hasFeedTable(h), empty:h.length<30});
}
const sausas=out.items.filter(i=>!i.kons);
const kons=out.items.filter(i=>i.kons);
out.summary={
  total_josera:out.items.length,
  sausas_total:sausas.length,
  sausas_su_lentele:sausas.filter(i=>i.feedTable).length,
  sausas_BE_lenteles:sausas.filter(i=>!i.feedTable&&!i.empty).length,
  konservai:kons.length
};
out.sausas_be_lenteles_ids=sausas.filter(i=>!i.feedTable&&!i.empty).map(i=>({id:i.id,name:i.name}));
putResult('josclean_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
