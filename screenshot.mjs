import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'af',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbaf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbaf.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:180000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var totals={applied:0, would_clear_sale:0, would_add_sale:0, would_change_price:0, skip_no_change:0, errors:0};
  // APPLY batchais
  for(var off=0; off<1500; off+=300){
    var r=exec('curl -sk -m 150 "'+BASE+'/?psc_vf_sync=1&k=ps2026&path=reprice&mode=apply&confirm=YES&limit=300&offset='+off+'"');
    var m=r.match(/(\{.*\})/s); if(!m){ totals.errors++; totals.err_msg=r.slice(0,200); break; }
    var d=JSON.parse(m[0]); if(d.error){ totals.errors++; totals.err_msg=d.error; break; }
    var s=d.stats||{};
    ['applied','would_clear_sale','would_add_sale','would_change_price','skip_no_change'].forEach(k=>{ totals[k]+=s[k]||0; });
    if((s.products_scanned||0)<300) break;
  }
  
  // Patvirtinimas - suskaičiuojam kiek VF akcijų liko
  commit('apply_fix.json', Buffer.from(JSON.stringify(totals),'utf8').toString('base64'));
  console.log(JSON.stringify(totals));
})();
