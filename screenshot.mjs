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
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 60 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function apiH(url){
  const h=execSync('curl -sk -I -u "'+AUTH+'" "'+url+'" 2>/dev/null | tr -d "\r"',{encoding:'utf8'});
  return h;
}

L('############ S168 — UZSAKYMU RECON + BACKUP ############'); L('');

// ---- 1. Kiek is viso ----
L('=== 1. Uzsakymu kiekis ===');
const hdr = apiH('https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=1&status=any');
const tot = (hdr.match(/x-wp-total:\s*(\d+)/i)||[])[1];
const pgs = (hdr.match(/x-wp-totalpages:\s*(\d+)/i)||[])[1];
L('  x-wp-total: '+(tot||'?')+'   puslapiu: '+(pgs||'?'));
L('');

// ---- 2. Visi uzsakymai (paginuotai) ----
L('=== 2. Pilnas sarasas ===');
let all=[];
for(let p=1;p<=Math.min(parseInt(pgs||'1'),10);p++){
  const r=api('https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=100&status=any&page='+p+'&orderby=id&order=asc');
  if(r.code!=='200'){ L('  psl '+p+' HTTP '+r.code); break; }
  const arr=JSON.parse(r.body);
  all=all.concat(arr);
  if(arr.length<100) break;
}
L('  surinkta: '+all.length);
L('');
const byStatus={};
const byPayment={};
let sum=0;
for(const o of all){
  byStatus[o.status]=(byStatus[o.status]||0)+1;
  byPayment[o.payment_method||'(nera)']=(byPayment[o.payment_method||'(nera)']||0)+1;
  sum+=parseFloat(o.total||0);
}
L('  Pagal busena:');
for(const [k,v] of Object.entries(byStatus).sort((a,b)=>b[1]-a[1])) L('    '+String(v).padStart(4)+'  '+k);
L('');
L('  Pagal mokejimo buda:');
for(const [k,v] of Object.entries(byPayment).sort((a,b)=>b[1]-a[1])) L('    '+String(v).padStart(4)+'  '+k);
L('');
L('  Bendra suma: '+sum.toFixed(2)+' EUR');
L('');

// ---- 3. Detalus sarasas ----
L('=== 3. Detaliai ===');
L('  ID     Nr     Busena        Suma      Data                 El.pastas');
L('  ' + '─'.repeat(92));
for(const o of all){
  const em=(o.billing?.email||'—');
  L('  '+String(o.id).padEnd(6)+' '+String(o.number).padEnd(6)+' '+String(o.status).padEnd(13)+' '+String(o.total).padStart(8)+'  '+String(o.date_created).slice(0,19)+'  '+em.slice(0,34));
}
L('');

// ---- 4. Ar yra realiu (ne testiniu) pozymiu ----
L('=== 4. Realumo patikra ===');
const testEmails = all.filter(o=>/gtm\.test|test@|@example|\+test/i.test(o.billing?.email||''));
const paid = all.filter(o=>['completed','processing','refunded'].includes(o.status));
const withPaysera = all.filter(o=>o.payment_method==='paysera');
const withTx = all.filter(o=>o.transaction_id);
L('  Testiniu el. pastu (gtm.test/test@/example): '+testEmails.length);
L('  Busena completed/processing/refunded:        '+paid.length);
L('  Mokejimas per Paysera:                       '+withPaysera.length);
L('  Su transaction_id (realus apmokejimas):      '+withTx.length);
if(withTx.length){ L('  ⚠️ Uzsakymai su transaction_id:'); withTx.forEach(o=>L('     #'+o.number+' '+o.status+' '+o.total+' tx='+o.transaction_id)); }
if(paid.length){ L('  ⚠️ Apmoketi/ivykdyti uzsakymai:'); paid.forEach(o=>L('     #'+o.number+' '+o.status+' '+o.total+' '+String(o.date_created).slice(0,10)+' '+(o.billing?.email||'—'))); }
L('');

// ---- 5. Susije objektai ----
L('=== 5. Kas dar susije ===');
const refunds = all.filter(o=>(o.refunds||[]).length);
L('  Uzsakymu su grazinimais: '+refunds.length);
const invoiceMeta = all.filter(o=>(o.meta_data||[]).some(m=>/invoice|saskait|wcdn|pragma/i.test(m.key)));
L('  Uzsakymu su saskaitos meta: '+invoiceMeta.length);
if(invoiceMeta.length){
  const keys=new Set();
  invoiceMeta.forEach(o=>(o.meta_data||[]).forEach(m=>{ if(/invoice|saskait|wcdn|pragma/i.test(m.key)) keys.add(m.key); }));
  L('    raktai: '+[...keys].join(', '));
}
L('');

// ---- 6. BACKUP ----
L('=== 6. Backup ===');
const backup = { exported:new Date().toISOString(), count:all.length, total:sum.toFixed(2), orders:all };
const okB = putFile('orders_backup_20260710.json', JSON.stringify(backup,null,1));
L('  screenshots/orders_backup_20260710.json  '+(okB?'✅ issaugota':'❌ nepavyko'));
L('  dydis: ~'+Math.round(JSON.stringify(backup).length/1024)+' KB');
L('');

// ---- 7. DRY-RUN ----
L('=== 7. DRY-RUN — ka trintume ===');
L('  Trintume: '+all.length+' uzsakymu (force=true, negrizamai)');
L('  ID sarasas: '+all.map(o=>o.id).join(', '));
L('');
L('  ⚠️ NIEKO NEISTRINTA. Reikia Raimio patvirtinimo.');
putFile('s168_orders_recon.txt', out); console.log(out);
