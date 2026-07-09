import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const PROD="https://petshop.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ck',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// === 1. DEV: aktyvus plugin'ai (per REST) ===
const plug = api('/wp-json/wp/v2/plugins?per_page=100');
try{
  const arr = JSON.parse(plug);
  const active = arr.filter(x=>x.status==='active');
  out += '=== DEV aktyvus plugin\'ai ('+active.length+') ===\n';
  active.forEach(p=>out += '  '+p.plugin+' | '+p.name+'\n');
}catch(e){ out += 'plugins ERR: '+plug.slice(0,150)+'\n'; }

// === 2. DEV: ieskau ar yra cookie/consent plugin\'ai (aktyvūs arba neaktyvūs)
try{
  const arr = JSON.parse(plug);
  const cookiePlugs = arr.filter(x=>{
    const n = (x.name||'').toLowerCase()+' '+(x.plugin||'').toLowerCase()+' '+(x.description?.rendered||'').toLowerCase();
    return n.includes('cookie') || n.includes('consent') || n.includes('gdpr') || n.includes('cmp') || n.includes('rgpd');
  });
  out += '\n=== visi cookie/consent susijusi ('+cookiePlugs.length+') ===\n';
  cookiePlugs.forEach(p=>out += '  ['+p.status+'] '+p.plugin+' | '+p.name+'\n');
}catch(e){}

// === 3. Snippet'ai ieskau consent/cookie kodo ===
const snips = api('/wp-json/code-snippets/v1/snippets?_fields=id,name,active&per_page=100');
try{
  const arr = JSON.parse(snips);
  out += '\n=== visu snippet\'u ('+arr.length+', aktyvus '+arr.filter(x=>x.active).length+') ===\n';
  arr.forEach(s=>{
    const nm = s.name.toLowerCase();
    if(nm.includes('cookie')||nm.includes('consent')||nm.includes('gdpr')||nm.includes('cmp')||nm.includes('ga4')||nm.includes('gtag')||nm.includes('fbq')||nm.includes('brevo')){
      out += '  ['+(s.active?'ON':'off')+'] '+s.id+' | '+s.name+'\n';
    }
  });
}catch(e){}

// === 4. DEV: rendered HTML - ar yra tracking scripts, cookie banner ===
const html = (()=>{ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+'/pagrindinis-test/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } })();
out += '\n=== DEV rendered HTML analize (/pagrindinis-test/) ===\n';
out += 'ilgis: '+html.length+'\n';
const trackers = {
  'GA4 (gtag/analytics)': /gtag|google-analytics|googletagmanager|G-[A-Z0-9]{6,}/,
  'GTM': /GTM-[A-Z0-9]{5,}/,
  'Meta/Facebook Pixel': /fbq\(|connect\.facebook\.net\/.*fbevents/,
  'TikTok Pixel': /ttq\.load|analytics\.tiktok\.com/,
  'Brevo (Sendinblue)': /brevo|sendinblue/i,
  'Hotjar': /hotjar|hj\(/,
  'Klaviyo': /klaviyo/i,
  'Cookie banner (bendrai)': /cookie[_-]?consent|cookiebot|cookielaw|complianz|iubenda|termly|didomi/i,
};
for(const [name, re] of Object.entries(trackers)){
  const hit = re.test(html);
  out += '  ['+(hit?'YRA':'nera')+'] '+name+'\n';
}

// === 5. PROD (petshop.lt): koks cookie/tracker setup ten dabar? ===
out += '\n=== PROD petshop.lt analize ===\n';
let prodHtml = '';
try{ prodHtml = execSync('curl -sk -L --max-time 25 "'+PROD+'/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000}); }catch(e){}
out += 'ilgis: '+prodHtml.length+'\n';
for(const [name, re] of Object.entries(trackers)){
  const hit = re.test(prodHtml);
  out += '  ['+(hit?'YRA':'nera')+'] '+name+'\n';
}

// === 6. Options - default_role, permalink structure - contextinis info ===
const settings = api('/wp-json/wp/v2/settings');
try{
  const s = JSON.parse(settings);
  out += '\n=== WP settings ===\n';
  out += '  url: '+s.url+'\n';
  out += '  language: '+s.language+'\n';
  out += '  timezone: '+s.timezone+'\n';
}catch(e){}

putFile('cookie_recon.txt', out);
