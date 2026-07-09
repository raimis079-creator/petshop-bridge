import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ds',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method){ let cmd='curl -sk -u "$WPU:$WPP" '; if(method) cmd+='-X '+method+' '; cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
let out='';

// Tikslus 82 kandidatų sąrašas (iš recon rezultatų)
const ALL = [69,137,191,438,439,444,456,487,488,489,490,491,496,497,498,499,500,501,504,505,506,508,511,522,523,526,527,528,529,530,531,533,534,536,537,538,540,541,542,543,544,545,546,548,549,551,552,553,554,574,575,576,577,578,579,580,581,583,584,585,586,588,589,590,591,592,593,595,596,597,598,599,600,601,602,603,604,605,606,607,608,611];
const KEEP = [611]; // palikti kaip fallback
const DELETE = ALL.filter(id => !KEEP.includes(id));

out += 'Kandidatų iš viso: '+ALL.length+'\n';
out += 'Ištrinami: '+DELETE.length+' (be 611)\n';
out += 'Paliekami: '+KEEP.length+' (611 kaip fallback)\n\n';

// 1. BACKUP kiekvieno snippet'o pilnas turinys (title + code + scope + priority + hooks)
const backup = { timestamp: new Date().toISOString(), items: [] };
out += '=== BACKUP (visi 82) ===\n';
let backupCount = 0;
for(const id of ALL){
  const r = api('/wp-json/code-snippets/v1/snippets/'+id);
  try{
    const j = JSON.parse(r);
    backup.items.push({
      id: j.id,
      name: j.name,
      description: j.description || '',
      code: j.code || '',
      scope: j.scope,
      priority: j.priority,
      active: j.active,
      tags: j.tags || [],
      modified: j.modified || '',
    });
    backupCount++;
  }catch(e){ out += '  ['+id+'] BACKUP ERR\n'; }
}
out += 'backup: '+backupCount+' items\n\n';
putFile('snippet_backup_20260709.json', JSON.stringify(backup, null, 2));

// 2. DELETE 81 (be 611)
out += '=== DELETE 81 ===\n';
let okCount = 0, errCount = 0;
for(const id of DELETE){
  const r = api('/wp-json/code-snippets/v1/snippets/'+id, 'DELETE');
  try{
    const j = JSON.parse(r);
    if(j.id === id || j.deleted === true || j.previous){
      okCount++;
    } else {
      out += '  ['+id+']: '+JSON.stringify(j).slice(0,150)+'\n';
      errCount++;
    }
  }catch(e){ out += '  ['+id+']: EXC '+r.slice(0,100)+'\n'; errCount++; }
}
out += 'DELETED: '+okCount+' / ERRORS: '+errCount+'\n\n';

// 3. POST-VERIFY: snippet'ų sąrašas dabar
let all = [];
for(let page=1; page<=10; page++){
  const r = api('/wp-json/code-snippets/v1/snippets?per_page=100&page='+page+'&_fields=id,name,active');
  try{
    const arr = JSON.parse(r);
    if(!Array.isArray(arr) || arr.length === 0) break;
    all = all.concat(arr);
    if(arr.length < 100) break;
  }catch(e){ break; }
}
out += '=== POST-DELETE stats ===\n';
out += 'total snippet\'ai: '+all.length+' (buvo 359)\n';
out += 'aktyvūs: '+all.filter(x=>x.active).length+'\n';

// Ar 611 dar egzistuoja?
const s611 = all.find(x=>x.id===611);
out += '611 statusas: '+(s611 ? 'YRA ('+s611.name+', aktyvus='+s611.active+')' : 'NERASTA')+'\n';

// Ar kuris iš 81 dar liko?
const stillExist = DELETE.filter(id => all.find(x=>x.id===id));
out += 'iš 81 dar likę: '+stillExist.length+(stillExist.length>0 ? ' → '+stillExist.slice(0,10).join(',') : '')+'\n';

// 4. HOMEPAGE verify - kad site'as vis dar veikia
out += '\n=== Homepage / verifikacija ===\n';
const { chromium } = await import('playwright');
const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
const p = await ctx.newPage();
await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
await p.waitForTimeout(4000);
const chk = await p.evaluate(()=>{
  const heroBg = document.querySelector('.ph-hero-bg');
  const badge = document.querySelector('.ph-hero-badge img');
  const cats = [...document.querySelectorAll('.ph-cat-img')];
  const tb = document.querySelectorAll('.ph-tb-item').length;
  const e5 = !!document.querySelector('.ph-e5');
  const footer = document.querySelectorAll('#custom_html-2, #custom_html-3, #custom_html-4, #custom_html-5').length;
  return {
    hero_bg: heroBg ? getComputedStyle(heroBg).backgroundImage.includes('hero-augintiniai') : false,
    badge: badge ? badge.naturalWidth+'x'+badge.naturalHeight : '-',
    cats: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
    tb_items: tb,
    e5: e5,
    footer_widgets: footer,
  };
});
out += JSON.stringify(chk, null, 1)+'\n';
await ctx.close();
await b.close();

putFile('delsnip.txt', out);
