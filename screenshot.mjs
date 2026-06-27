import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wcList(page){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Eukanuba&per_page=100&page=${page}&_fields=id,name,sku,status" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
let all=[];for(let p=1;p<=2;p++){const r=wcList(p);if(!r||!r.length)break;all=all.concat(r);if(r.length<100)break;}
execSync('rm -rf /tmp/p && mkdir -p /tmp/p',{env});
fs.writeFileSync('/tmp/ids.txt', all.map(d=>d.id).join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/p/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const MARK='\u0160\u0117rimo instrukcija';
const res=all.map(d=>{let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/p/'+d.id+'.json','utf8')).content||{}).raw||"";}catch(e){T="__FAIL__";}
  const iM=T.indexOf(MARK);
  const feedRegion=iM>-1?T.slice(iM,iM+1400):"";
  const digitG=/\d+\s*(?:&ndash;|\u2013|-)?\s*\d*\s*g/.test(feedRegion);
  const nbspSoup=(feedRegion.split("&nbsp;").length-1)>=8;
  const feedTable=feedRegion.indexOf("<table")>-1;
  // composition length
  const iS=T.search(/Sud\u0117tis/);let sudLen=0;if(iS>-1){const seg=T.slice(iS,iS+600).replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');sudLen=seg.length;}
  // analytical %
  const iA=T.indexOf("Analitin");const analPct=iA>-1?(T.slice(iA,iA+500).split("%").length-1):0;
  // priedai / additives
  const hasPriedai=T.indexOf("riedai")>-1||T.indexOf("Vitaminas")>-1;
  return {id:d.id,sku:d.sku,status:d.status,name:(d.name||"").slice(0,46),
    feedTable,feedNumbers:digitG,feedGarbled:nbspSoup,sudOK:sudLen>120,analPct,priedai:hasPriedai,
    fail:T==="__FAIL__"};});
commit("euk_deep_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE n="+res.length);
