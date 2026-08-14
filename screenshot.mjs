process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const RAW='https://raw.githubusercontent.com/'+REPO+'/94bc7198630d18d26b6d9f7a9af17e032ae0493b/maketai/vitrina_v2.html';
const r=await fetch(RAW); const html=await r.text();
fs.writeFileSync('/tmp/m.html',html);
console.log('html',html.length);
const br=await chromium.launch();
async function put(name,buf){
  let sha=null;
  try{const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:name,content:buf.toString('base64')}; if(sha) body.sha=sha;
  const p=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
  console.log('put',name,p.status,buf.length);
}
let pg=await br.newPage({viewport:{width:1440,height:1000}});
await pg.goto('file:///tmp/m.html'); await pg.waitForTimeout(900);
await pg.evaluate(()=>{const ids=LAUKAI[Object.keys(LAUKAI)[0]].krepsys.map(p=>p.id);
  for(let i=0;i<3;i++)k(ids[0],1); for(let i=0;i<2;i++)k(ids[3],1); for(let i=0;i<3;i++)k(ids[7],1); k(ids[8],2); k(ids[5],1);});
await pg.waitForTimeout(400);
await put('mv4_d_pilna.jpg', await pg.screenshot({type:'jpeg',quality:82,fullPage:true}));
await pg.evaluate(()=>perziura(LAUKAI[Object.keys(LAUKAI)[0]].krepsys[0].id));
await pg.waitForTimeout(400);
await put('mv4_d_modal.jpg', await pg.screenshot({type:'jpeg',quality:82}));
await pg.close();
pg=await br.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true});
await pg.goto('file:///tmp/m.html'); await pg.waitForTimeout(900);
await pg.evaluate(()=>perziura(LAUKAI[Object.keys(LAUKAI)[0]].krepsys[1].id));
await pg.waitForTimeout(400);
await put('mv4_m_modal.jpg', await pg.screenshot({type:'jpeg',quality:80}));
await br.close();
console.log('baigta');
