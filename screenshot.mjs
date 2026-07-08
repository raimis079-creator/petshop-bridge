import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'h1r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
const pages = [
  ['landing-naujas','/naujas-augintinis/'],
  ['landing-hipo','/hipoalerginis-maistas/'],
  ['page-sunu-veisles','/sunu-veisles/'],
  ['page-apie-mus','/apie-mus/'],
  ['page-pristatymas','/pristatymas/'],
  ['blog','/hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu/'],
  ['sprendimai','/sprendimai/'],
  ['sprend-child','/naujas-suniukas/'],
];
for(const [label, u] of pages){
  const html = get(u);
  out += '=== '+label+' '+u+' ===\n';
  if(!html || html.length < 500){ out += 'FETCH FAIL\n\n'; continue; }
  // Visi h1
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]{0,120}?)<\/h1>/g)];
  out += 'H1 count: '+h1s.length+'\n';
  h1s.forEach((m,i)=>{
    const tag = m[0].slice(0, m[0].indexOf('>')+1);
    out += '  h1['+i+'] tag: '+tag.slice(0,110)+'\n';
    out += '  h1['+i+'] text: '+m[1].replace(/<[^>]+>/g,'').trim().slice(0,60)+'\n';
  });
  // Visi h2 pirmieji 3
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]{0,120}?)<\/h2>/g)].slice(0,3);
  out += 'H2 (first 3):\n';
  h2s.forEach((m,i)=>{
    const tag = m[0].slice(0, m[0].indexOf('>')+1);
    out += '  h2['+i+'] tag: '+tag.slice(0,110)+'\n';
    out += '  h2['+i+'] text: '+m[1].replace(/<[^>]+>/g,'').trim().slice(0,60)+'\n';
  });
  // Title wrapper zonos - ieskau entry-title / page-title
  const et = html.match(/<[^>]*class="[^"]*(entry-title|page-title)[^"]*"[^>]*>/g);
  out += 'title-wrapper tags: '+(et?et.slice(0,3).join(' | ').slice(0,220):'nera')+'\n';
  out += '\n';
}
putFile('h1recon.txt', out);
