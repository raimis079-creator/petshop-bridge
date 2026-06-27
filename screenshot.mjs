import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
const MARK='\u0160\u0117rimo instrukcija';
const IDS=[33822,33452,14794,14818,14817,14792,14771,14770,14769,14717,14476,14475,13019,12930,12928,12468,12467,12466,12458,12457,12456,12455,12454,12453,12452];
const out={summary:[]};
for(const id of IDS){const T=readRaw(id);if(T===null){out.summary.push({id,ERR:1});continue;}
  const iM=T.indexOf(MARK);
  const after=T.slice(iM+10);
  const secAfter={};
  for(const s of ['Sud\u0117tis','Analitin','Priedai','\u012esp\u0117jim','Energin','Vitamin']){const p=after.indexOf(s);secAfter[s]=p>-1?p:-1;}
  // is feeding last? = no major section after
  const anyAfter=Object.values(secAfter).some(v=>v>-1&&v<2500);
  // find the </p> that closes feeding region: first real </p> after the last 'g' near end
  out.summary.push({id, mark_pos:iM, total:T.length, tail_after_mark:T.length-iM, section_after:anyAfter, secAfter:Object.fromEntries(Object.entries(secAfter).filter(([k,v])=>v>-1&&v<3000))});
}
// full structure dump for 3
out.dumps={};
for(const id of [12452,12928,14794]){const T=readRaw(id);const iM=T.indexOf(MARK);const iStart=T.lastIndexOf("<p",iM);
  out.dumps[id]={before:T.slice(Math.max(0,iStart-90),iStart+4), block:T.slice(iStart, iM+1500).slice(0,1500)};}
commit("euk_struct_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
