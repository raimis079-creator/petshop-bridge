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
function clean(s){
  s=s.replace(/<!--[\s\S]*?-->/g,' ');
  s=s.replace(/<[^>]+>/g,' ');                          // real tags FIRST (bounds still entities)
  s=s.replace(/&lt;\s*\/?[a-zA-Z][^&]*?&gt;/g,' ');     // encoded tags (letter/slash start only)
  s=s.replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&');
  s=s.replace(/&lt;\s*(?=\d)/g,'< ').replace(/&gt;\s*(?=\d)/g,'> ');  // bounds AFTER tag strip
  s=s.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  s=s.replace(/\s+/g,' ').trim();
  return s;
}
const ROW=/(<|>)?\s*(\d+(?:,\d+)?)\s*(?:[-\u2013]\s*(\d+(?:,\d+)?))?\s*kg\s+(\d+(?:,\d+)?)\s*(?:[-\u2013]\s*(\d+(?:,\d+)?))?\s*g\s*(\+)?/gi;
function wlabel(b,lo,hi){if(b==='<')return 'iki '+lo+' kg';if(b==='>')return 'vir\u0161 '+lo+' kg';if(hi)return lo+'\u2013'+hi+' kg';return lo+' kg';}
function glabel(lo,hi,plus){let s=hi?(lo+'\u2013'+hi+' g'):(lo+' g');if(plus)s+='+';return s;}
function parse(txt){const rows=[];let m;const re=new RegExp(ROW);let lastEnd=0,firstStart=-1;
  while((m=re.exec(txt))){if(firstStart<0)firstStart=m.index;rows.push({w:wlabel(m[1],m[2],m[3]),g:glabel(m[4],m[5],m[6])});lastEnd=re.lastIndex;}
  return {rows,firstStart,lastEnd};}
const out=IDS.map(id=>{let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){return {id,ERR:1};}
  const T=(o.content||{}).raw||"";const st=o.status;
  const m=T.match(HEAD);const pos=m?m.index:-1;
  const region=pos>-1?clean(T.slice(pos,pos+700)):'';
  const p=parse(region);
  let pre=region.slice(0,p.firstStart>-1?p.firstStart:0).replace(/^[^:]*:/,'').replace(/\u0160uns svoris|Dienos norma|Svoris\s*\(kg\)|Paros doz[\u0117e]\s*\(g\)|dienos norna|dienos norma/gi,'').trim();
  let post=region.slice(p.lastEnd).replace(/^[\s.+]+/,'').trim();
  const note=[pre,post].filter(x=>x&&x.length>8).join(' ');
  return {id,status:st,rows:p.rows,n:p.rows.length,note:note.slice(0,140)};
});
commit("ont_A_dry3_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
