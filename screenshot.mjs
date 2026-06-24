import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
const ids=[18112,18109,18106,18101,18098,18095,18092,18088,18077,18074,18065,18062,21707,18046,18043,18040,18036,18032,18029,18026,18022,18018,18014,18011,18000,17995,17992,17986,17983,17978];

// pilnas parsavimas viso turinio
function parse(h){
  const z=h.replace(/&nbsp;/g,' ').replace(/&ndash;/g,'\u2013');
  // visi <p> blokai su pozicijomis
  const pRe=/<p[^>]*>([\s\S]*?)<\/p>/g; let m;
  const ps=[];
  while((m=pRe.exec(z))!==null){ ps.push({inner:m[1], start:m.index, end:m.index+m[0].length}); }
  // klasifikuojam kiekviena <p>
  let hasRange=false, hasAge=false, hasPreg=false;
  const rowsIdx=[];
  ps.forEach((p,i)=>{
    if(/Kal\u0117s|N\u0117\u0161tum/i.test(p.inner)) hasPreg=true;
    if(/Am\u017eius|m\u0117nesiais|kg k\u016bno|k\u016bno svorio/i.test(p.inner)) hasAge=true;
    if(/\d+\s*\u2013\s*\d+\s*kg/i.test(p.inner)) hasRange=true;
    const wt=p.inner.match(/(\d+)\s*kg/i);
    const isRange=/\d+\s*\u2013\s*\d+\s*kg/i.test(p.inner);
    const grams=[...p.inner.matchAll(/(\d+)\s*g\b/gi)].map(x=>+x[1]);
    if(wt && !isRange && grams.length===3){ rowsIdx.push(i); }
  });
  if(hasPreg) return {cls:"SPECIAL_pregnancy"};
  if(hasAge) return {cls:"SPECIAL_age"};
  if(hasRange) return {cls:"SPECIAL_range"};
  if(rowsIdx.length<4) return {cls:"FEW_ROWS", n:rowsIdx.length};
  // tikrinam ar eilutes gretimos (consecutive indeksai)
  let consecutive=true;
  for(let k=1;k<rowsIdx.length;k++){ if(rowsIdx[k]!==rowsIdx[k-1]+1){consecutive=false;break;} }
  const rows=rowsIdx.map(i=>{
    const inner=ps[i].inner;
    const wt=+inner.match(/(\d+)\s*kg/i)[1];
    const g=[...inner.matchAll(/(\d+)\s*g\b/gi)].map(x=>+x[1]);
    return [wt,g[0],g[1],g[2]];
  });
  // header <p> pries pirma eilute?
  const firstRow=rowsIdx[0];
  const hdr = firstRow>0 && /Svoris|neaktyvus|aktyvus/i.test(ps[firstRow-1].inner) && !/\d+\s*kg/.test(ps[firstRow-1].inner);
  return {cls:"STD_DOG", rows, consecutive, hasHeader:hdr,
    spanStart: hdr? ps[firstRow-1].start : ps[firstRow].start,
    spanEnd: ps[rowsIdx[rowsIdx.length-1]].end };
}
const out=[];
fs.mkdirSync('/tmp/p',{recursive:true});
fs.writeFileSync('/tmp/ids.txt', ids.join("\n"));
const U=process.env.WP_USER,P=env.WP_PASS_CLEAN;
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I {} curl -sk --max-time 30 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/p/{}.json`,{encoding:'utf8',maxBuffer:200000000,timeout:200000});}catch(e){}
for(const id of ids){
  let h="";try{h=(JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){}
  if(!h){out.push({id,cls:"ERR"});continue;}
  const r=parse(h);
  out.push({id, cls:r.cls, n:r.rows?r.rows.length:(r.n||0), consecutive:r.consecutive, hasHeader:r.hasHeader,
    rows:r.rows? r.rows.map(x=>x[0]+":"+x[1]+"/"+x[2]+"/"+x[3]).join(" ") : undefined});
}
commit("dryconv2_"+TS+".json", JSON.stringify(out,null,1));
console.log("DONE "+TS);
