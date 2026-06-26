import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const SAMP=[[17986,"SensiCat 10kg"],[18077,"Kitten 10kg"],[18101,"Culinesse 10kg"],[18084,"Indoor 10kg"],[17992,"Senior 10kg"]];
const out={};
for(const [id,nm] of SAMP){const T=readRaw(id);if(T===null){out[id]={nm,ERR:1};continue;}
  const markers=["Rekomenduojamas","\u0160\u0117rim","Kiekis","per par\u0105","per dien","Rekomenduojam"];
  let iF=-1,which=null;for(const m of markers){const i=T.indexOf(m);if(i>=0&&(iF<0||i<iF)){iF=i;which=m;}}
  out[id]={nm,len:T.length,rekom:T.indexOf("Rekomenduojamas")>-1,sudetis:T.indexOf("Sud\u0117tis")>-1,analit:T.indexOf("Analitin")>-1,nMark:T.split(MARK).length-1,nTable:T.split("<table").length-1,firstMarker:which,
    dump:iF>=0?T.slice(Math.max(0,iF-90),iF+1100):"NO_FEEDING_MARKER"};
}
commit("catdry_struct_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
