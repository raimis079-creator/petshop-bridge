// RINK-RECON4-0811
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B = 'https://dev.avesa.lt';
const U = process.env.WP_USER, P = (process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH = 'Basic ' + Buffer.from(U+':'+P).toString('base64');
const TOK = process.env.GH_TOKEN || '';
fs.mkdirSync('screenshots',{recursive:true});

async function wp(path, opts={}){
  try{
    const r = await fetch(B+path, {...opts, headers:{'Authorization':AUTH,'Content-Type':'application/json',...(opts.headers||{})}});
    const t = await r.text();
    return {status:r.status, text:t};
  }catch(e){ return {status:0, text:String(e)}; }
}
function jsonSafe(t){ const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x;})); try{return JSON.parse(t.slice(i));}catch(e){return null;} }

const out = {marker:'RINK-RECON4-0811', ts:new Date().toISOString()};

// 1. TEMP snippet: DB recon for MnM bundles
const phpB64 = `YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZGlhZyddID8/ICcnKSE9PSdEZzk5V3cxJykgcmV0dXJuOwoJQHNldF90aW1lX2xpbWl0KDE4MCk7CglnbG9iYWwgJHdwX2ZpbHRlcjsgJG89YXJyYXkoJ21hcmtlcic9PidTQVJHTyBESUFHIHYxJyk7Cgkkb1sna2xhc2UnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaXVfTGlrdWNpYWknKTsKCWZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX2FkZF90b19jYXJ0X3ZhbGlkYXRpb24nLCd3b29jb21tZXJjZV9wcm9kdWN0X2lzX2luX3N0b2NrJywnd29vY29tbWVyY2VfcHJvZHVjdF9nZXRfc3RvY2tfc3RhdHVzJywnd29vY29tbWVyY2VfY2hlY2tfY2FydF9pdGVtcycpIGFzICRoKXsKCQkkbD1hcnJheSgpOwoJCWlmKGlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicykgZm9yZWFjaCgkY2JzIGFzICRjYil7CgkJCSRuPWlzX2FycmF5KCRjYlsnZnVuY3Rpb24nXSk/KGlzX29iamVjdCgkY2JbJ2Z1bmN0aW9uJ11bMF0pP2dldF9jbGFzcygkY2JbJ2Z1bmN0aW9uJ11bMF0pOiRjYlsnZnVuY3Rpb24nXVswXSkuJzo6Jy4kY2JbJ2Z1bmN0aW9uJ11bMV06KGlzX3N0cmluZygkY2JbJ2Z1bmN0aW9uJ10pPyRjYlsnZnVuY3Rpb24nXTonY2xvc3VyZScpOwoJCQkkbFtdPSRwci4nOicuJG4uJyAoYXJncz0nLiRjYlsnYWNjZXB0ZWRfYXJncyddLicpJzsKCQl9CgkJJG9bJ2hvb2tfJy4kaF09JGw7Cgl9CgkvKiB0aWVzaW9naW5pcyBtZXRvZG8gdGVzdGFzICovCglpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUmlua2luaXVfTGlrdWNpYWknKSl7CgkJaWYoaXNfbnVsbChXQygpLT5jYXJ0KSkgd2NfbG9hZF9jYXJ0KCk7CgkJV0MoKS0+Y2FydC0+ZW1wdHlfY2FydCgpOyB3Y19jbGVhcl9ub3RpY2VzKCk7CgkJJG9bJ2dhbGltYV8zNDE3MiddPVBldHNob3BfUmlua2luaXVfTGlrdWNpYWk6OmdhbGltYV92aWVzYWkoMzQxNzIpOwoJCSRyZXo9UGV0c2hvcF9SaW5raW5pdV9MaWt1Y2lhaTo6a3JlcHNlbGlvX3Nhcmdhcyh0cnVlLDM0MTcyLDk5OSk7CgkJJHByPWFycmF5KCk7IGZvcmVhY2god2NfZ2V0X25vdGljZXMoKSBhcyAkdD0+JGEpeyBmb3JlYWNoKCRhIGFzICRuKXsgJHByW109JHQuJzogJy53cF9zdHJpcF9hbGxfdGFncyhpc19hcnJheSgkbik/KCRuWydub3RpY2UnXT8/JycpOiRuKTsgfSB9CgkJJG9bJ3RpZXNpb2dpYWlfOTk5J109YXJyYXkoJ3Jleic9PiRyZXo9PT1mYWxzZT8nQVRNRVRFJzonUFJBTEVJRE8nLCdwcmFuZXNpbWFpJz0+JHByKTsKCQl3Y19jbGVhcl9ub3RpY2VzKCk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK`;
const php = Buffer.from(phpB64,'base64').toString('utf8');
const snipRes = await wp('/wp-json/code-snippets/v1/snippets', {method:'POST', body:JSON.stringify({name:'TEMP ZZ Sargo Diag v1', code:php, scope:'global', active:true, priority:10})});
const snip = jsonSafe(snipRes.text);
out.snip_id = snip && snip.id ? snip.id : null;
out.snip_status = snipRes.status;
await new Promise(r=>setTimeout(r,3000));

// 2. Call the gate
try {
  const res = execSync(`curl -sk "${B}/?ps_diag=Dg99Ww1&k=ps2026" --max-time 120`, {encoding:'utf8', maxBuffer: 20*1024*1024});
  out.recon = jsonSafe(res);
  if(!out.recon) out.recon_raw = res.slice(0,3000);
} catch(e){ out.recon_err = String(e).slice(0,500); }

// 3. Deactivate temp snippet
if(out.snip_id){
  const d = await wp('/wp-json/code-snippets/v1/snippets/'+out.snip_id, {method:'POST', body:JSON.stringify({active:false})});
  out.snip_deact = d.status;
}

// 4. Write result via Contents API
const fn = 'screenshots/rinkrec_'+Date.now()+'.json';
const body = {message:'rinkrec result', content: Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const pr = await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+fn, {method:'PUT', headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'bridge'}, body:JSON.stringify(body)});
console.log('putResult', pr.status, fn);
fs.writeFileSync(fn.replace('screenshots/','screenshots/local_'), JSON.stringify(out).slice(0,500));
