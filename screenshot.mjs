import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[17216,17213,17138,17751,17748,17299,17296,17293,17286,17283,17280,17268,17265,17262,17188,17182,17179,17176,17170,17159,17156,17153,17150,17060,17057,17051,17048,17041,16945,16942,16939,16936,16933,16329,16326,16259,16254,16234,16210,16207,16198,18363,18360,18357,18351,18348,17802,17799,17740,17738,17272,17210,17191,17185,17173,17165,17144,17141,17135,16257,16231,16222,16204];
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const HEAD=/(\u0160\u0117rim[a-z]*\s+(?:rekomendacij[a-z]*|instrukcij[a-z]*|norm[a-z]*)|[Rr]ekomenduojama[a-z]*\s+(?:paros|\u0161\u0117rim|kiekis)[a-z ]*)/;
function clean(s){return s.replace(/<!--[\s\S]*?-->/g,' ').replace(/&lt;[^&]*?&gt;/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
function analyze(id){let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return {id,read:0};}
  const m=T.match(HEAD);const pos=m?m.index:-1;
  let region= pos>-1?clean(T.slice(pos, pos+1100)):'';
  const hasTbl= pos>-1? /<table/i.test(T.slice(pos,pos+1100)) : false;
  const grams=(region.match(/\d+\s*[\u2013-]?\s*\d*\s*g\b/gi)||[]).length;
  const kgs=(region.match(/\d+\s*kg/gi)||[]).length;
  const ref=/ant\s+pakuot|\u017er\.?\s*ant|nurodyt[ao]s?\s+ant/i.test(region);
  return {id,read:1,hasTbl,grams,kgs,ref,head:m?m[0]:'',snip:region.slice(0,170)};
}
const rows=IDS.map(analyze);
function cls(r){if(!r.read)return 'ERR';if(r.hasTbl)return 'HAS_TABLE';if(r.ref&&r.grams<2)return 'REF_ONLY';if(r.grams>=2)return 'HAS_NUMBERS';if(r.grams===1)return 'ONE_NUM';return 'NO_NUM';}
rows.forEach(r=>r.cls=cls(r));
const b={};rows.forEach(r=>b[r.cls]=(b[r.cls]||0)+1);
commit("ont_recon_"+Date.now()+".json", JSON.stringify({buckets:b,rows},null,1));
console.log("DONE");
