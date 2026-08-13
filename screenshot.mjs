process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'SHARE OFF', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const URL_P='https://dev.avesa.lt/product/josidog-regular-15-kg-sausas-maistas-sunims/';
/* PRIES */
try{
  const h=execSync('curl -sk "'+URL_P+'" --max-time 90',{encoding:'utf8',maxBuffer:20*1024*1024});
  out.pries={ share_icons:(h.match(/share-icons/g)||[]).length, twitter:(h.match(/Share on Twitter/gi)||[]).length };
}catch(e){ out.pries='ERR'; }
const b64=execSync('curl -s "https://raw.githubusercontent.com/'+REPO+'/main/deploy/snip.php.b64"',{encoding:'utf8'}).trim();
const php=Buffer.from(b64,'base64').toString('utf8');
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'Petshop Vitrina Dalinimasis v1.0 (isjungti social mygtukai)',code:php,scope:'front-end',active:true,priority:10})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,200);
await new Promise(r=>setTimeout(r,5000));
/* PO */
try{
  const h=execSync('curl -sk "'+URL_P+'?nc='+Date.now()+'" --max-time 90',{encoding:'utf8',maxBuffer:20*1024*1024});
  out.po={ share_icons:(h.match(/share-icons/g)||[]).length, twitter:(h.match(/Share on Twitter/gi)||[]).length };
}catch(e){ out.po='ERR'; }
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:900,height:900}});
  const pg=await ctx.newPage();
  await pg.goto(URL_P,{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(2500);
  out.matosi = await pg.evaluate(()=>({
    share:document.querySelectorAll('.share-icons, .social-icons').length,
    matomi:[...document.querySelectorAll('.share-icons a, .social-icons a')].filter(a=>a.offsetParent!==null).length
  }));
  await pg.evaluate(()=>{ const k=[...document.querySelectorAll('*')].find(e=>/Kategorija:/.test(e.textContent) && e.children.length<4); if(k) k.scrollIntoView({block:'center'}); });
  await pg.waitForTimeout(800);
  await pg.screenshot({path:'screenshots/share_po.png',fullPage:false}); files.push('screenshots/share_po.png');
  await br.close();
}catch(e){ out.err=String(e).slice(0,250); }
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res shoff',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/shoff.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/shoff.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
