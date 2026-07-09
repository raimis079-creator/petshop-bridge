import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out=''; const L=(s)=>{out+=s+'\n';};
function scan(label,url){
  L('##################################################');
  L('### '+label+'  '+url);
  L('##################################################');
  let html='';
  try{ html = execSync('curl -sk -L --max-time 40 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120" "'+url+'"',{encoding:'utf8',maxBuffer:30000000}); }
  catch(e){ L('FETCH ERR: '+(e.message||'').slice(0,150)); L(''); return; }
  L('HTML dydis: '+html.length+' baitu');
  const pats = {
    'GTM container ID (GTM-xxxx)' : /GTM-[A-Z0-9]{6,9}/g,
    'GA4 measurement ID (G-xxxx)' : /\bG-[A-Z0-9]{6,12}\b/g,
    'Universal Analytics (UA-)'   : /\bUA-\d{4,10}-\d{1,3}\b/g,
    'Google Ads conv (AW-)'       : /\bAW-\d{9,12}\b/g,
    'Meta Pixel ID (fbq init)'    : /fbq\(\s*['"]init['"]\s*,\s*['"](\d{10,20})['"]/g,
    'connect.facebook.net'        : /connect\.facebook\.net[^\s"'<>]*/g,
    'googletagmanager.com'        : /googletagmanager\.com[^\s"'<>]*/g,
    'gtag( calls'                 : /gtag\(\s*['"][a-z_]+['"]/g,
    'dataLayer'                   : /dataLayer/g,
    'Cookiebot/Complianz/CookieYes': /(cookiebot|complianz|cookieyes|cmplz)/gi,
    'Hotjar/Clarity'              : /(hotjar|clarity\.ms)/gi,
  };
  for(const [k,re] of Object.entries(pats)){
    const m = html.match(re);
    if(m){
      const uniq=[...new Set(m)];
      L('  ['+String(uniq.length).padStart(2)+' uniq / '+String(m.length).padStart(3)+' viso] '+k);
      uniq.slice(0,6).forEach(u=>L('        '+u.slice(0,110)));
    } else {
      L('  [ 0] '+k);
    }
  }
  L('');
}
scan('PROD petshop.lt','https://petshop.lt/');
scan('PROD prekes puslapis (paieska)','https://petshop.lt/index.php?route=common/home');
scan('DEV dev.avesa.lt','https://dev.avesa.lt/');
putFile('tracking_scan.txt', out); console.log(out);
