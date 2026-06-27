import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
// B1 dog matrix + B2 cat matrix (need full number sequences)
const MATRIX=[17299,17296,17293,17286,17283,17280,17268,17265,17262,17272,16234,16210,16207,16204,16222];
// B3 age-based with real <td> — capture RAW table
const AGE=[17216,17213,17210];
const ALL=[...MATRIX,...AGE];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt', ALL.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm))/i;
function clean(s){s=s.replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&lt;\s*\/?[a-zA-Z][^&]*?&gt;/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();return s;}
function region(T){let p=T.search(HEAD);if(p<0)return {full:'(no heading)'};let r=T.slice(p,p+2200);for(const st of ['Sud\u0117tis','Analitin','Energin','\u012esp\u0117jim','Priedai','Maistingos']){const si=r.indexOf(st);if(si>60)r=r.slice(0,si);}return {full:clean(r)};}
const out=ALL.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";const isAge=AGE.includes(id);
  const r=region(T);
  let raw='';
  if(isAge){const p=T.search(HEAD);raw=p>-1?T.slice(p,p+1400):'';}
  return {id,status:o.status,isAge,full:r.full,raw};
});
commit("ont_B_full_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
