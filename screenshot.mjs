process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||'';
const REPO='raimis079-creator/petshop-bridge';
const U='https://dev.avesa.lt/wp-content/uploads/2026/06/';
const F={
19594:'82746-animonda-grancarno-adult-jautiena-su-anciu-sirdelemis-konservai-sunims_1754644444-280x280.jpg',
19586:'82733-animonda-grancarno-adult-jautiena-su-eriena-konservai-sunims_1754565003-280x280.jpg',
17159:'ontario-lamb-pate-400g-konservai-sunims-su-eriena_1779958797-280x280.webp',
19549:'82802-animonda-grancarno-adult-su-paukstienos-sirdelemis-konservai-sunims_1754568246-280x280.jpg',
19475:'82477-animonda-grancarno-adult-su-sirdimis_1754555473-280x280.jpg',
19566:'82801-animonda-grancarno-adult-su-antiena-konservai-sunims_1754642984-280x280.jpg',
19590:'82747-animonda-grancarno-adult-jautiena-su-anciu-sirdelemis-konservai-sunims_1754644665-280x280.jpg',
19582:'82742-animonda-grancarno-adult-jautiena-su-eriena-konservai-sunims_1754565034-280x280.jpg',
19570:'82744-animonda-grancarno-adult-jautiena-konservai-sunims_1754570190-280x280.jpg',
19562:'82804-animonda-grancarno-adult-su-antiena-konservai-sunims_1754643067-280x280.jpg',
19545:'82805-animonda-grancarno-adult-su-paukstienos-sirdelmis-konservai-sunims_1754568326-280x280.jpg',
19578:'an-animonda-grancarno-adult-beef-rabbit-with-herbs-konservai-suaugusiems-sunims-su-sviezia-jautiena-ir-triusiena-paskaninta-zolelem-1-280x280.jpg',
18521:'exclusion-mediteraneo-monoprotein-jautiena-konservai-sunims_1776419773-280x280.jpg',
18518:'exclusion-mediteraneo-monoprotein-kalakutiena-400g_1776418657-280x280.jpg',
18512:'exclusion-mediteraneo-monoprotein-eriena-konservai-sunims_1776419348-280x280.jpg',
18515:'exclusion-mediteranio-monoprotein-versiena-400g-konservai-sunims_1776417809-280x280.jpg',
23478:'6ca85ecc-2fc5-4ca2-b719-c7feff08f3a1-280x280.png',
23480:'5d7b8785-b1a0-4f0f-bade-0ba19a6112f3-280x280.png',
23472:'7790a080-3f15-441f-b13d-d43bde3b9057-280x280.png',
22983:'d57b81ea-7f34-471b-9ef8-e40d412297d4-280x280.png'};
const out={};
for (const [id,f] of Object.entries(F)){
  try{
    const r=await fetch(U+encodeURI(f));
    if(r.status!==200){ out[id]={err:r.status}; continue; }
    const b=Buffer.from(await r.arrayBuffer());
    out[id]={t:r.headers.get('content-type'), n:b.length, b64:b.toString('base64')};
  }catch(e){ out[id]={err:String(e).slice(0,80)}; }
}
const body={message:'imgs',content:Buffer.from(JSON.stringify(out)).toString('base64')};
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/imgs_0814.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
if(sha) body.sha=sha;
const r=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/imgs_0814.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',r.status, Object.keys(out).length);
