import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const URLS=["/gamintojas/josera/", "/gamintojas/deli-nature/", "/gamintojas/ziarnko/", "/gamintojas/trixie/", "/gamintojas/hikari/", "/gamintojas/katrinex/", "/gamintojas/belocat/", "/gamintojas/gimborn/", "/gamintojas/animonda/", "/gamintojas/animonda/", "/gamintojas/animonda/", "/gamintojas/dolina-noteci/"];
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'brandcheck',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),res:[]};
const seen=new Set();
for(const u of URLS){
  if(seen.has(u)) continue; seen.add(u);
  let code='?',hasProd=false,noindex=false,title='';
  try{
    const html=execSync('curl -sk -u ":" -L "'+DEV+u+'"',{encoding:'utf8',maxBuffer:50000000,timeout:40000,env:{...process.env,WPU,WPP}});
    hasProd=/(add_to_cart|product_cat|li class="product|woocommerce-loop|add-to-cart)/i.test(html);
    noindex=/noindex/i.test((html.match(/<meta[^>]*robots[^>]*>/i)||[''])[0]);
    title=((html.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').slice(0,50);
    const hc=execSync('curl -sk -o /dev/null -w "%{http_code}" -u ":" -L "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}});
    code=hc.trim();
  }catch(e){ code='EXC'; }
  out.res.push({u,code,hasProd,noindex,title});
  putFile('brandcheck.json',JSON.stringify(out));
}
putFile('brandcheck.json',JSON.stringify(out));
