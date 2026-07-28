import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={};
try{
  const url='https://dev.avesa.lt/?p=34484';
  const html=execSync('curl -skL --max-time 60 "https://dev.avesa.lt/?post_type=product&p=34484"',{maxBuffer:20e6,timeout:75000}).toString();
  o.ilgis=html.length;
  const i=html.indexOf('ps-calc-hook');
  o.rasta=i;
  if(i>0){
    o.kontekstas = html.slice(Math.max(0,i-900), i+500).replace(/\s+/g,' ');
  }
  const j=html.indexOf('id="ps-calc"');
  o.widget_pos=j;
  if(j>0) o.widget_kontekstas = html.slice(Math.max(0,j-400), j+300).replace(/\s+/g,' ');
  // ar summary blokas apskritai yra
  o.turi_summary = html.indexOf('product-summary')>=0 || html.indexOf('summary entry-summary')>=0;
  o.turi_add_to_cart = html.indexOf('single_add_to_cart_button')>=0;
  o.turi_price = /class="[^"]*price[^"]*"/.test(html);
  // ar JS failas realiai pasiekiamas
  const js=execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 30 "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/product-calc.js"',{maxBuffer:1e6}).toString().trim();
  o.js_http=js;
}catch(e){o.err=String(e).slice(0,250);}
putB64('vis.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
