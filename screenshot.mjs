import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'b3',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
// slug -> grazus pavadinimas
const breeds={
  'amerikieciu-buldogas':'Amerikiečių buldogas',
  'amerikieciu-putbulterjeras':'Amerikiečių pitbulterjeras',
  'biglis':'Biglis',
  'bokseris':'Bokseris',
  'ciau-ciau':'Čiau čiau',
  'cvergsnauceris':'Cvergšnauceris',
  'dalmantinas':'Dalmatinas',
  'dzeko-raselo-terjeras':'Džeko Raselo terjeras',
  'havanu-bisonai':'Havanų bišonai',
  'jorksyro-terjeras':'Jorkšyro terjeras',
  'kaukazo-aviganis':'Kaukazo aviganis',
  'kinu-kuduotasis-suo':'Kinų kuduotasis šuo',
  'kolis':'Kolis',
  'mastifas':'Mastifas',
  'rotveileris-s-v':'Rotveileris',
  'samojedas':'Samojedas',
  'senbernaras':'Senbernaras',
  'taksas':'Taksas',
  'tibeto-mastifas':'Tibeto mastifas'
};
const out={};
for(const [slug,name] of Object.entries(breeds)){
  out[slug]={name, http:code('/'+slug+'/')};
}
putFile('breeds3.json',JSON.stringify(out));
