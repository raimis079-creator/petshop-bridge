import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fw',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const html=get('/apie-mus/?diag='+Date.now());
// randam sekcija su "Naujausi" ir tikrinam jos wrapping HTML
const idx=html.indexOf('NAUJAUSI');
const idx2=html.indexOf('Naujausi');
const useidx=idx>=0?idx:idx2;
const out={
  html_len:html.length,
  naujausi_idx:useidx,
  populiariausi_idx:html.indexOf('POPULIARIAUSI')>=0?html.indexOf('POPULIARIAUSI'):html.indexOf('Populiariausi'),
  ivertinti_idx:html.indexOf('GERIAUSIAI')>=0?html.indexOf('GERIAUSIAI'):html.indexOf('Geriausiai'),
  // istraukiam apie 2000 simboliu apie ta bloka - ieskosim class/id
  context: useidx>=0 ? html.slice(Math.max(0,useidx-1200), useidx+400) : ''
};
// ieskom kokie WP hookai / widgetai / shortcodes
out.has_wc_before_footer = html.indexOf('woocommerce-before-footer')>=0;
out.has_products_widget = html.indexOf('product_top_rated')>=0 || html.indexOf('product-top-rated')>=0;
// ieskom sekcijos wrappers
const wrappers = [];
const re = /<section[^>]*class="([^"]*)"|<div[^>]*class="([^"]*(?:products|top-rated|latest|popular|widgets|bottom)[^"]*)"/gi;
let m; let cnt=0;
while((m = re.exec(html)) !== null && cnt<15){
  wrappers.push(m[1]||m[2]);
  cnt++;
}
out.candidate_wrappers = wrappers;
putFile('findwidget.json',JSON.stringify(out));
console.log('done');
