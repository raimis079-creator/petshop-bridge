import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const MK=(process.env.SENDER_MARKETING_TOKEN||'').trim();
const SAPI='https://api.sender.net/v2';
function scall(method, path, body){
  let cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" "'+SAPI+path+'"';
  if(body){fs.writeFileSync('/tmp/sb.json',JSON.stringify(body));cmd='curl -s --max-time 30 -w "\nHTTP:%{http_code}" -X '+method+' -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" -H "Content-Type: application/json" --data-binary @/tmp/sb.json "'+SAPI+path+'"';}
  let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:10000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}
  const code=(r.match(/HTTP:(\S+)$/)||[])[1]||'?';const raw=r.replace(/\nHTTP:\S+$/,'');
  return {code, raw};
}
(async()=>{
  L('======================================');
  L('TESTAS #6: WooCommerce/ecommerce duomenys');
  L('======================================');
  L('');
  L('--- Zonduoju ecommerce endpoint\'us (GET) ---');
  const eps=['/orders','/products','/carts','/ecommerce/orders','/ecommerce/products','/shops','/stores','/revenue'];
  for(const e of eps){
    const r=scall('GET',e);
    const exists = r.code!=='404';
    L('  GET '+e+' -> HTTP '+r.code+(exists?' (egzistuoja)':' (nera)'));
  }
  L('');
  L('--- Bandau POST užsakymą (order_paid ecommerce) ---');
  // Sender custom event with ecommerce semantics: type=purchase with order data
  const order={
    subscriber:{email:'terra@gyvunai.lt'},
    type:'order_paid',
    order_id:'TEST-6001',
    total:42.50,
    currency:'EUR',
    products:[
      {sku:'EXCL-2KG', name:'Exclusion Monoprotein 2kg', price:21.60, qty:1},
      {sku:'CHURU-4P', name:'Churu 4pack', price:20.90, qty:1}
    ]
  };
  const o=scall('POST','/events', JSON.stringify(order)?order:order);
  L('  POST /events (order_paid su products) HTTP '+o.code+' — '+o.raw.slice(0,180));
  L('');
  // Product purchased ecommerce event
  L('--- Product purchased event ---');
  const pp=scall('POST','/events',{subscriber:{email:'terra@gyvunai.lt'}, type:'product_purchased', sku:'EXCL-2KG', price:21.60});
  L('  HTTP '+pp.code+' — '+pp.raw.slice(0,150));
  L('');
  // Cart abandoned event
  L('--- Cart abandoned event ---');
  const ca=scall('POST','/events',{subscriber:{email:'terra@gyvunai.lt'}, type:'cart_abandoned', cart_total:42.50, items:2});
  L('  HTTP '+ca.code+' — '+ca.raw.slice(0,150));
  putText('_test6.txt', out);
  console.log('done');
})();
