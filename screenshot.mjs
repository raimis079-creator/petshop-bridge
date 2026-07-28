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
  // ieskom Exclusion arkliena M/L 12kg
  const s=execSync('curl -sk --max-time 45 "https://dev.avesa.lt/?s=Exclusion+arkliena+bulv%C4%97mis&post_type=product"',{maxBuffer:20e6,timeout:60000}).toString();
  const m=[...s.matchAll(/href="(https:\/\/dev\.avesa\.lt\/product\/[^"]*arklien[^"]*)"/g)].map(x=>x[1]);
  o.rasta=[...new Set(m)].slice(0,3);
  const url=o.rasta[0];
  if(url){
    const h=execSync('curl -skL --max-time 60 "'+url+'"',{maxBuffer:20e6,timeout:75000}).toString();
    o.url=url;
    o.hook = h.indexOf('ps-calc-hook')>=0;
    o.widget = h.indexOf('id="ps-calc"')>=0;
    o.js = h.indexOf('product-calc.js')>=0;
    // kur JS tag'as vs kur widget
    o.js_pos = h.indexOf('product-calc.js');
    o.widget_pos = h.indexOf('id="ps-calc"');
    o.hook_pos = h.indexOf('ps-calc-hook');
    o.footer_pos = h.lastIndexOf('</body>');
    // ar JS PRIES widget'a (tada root=null)
    o.js_pries_widget = (o.js_pos>0 && o.widget_pos>0 && o.js_pos < o.widget_pos);
  }
}catch(e){o.err=String(e).slice(0,250);}
putB64('chk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
