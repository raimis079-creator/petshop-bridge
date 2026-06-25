import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const W=["5 kg","10 kg","20 kg","30 kg","40 kg"];
function buildJrWet(rows){let t='\n'+MARK+'\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';W.forEach(w=>{t+='<th>'+w+'</th>';});t+='</tr>\n';rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.v.map(x=>'<td>'+x+' g</td>').join('')+'</tr>\n';});t+='</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Pa\u0161aras pilnavertis augantiems \u0161unims (nuo 6 sav.). Augan\u010diam \u0161uniui svarbus saikingas energijos kiekis \u2014 jei \u0161uo per sunkus pagal am\u017ei\u0173, kiek\u012f suma\u017einkite. Atidar\u0119 laikykite \u0161aldytuve (2\u20136 \u00b0C) ir su\u0161erkite per 24 val. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';return t;}
const ser=buildJrWet([
 {age:"1\u20132",v:["230\u2013290","355\u2013445","550\u2013645","715\u2013840","885\u20131040"]},
 {age:"3\u20134",v:["300\u2013375","485\u2013615","775\u20131005","1015\u20131325","1260\u20131645"]},
 {age:"5\u201312",v:["330\u2013370","550\u2013635","920\u20131075","1225\u20131480","1525\u20131840"]}
]);
const results=[];
for(const id of [21659]){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  if(T.indexOf(MARK)>-1){results.push({id,SKIP:"MARK exists"});continue;}
  const hasAnal=T.indexOf("Analitin")>-1, hasSud=/Sud\u0117tis/.test(T);
  if(!hasAnal&&!hasSud){results.push({id,SKIP:"no Sud/Anal"});continue;}
  const newT=T+ser;
  const probe='<td>230\u2013290 g</td>';
  const okStart=newT.startsWith(T), okSingle=(newT.split(MARK).length-1)===1, analKept=(newT.indexOf("Analitin")>-1)===hasAnal, hasProbe=newT.indexOf(probe)>-1;
  if(!okStart||!okSingle||!analKept||!hasProbe){results.push({id,SKIP:"guard",okStart,okSingle,analKept,hasProbe});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:"Junior Pure Beef",write:wc,ver_mark:after!==null&&after.indexOf(MARK)>-1,ver_probe:after!==null&&after.indexOf(probe)>-1,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_anal:after!==null?(after.indexOf("Analitin")>-1)===hasAnal:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,100)});}}
commit("konswet2_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
