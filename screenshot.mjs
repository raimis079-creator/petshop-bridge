import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sh',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}|%{redirect_url}" --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }

(async()=>{
  let out='';

  // 1. BACKUP page ID 11
  const before = api('/wp-json/wp/v2/pages/11?context=edit');
  let backup = null;
  try{
    backup = JSON.parse(before);
    out += '=== BACKUP ID 11 ===\n';
    out += '  slug: '+backup.slug+'\n';
    out += '  title: '+backup.title.rendered+'\n';
    out += '  status: '+backup.status+'\n';
    out += '  content_len: '+(backup.content.raw||'').length+'\n\n';
    putFile('shop_backup.json', JSON.stringify({
      id: 11, slug: backup.slug, title_raw: backup.title.raw, title_rendered: backup.title.rendered,
      status: backup.status, content_raw: backup.content.raw, modified: backup.modified,
    }, null, 2));
  }catch(e){ out += 'BACKUP ERR: '+before.slice(0,200)+'\n'; putFile('shopren.txt', out); return; }

  // 2. PUT: slug=parduotuve, title=Parduotuvė
  const upd = api('/wp-json/wp/v2/pages/11', 'POST', { slug: 'parduotuve', title: 'Parduotuvė' });
  try{
    const j = JSON.parse(upd);
    out += '=== PUT rezultatas ===\n';
    out += '  slug: '+j.slug+'\n';
    out += '  title: '+j.title.rendered+'\n';
    out += '  link: '+j.link+'\n';
    if(j.slug !== 'parduotuve'){ out += 'SLUG NEPAKEISTA\n'; putFile('shopren.txt', out); return; }
  }catch(e){ out += 'PUT ERR: '+upd.slice(0,300)+'\n'; putFile('shopren.txt', out); return; }

  await new Promise(r=>setTimeout(r,3000));

  // 3. Menu items patikra: rasti Main "Shop" nuoroda
  out += '\n=== Menu Main - Shop nuoroda ===\n';
  const menus = api('/wp-json/wp/v2/menus?per_page=20');
  let shopMenuItemId = null;
  try{
    const arr = JSON.parse(menus);
    for(const m of arr){
      const items = api('/wp-json/wp/v2/menu-items?menus='+m.id+'&per_page=100&_fields=id,title,url,object_id,object,menus');
      try{
        const ii = JSON.parse(items);
        ii.forEach(mi=>{
          if((mi.url||'').includes('/shop/') || (mi.title.rendered||'').toLowerCase() === 'shop'){
            out += '  Menu ['+m.name+' id='+m.id+']: item id='+mi.id+' title='+mi.title.rendered+' url='+mi.url+' object='+mi.object+' obj_id='+mi.object_id+'\n';
            shopMenuItemId = mi.id;
          }
        });
      }catch(e){}
    }
  }catch(e){}

  // 4. Menu item update: Parduotuvė → /parduotuve/
  if(shopMenuItemId){
    const mUpd = api('/wp-json/wp/v2/menu-items/'+shopMenuItemId, 'POST', {
      title: 'Parduotuvė',
      url: DEV+'/parduotuve/'
    });
    try{
      const j = JSON.parse(mUpd);
      out += '  UPDATED: title='+j.title.rendered+' url='+j.url+'\n';
    }catch(e){ out += '  Menu update ERR: '+mUpd.slice(0,200)+'\n'; }
  }
  out += '\n';

  // 5. Sukurti 301 redirect snippet'a
  const redirCode = `/**
 * Petshop Shop→Parduotuvė 301 v1 (LIVE)
 *
 * 301 redirect'ai:
 * /shop/           -> /parduotuve/
 * /shop/anything/  -> /parduotuve/anything/
 *
 * Suveikia PRIES rewrite parser, kad /shop/* nepasiektu WooCommerce.
 */
add_action('template_redirect', function() {
    $req = $_SERVER['REQUEST_URI'] ?? '';
    if (strpos($req, '/shop/') !== 0 && $req !== '/shop') return;
    $new = preg_replace('#^/shop#', '/parduotuve', $req);
    wp_redirect(home_url($new), 301);
    exit;
}, 1);`;

  const cr = api('/wp-json/code-snippets/v1/snippets', 'POST', {
    name: 'Petshop Shop→Parduotuvė 301 v1 (LIVE)',
    code: redirCode,
    scope: 'front-end',
    active: false,
    priority: 5
  });
  let redirSid = null;
  try{ const j = JSON.parse(cr); redirSid = j.id; out += 'Redirect snippet sukurtas id='+redirSid+'\n';
    if(j.code_error) out += '  code_error: '+JSON.stringify(j.code_error)+'\n';
  }catch(e){ out += 'CR ERR: '+cr.slice(0,300)+'\n'; }
  if(redirSid){
    api('/wp-json/code-snippets/v1/snippets/'+redirSid, 'PUT', { active: true });
    await new Promise(r=>setTimeout(r,3000));
    out += '  aktyvintas\n';
  }

  // 6. HTTP kodai
  out += '\n=== HTTP kodai (po pakeitimų) ===\n';
  for(const u of ['/parduotuve/','/shop/','/shop/anything/','/shop']){
    out += '  '+code(u).padEnd(30)+'  '+u+'\n';
  }
  out += '\n';

  // 7. WC settings - shop_page_id vis dar 11?
  const wc = api('/wp-json/wc/v3/settings/products');
  try{
    const arr = JSON.parse(wc);
    const spid = arr.find(x=>x.id==='woocommerce_shop_page_id');
    out += 'woocommerce_shop_page_id: '+(spid?spid.value:'?')+'\n';
  }catch(e){}

  // 8. Playwright verify
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(3500);
  const chk = await p.evaluate(()=>{
    // Ieškau visų /shop/ ir /parduotuve/ nuorodų
    const links = [...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
    const shopLinks = links.filter(l => l && (l.includes('/shop/') || l.endsWith('/shop')));
    const pardLinks = links.filter(l => l && (l.includes('/parduotuve/') || l.endsWith('/parduotuve')));
    return {
      hero: !!document.querySelector('.ph-hero'),
      cats: document.querySelectorAll('.ph-cat-card').length,
      footer: document.querySelectorAll('#custom_html-2, #custom_html-3, #custom_html-4, #custom_html-5').length,
      shop_link_count: shopLinks.length,
      shop_links_sample: shopLinks.slice(0,5),
      parduotuve_link_count: pardLinks.length,
      parduotuve_links_sample: pardLinks.slice(0,5),
    };
  });
  out += '\n=== Homepage / patikra ===\n'+JSON.stringify(chk, null, 2)+'\n';
  await ctx.close();
  await b.close();

  putFile('shopren.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
