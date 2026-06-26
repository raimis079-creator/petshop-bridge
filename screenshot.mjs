import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function read(id){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,title,content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const j=JSON.parse(fs.readFileSync('/tmp/r.json','utf8'));return {t:((j.content||{}).raw||''),title:((j.title||{}).raw||(j.title||{}).rendered||'')};}catch(e){execSync('sleep 2');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const MK=["\u0160\u0117rim","&Scaron;\u0117rim","Rekomenduoj","skardin","Dienos norma","per par\u0105","per dien","Kiekis"];
const IDS=[21860,21858,21856,21854,21838,21836,21834,21832,21830,21828,21677,21671,21335,21333,21331,21329,21327,21325,20504,20437,20435,20432,20429,20427,20424,20421,20418,20416,20413,20410,18071,18068];
const out=[];
for(const id of IDS){const r=read(id);if(r===null){out.push({id,ERR:1});continue;}
  const T=r.t;let iF=-1,which=null;for(const m of MK){const i=T.indexOf(m);if(i>=0&&(iF<0||i<iF)){iF=i;which=m;}}
  out.push({id,title:r.title.slice(0,46),sud:T.indexOf("Sud\u0117tis")>-1,anal:T.indexOf("Analitin")>-1,nMark:T.split(MARK).length-1,nTab:T.split("<table").length-1,marker:which,
    sdump:iF>=0?T.slice(iF,iF+200):"NONE"});
}
commit("catwet_map_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE "+out.length);
