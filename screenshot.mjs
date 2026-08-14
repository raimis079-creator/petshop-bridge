process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const F={"23837": "https://dev.avesa.lt/wp-content/uploads/2026/06/0e43e3c1-338b-4934-9032-66fba324c0e8-280x280.png", "23846": "https://dev.avesa.lt/wp-content/uploads/2026/06/f9064095-3b1c-4cae-adc7-ac55e6c4835e-280x280.png", "24492": "https://dev.avesa.lt/wp-content/uploads/2026/06/a6350d39-ca91-4e4d-b373-a2b78d41a3d3-280x280.png", "23855": "https://dev.avesa.lt/wp-content/uploads/2026/06/8db7ae35-f9ff-4feb-b572-397360191d14-280x280.png", "23807": "https://dev.avesa.lt/wp-content/uploads/2026/06/897f841e-b1bd-4772-8800-1e36ef4bc007-280x280.png", "25340": "https://dev.avesa.lt/wp-content/uploads/2026/06/c8f08be0-8884-4434-9091-6d8ee62d8101-280x280.png", "21878": "https://dev.avesa.lt/wp-content/uploads/2026/06/18352643-33ab-4737-9ebd-211d4663468e-280x280.png", "21884": "https://dev.avesa.lt/wp-content/uploads/2026/06/df262984-6be9-4053-855a-ffb400974877-280x280.png", "21890": "https://dev.avesa.lt/wp-content/uploads/2026/06/20402cfc-d3fd-49f9-b1ba-2a973e130e63-280x280.png", "21893": "https://dev.avesa.lt/wp-content/uploads/2026/06/3a305373-6c01-4d1e-8317-c07ade636e40-280x280.png", "21899": "https://dev.avesa.lt/wp-content/uploads/2026/06/df5df7f1-2829-4d73-ad3c-945e3091772b-280x280.png", "21905": "https://dev.avesa.lt/wp-content/uploads/2026/06/12440d89-4563-4a3f-aadc-a1bb924963e0-280x280.png", "21256": "https://dev.avesa.lt/wp-content/uploads/2026/06/a55171a8-c5a4-40e0-9a57-6e6498c4cc61-280x280.png", "21223": "https://dev.avesa.lt/wp-content/uploads/2026/06/8523b9e8-3d27-412a-8233-3f30a5e5d8da-280x280.png", "21220": "https://dev.avesa.lt/wp-content/uploads/2026/06/9cda8b25-09a3-4581-b229-caba508bcde1-280x280.png", "21262": "https://dev.avesa.lt/wp-content/uploads/2026/06/f3d2b854-965e-4f59-936a-06f396bcb479-280x280.png"};
const out={};
for (const [id,u] of Object.entries(F)){
  try{ const r=await fetch(u);
    if(r.status!==200){ out[id]={err:r.status}; continue; }
    const b=Buffer.from(await r.arrayBuffer());
    out[id]={n:b.length,b64:b.toString('base64')};
  }catch(e){ out[id]={err:String(e).slice(0,60)}; }
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/imgs3.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'imgs3',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/imgs3.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status,Object.keys(out).length);
