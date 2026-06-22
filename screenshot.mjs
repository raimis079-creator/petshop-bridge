import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782120841";
const out={};
// DRY endpoint (token gate, be auth)
try{
  const html=execSync(`curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_higiena=dry&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
  const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
  out.dry=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:'no match';
  // istraukti PARSED eilutes (ID + Tipas) - po PARSED klase
  const rows=[...html.matchAll(/<td>(\d+)<\/td><td>([^<]*)<\/td><td class="p">PARSED<\/td><td>([^<]*)<\/td>/g)].slice(0,40).map(r=>r[1]+' | '+r[2].slice(0,30)+' => '+r[3]);
  out.parsed_rows=rows;
  out.parsed_ids=[...html.matchAll(/<td>(\d+)<\/td><td>[^<]*<\/td><td class="p">PARSED/g)].map(r=>+r[1]);
}catch(e){ out.dry='ERR '+String(e).slice(0,80); }
// ar APPLY jau ivyko? - tikrinti pa_tipas pirmom 5 PARSED prekem
try{
  const ids=(out.parsed_ids||[]).slice(0,5);
  const chk=[];
  for(const id of ids){ try{ const d=JSON.parse(execSync(`curl -sk --max-time 15 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${id}?_fields=id,attributes"`,{encoding:'utf8',env})); const t=(d.attributes||[]).find(a=>a.name==='Tipas'||a.slug==='pa_tipas'); chk.push(id+': '+(t&&t.options?t.options.join(','):'<NONE>')); }catch(e){ chk.push(id+': ERR'); } }
  out.applied_check=chk;
}catch(e){ out.applied_check='ERR'; }
out.fin=putResult('hdry_'+TS+'.txt', out);
