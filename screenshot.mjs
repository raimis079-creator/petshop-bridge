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
// viena paieska "Josera" pakanka (JosiDog/JosiCat irgi turi "Josera" varda dazniausiai), + lygiagretus raw
let products=[];
for(let page=1;page<=3;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Jose&per_page=100&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    products=products.concat(r); if(r.length<100)break;
  }catch(e){break;}
}
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
// lygiagretus raw skaitymas
fs.writeFileSync('/tmp/jids.txt', products.map(p=>p.id).join('\n'));
const user=process.env.WP_USER, pass=env.WP_PASS_CLEAN;
execSync('mkdir -p /tmp/jp');
execSync(`cat /tmp/jids.txt | xargs -P 10 -I{} sh -c 'curl -sk --max-time 20 -u "${user}:${pass}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/jp/{}.json 2>/dev/null'`,{maxBuffer:200000000, timeout:300000});

function hasFeedTable(h){const tables=h.match(/<table[\s\S]*?<\/table>/gi)||[];for(const t of tables){const txt=t.replace(/<[^>]+>/g,' ');if(/\d+\s*kg/i.test(txt)&&/\d+\s*[-\u2013\u2014]?\s*\d*\s*g\b/i.test(txt))return true;}return false;}
const out={ts:TS, total:products.length, items:[]};
for(const p of products){
  let h=''; try{ h=(JSON.parse(fs.readFileSync('/tmp/jp/'+p.id+'.json','utf8')).content||{}).raw||''; }catch(e){}
  const l=h.toLowerCase();
  out.items.push({id:p.id, name:p.name.slice(0,50), len:h.length, empty:h.length<30,
    sud:/sud\u0117tis\s*:|sudedamosios\s+dalys/i.test(l), anal:/analitin|\u017eali\s+baltym/i.test(l),
    serW:/\u0161\u0117rim|maitinimo\s+norma|paros\s+norma/i.test(l), feedTable:hasFeedTable(h),
    broken:(h.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length});
}
out.summary={total:out.items.length, empty:out.items.filter(i=>i.empty).length,
  no_sud:out.items.filter(i=>!i.sud&&!i.empty).length, no_anal:out.items.filter(i=>!i.anal&&!i.empty).length,
  no_table:out.items.filter(i=>!i.feedTable&&!i.empty).length, broken:out.items.filter(i=>i.broken>0).length};
putResult('josscan2_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
