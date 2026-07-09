import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'do',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method){ let cmd='curl -sk -u "$WPU:$WPP" '; if(method) cmd+='-X '+method+' '; cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
let out='';

const IDS = [34554,34555,34556,34557,34558,34559,34572,34573];

// 1. BACKUP: kiekvieno failo detali metadata + faktinio failo baitai
const backup = { timestamp: new Date().toISOString(), items: [] };
out += '=== BACKUP ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?context=edit');
  try{
    const j = JSON.parse(r);
    backup.items.push({
      id: id,
      title: j.title,
      slug: j.slug,
      source_url: j.source_url,
      mime_type: j.mime_type,
      media_details: j.media_details,
      alt_text: j.alt_text,
      date: j.date,
      author: j.author,
    });
    out += '  '+id+': '+(j.source_url||'?').split('/').pop()+' backed up\n';
  }catch(e){ out += '  '+id+': BACKUP ERR\n'; }
}
putFile('orphan_media_backup_20260709.json', JSON.stringify(backup, null, 2));
out += 'backup: '+backup.items.length+' items\n\n';

// 2. DELETE su force=true
out += '=== DELETE ===\n';
const results = {};
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?force=true', 'DELETE');
  try{
    const j = JSON.parse(r);
    if(j.deleted === true){
      out += '  '+id+': DELETED (force)\n';
      results[id] = 'ok';
    } else {
      out += '  '+id+': '+JSON.stringify(j).slice(0,200)+'\n';
      results[id] = 'err';
    }
  }catch(e){ out += '  '+id+': DEL EXC: '+r.slice(0,200)+'\n'; results[id] = 'exc'; }
}
out += '\n';

// 3. POST-VERIFICATION: ar media dar egzistuoja?
out += '=== POST-DELETE patikra ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=id');
  try{
    const j = JSON.parse(r);
    if(j.code === 'rest_post_invalid_id') out += '  '+id+': istrintas OK\n';
    else out += '  '+id+': DAR YRA! '+JSON.stringify(j).slice(0,100)+'\n';
  }catch(e){ out += '  '+id+': verify ERR\n'; }
}
out += '\n';

// 4. HOMEPAGE VERIFY: ar viskas dar veikia
const { chromium } = await import('playwright');
const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
const p = await ctx.newPage();
const nlog = [];
p.on('response', r => { const u = r.url(); if(u.includes('/2026/07/')) nlog.push(r.status()+' '+u.split('/2026/07/')[1].split('?')[0]); });
await p.goto(DEV+'/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
await p.waitForTimeout(4000);
const chk = await p.evaluate(()=>{
  const heroBg = document.querySelector('.ph-hero-bg');
  const badge = document.querySelector('.ph-hero-badge img');
  const cats = [...document.querySelectorAll('.ph-cat-img')];
  const bans = [...document.querySelectorAll('.ph-banner-bg')];
  return {
    hero_bg_loaded: heroBg ? getComputedStyle(heroBg).backgroundImage.includes('hero-augintiniai') : false,
    badge_natural: badge ? badge.naturalWidth+'x'+badge.naturalHeight : '-',
    cats_loaded: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
    banners_bg: bans.length && bans.every(x=>getComputedStyle(x).backgroundImage.includes('banner-')),
  };
});
out += '=== HOMEPAGE / verifikacija ===\n';
out += 'tinklo /2026/07/:\n';
nlog.forEach(l=>out += '  '+l+'\n');
out += 'DOM:\n'+JSON.stringify(chk,null,1)+'\n';
await ctx.close();
await b.close();

putFile('delorphan.txt', out);
