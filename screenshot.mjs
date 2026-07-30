import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const TK=process.env.SENDER_TRANSACTIONAL_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR '+String(e).slice(0,150);}}
function txt(name){
  const r=sh('curl -sS -H "accept: application/dns-json" "https://dns.google/resolve?name='+name+'&type=TXT"');
  try{ const j=JSON.parse(r); return (j.Answer||[]).map(a=>a.data.replace(/"/g,'')); }catch(e){ return []; }
}
const O={lookups:[], total:0};
// rekursyviai skaiciuojam SPF DNS lookup'us
function countSpf(domain, depth){
  if(depth>4) return 0;
  const recs=txt(domain).filter(x=>/^v=spf1/i.test(x));
  if(!recs.length){ O.lookups.push({d:domain, note:'SPF nerastas'}); return 0; }
  const rec=recs[0];
  let n=0;
  const mechs=rec.match(/(include:[^\s]+|a(?=[\s:])|mx(?=[\s:])|ptr|exists:[^\s]+|redirect=[^\s]+)/g)||[];
  for(const m of mechs){
    if(m.startsWith('include:')){
      n+=1; const sub=m.slice(8);
      const c=countSpf(sub, depth+1);
      O.lookups.push({d:sub, own:1, nested:c, from:domain});
      n+=c;
    } else if(m==='a'||m==='mx'||m.startsWith('exists:')||m.startsWith('redirect=')){ n+=1; }
  }
  return n;
}
O.total = countSpf('petshop.lt',0);
O.verdict = O.total>10 ? 'VIRSIJA 10 -> SPF PERMERROR' : 'telpa i 10';

// realistinis testinis laiskas
const html = `<!DOCTYPE html><html lang="lt"><head><meta charset="utf-8"><title>Petshop.lt</title></head>
<body style="margin:0;padding:0;background:#F3EFE5;font-family:Arial,Helvetica,sans-serif;color:#1F2A24">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3EFE5;padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px">
<tr><td style="font-size:20px;font-weight:700;padding-bottom:16px">Jūsų užsakymas priimtas</td></tr>
<tr><td style="font-size:15px;line-height:1.6;padding-bottom:20px">
Sveiki, dėkojame už užsakymą. Gavome jūsų apmokėjimą ir jau ruošiame siuntą.
Kai ji iškeliaus, atsiųsime sekimo numerį.
</td></tr>
<tr><td style="padding-bottom:24px">
<a href="https://petshop.lt/my-account/orders/" style="background:#2d6a35;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600;display:inline-block">Peržiūrėti užsakymą</a>
</td></tr>
<tr><td style="font-size:12px;color:#7A867C;border-top:1px solid #eee;padding-top:16px;line-height:1.5">
UAB Avesa, Liucionių g. 46, Liucionys, LT-15166<br>
Gavote šį laišką, nes pateikėte užsakymą petshop.lt.<br>
<a href="https://petshop.lt/atsisakyti/" style="color:#7A867C">Atsisakyti pranešimų</a>
</td></tr>
</table></td></tr></table></body></html>`;
const text = `Jusu uzsakymas priimtas\n\nSveiki, dekojame uz uzsakyma. Gavome jusu apmokejima ir jau ruosiame siunta.\nKai ji iskeliaus, atsiusime sekimo numeri.\n\nPerziureti uzsakyma: https://petshop.lt/my-account/orders/\n\nUAB Avesa, Liucioniu g. 46, Liucionys, LT-15166\nGavote si laiska, nes pateikete uzsakyma petshop.lt.\nAtsisakyti: https://petshop.lt/atsisakyti/`;

const body={ from:{email:'terra@petshop.lt',name:'Petshop.lt'},
  to:{email:'test-3ux8bx8ih@srv1.mail-tester.com',name:'Testas'},
  subject:'Jūsų užsakymas priimtas', html:html, text:text };
fs.writeFileSync('/tmp/m.json',JSON.stringify(body));
const r=sh('curl -sS -X POST -H "Authorization: Bearer '+TK+'" -H "Content-Type: application/json" -H "Accept: application/json" --data-binary @/tmp/m.json "https://api.sender.net/v2/message/send"');
O.send=r.slice(0,300);
putB64('dns2.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
