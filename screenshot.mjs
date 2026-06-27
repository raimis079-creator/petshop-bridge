import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[33822,33452,14794,14818,14817,14792,14771,14770,14769,14717,14476,14475,13019,12930,12928,12468,12467,12466,12458,12457,12456,12455,12454,12453,12452];
execSync('rm -rf /tmp/p && mkdir -p /tmp/p',{env});
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/p/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const MARK='\u0160\u0117rimo instrukcija';
function clean(s){s=s.replace(/<!--[\s\S]*?-->/g,' ').replace(/&lt;[^&]*?&gt;/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();return s;}
const RE='(\\d+)\\s*kg\\s*[-\u2013:*]*\\s*(\\d+)\\s*(?:[\u2013-]\\s*(\\d+))?\\s*g';
function pairs(text){const re=new RegExp(RE,'gi');const out=[];let m;while((m=re.exec(text))){out.push({w:+m[1],lo:+m[2],hi:m[3]?+m[3]:null});}return out;}
function lastEnd(text){const re=new RegExp(RE,'gi');let last=0,m;while((m=re.exec(text))){last=re.lastIndex;}return last;}
function g(p){return p.hi?(p.lo+'\u2013'+p.hi+' g'):(p.lo+' g');}
const res=IDS.map(id=>{let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return {id,FAIL:1};}
  const iM=T.indexOf(MARK);if(iM<0)return {id,NO_MARK:1};
  let region=T.slice(iM, iM+1700);
  for(const stop of ['Sud\u0117tis','Analitin','Energin','\u012esp\u0117jim']){const si=region.indexOf(stop);if(si>40)region=region.slice(0,si);}
  const txt=clean(region);
  const dbl = /ma\u017einimui/i.test(txt) && /palaikymui/i.test(txt);
  let parsed, note='';
  if(dbl){
    const iMaz=txt.search(/ma\u017einimui/i), iPal=txt.search(/palaikymui/i);
    const mz=pairs(txt.slice(iMaz,iPal)), pl=pairs(txt.slice(iPal));
    const byW={};mz.forEach(p=>byW[p.w]={m:g(p)});pl.forEach(p=>{byW[p.w]=byW[p.w]||{};byW[p.w].p=g(p);});
    parsed={regime:'DOUBLE',rows:Object.keys(byW).map(Number).sort((a,b)=>a-b).map(w=>({w,maz:byW[w].m||'?',pal:byW[w].p||'?'}))};
    note=txt.slice(iPal+lastEnd(txt.slice(iPal))).replace(/^[\s.,*]+/,'').trim();
  } else {
    const ps=pairs(txt);parsed={regime:'SINGLE',rows:ps.map(p=>({w:p.w,val:g(p)}))};
    note=txt.slice(lastEnd(txt)).replace(/^[\s.,*]+/,'').trim();
  }
  const flag = parsed.rows.length<2 || (parsed.regime==='DOUBLE'&&parsed.rows.some(r=>r.maz==='?'||r.pal==='?'));
  return {id,regime:parsed.regime,n:parsed.rows.length,rows:parsed.rows,note:note.slice(0,80),FLAG:flag};
});
commit("euk_dry2_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE");
