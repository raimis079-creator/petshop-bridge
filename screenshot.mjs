import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
// visi snippetai su fee/krepsel/mazo/surcharge kode
const list=get('/wp-json/code-snippets/v1/snippets?_fields=id,name,active,code');
let arr; try{ arr=JSON.parse(list); }catch(e){ arr=[]; }
const hits=[];
for(const s of (Array.isArray(arr)?arr:[])){
  const code=(s.code||'').toLowerCase();
  const name=(s.name||'').toLowerCase();
  if(/calculate_fees|mazo|krepsel|small.?cart|small.?basket|surcharge|add_fee|1\.21|handling/.test(code) || /fee|krepsel|mokest/.test(name)){
    hits.push({id:s.id,name:s.name,active:s.active,code:(s.code||'').slice(0,1500)});
  }
}
putFile('feeprobe.json',JSON.stringify({total:(Array.isArray(arr)?arr.length:0),hits}));
console.log('hits',hits.length);
