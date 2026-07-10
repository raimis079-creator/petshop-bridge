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
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 90 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function hdr(url){ return execSync('curl -sk -I -u "'+AUTH+'" "'+url+'" 2>/dev/null | tr -d "\r"',{encoding:'utf8'}); }

L('############ BLOG INVENTORIUS + REDIRECTION ############'); L('');

// ===== 1. Blog inventorius =====
L('=== 1. Kur gyvena "blog" straipsniai ===');
const cnt = u => { const h=hdr(u); return (h.match(/x-wp-total:\s*(\d+)/i)||[])[1]||'0'; };
L('  posts (any):  '+cnt('https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=1&status=any'));
L('  pages (any):  '+cnt('https://dev.avesa.lt/wp-json/wp/v2/pages?per_page=1&status=any'));
L('');

L('  --- Visi posts ---');
const ps=api('GET','https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=100&status=any&_fields=id,slug,status,title,link&orderby=id&order=asc');
if(ps.code==='200'){
  const arr=JSON.parse(ps.body);
  arr.forEach(p=>L('    ['+p.id+'] '+String(p.status).padEnd(8)+' /'+p.slug+'/'));
  L('    is viso: '+arr.length);
}
L('');

// Veisliu / patarimu pages
L('  --- Pages su veisliu/straipsniu pozymiais ---');
const breedHints=['veisl','terjeras','retriveris','ovcarka','buldogas','spanielis','kolis','dalmatinas','mastifas','pitbul','cihuahua','pudelis','maistas','patarim','kaip-','kodel'];
const seen={};
for(const hint of breedHints){
  const r=api('GET','https://dev.avesa.lt/wp-json/wp/v2/pages?search='+hint+'&per_page=30&status=any&_fields=id,slug,status');
  if(r.code==='200'){
    try{ JSON.parse(r.body).forEach(p=>{ if(!seen[p.id]) seen[p.id]={slug:p.slug,status:p.status}; }); }catch(e){}
  }
}
const ids=Object.keys(seen);
L('    rasta unikaliu pages: '+ids.length);
const byStatus={};
ids.forEach(i=>{ const s=seen[i].status; byStatus[s]=(byStatus[s]||0)+1; });
L('    pagal statusa: '+JSON.stringify(byStatus));
L('');
L('    pirmi 25 slug\'ai:');
ids.slice(0,25).forEach(i=>L('      ['+i+'] '+String(seen[i].status).padEnd(8)+' /'+seen[i].slug+'/'));
L('');

// ===== 2. Redirection plugin =====
L('=== 2. Redirection plugin ===');
const chk=api('GET','https://dev.avesa.lt/wp-json/wp/v2/plugins?search=redirection');
if(chk.code==='200'){
  const arr=JSON.parse(chk.body);
  if(arr.length){ arr.forEach(p=>L('  jau yra: '+p.name+' v'+p.version+'  status='+p.status)); }
  else{
    L('  neidiegtas — diegiam');
    const ins=api('POST','https://dev.avesa.lt/wp-json/wp/v2/plugins',{slug:'redirection',status:'inactive'});
    L('  POST /plugins {slug:redirection} -> HTTP '+ins.code);
    if(ins.code==='201'||ins.code==='200'){
      const j=JSON.parse(ins.body);
      L('    ✅ idiegta: '+j.name+' v'+j.version+'  plugin='+j.plugin+'  status='+j.status);
      L('    (palikta INACTIVE — aktyvuosim kai reikes)');
    } else {
      L('    ❌ '+ins.body.slice(0,300));
    }
  }
} else L('  HTTP '+chk.code);
L('');

L('=== 3. Patikra po diegimo ===');
const v=api('GET','https://dev.avesa.lt/wp-json/wp/v2/plugins?search=redirection');
if(v.code==='200'){
  const arr=JSON.parse(v.body);
  arr.forEach(p=>L('  '+(p.status==='active'?'ON ':'off')+'  '+p.name+' v'+p.version));
  if(!arr.length) L('  ❌ nerastas');
}
L('');
L('=== 4. Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['/duk/','https://dev.avesa.lt/duk/']]){
  const c=execSync('curl -skL -o /dev/null -w "%{http_code}" --max-time 25 "'+u+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  L('  '+nm.padEnd(12)+' HTTP '+c);
}
putFile('blog_redirection.txt', out); console.log(out);
