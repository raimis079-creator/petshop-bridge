import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
let prods=[];
for(const st of ['publish','draft']){for(let pg=1;pg<=3;pg++){let arr=[];try{arr=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=ontario&status=${st}&per_page=100&page=${pg}&_fields=id,name,sku,status,categories"`,{encoding:'utf8',env,maxBuffer:80000000}));}catch(e){break;}if(!Array.isArray(arr)||!arr.length)break;prods=prods.concat(arr);if(arr.length<100)break;}}
const seen={};prods=prods.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});
fs.writeFileSync('/tmp/ids.txt', prods.map(p=>p.id).join("\n"));
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}
const FEEDTERM=/(\u0160\u0117rim|\u0161\u0117rim|[Rr]ekomenduojamas\s+kiekis|[Pp]aros\s+norm|[Kk]iekis\s+per\s+par|[Rr]ekomenduojama\s+paros)/;
const RECOG=/(\u0160\u0117rim(?:o|as)?(?:\s+(?:instrukcija|rekomendacij[ao]s?|norma|normos|nurodymai))?\s*(?::|<\/(?:strong|h[1-6]|p)>)|Rekomenduojamas\s+kiekis\s+per\s+par[a\u0105])/;
const PAIR=/\d+\s*kg\s*[-\u2013:* ]{0,4}\d+\s*[-\u2013]?\s*\d*\s*g/;
function classify(id){let T="";try{T=(JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8')).content||{}).raw||"";}catch(e){return {read:0};}
  const len=T.length;const sud=/Sud\u0117tis|Sudedam/i.test(T);const b2b=T.indexOf('b2b-black')>-1;
  const fm=T.match(FEEDTERM);
  let feedHead=false,recognized=false,tblAfter=false,pairsAfter=false,headTxt='';
  if(fm){const pos=fm.index;feedHead=true;
    headTxt=T.slice(Math.max(0,pos-6),Math.min(T.length,pos+42)).replace(/\s+/g,' ');
    recognized=RECOG.test(T.slice(Math.max(0,pos-10),pos+80));
    const after=T.slice(pos,pos+800);
    tblAfter=/<table[ >]/i.test(after);pairsAfter=PAIR.test(after);}
  const anyPair=PAIR.test(T);
  const anyTable=/<table[ >]/i.test(T);
  return {read:1,len,sud,b2b,feedHead,recognized,tblAfter,pairsAfter,anyPair,anyTable,headTxt};
}
const rows=prods.map(p=>{const c=classify(p.id);return {id:p.id,name:(p.name||'').slice(0,46),sku:p.sku,status:p.status,cats:(p.categories||[]).map(x=>x.name).join('/'),...c};});
function bucket(r){if(!r.read||r.len<80)return 'EMPTY';
  if(r.feedHead&&r.recognized&&(r.tblAfter||r.pairsAfter))return r.tblAfter?'OK_TABLE':'OK_PROSE';
  if(r.feedHead&&!r.recognized&&(r.tblAfter||r.pairsAfter))return r.tblAfter?'FIXHEAD_TABLE':'FIXHEAD_PROSE';
  if(r.feedHead&&!(r.tblAfter||r.pairsAfter))return 'HEAD_NODATA';
  if(r.anyPair)return 'PROSE_NOHEAD';
  return 'NOFEED';}
rows.forEach(r=>r.bucket=bucket(r));
const buckets={},byCat={};rows.forEach(r=>{buckets[r.bucket]=(buckets[r.bucket]||0)+1;byCat[r.cats]=(byCat[r.cats]||0)+1;});
commit("ont_audit_"+Date.now()+".json", JSON.stringify({total:rows.length,buckets,byCat,rows},null,1));
console.log("DONE "+rows.length);
