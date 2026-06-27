import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[17299,17296,17293,17286,17283,17280,17268,17265,17262,17272,17210,17216,17213,16259,16254,16234,16210,16207,16198,16257,16231,16222,16204];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/(\u0160\u0117rim(?:o|as)\s+(?:rekomendacij|instrukcij|norm)|Rekomenduojama\s+paros\s+doz|Rekomenduojamas\s+kiekis)/i;
function clean(s){s=s.replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&lt;\s*\/?[a-zA-Z][^&]*?&gt;/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();return s;}
const out=IDS.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";const st=o.status;
  const m=T.match(HEAD);const pos=m?m.index:-1;
  const region=pos>-1?clean(T.slice(pos,pos+900)):'(no heading)';
  // count kg & g tokens to hint format
  const kgN=(region.match(/\d+(?:,\d+)?\s*kg/gi)||[]).length;
  const gN=(region.match(/\d+(?:,\d+)?\s*g(?![a-z\u012f-\u017e])/gi)||[]).length;
  return {id,status:st,kgN,gN,region:region.slice(0,420)};
});
commit("ont_B_recon_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
