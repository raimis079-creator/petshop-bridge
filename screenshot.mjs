process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H078'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const tls=await import('tls');
const dns=await import('dns/promises');

function tikrinti(host, servername, port=443){
  return new Promise((res)=>{
    const s=tls.connect({host,port,servername,rejectUnauthorized:false,timeout:12000},()=>{
      const c=s.getPeerCertificate(true);
      res({ok:1, servername,
        subject:c.subject?c.subject.CN:null,
        issuer:c.issuer?(c.issuer.O||c.issuer.CN):null,
        san:c.subjectaltname||null,
        nuo:c.valid_from, iki:c.valid_to,
        autorizuotas:s.authorized, klaida:s.authorizationError||null,
        protokolas:s.getProtocol()});
      s.end();
    });
    s.on('error',e=>res({ok:0,servername,kl:String(e).slice(0,120)}));
    s.on('timeout',()=>{ s.destroy(); res({ok:0,servername,kl:'timeout'}); });
  });
}
try{
  out.dns={};
  for(const h of ['petshop.lt','www.petshop.lt','dev.avesa.lt']){
    try{ out.dns[h]=await dns.resolve4(h); }catch(e){ out.dns[h]='kl'; }
  }
  /* NAUJASIS serveris su petshop.lt vardu — svarbiausias testas */
  out.naujas_su_petshop = await tikrinti('79.98.29.24','petshop.lt');
  out.naujas_su_www     = await tikrinti('79.98.29.24','www.petshop.lt');
  out.naujas_su_dev     = await tikrinti('79.98.29.24','dev.avesa.lt');
  /* dabartinis gyvas petshop.lt (eShoprent) — palyginimui */
  out.dabartinis        = await tikrinti('petshop.lt','petshop.lt');
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h078.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h078 ssl patikra');
