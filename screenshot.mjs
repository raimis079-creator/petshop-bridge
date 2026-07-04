import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ar',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbar.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbar.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:200000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var totals={reprice:{applied:0, would_change_price:0, would_clear_sale:0, would_add_sale:0, skip_locked:0, skip_promo:0, skip_no_change:0, errors:0},
              stock:{applied:0, would_change_qty:0, would_zero_out:0, would_refresh_only:0, errors:0},
              publish:{applied:0, would_publish:0, errors:0}};

  // 1. REPRICE APPLY (batch'ais)
  for (var off=0; off<1500; off+=200){
    var url = BASE+'/?psc_vf_sync=1&k=ps2026&path=reprice&mode=apply&confirm=YES&limit=200&offset='+off;
    var r=exec('curl -sk -m 180 "'+url+'"');
    var m=r.match(/(\{.*\})/s);
    if(!m){ totals.reprice.errors++; totals.reprice.err_msg=(r||'').slice(0,200); break; }
    var d=JSON.parse(m[0]); if(d.error){ totals.reprice.errors++; totals.reprice.err_msg=d.error; break; }
    var s=d.stats||{};
    totals.reprice.applied += s.applied||0;
    totals.reprice.would_change_price += s.would_change_price||0;
    totals.reprice.would_clear_sale += s.would_clear_sale||0;
    totals.reprice.would_add_sale += s.would_add_sale||0;
    totals.reprice.skip_locked += s.skip_locked||0;
    totals.reprice.skip_promo += s.skip_promo||0;
    totals.reprice.skip_no_change += s.skip_no_change||0;
    if((s.products_scanned||0) < 200) break;
  }

  // 2. STOCK APPLY (batch'ais)
  for (var off2=0; off2<1500; off2+=200){
    var url2 = BASE+'/?psc_vf_sync=1&k=ps2026&path=stock&mode=apply&confirm=YES&limit=200&offset='+off2;
    var r2=exec('curl -sk -m 180 "'+url2+'"');
    var m2=r2.match(/(\{.*\})/s);
    if(!m2){ totals.stock.errors++; totals.stock.err_msg=(r2||'').slice(0,200); break; }
    var d2=JSON.parse(m2[0]); if(d2.error){ totals.stock.errors++; totals.stock.err_msg=d2.error; break; }
    var s2=d2.stats||{};
    totals.stock.applied += s2.applied||0;
    totals.stock.would_change_qty += s2.would_change_qty||0;
    totals.stock.would_zero_out += s2.would_zero_out||0;
    totals.stock.would_refresh_only += s2.would_refresh_only||0;
    if((s2.products_scanned||0) < 200) break;
  }

  // 3. PUBLISH APPLY (mažas, vienu kartu)
  var r3=exec('curl -sk -m 90 "'+BASE+'/?psc_vf_sync=1&k=ps2026&path=publish&mode=apply&confirm=YES&limit=500&offset=0"');
  var m3=r3.match(/(\{.*\})/s);
  if(m3){ var d3=JSON.parse(m3[0]); if(d3.stats){ totals.publish.applied=d3.stats.applied||0; totals.publish.would_publish=d3.stats.would_publish||0; totals.publish.samples=d3.examples||[]; } }
  else totals.publish.errors++;

  // 4. CRON REGISTER
  var cr=exec('curl -sk -m 30 "'+BASE+'/?psc_vf_sync=1&k=ps2026&cron=register"');
  var mc=cr.match(/(\{.*\})/s);
  totals.cron = mc?JSON.parse(mc[0]):(cr||'').slice(0,200);

  commit('apply_all.json', Buffer.from(JSON.stringify(totals),'utf8').toString('base64'));
  console.log(JSON.stringify(totals));
})();
