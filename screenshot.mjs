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
function get(url){
  const code=execSync('curl -skL -o /tmp/g.txt -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ NUORODOS "Slapukų naudojimas" PAIESKA ############'); L('');

L('=== 1. Complianz REST banner endpoint ===');
const r=get('https://dev.avesa.lt/wp-json/complianz/v1/banner/1/optin');
L('  HTTP '+r.code+'  ('+r.body.length+' B)');
if(r.code==='200'){
  try{
    const j=JSON.parse(r.body);
    L('  raktai: '+Object.keys(j).join(', ').slice(0,300));
    if(j.legal_documents) L('  legal_documents: '+JSON.stringify(j.legal_documents).slice(0,500));
    if(j.documents) L('  documents: '+JSON.stringify(j.documents).slice(0,400));
  }catch(e){ L('  parse err'); L('  '+r.body.slice(0,400)); }
}
L('');

L('=== 2. Kiti complianz REST endpoint\'ai ===');
const rt=get('https://dev.avesa.lt/wp-json/');
if(rt.code==='200'){
  try{
    const j=JSON.parse(rt.body);
    Object.keys(j.routes||{}).filter(x=>/complianz/i.test(x)).forEach(x=>L('  '+x));
  }catch(e){}
}
L('');

L('=== 3. HTML: is kur nuoroda ===');
const h=get('https://dev.avesa.lt/');
const idx=h.body.indexOf('Slapukų naudojimas');
if(idx>0){
  L('  rasta HTML pozicijoje '+idx);
  L('  kontekstas:');
  L('  '+h.body.slice(Math.max(0,idx-400), idx+200).replace(/\s+/g,' '));
}else{
  L('  HTML\'e nerasta (renderinama JS)');
}
L('');

L('=== 4. Inline cmplz config JS ===');
const cfg=h.body.match(/complianz[^<]{0,60}=\s*\{[\s\S]{0,1500}/);
if(cfg){ L('  '+cfg[0].slice(0,900)); }
else{
  const sc=h.body.match(/<script[^>]*id=["']cmplz[^"']*["'][^>]*>[\s\S]{0,1200}?<\/script>/g)||[];
  L('  cmplz script tag\'u: '+sc.length);
  sc.slice(0,2).forEach(s=>L('  '+s.slice(0,700).replace(/\s+/g,' ')));
}
L('');

L('=== 5. Complianz JS failas su nuorodomis ===');
const jsUrl = (h.body.match(/https?:\/\/[^"']*complianz[^"']*\.js[^"']*/g)||[]).slice(0,3);
jsUrl.forEach(u=>L('  '+u.slice(0,120)));
putFile('cmplz_link_hunt.txt', out); console.log(out);
