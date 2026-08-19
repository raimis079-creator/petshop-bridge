process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'H079'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const dns=await import('dns/promises');
async function bandyk(f,...a){ try{ return await f(...a); }catch(e){ return 'kl: '+String(e.code||e).slice(0,40); } }
try{
  out.petshop={};
  out.petshop.NS   = await bandyk(dns.resolveNs,'petshop.lt');
  out.petshop.A    = await bandyk(dns.resolve4,'petshop.lt');
  out.petshop.SOA  = await bandyk(dns.resolveSoa,'petshop.lt');
  out.petshop.MX   = await bandyk(dns.resolveMx,'petshop.lt');
  out.petshop.TXT  = await bandyk(dns.resolveTxt,'petshop.lt');
  out.avesa={};
  out.avesa.NS     = await bandyk(dns.resolveNs,'avesa.lt');
  out.avesa.SOA    = await bandyk(dns.resolveSoa,'avesa.lt');
  out.avesa.A      = await bandyk(dns.resolve4,'avesa.lt');
  /* NS serveriu tapatybe */
  out.ns_ip={};
  const visi=new Set();
  for(const g of [out.petshop.NS,out.avesa.NS]) if(Array.isArray(g)) g.forEach(x=>visi.add(x));
  for(const n of visi) out.ns_ip[n]=await bandyk(dns.resolve4,n);
  /* ar iv.lt ir serveriai.lt NS sutampa */
  out.iv_ns  = await bandyk(dns.resolveNs,'iv.lt');
  out.srv_ns = await bandyk(dns.resolveNs,'serveriai.lt');
  /* TTL matavimas per HTTP DNS (Google) */
  out.ttl={};
  for(const [n,t] of [['petshop.lt','A'],['petshop.lt','NS'],['www.petshop.lt','A']]){
    try{
      const r=await fetch(`https://dns.google/resolve?name=${n}&type=${t}`,{headers:{'accept':'application/dns-json'}});
      const j=await r.json();
      out.ttl[n+'/'+t]=(j.Answer||[]).map(x=>({data:x.data,TTL:x.TTL}));
    }catch(e){ out.ttl[n+'/'+t]='kl'; }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h079.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h079 dns zonos patikra');
