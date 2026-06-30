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
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // Pažiūriu rinkinio 34158 stock settings + manage_stock
  const p = api('GET','/wp-json/wc/v3/products/34158?nc='+Date.now());
  out.rinkinys_34158 = {
    type: p.type,
    manage_stock: p.manage_stock,
    stock_status: p.stock_status,
    stock_quantity: p.stock_quantity,
    sold_individually: p.sold_individually,
    backorders: p.backorders,
    purchasable: p.purchasable
  };
  // Visi 11 komponentų - jų stock settings
  const COMPS = [16942, 17057, 17499, 17493, 18369, 19045, 19452, 17550, 17547, 17538, 17541];
  out.komponentai = [];
  for(const id of COMPS){
    const c = api('GET','/wp-json/wc/v3/products/'+id+'?nc='+Date.now());
    out.komponentai.push({
      id: c.id,
      name: (c.name||'').slice(0,50),
      manage_stock: c.manage_stock,
      stock_status: c.stock_status,
      stock_quantity: c.stock_quantity,
      backorders: c.backorders,
      purchasable: c.purchasable
    });
  }
  commit('stock_diag.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
