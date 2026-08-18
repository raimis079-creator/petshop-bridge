process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'G971'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const zlib=await import('zlib');
for (const [vardas,url] of [
  ['en','https://www.google.com/basepages/producttype/taxonomy-with-ids.en-US.txt'],
  ['lt','https://www.google.com/basepages/producttype/taxonomy-with-ids.lt-LT.txt']]) {
  try{
    const r=await fetch(url);
    out[vardas]={status:r.status};
    if(r.ok){
      const t=await r.text();
      const gyv=t.split('\n').filter(x=>/Animals|Gyv/i.test(x));
      out[vardas].eiluciu=t.split('\n').length;
      out[vardas].gyvunu=gyv.length;
      await put('taksonomija/'+vardas+'.txt.gz', zlib.gzipSync(Buffer.from(gyv.join('\n'))), 'google taksonomija '+vardas);
    }
  }catch(e){ out[vardas]={klaida:String(e).slice(0,150)}; }
}
await put('screenshots/g971.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g971');
