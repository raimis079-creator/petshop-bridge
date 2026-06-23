import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=String(Date.now());
const idsRaw=execSync(`curl -s -H "Authorization: Bearer ${process.env.GH_TOKEN}" "https://api.github.com/repos/${process.env.GH_REPO}/contents/screenshots?ref=main&t=${Date.now()}"`,{encoding:'utf8'});
const idsFile=(idsRaw.match(/"foodids_\d+\.json"/g)||[]).map(s=>s.replace(/"/g,'')).sort().pop();
const allIds=JSON.parse(execSync(`curl -s "https://raw.githubusercontent.com/${process.env.GH_REPO}/main/screenshots/${idsFile}"`,{encoding:'utf8'}));

// Sukuriu URL sarasa visom prekem, skaitau LYGIAGRECIAI per xargs
fs.writeFileSync('/tmp/ids.txt', allIds.join('\n'));
const user=process.env.WP_USER, pass=env.WP_PASS_CLEAN;
// kiekvienai prekei: parsisiunciu raw i atskira faila /tmp/p/<id>.html
execSync('mkdir -p /tmp/p');
const cmd=`cat /tmp/ids.txt | xargs -P 12 -I{} sh -c 'curl -sk --max-time 20 -u "${user}:${pass}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=content" -o /tmp/p/{}.json 2>/dev/null'`;
execSync(cmd, {maxBuffer:200000000, timeout:600000});

function check(h){
  return {
    sudetis: /sud\u0117tis\s*:|sudedamosios\s+dalys|ingredient/i.test(h),
    analitines: /analitin|\u017eali\s+baltym|\u017ealieji\s+riebal/i.test(h),
    serimas: /\u0161\u0117rim|maitinimo\s+norma|paros\s+norma|rekomenduojamas\s+kiekis|\u0161uns\s+svoris|kat\u0117s\s+svoris|g\/per\s+dien/i.test(h)
  };
}
const out={ts:TS, total:allIds.length, items:[]};
for(const id of allIds){
  let raw='';
  try{ const j=JSON.parse(fs.readFileSync('/tmp/p/'+id+'.json','utf8')); raw=(j.content&&j.content.raw)||''; }catch(e){}
  const empty=raw.length<30;
  const c=check(raw);
  out.items.push({id, len:raw.length, empty, sudetis:c.sudetis, analitines:c.analitines, serimas:c.serimas});
}
out.summary={
  total:out.items.length,
  empty:out.items.filter(i=>i.empty).length,
  no_sudetis:out.items.filter(i=>!i.sudetis&&!i.empty).length,
  no_analitines:out.items.filter(i=>!i.analitines&&!i.empty).length,
  no_serimas:out.items.filter(i=>!i.serimas&&!i.empty).length
};
putResult('foodfast_'+TS+'.json', JSON.stringify(out));
console.log(JSON.stringify(out.summary));
