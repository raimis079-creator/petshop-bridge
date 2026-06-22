import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:200000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=process.env.RUN_TS;
const ids="12454,12460,12461,12462,12463,12464,12565,12661,12685,14278,14478,14516,14517,14546,14547,14553,14630,14633,14634,14650,14651,14772,14795,16207,16210,16217,16225,16228,16248,16254,16259,16265,16270,16326,16329,16402,16411,16422,16425,16431,16466,16469,16472,16475,16478,16481,16516,16519,16525,16534,16573,16576,16579,16582,16585,16588,16591,16594,16606,16609,16624,16627,16630,16633,16642,16645,16699,16702,16708,16712,16715,16718,16721,16724,16727,16745,16751,16763,16772,16776,16779,16782,16785,16788,16791,16794,16810,16824,16854,16857,16862,16865,16868,16871,16876,16881,16886,16889,17748,17751,17903,17947,17950,17959,17965,17969,18051,18054,18058,18080,18084,18149,18154,18159,18169,18172,18178,18181,18188,18191,18197,18203,18206,18212,18218,18221,18227,18233,18236,18245,18248,18254,18257,18260,18263,18266,18269,18272,18278,18281,18284,18290,18296,18302,18314,18320,18323,18326,18329,18332,18335,18338,18341,18354,18366,18369,18372,18379,18382,18385,18521,18524,18527,18530,18533,18536,18539,18542,18572,18617,18623,19199,19201,19204,19207,19210,19213,19715,19720,19725,19730,19735,19740,19747,19751,19756,19760,19765,19770,19775,19780,19785,21123,21531,26899,27126,27128,27130,27132,33231,33370,33394".split(',');
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:80000000})); }
let prods=[];
for(let i=0;i<ids.length;i+=100){
  const chunk=ids.slice(i,i+100).join(',');
  try{ const r=wc('products?include='+chunk+'&per_page=100&_fields=id,name,description'); prods=prods.concat(r); }catch(e){}
}
const out={fetched:prods.length, analitines:{parser_gap:0,data_gap:0}, sudetis:{parser_gap:0,data_gap:0}, serimo:{parser_gap:0,data_gap:0}, examples_pg:[], examples_dg:[]};
const dec=s=>String(s||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
for(const p of prods){
  const raw=dec(p.description||'');
  const hasAnal=/analitin/i.test(raw)||/\u017Eali\s+baltymai|\u017Eali\u0173\s+baltym/i.test(raw);
  const hasSud=/sud\u0117tis/i.test(raw);
  const hasSer=/\u0161\u0117rim|rekomenduojamas\s+kiekis|paros\s+norm/i.test(raw);
  // is missing what? remčiamės audito CSV nereikia — tiesiog klasifikuojam visus tris
  // analitines: jei keyword yra bet sekcija nebuvo atpazinta -> tikriausiai parser-gap
  if(hasAnal) out.analitines.parser_gap++; else out.analitines.data_gap++;
  if(hasSud) out.sudetis.parser_gap++; else out.sudetis.data_gap++;
  if(hasSer) out.serimo.parser_gap++; else out.serimo.data_gap++;
  if(hasAnal && out.examples_pg.length<6) out.examples_pg.push({id:p.id,name:(p.name||'').slice(0,40),snip:raw.replace(/\s+/g,' ').slice(0,180)});
  if(!hasAnal && !hasSud && out.examples_dg.length<6) out.examples_dg.push({id:p.id,name:(p.name||'').slice(0,40),snip:raw.replace(/\s+/g,' ').slice(0,140)});
}
putResult('fooddiag_'+TS+'.json', JSON.stringify(out,null,1));
