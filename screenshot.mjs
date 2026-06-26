import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function read(id){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,title,content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const j=JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));return {t:((j.content||{}).raw||''),title:((j.title||{}).raw||(j.title||{}).rendered||'')};}catch(e){execSync('sleep 2');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
function classify(s){s=s.toLowerCase();
 if(/sensicat/.test(s))return"SensiCat";
 if(/kitten/.test(s)&&/(grainfree|begr\u016bd)/.test(s))return"KittenGrainfree";
 if(/kitten|ka\u010diukam/.test(s))return"Kitten";
 if(/culinesse/.test(s))return"Culinesse";
 if(/marinesse/.test(s))return"Marinesse";
 if(/naturecat/.test(s))return"NatureCat";
 if(/naturelle/.test(s))return"Naturelle";
 if(/indoor/.test(s))return"Indoor";
 if(/dailycat/.test(s))return"DailyCat";
 if(/catelux/.test(s))return"Catelux";
 if(/leger/.test(s))return"Leger";
 if(/senior|pagyvenu/.test(s))return"Senior";
 return"?";}
const IDS=[27134,27132,26918,26917,26916,26915,26914,26913,26912,26381,21846,21840,21789,21785,21766,21762,21757,21752,21744,21740,21735,21728,21707,18109,18106,18101,18098,18095,18092,18084,18080,18077,18074,18065,18062,18058,18054,18051,18043,18040,18011,18010,18007,18004,17992,17989,17986,17983];
const out=[];
for(const id of IDS){const r=read(id);if(r===null){out.push({id,ERR:1});continue;}
  const T=r.t;const line=classify(r.title+" "+T.slice(0,400));
  const iS=T.indexOf("\u0160\u0117rimo rekomendacij");
  out.push({id,title:r.title.slice(0,52),line,
    sud:T.indexOf("Sud\u0117tis")>-1,anal:T.indexOf("Analitin")>-1,nMark:T.split(MARK).length-1,
    serimo:iS>=0,sdump:iS>=0?T.slice(iS,iS+280):"NO_SERIMO_REKOM"});
}
commit("catdry_map48_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE "+out.length);
