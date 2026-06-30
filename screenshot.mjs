import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(path){
  let cmd='curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'?nc='+Date.now()+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  const comps = [
    {id:19092, name:'Balta stirnos koja', kiekis:5, buvo:60},
    {id:16298, name:'Ruda stirnos koja', kiekis:5, buvo:20},
    {id:16317, name:'Ruda avies koja', kiekis:2, buvo:51},
    {id:19104, name:'Balta avies koja', kiekis:2, buvo:76}
  ];
  out.results = [];
  for(const c of comps){
    const p = api('/wp-json/wc/v3/products/'+c.id);
    out.results.push({
      id: c.id, name: c.name, kiekis: c.kiekis, buvo: c.buvo,
      dabar: p.stock_quantity, stock_status: p.stock_status
    });
  }
  // Taip pat patikrinu naujausią užsakymą
  const orders = api('/wp-json/wc/v3/orders?per_page=3&orderby=date&order=desc');
  out.recent_orders = Array.isArray(orders) ? orders.map(o=>({
    id:o.id, status:o.status, total:o.total, date:o.date_created,
    items: (o.line_items||[]).map(li=>li.name)
  })) : [];
  commit('koju_final.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
