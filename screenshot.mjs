import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const IDS=[25227,21153,21151,21149,21147,21145,21143,21141,21139,21137,21135,21133,21131,21129,21125,21123,21119,21117,21115,20977,20961,20947,20941,20525,20523,20517,18593,18530,21121,20955,20533,20529,18617,18542,18539,18536,18533];
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const REKO='Rekomenduojamas kiekis per par';
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
function chk(id){let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return {id,read:0};}
  const reko=T.indexOf(REKO)>-1, mark=T.indexOf(MARK)>-1;
  const heading = mark&&reko?'BOTH':(mark?'INSTRUKCIJA':(reko?'REKOMENDUOJAMAS':'NONE'));
  // feeding region = from heading to +1500
  let hp=-1; if(reko)hp=T.indexOf(REKO); else if(mark)hp=T.indexOf(MARK);
  const region= hp>-1?T.slice(hp,hp+1600):'';
  const b2b=T.indexOf('b2b-black')>-1;
  const tbl=hp>-1?/<table/i.test(region):false;
  // table width style in region
  let width='';const wm=region.match(/<table[^>]*width:\s*([^;"']+)/i); if(wm)width=wm[1].trim();
  // double feeding heading?
  const rekoCount=(T.split(REKO).length-1), markCount=(T.split(MARK).length-1);
  const dbl=(rekoCount+markCount)>1;
  // cruft in region
  const cruft=region.indexOf('&lt;')>-1||region.indexOf('notionvc')>-1;
  return {id,heading,b2b,tbl,width,dbl,cruft,fcount:rekoCount+markCount};
}
const rows=IDS.map(chk);
// consistency summary
const byHead={},byWidth={};let nob2b=[],notbl=[],cruftL=[],dblL=[];
rows.forEach(r=>{byHead[r.heading]=(byHead[r.heading]||0)+1;byWidth[r.width||'(none)']=(byWidth[r.width||'(none)']||0)+1;
  if(!r.b2b)nob2b.push(r.id);if(!r.tbl)notbl.push(r.id);if(r.cruft)cruftL.push(r.id);if(r.dbl)dblL.push(r.id);});
commit("excl_consist_"+Date.now()+".json", JSON.stringify({total:rows.length,byHead,byWidth,nob2b,notbl,cruftL,dblL,rows},null,1));
console.log("DONE");
