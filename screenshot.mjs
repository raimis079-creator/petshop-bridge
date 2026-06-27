import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
function clean(s){return s.replace(/&nbsp;/g,' ').replace(/&ndash;/g,'\u2013').replace(/&gt;/g,'>').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();}
function nbspCells(pHtml){return pHtml.split(/(?:&nbsp;\s*){2,}/).map(x=>clean(x)).filter(x=>x!=='');}
const out={};
for(const id of [18088,18022]){const T=readRaw(id);if(T===null){out[id]={ERR:1};continue;}
  const iH=T.indexOf("\u0160\u0117rimo rekomendacij");
  // section = from heading to next <h4 or <table or end, cap 3000
  let end=T.length;for(const stop of ["<h4","<table","Analitin","Sud\u0117tis"]){const j=T.indexOf(stop,iH+30);if(j>=0&&j<end)end=j;}
  const sect=T.slice(iH,Math.min(end,iH+3000));
  // split into <p> blocks
  const ps=[];let parts=sect.split(/<p[^>]*>/);for(let i=1;i<parts.length;i++){const inner=parts[i].split("</p>")[0];ps.push(inner);}
  const rows=ps.map(p=>nbspCells(p)).filter(r=>r.length>0);
  out[id]={nP:ps.length,rows};
}
commit("garbled_parse_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
