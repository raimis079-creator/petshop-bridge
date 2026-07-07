import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'reconp2',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('reconp2_0707.json',out); }

// Abiem Protection Lamb SKU: content.raw is wp/v2 context=edit (lossless), tikrinam serimo lentele
for (const pid of [16791,16794]){
  step('p'+pid,()=>{
    const p=JSON.parse(wp('/wp-json/wp/v2/product/'+pid+'?context=edit'));
    const c=(p.content&&p.content.raw)||'';
    const hasTable=/<table/i.test(c);
    const hasSerimo=/serim|paros doz|paros norm|rekomenduojam.*kiek|kiekis per par/i.test(c);
    const hasB2b=/b2b-black/i.test(c);
    const hasVetlife=/b2b-vetlife/i.test(c);
    // istraukiam serimo sekcijos fragmenta
    let frag='';
    const m=c.search(/serim|paros doz|paros norm/i);
    if(m>=0) frag=c.slice(Math.max(0,m-40), m+400).replace(/\s+/g,' ');
    return {clen:c.length, hasTable, hasSerimo, hasB2b, hasVetlife, frag:frag.slice(0,400)};
  });
}
putResult('reconp2_0707.json',out);
