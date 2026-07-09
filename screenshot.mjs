import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cr',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
let out='';

// 1. Ar Complianz jau install'intas (aktyvus arba ne)?
const plug = api('/wp-json/wp/v2/plugins?per_page=100');
try{
  const arr = JSON.parse(plug);
  const complianz = arr.filter(x => {
    const n = (x.plugin||'').toLowerCase() + ' ' + (x.name||'').toLowerCase();
    return n.includes('complianz');
  });
  out += '=== Complianz būklė ===\n';
  if(complianz.length === 0){
    out += '  NE INSTALL\'INTAS - reikia install per WP plugin repository\n';
  } else {
    complianz.forEach(p=>out += '  ['+p.status+'] '+p.plugin+' | '+p.name+' | v'+p.version+'\n');
  }
}catch(e){ out += 'plugins ERR: '+plug.slice(0,150)+'\n'; }

// 2. Ar plugins endpoint palaiko instaliavima?
// Endpoint: POST /wp/v2/plugins?slug=complianz-gdpr
// Bet gali blokuoti WAF - kaip su settings anksciau
out += '\n=== Plugin install test (dry run - tik user_can check) ===\n';
const testInst = api('/wp-json/wp/v2/plugins', 'GET');
try{
  const j = JSON.parse(testInst);
  if(Array.isArray(j)) out += '  GET veikia - '+j.length+' plugins\n';
}catch(e){}

// 3. Ar egzistuoja Flatsome header hook fields (Google Analytics, GTM head code)?
out += '\n=== Flatsome theme hooks ===\n';
const flatsome = api('/wp-json/wp/v2/settings');
try{
  const j = JSON.parse(flatsome);
  // Ieskau theme_mod jei prieinamas
  out += '  url: '+j.url+'\n';
  out += '  language: '+j.language+'\n';
}catch(e){}

// 4. Rendered HTML - patikra jau esamu tracker'iu (turejo buti nulis)
out += '\n=== Rendered HTML DEV / patikra ===\n';
try{
  const html = execSync('curl -sk -A "Mozilla/5.0" --max-time 25 "'+DEV+'/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000});
  const trackers = {
    'GTM script': /googletagmanager\.com\/gtm\.js/,
    'GTM ID pastebimas': /GTM-[A-Z0-9]{5,}/,
    'gtag/GA4': /gtag\(\)|G-[A-Z0-9]{6,}/,
    'Meta Pixel init': /fbq\('init'/,
    'Complianz JS/CSS': /complianz/i,
  };
  for(const [name, re] of Object.entries(trackers)){
    const hit = re.test(html);
    out += '  ['+(hit?'YRA':'nera')+'] '+name+'\n';
  }
}catch(e){}

putFile('compl_recon.txt', out);
