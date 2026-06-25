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
function fmt2(rows){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Aktyvumas iki 1 val./d.</th><th>Aktyvumas iki 3 val./d.</th></tr>\n';rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td></tr>\n';});return t+'</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105 (pagal aktyvum\u0105). Pritaikykite pagal gyv\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
const jobs=[
 {recipe:"M/M Chicken & Rice", ids:[25233], ser:fmt2([[10,145,170],[20,245,285],[30,335,385],[40,415,480],[60,560,650],[80,695,805]]), newProbe:"<td>695 g</td>"},
 {recipe:"adult Lamb & Sweet Potato", ids:[20445,27019,25625], ser:fmt2([[5,85,100],[10,145,165],[20,240,280],[30,325,380],[40,405,470],[60,550,635],[80,680,790]]), newProbe:"<td>680 g</td>"},
 {recipe:"Mini Duck & Potato", ids:[26296,21045], ser:fmt2([[2,45,50],[4,70,85],[6,100,115],[8,120,140],[10,145,165]]), newProbe:"<td>145 g</td>"},
 {recipe:"Mini Salmon & Chicken", ids:[26901,25391], ser:fmt2([[2,40,50],[4,70,80],[6,95,110],[8,120,135],[10,140,160]]), newProbe:"<td>135 g</td>"}
];
const results=[];
for(const J of jobs){ for(const id of J.ids){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  const idx=T.lastIndexOf(MARK);
  if(idx<0){results.push({id,recipe:J.recipe,SKIP:"NO MARK \u2014 n\u0117ra k\u0105 keisti"});continue;}
  let cut=idx; if(T[idx-1]==='\n')cut=idx-1;
  const base=T.slice(0,cut), oldBlock=T.slice(idx);
  const hasSud=/Sud\u0117tis/.test(base), hasAnal=base.indexOf("Analitin")>-1, oldHasTable=/<table>/.test(oldBlock), oldWasFmt3=/Neaktyvus/.test(oldBlock);
  if(!hasSud||!hasAnal||!oldHasTable||!oldWasFmt3){results.push({id,recipe:J.recipe,SKIP:"guard-pre",hasSud,hasAnal,oldHasTable,oldWasFmt3});continue;}
  const newT=base+J.ser;
  const okSingle=(newT.split(MARK).length-1)===1, noOldHdr=!/Neaktyvus/.test(newT), hasNewHdr=/Aktyvumas iki 1 val\.\/d\./.test(newT), hasNewProbe=newT.indexOf(J.newProbe)>-1, analKept=(newT.indexOf("Analitin")>-1)===hasAnal, baseKept=newT.startsWith(base);
  if(!okSingle||!noOldHdr||!hasNewHdr||!hasNewProbe||!analKept||!baseKept){results.push({id,recipe:J.recipe,SKIP:"guard-post",okSingle,noOldHdr,hasNewHdr,hasNewProbe,analKept});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:J.recipe,write:wc,ver_newhdr:after!==null&&/Aktyvumas iki 1 val\.\/d\./.test(after),ver_no_old:after!==null&&!/Neaktyvus/.test(after),ver_probe:after!==null&&after.indexOf(J.newProbe)>-1,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_anal:after!==null?(after.indexOf("Analitin")>-1)===hasAnal:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,recipe:J.recipe,ERR:String(e).slice(0,120)});}}}
commit("refill1_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
