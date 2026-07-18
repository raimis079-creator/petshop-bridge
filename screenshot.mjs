import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function up(name, buf){
  const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;
  let s=''; try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pp.json',JSON.stringify({message:'calc shot',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  return execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pp.json "${u}"`,{maxBuffer:120*1024*1024}).toString().trim();
}
const o={};
let chromium=null;
try{ ({chromium}=await import('playwright')); }catch(e){
  try{ execSync('npm i playwright@1.49.0 --no-save 2>&1 | tail -1 && npx playwright install chromium 2>&1 | tail -1',{stdio:'ignore',timeout:180000}); ({chromium}=await import('playwright')); }catch(e2){ o.pw_err=String(e2).slice(0,200); }
}
if(chromium){
  const br=await chromium.launch({args:['--ignore-certificate-errors','--no-sandbox']});
  const URL='https://dev.avesa.lt/product/exclusion-hypoallergenic-mini-mazu-veisliu-sunu-maistas-su-arkliena-ir-bulvemis-s-2-kg/';
  async function shoot(vp, fname, clip){
    const pg=await br.newPage({viewport:vp, ignoreHTTPSErrors:true});
    await pg.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForSelector('#ps-fcalc',{timeout:20000});
    await pg.fill('#ps-fcalc-w','5');
    await pg.click('#ps-fcalc-btn');
    await pg.waitForFunction(()=>{const el=document.getElementById('ps-fcalc-out');return el&&el.textContent.includes('porcija');},{timeout:20000}).catch(()=>{});
    await pg.waitForTimeout(1200);
    const el=await pg.$('#ps-fcalc');
    const box=el?await el.boundingBox():null;
    let buf;
    if(box && clip){ buf=await pg.screenshot({clip:{x:Math.max(0,box.x-16),y:Math.max(0,box.y-16),width:Math.min(vp.width,box.width+32),height:box.height+32}}); }
    else { if(box) await pg.evaluate(()=>document.getElementById('ps-fcalc').scrollIntoView({block:'center'})); await pg.waitForTimeout(400); buf=await pg.screenshot(); }
    o[fname+'_out_text']=await pg.$eval('#ps-fcalc-out',e=>e.textContent.trim().slice(0,200)).catch(()=>null);
    await pg.close();
    return buf;
  }
  try{
    const d1=await shoot({width:1280,height:900},'calc_desktop',true);  o.desktop_up=up('calc_desktop.png',d1);
    const d2=await shoot({width:1280,height:900},'calc_desktop_full',false); o.desktop_full_up=up('calc_desktop_full.png',d2);
    const m1=await shoot({width:390,height:844},'calc_mobile',false);  o.mobile_up=up('calc_mobile.png',m1);
  }catch(e){ o.shot_err=String(e).slice(0,300); }
  await br.close();
}
const u2=`https://api.github.com/repos/${REPO}/contents/screenshots/shot.json`;
let s2=''; try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u2}?nocache=${Math.random()}"`).toString()); if(j.sha)s2=j.sha;}catch(e){}
fs.writeFileSync('/tmp/p2.json',JSON.stringify({message:'shot meta',content:Buffer.from(JSON.stringify({d:o})).toString('base64'),...(s2?{sha:s2}:{})}));
execSync(`curl -s -o /dev/null -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p2.json "${u2}"`);
