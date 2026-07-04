import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfs.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:200000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var results={reprice:{}, stock:{}, publish:{}};
  for (var path of ['reprice','stock','publish']){
    var agg={};
    var samples=[];
    for (var off=0; off<1300; off+=250){
      var r=exec('curl -sk -m 90 "'+BASE+'/?psc_vf_sync=1&k=ps2026&path='+path+'&mode=dryrun&limit=250&offset='+off+'"');
      var m=r.match(/(\{.*\})/s);
      if(!m){ agg.error='no json off='+off; break; }
      var d=JSON.parse(m[0]);
      if(d.error){ agg.error=d.error; break; }
      var s=d.stats||{};
      Object.keys(s).forEach(k=>{ if(typeof s[k]==='number') agg[k]=(agg[k]||0)+s[k]; });
      (d.examples||[]).forEach(e=>{ if(samples.length<25) samples.push(e); });
      var scanned = s.products_scanned||s.draft_scanned||0;
      if(scanned<250) break;
    }
    results[path]={agg:agg, samples:samples};
  }
  commit('full_stats.json', Buffer.from(JSON.stringify(results),'utf8').toString('base64'));
  console.log('done');
})();
