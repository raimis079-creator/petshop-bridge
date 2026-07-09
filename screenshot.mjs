import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const PROD="https://petshop.lt";
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pc',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out='';
const html = execSync('curl -sk -L --max-time 25 "'+PROD+'/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000});

// Identifikuoju cookie-consent sprendimą
const solutions = {
  'Cookiebot': /cookiebot\.com|CookieConsent/i,
  'Complianz': /complianz\.io|complianz-gdpr/i,
  'Iubenda': /iubenda\.com/i,
  'CookieYes': /cookieyes\.com/i,
  'GDPR Cookie Compliance (Termly)': /termly\.io/i,
  'Real Cookie Banner': /real-cookie-banner|devowl/i,
  'GA4 Google Cookie Consent': /consent[_-]?mode|google.tag.js.consent/i,
  'GDPR Cookie Consent (WebToffee)': /gdpr-cookie-consent|webtoffee/i,
  'Osano': /osano\.com|cookieconsent/i,
  'OneTrust': /onetrust|otSDK/i,
  'PIWIK/Matomo Consent': /piwik|matomo/i,
  'CustomCookie/Manual': /cookie-notice|cookieBanner|CookieBar/i,
};
out += '=== PROD cookie-consent sprendimas ===\n';
for(const [name, re] of Object.entries(solutions)){
  const m = html.match(re);
  if(m) out += '  MATCH: '+name+' -> '+JSON.stringify(m[0])+'\n';
}
out += '\n';

// GA4/GTM ID
const ga4 = [...html.matchAll(/G-([A-Z0-9]{6,})/g)].map(m=>m[0]);
const gtm = [...html.matchAll(/GTM-([A-Z0-9]{5,})/g)].map(m=>m[0]);
const meta = [...html.matchAll(/fbq\('init',\s*['"]([0-9]+)['"]/g)].map(m=>m[1]);
out += 'GA4 ID: '+(ga4.length ? [...new Set(ga4)].join(', ') : 'nera')+'\n';
out += 'GTM ID: '+(gtm.length ? [...new Set(gtm)].join(', ') : 'nera')+'\n';
out += 'Meta Pixel ID: '+(meta.length ? [...new Set(meta)].join(', ') : 'nera')+'\n\n';

// Ieškau cookie banner HTML struktūros - koki wrapper class'e
const bannerHints = [
  /<div[^>]+class="[^"]*(cookie|consent|gdpr)[^"]*"[^>]*>/gi,
  /<script[^>]+src="[^"]+(cookie|consent)[^"]*"/gi,
];
out += '=== HTML fragments (pirmi 5) ===\n';
let count = 0;
for(const re of bannerHints){
  for(const m of html.matchAll(re)){
    if(count++ < 8) out += '  '+m[0].slice(0,200)+'\n';
  }
}

putFile('prod_cookie.txt', out);
