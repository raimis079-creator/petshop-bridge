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

const IDS=[3241,3258,3259,3260,3261,3262,3263,3264,3265,3266,3267,3268,3269,3270,3271,3272,3273,3274,3275,3276,3277,3278,3279,3280,3282,3283,3284,3285,3286,3287,3288,3289,3290,3291,3292,3293,3294,3295,3297,3298,3303,3305,6632,6634,6635,6636,6637,6638,6639,6640,6641,11417,27907,34155,34174,34177,34178,34472,34592,34593];

function del(id){
  const code=execSync('curl -sk -o /tmp/d.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X DELETE "https://dev.avesa.lt/wp-json/wc/v3/orders/'+id+'?force=true" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/d.json','utf8'); }catch(e){}
  return {code, body:b};
}
function apiH(url){
  return execSync('curl -sk -I -u "'+AUTH+'" "'+url+'" 2>/dev/null | tr -d "\r"',{encoding:'utf8'});
}

L('############ S168 — UZSAKYMU TRYNIMAS (APPLY) ############');
L('laikas: '+new Date().toISOString());
L('backup: screenshots/orders_backup_20260710.json');
L('trinama: '+IDS.length+' uzsakymu, force=true'); L('');

// Pries
const h0=apiH('https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=1&status=any');
const t0=(h0.match(/x-wp-total:\s*(\d+)/i)||[])[1];
L('PRIES: x-wp-total = '+t0); L('');

L('=== Trinimas ===');
let ok=0, fail=0;
const fails=[];
for(let i=0;i<IDS.length;i++){
  const id=IDS[i];
  const r=del(id);
  if(r.code==='200'){
    ok++;
    let num='?'; try{ num=JSON.parse(r.body).number; }catch(e){}
    L('  ['+String(i+1).padStart(2)+'/'+IDS.length+'] ✅ '+String(id).padEnd(6)+' (#'+num+')');
  } else {
    fail++; fails.push({id, code:r.code, body:r.body.slice(0,120)});
    L('  ['+String(i+1).padStart(2)+'/'+IDS.length+'] ❌ '+String(id).padEnd(6)+' HTTP '+r.code);
  }
  if(i%10===9) execSync('sleep 1');
}
L('');
L('  pavyko: '+ok+'   nepavyko: '+fail);
if(fails.length){
  L('  Nepavykusieji:');
  fails.forEach(f=>L('    '+f.id+'  HTTP '+f.code+'  '+f.body));
}
L('');

// Po
execSync('sleep 3');
const h1=apiH('https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=1&status=any');
const t1=(h1.match(/x-wp-total:\s*(\d+)/i)||[])[1];
L('=== Verifikacija ===');
L('  PO: x-wp-total = '+(t1||'0'));
L('  Skirtumas: '+t0+' -> '+(t1||'0')+'   istrinta: '+(parseInt(t0)-parseInt(t1||'0')));
L('  '+((t1==='0'||!t1)?'✅ Uzsakymu nebeliko':'⚠️ liko '+t1));
L('');

// Ar tikrai tusti
const r=execSync('curl -sk -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=5&status=any" 2>/dev/null',{encoding:'utf8'});
try{
  const arr=JSON.parse(r);
  L('  GET /orders grazina: '+arr.length+' irasu');
  arr.forEach(o=>L('    liko: #'+o.number+' '+o.status+' '+o.total));
}catch(e){ L('  parse err'); }
L('');

// Saskaitu skaitiklis
L('=== Saskaitu skaitiklis (informacijai) ===');
L('  WCDN skaitiklis saugomas atskirai ir NEPASIKEITE.');
L('  Pries launch butina resetinti AVPN ir IAPV serijas i 101.');
L('  (jau yra migracijos checklist\'e)');
L('');

L('=== Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Krepselis','https://dev.avesa.lt/cart/'],['Mano paskyra','https://dev.avesa.lt/paskyra/']]){
  const c=execSync('curl -skL -o /dev/null -w "%{http_code}" --max-time 30 "'+u+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  L('  '+nm.padEnd(14)+' HTTP '+c);
}
putFile('s168_delete_orders.txt', out); console.log(out);
