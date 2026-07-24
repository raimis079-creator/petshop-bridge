import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
try{
  // fetch the actual served CSS file + JS file
  const css = execSync('curl -sk "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/account.css?v='+Date.now()+'"',{maxBuffer:50e6}).toString();
  o.css_has_pspet_is_done = css.includes('.pspet-step.pspet-is-done');
  o.css_has_bare_done = /\.pspet-step\.done\b/.test(css);
  o.css_bytes = css.length;
  const js = execSync('curl -sk "https://dev.avesa.lt/wp-content/plugins/petshop-core/assets/pet-form.js?v='+Date.now()+'"',{maxBuffer:50e6}).toString();
  o.js_has_is_done = js.includes('pspet-is-done');
  o.js_bytes = js.length;
  // Is there a GLOBAL .done{display:none} anywhere in loaded theme/plugin CSS?
  // fetch the page and look for stylesheets
  const html = execSync('curl -sk "https://dev.avesa.lt/my-account/augintinis/?action=create"',{maxBuffer:50e6}).toString();
  const links = (html.match(/href="[^"]*\.css[^"]*"/g)||[]).map(x=>x.slice(6,-1)).filter(u=>u.includes('avesa')||u.startsWith('/'));
  o.stylesheet_count = links.length;
  var globalDoneFound = [];
  for (const link of links.slice(0,25)) {
    var url = link.startsWith('http') ? link : ('https://dev.avesa.lt' + link);
    try {
      var body = execSync('curl -sk "'+url+'"',{maxBuffer:50e6, timeout:15000}).toString();
      if (/\.done\s*\{[^}]*display\s*:\s*none/.test(body) || /\.done\s*,[^{]*\{[^}]*display\s*:\s*none/.test(body)) {
        globalDoneFound.push(url.split('/').pop());
      }
    } catch(e){}
  }
  o.global_done_display_none_in = globalDoneFound;
}catch(e){ o.err=String(e).slice(0,300); }
putB64('csschk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
