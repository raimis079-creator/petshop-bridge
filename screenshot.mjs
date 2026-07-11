import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'cp '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
function getHtml(p){sh('curl -s -k -A "Mozilla/5.0" "'+BASE+p+'" -o /tmp/pg.html 2>/dev/null');try{return fs.readFileSync('/tmp/pg.html','utf8');}catch(e){return '';}}
function analyze(html){
  const title=(html.match(/<title>([^<]*)<\/title>/i)||[])[1]||'';
  const h1=(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'';
  // istraukiam matoma teksta is entry-content / page-content
  let body=html;
  const m=html.match(/<div[^>]*class="[^"]*(?:entry-content|page-content|the-content|post-content)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|article|main)>/i);
  if(m)body=m[1];
  const text=body.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  return {
    title:title.trim().slice(0,80),
    h1:h1.replace(/<[^>]+>/g,'').trim().slice(0,80),
    text_len:text.length,
    // Complianz auto-doc zymes
    cmplz_document: /cmplz-document|cmplz-cookie-statement|complianz\/legal-documents|cmplz-cookies/i.test(html),
    cmplz_shortcode_out: /cmplz-cookies-overview|cookie-statement-type|cmplz-manage-consent/i.test(html),
    lists_cookies: /(_ga|_gcl_au|_fbp|cmplz_|woocommerce_items_in_cart|PHPSESSID)/.test(text),
    mentions_cookiedatabase: /cookiedatabase\.org|automati(s|z)/i.test(text),
    // pirmi 300 simboliu teksto
    excerpt: text.slice(0,300)
  };
}
(async()=>{const R={};try{
  for(const [key,p] of [['sena_34526','/slapuku-politika/'],['complianz_35','/slapuku-politika-es/']]){
    const html=getHtml(p);
    const a=analyze(html);
    R[key]={path:p,html_len:html.length,...a};
    L('=== '+key+' ('+p+') ===');
    L('  title: '+a.title);
    L('  h1: '+a.h1);
    L('  matomo teksto ilgis: '+a.text_len+' simb.');
    L('  Complianz auto-dokumentas: '+a.cmplz_document);
    L('  Complianz cookie shortcode output: '+a.cmplz_shortcode_out);
    L('  isvardija konkrecius slapukus (_ga/_fbp/cmplz...): '+a.lists_cookies);
    L('  mini cookiedatabase/automatiskai: '+a.mentions_cookiedatabase);
    L('   istrauka: '+a.excerpt.slice(0,220));
    L('');
  }
  // Banerio nuorodos (i kuri slapuku psl rodo pats Complianz baneris)
  const prod=getHtml('/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/');
  const links=[...prod.matchAll(/class="cmplz-link[^"]*"[^>]*href="([^"]*)"|href="([^"]*)"[^>]*class="cmplz-link/gi)].map(x=>x[1]||x[2]);
  const allCmplzLinks=[...prod.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([^<]*(?:slapuk|privatum)[^<]*)<\/a>/gi)].map(x=>({href:x[1],text:x[2].trim()}));
  R.banner_links=allCmplzLinks;
  L('=== Banerio nuorodos (slapuku/privatumo) ===');
  for(const l of allCmplzLinks) L('  "'+l.text+'" -> '+l.href);
  L('DONE');
}catch(e){L('!!! '+(e&&e.stack?e.stack:e));}finally{putText('cookie_pages.json',JSON.stringify(R,null,2));putText('_run8_log.txt',out);}})();
