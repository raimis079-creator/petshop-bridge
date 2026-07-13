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
  L('TESTAS #6 — ecommerce struktūros detalės');
  L('');
  // what does GET /orders return (structure)
  L('--- GET /orders struktūra ---');
  const o=scall('GET','/orders');
  L('  '+o.raw.slice(0,300));
  L('');
  L('--- GET /stores struktūra ---');
  const s=scall('GET','/stores');
  L('  '+s.raw.slice(0,300));
  L('');
  L('--- GET /carts struktūra ---');
  const c=scall('GET','/carts');
  L('  '+c.raw.slice(0,250));
  L('');
  // GET /products error tells us required params
  L('--- GET /products (ko reikia) ---');
  const p=scall('GET','/products');
  L('  '+p.raw.slice(0,200));
  L('');
  // try POST an order
  L('--- POST /orders (struktūruotas užsakymas) ---');
  const order={
    email:'terra@gyvunai.lt',
    external_id:'TEST-6001',
    total:42.50,
    currency:'EUR',
    status:'paid',
    items:[{product_id:'EXCL-2KG', name:'Exclusion 2kg', price:21.60, quantity:1}]
  };
  const po=scall('POST','/orders', order);
  L('  HTTP '+po.code+' — '+po.raw.slice(0,250));
  putText('_test6b.txt', out);
  console.log('done');
})();
