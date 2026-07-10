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
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

L('############ BUG DIAGNOSTIKA ############'); L('');

// ---- BUG 1: add_to_cart mygtukas ----
L('=== BUG 1: single_add_to_cart_button klases ===');
const pr=page('https://dev.avesa.lt/product/zaislas-katei-plastikinis-kamuoliukas-4-cm/');
L('  HTTP '+pr.code);
const btns = pr.html.match(/<button[^>]{0,400}single_add_to_cart_button[^>]{0,400}>/g)||[];
L('  rasta mygtuku: '+btns.length);
btns.forEach(b=>L('    '+b.replace(/\s+/g,' ').slice(0,260)));
L('');
L('  ajax_add_to_cart klase mygtuke: '+(btns.some(b=>/ajax_add_to_cart/.test(b))?'✅ TAIP (AJAX)':'❌ NE (forma submit\'ina)'));
L('  forma cart: '+(/(<form[^>]{0,200}class="[^"]*cart)/.test(pr.html)?'yra':'nera'));
const formTag = pr.html.match(/<form[^>]{0,300}class="[^"]{0,120}cart[^"]{0,60}"[^>]{0,200}>/);
if(formTag) L('  form tag: '+formTag[0].replace(/\s+/g,' ').slice(0,220));
L('');
L('  window.petshopGtmItem yra: '+(/window\.petshopGtmItem/.test(pr.html)?'✅':'❌'));
L('  added_to_cart listener yra: '+(/added_to_cart/.test(pr.html)?'✅':'❌'));
L('  jQuery yra: '+(/jquery/i.test(pr.html)?'✅':'❌'));
L('');
L('  Flatsome AJAX nustatymai:');
const fl = pr.html.match(/ajax_add_to_cart["\s:=]+(\w+)/g)||[];
fl.slice(0,4).forEach(x=>L('    '+x));
L('');

// ---- BUG 2: thankyou hook 2x ----
L('=== BUG 2: woocommerce_thankyou dvigubas kvietimas ===');
L('  Tikrinam thankyou HTML — kiek data-petshop-gtm bloku su purchase');
const ty=page('https://dev.avesa.lt/checkout/order-received/34592/?key=wc_order_xu5mjRUn9PE4D');
L('  HTTP '+ty.code+'  ('+ty.html.length+' B)');
const blocks = ty.html.match(/<script data-petshop-gtm="1">[\s\S]*?<\/script>/g)||[];
L('  data-petshop-gtm bloku: '+blocks.length);
const purBlocks = blocks.filter(b=>/"event":"purchase"/.test(b));
L('  su event=purchase: '+purBlocks.length+'  '+(purBlocks.length>1?'❌ DUBLIS':'(order meta jau nustatyta, tad 0 tiketina)'));
purBlocks.forEach((b,i)=>{
  const m=b.match(/"transaction_id":"?(\d+)"?/);
  L('    ['+i+'] transaction_id='+(m?m[1]:'?')+'  ilgis='+b.length);
});
L('');
L('  (Pastaba: si uzklausa be sesijos — order meta jau "yes", tad push\'o neturi buti)');
L('');

// ---- Kiek kartu woocommerce_thankyou fire'ina ----
L('=== Flatsome / plugin\'u thankyou hook analize ===');
L('  Ieskom pozymiu, kad thankyou renderinamas 2x:');
const sig={
  'woocommerce-order-received':(ty.html.match(/woocommerce-order-received/g)||[]).length,
  'woocommerce-thankyou-order-details':(ty.html.match(/woocommerce-thankyou-order-details/g)||[]).length,
  'order-received antraste':(ty.html.match(/order-received/g)||[]).length,
  'woocommerce-order':(ty.html.match(/class="woocommerce-order"/g)||[]).length,
};
for(const [k,v] of Object.entries(sig)) L('    '+String(v).padStart(3)+'× '+k);
putFile('s168_bugs.txt', out); console.log(out);
