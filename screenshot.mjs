import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const html = execSync('curl -skL --max-time 40 "https://dev.avesa.lt/?x='+Date.now()+'"',{encoding:'utf8',maxBuffer:30000000});

L('############ page_links PILNAS ############'); L('');
const i = html.indexOf('"page_links"');
if(i<0){ L('nerasta'); }
else{
  // randam balansuota JSON
  let start = html.indexOf('{', i);
  let depth=0, end=start;
  for(let k=start;k<html.length && k<start+4000;k++){
    if(html[k]==='{') depth++;
    else if(html[k]==='}'){ depth--; if(depth===0){ end=k+1; break; } }
  }
  const raw = html.slice(start,end);
  L('raw ilgis: '+raw.length); L('');
  try{
    const pl=JSON.parse(raw);
    for(const [region,docs] of Object.entries(pl)){
      L('region "'+region+'":');
      for(const [type,d] of Object.entries(docs)){
        L('  '+String(type).padEnd(20)+' title="'+d.title+'"');
        L('  '+' '.repeat(20)+' url='+String(d.url).replace(/^https?:\/\/dev\.avesa\.lt/,''));
      }
    }
  }catch(e){
    L('parse err: '+e.message);
    L(raw.slice(0,1200));
  }
}
L('');
L('############ Susije options ############');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
const p=execSync('curl -sk --max-time 40 "https://dev.avesa.lt/?cmplz_css=1&token='+TOKEN+'"',{encoding:'utf8'});
try{
  const j=JSON.parse(p);
  L('  dabartinis privacy page option: '+JSON.stringify(j.dabartinis_privacy_page));
  L('  privacy_options: '+JSON.stringify(j.privacy_options));
}catch(e){ L('  '+p.slice(0,300)); }
putFile('cmplz_pagelinks_full.txt', out); console.log(out);
