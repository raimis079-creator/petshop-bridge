import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[17138,17188,17179,17176,17159,17156,17173,17144,17141,17135,17191,17185,17182,17170,17153,17165,17150];
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/\u0160\u0117rimo\s+(?:rekomendacij|instrukcij)/i;
function clean(s){return s.replace(/<!--[\s\S]*?-->/g,' ').replace(/&lt;[^&]*?&gt;/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
// row: weight-range kg + gram-range g
const ROW=/(\d+)\s*[-\u2013]\s*(\d+)\s*kg\s+(\d+)\s*[-\u2013]\s*(\d+)\s*g/gi;
const ROW1=/(\d+)\s*kg\s+(?:ir\s+daugiau\s+)?(\d+)\s*[-\u2013]?\s*(\d+)?\s*g/gi;
function parse(txt){const rows=[];let m;const re=new RegExp(ROW);while((m=re.exec(txt))){rows.push({w:m[1]+'\u2013'+m[2]+' kg',g:m[3]+'\u2013'+m[4]+' g'});}return rows;}
const out=IDS.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";const st=o.status;
  const m=T.match(HEAD);const pos=m?m.index:-1;
  const region=pos>-1?clean(T.slice(pos,pos+700)):'';
  const rows=parse(region);
  return {id,status:st,region:region.slice(0,360),rows,n:rows.length};
});
commit("ont_A_dry_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
