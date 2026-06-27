import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r_${id}.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r_'+id+'.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 2');}return null;}
const PAIR=/(\d+)\s*kg\s*[-\u2013:* ]{0,4}\d+\s*[-\u2013]?\s*\d*\s*g/i;
const IDS=[18554,18557,18563,18566,18569,18575,18578,18581];
const out={};
for(const id of IDS){const T=readRaw(id);if(T===null){out[id]={ERR:1};continue;}
  const m=T.match(PAIR);const pos=m?m.index:-1;
  // headings list
  const heads=[];const hre=/<(?:strong|h[1-6])[^>]*>([^<]{3,55})<\/(?:strong|h[1-6])>/gi;let h;while((h=hre.exec(T))){heads.push(h[1].trim());}
  out[id]={total:T.length, pair_pos:pos, is_last_third: pos>-1?(pos>T.length*0.6):null,
    ctx_before: pos>-1?T.slice(Math.max(0,pos-220),pos):'',
    ctx_pairs: pos>-1?T.slice(pos,pos+360):'',
    tail_after: pos>-1?T.length-pos:null,
    heads:heads.slice(0,14)};
}
commit("excl_prose_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
