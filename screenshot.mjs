import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const id=20455;
const T=readRaw(id);
const rep={id, len:T.length, n_mark:(T.split(MARK).length-1), n_table:(T.split("<table").length-1),
  i_kiekis24:T.indexOf("Kiekis / 24"), i_atkreipkite:T.indexOf("Atkreipkite"), i_svarbu:T.indexOf("SVARBU"),
  i_nurodyti:T.indexOf("Nurodyti kiekiai"), i_sunsvoris:T.indexOf("\u0160UNS SVORIS"), i_sunssvoris2:T.indexOf("\u0160uns svoris"),
  i_svoris_th:T.indexOf("Svoris"), i_b2bblack:T.indexOf("b2b-black"), i_serimo_h:T.indexOf("\u0160\u0117rimo instrukcij"), i_mark:T.lastIndexOf(MARK)};
// dump tail from earliest feeding marker
const cands=[rep.i_kiekis24,rep.i_atkreipkite,rep.i_svoris_th,rep.i_b2bblack,rep.i_serimo_h].filter(x=>x>=0);
const start=Math.max(0, Math.min(...cands)-150);
rep.tail=T.slice(start);
commit("recon20455_"+Date.now()+".json", JSON.stringify(rep,null,1));
console.log("DONE");
