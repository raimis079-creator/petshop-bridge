import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}

// parsinu TIESIAI h (pozicijos h koordinatese)
function parse(h){
  const pRe=/<p[^>]*>([\s\S]*?)<\/p>/g; let m; const ps=[];
  while((m=pRe.exec(h))!==null){ ps.push({raw:m[1], clean:m[1].replace(/&nbsp;/g,' ').replace(/&ndash;/g,'\u2013'), start:m.index, end:m.index+m[0].length}); }
  let hasRange=false,hasAge=false,hasPreg=false; const rowsIdx=[];
  ps.forEach((p,i)=>{
    if(/Kal\u0117s|N\u0117\u0161tum/i.test(p.clean)) hasPreg=true;
    if(/Am\u017eius|m\u0117nesiais|kg k\u016bno|k\u016bno svorio/i.test(p.clean)) hasAge=true;
    if(/\d+\s*\u2013\s*\d+\s*kg/i.test(p.clean)) hasRange=true;
    const wt=p.clean.match(/(\d+)\s*kg/i); const isRange=/\d+\s*\u2013\s*\d+\s*kg/i.test(p.clean);
    const grams=[...p.clean.matchAll(/(\d+)\s*g\b/gi)].map(x=>+x[1]);
    if(wt&&!isRange&&grams.length===3) rowsIdx.push(i);
  });
  if(hasPreg||hasAge||hasRange) return {cls:"SPECIAL"};
  if(rowsIdx.length<4) return {cls:"FEW"};
  for(let k=1;k<rowsIdx.length;k++) if(rowsIdx[k]!==rowsIdx[k-1]+1) return {cls:"NONCONSEC"};
  const rows=rowsIdx.map(i=>{const c=ps[i].clean;const w=+c.match(/(\d+)\s*kg/i)[1];const g=[...c.matchAll(/(\d+)\s*g\b/gi)].map(x=>+x[1]);return [w,g[0],g[1],g[2]];});
  const fr=rowsIdx[0];
  const hdr = fr>0 && /Svoris|neaktyvus|aktyvus/i.test(ps[fr-1].clean) && !/\d+\s*kg/.test(ps[fr-1].clean);
  return {cls:"STD_DOG", rows, spanStart: hdr?ps[fr-1].start:ps[fr].start, spanEnd: ps[rowsIdx[rowsIdx.length-1]].end};
}
function buildTable(rows){
  let t='<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n';
  rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td><td>'+r[3]+' g</td></tr>\n';});
  t+='</table>';
  return t;
}
const ids=[18112,18046,18036,18032,18029,18026,18018,18014,18000,17995,17978];
const results=[];
for(const id of ids){
  try{
    const h=readRaw(id); if(h===null){results.push({id,ERR:"read fail"});continue;}
    const r=parse(h);
    if(r.cls!=="STD_DOG"){results.push({id,SKIP:r.cls});continue;}
    const sm=h.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):"NONE";
    const analPresent=h.indexOf("Analitin")>-1;
    const before=h.slice(0,r.spanStart);
    const hasMarker=/\u0160\u0117rim/i.test(before);  // ar markeris jau yra pries
    const tbl=buildTable(r.rows);
    const repl = hasMarker ? tbl : ('<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n'+tbl);
    const newH = before + repl + h.slice(r.spanEnd);
    // guards
    const sm2=newH.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    const messyGone = !/<p>[^<]*\d+\s*kg(&nbsp;|\s){4,}/i.test(newH);  // senos &nbsp; eilutes dingo
    const tableOk = /<th>\u0160uns svoris<\/th>/.test(newH) && new RegExp('<td>'+r.rows[0][0]+' kg</td>').test(newH);
    const sudOk = sm2&&md5(sm2[0])===sud;
    const analOk = (newH.indexOf("Analitin")>-1)===analPresent;
    if(!messyGone||!tableOk||!sudOk||!analOk){results.push({id,SKIP:"guard",messyGone,tableOk,sudOk,analOk});continue;}
    const wc=writeRaw(id,newH);
    const after=readRaw(id);
    results.push({id,write:wc,rows:r.rows.length,marker_kept:hasMarker,
      ver_table: after!==null && /<th>\u0160uns svoris<\/th>/.test(after),
      ver_messy_gone: after!==null && !/<p>[^<]*\d+\s*kg(&nbsp;|\s){4,}/i.test(after),
      ver_sud: after!==null && md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud,
      ver_anal: after!==null && after.indexOf("Analitin")>-1,
      lossless: after!==null && md5(after)===md5(newH)});
  }catch(e){results.push({id,ERR:String(e).slice(0,120)});}
}
commit("conv_"+TS+".json", JSON.stringify(results,null,2));
console.log("DONE "+TS);
