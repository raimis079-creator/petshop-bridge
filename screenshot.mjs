import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";

const FARMINA=[
  14535, 33239,14532, 33235,14528,14530, 14534,
  33243,14537, 14540,14539, 14543, 14544, 14715, 14545, 14542, 14541,
  14524,14525, 14526,
  14517,14516,33231, 14521,14520,14519, 14523,14522, 14515,
  14504, 14503, 14505,14506,14507, 14508,14509, 14510,14511,14512, 14513,14514,
  14552,14550, 14551, 14549,14548, 14560,14561, 14559,14558,
  14556, 14554, 14553, 14547,14546,
  33229, 14498, 14502, 14501, 14497, 14500,
  33253, 14578, 14577, 14581, 14580, 14579,
  33249, 33251, 14564,14565, 14566,14567, 14568,14569, 14570,14571,
  14572,14573, 14574,14575,
  14496
];

fs.writeFileSync('/tmp/ids.txt',FARMINA.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 12 -I{} curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/wp/v2/product/{}?context=edit&_fields=id,content,excerpt,status,title,modified_gmt" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const results=[];
for(const id of FARMINA){
  let j={};try{j=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){results.push({id,err:'read'});continue;}
  const raw=(j.content&&j.content.raw)||"";
  const exc=(j.excerpt&&j.excerpt.raw)||"";
  const g={
    noEncP:!/&lt;p&gt;|&lt;\/p&gt;|&lt;strong&gt;/.test(raw),
    noDoubleEnt:!/&amp;amp;|&amp;nbsp;/.test(raw),
    hasSerimo:/Šėrimo instrukcija/.test(raw),
    oneTable:(raw.match(/<table/g)||[]).length===1,
    hasB2bDiv:(raw.match(/<div class="b2b-black">/g)||[]).length===1,
    hasHeader:raw.includes('Šuns svoris')||raw.includes('Amžius'),
    introMin:raw.length>=2000,
    pakuoteAbsent:!/Pakuotės dydis.*cm/.test(raw),
    excerptDecoded:!/&lt;p&gt;|&amp;amp;/.test(exc) || exc.length===0
  };
  const pass=Object.values(g).every(Boolean);
  const bad=Object.entries(g).filter(([k,v])=>!v).map(([k])=>k);
  results.push({id,status:j.status,modified:j.modified_gmt,title:(j.title&&j.title.rendered||'').slice(0,60),len:raw.length,bad,pass});
}

const passed=results.filter(r=>r.pass).length;
const fails=results.filter(r=>!r.pass);
commit("farmina_health2_"+Date.now()+".json",JSON.stringify({total:results.length,passed,fails,sample_modified:results.slice(0,5).map(r=>({id:r.id,mod:r.modified}))},null,1));
console.log("HEALTH2 DONE",passed+"/"+results.length);
