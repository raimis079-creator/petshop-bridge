import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const home=get('/?nc='+Date.now());
const out={};
// trackeriu signatures HTML'e
out.ga4_gtag = /gtag\(|googletagmanager\.com\/gtag|G-[A-Z0-9]{8,}/.test(home);
out.ga_universal = /UA-\d{4,}/.test(home);
out.gtm = /googletagmanager\.com\/gtm|GTM-[A-Z0-9]+/.test(home);
out.meta_pixel = /fbevents\.js|connect\.facebook\.net|fbq\(/.test(home);
out.brevo = /sendinblue|brevo|sib_|sibForm/.test(home.toLowerCase());
out.mailerlite = /mailerlite/.test(home.toLowerCase());
out.hotjar = /hotjar/.test(home.toLowerCase());
out.youtube = /youtube\.com\/embed|youtube-nocookie/.test(home);
out.paysera = /paysera/.test(home.toLowerCase());
// istraukiam konkrecius ID
const g4=home.match(/G-[A-Z0-9]{8,}/); out.ga4_id=g4?g4[0]:null;
const gtmid=home.match(/GTM-[A-Z0-9]+/); out.gtm_id=gtmid?gtmid[0]:null;
const fbid=home.match(/fbq\('init',\s*'(\d+)'/); out.fb_id=fbid?fbid[1]:null;
// consent/cookie tools
out.cookie_notice = /cookie-notice|cookieconsent|complianz|cookiebot|borlabs|iubenda/.test(home.toLowerCase());
// kokie <script src> domenai
const scripts=[...home.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m=>m[1]);
const ext=scripts.filter(s=>s.startsWith('http') && !s.includes('dev.avesa.lt')).map(s=>{try{return new URL(s).hostname}catch(e){return s}});
out.external_script_hosts=[...new Set(ext)];
putFile('trackers.json',JSON.stringify(out));
