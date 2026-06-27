import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function front(id){for(let i=0;i<2;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h.html`,{encoding:'utf8',env,maxBuffer:80000000});return fs.readFileSync('/tmp/h.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const IDS=[18014,18112,18088,18046,18022,18018,18000,17995,17978];
const out=[];
for(const id of IDS){const T=readRaw(id);if(T===null){out.push({id,ERR:1});continue;}
  let iF=-1;for(const m of ["\u0160\u0117rim","&Scaron;\u0117rim"]){const i=T.indexOf(m);if(i>=0&&(iF<0||i<iF))iF=i;}
  out.push({id,nTab:T.split("<table").length-1,b2b:T.indexOf('class="b2b-black"')>-1,
    rekomLemma:T.indexOf("Rekomenduojamas kiekis")>-1, serimRekom:T.indexOf("\u0160\u0117rimo rekomendacij")>-1||T.indexOf("&Scaron;\u0117rimo rekomendacij")>-1,
    dump:iF>=0?T.slice(iF-20,iF+460):"NO"});}
// frontend accordion check on 2
for(const id of [18014,17995]){const H=front(id);const o=out.find(x=>x.id===id);if(H&&o){o.fe_accordion=(H.indexOf("ps-acc")>-1||H.indexOf("accordion")>-1);o.fe_serim=(H.indexOf("\u0160\u0117rim")>-1);o.fe_table=(H.indexOf("b2b-black")>-1);}}
commit("josdog_check_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
