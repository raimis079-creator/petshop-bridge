import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(url){
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ S168 RECON — uzsakymo testui ############'); L('');

// 1. Mokejimo budai
L('=== 1. Mokejimo budai (payment_gateways) ===');
const pg=api('https://dev.avesa.lt/wp-json/wc/v3/payment_gateways');
if(pg.code==='200'){
  try{
    const arr=JSON.parse(pg.body);
    for(const g of arr){
      L('  '+(g.enabled?'✅ ON ':'   off')+'  id='+String(g.id).padEnd(24)+' "'+g.title+'"');
      if(g.enabled) L('              method_title: '+g.method_title);
    }
    const on=arr.filter(g=>g.enabled);
    L('');
    L('  Ijungtu: '+on.length+'  -> '+on.map(g=>g.id).join(', '));
  }catch(e){ L('  parse err: '+pg.body.slice(0,200)); }
} else L('  HTTP '+pg.code);
L('');

// 2. Pristatymo zonos
L('=== 2. Pristatymo zonos ===');
const zn=api('https://dev.avesa.lt/wp-json/wc/v3/shipping/zones');
if(zn.code==='200'){
  try{
    const zones=JSON.parse(zn.body);
    for(const z of zones){
      L('  [zone '+z.id+'] "'+z.name+'"  order='+z.order);
      const m=api('https://dev.avesa.lt/wp-json/wc/v3/shipping/zones/'+z.id+'/methods');
      if(m.code==='200'){
        const ms=JSON.parse(m.body);
        for(const x of ms) L('      '+(x.enabled?'✅':'  ')+' '+String(x.method_id).padEnd(22)+' "'+x.title+'"  instance='+x.instance_id);
      }
    }
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+zn.code);
L('');

// 3. Tinkama preke testui: simple, in stock, purchasable, pigi
L('=== 3. Kandidatai testui (simple, instock) ===');
const pr=api('https://dev.avesa.lt/wp-json/wc/v3/products?per_page=20&status=publish&type=simple&stock_status=instock&orderby=price&order=asc');
if(pr.code==='200'){
  try{
    const arr=JSON.parse(pr.body);
    L('  rasta: '+arr.length);
    for(const p of arr.slice(0,8)){
      const src=(p.meta_data||[]).find(m=>m.key==='_fulfillment_source')?.value || '?';
      const co =(p.meta_data||[]).find(m=>m.key==='_courier_only')?.value || '-';
      const manuf=(p.meta_data||[]).find(m=>m.key==='_legacy_manufacturer')?.value || '-';
      L('  ['+p.id+'] '+String(p.price).padStart(7)+' EUR  sku='+String(p.sku||'-').padEnd(16)+' "'+p.name.slice(0,38)+'"');
      L('        purchasable='+p.purchasable+' in_stock='+p.in_stock+' virtual='+p.virtual+'  manuf='+manuf.slice(0,16)+'  courier_only='+co);
    }
  }catch(e){ L('  parse err: '+pr.body.slice(0,200)); }
} else L('  HTTP '+pr.code);
L('');

// 4. Checkout laukai (per HTML — reikia sesijos, tad tik struktura)
L('=== 4. WC nustatymai ===');
for(const [nm,ep] of [['Salis','general/woocommerce_default_country'],['Guest checkout','account/woocommerce_enable_guest_checkout'],['Terms page','advanced/woocommerce_terms_page_id']]){
  const r=api('https://dev.avesa.lt/wp-json/wc/v3/settings/'+ep);
  if(r.code==='200'){ try{ const j=JSON.parse(r.body); L('  '+nm.padEnd(18)+' = '+JSON.stringify(j.value)); }catch(e){ L('  '+nm+' parse err'); } }
  else L('  '+nm.padEnd(18)+' HTTP '+r.code);
}
L('');

// 5. Ar yra jau uzsakymu su _petshop_dl_purchase_sent
L('=== 5. Esami uzsakymai (paskutiniai 3) ===');
const or=api('https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=3&orderby=date&order=desc');
if(or.code==='200'){
  try{
    const arr=JSON.parse(or.body);
    L('  rasta: '+arr.length);
    for(const o of arr){
      const flag=(o.meta_data||[]).find(m=>m.key==='_petshop_dl_purchase_sent')?.value || '-';
      L('  #'+o.number+'  '+o.status+'  '+o.total+' '+o.currency+'  dl_sent='+flag+'  '+o.date_created);
    }
  }catch(e){ L('  parse err: '+or.body.slice(0,150)); }
} else L('  HTTP '+or.code+' '+or.body.slice(0,120));
putFile('s168_recon.txt', out); console.log(out);
