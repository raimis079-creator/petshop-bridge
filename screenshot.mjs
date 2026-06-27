import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name,buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
// Žinomi farmina.com URL'ai - sukurti per ID brute scan
// Receptai ir jų farmina.com ID (mes patikrinsim su HEAD request keletą galimų)
const recipes=[
  // [recipeKey, productIds, farminaUrlSlug, candidate_fids (paieška ID range)]
  {key:'lamb_blueberry_adult_mini', wpIds:[33239,14532], url:'392-lamb-&-blueberry-adult-mini'},
  {key:'lamb_blueberry_adult_med_max', wpIds:[14535], url:'393-lamb-&-blueberry-adult-medium-&-maxi', knownPdf:'393_19_nd-pumpkin-canine-8-lamb-medium-maxi.pdf', done:true},
  {key:'lamb_blueberry_puppy_mini', wpIds:[33235,14528,14530], url:'388-lamb-&-blueberry-puppy-mini', knownPdf:'388_47_nd-pumpkin-canine-1-puppy-lamb-mini.pdf'},
  {key:'wild_boar_apple_adult_mini', wpIds:[33243,14537], url:null},
  {key:'wild_boar_apple_adult_med_max', wpIds:[14540,14539], url:null},
  {key:'quail_pomegr_adult_mini', wpIds:[14543], url:null},
  {key:'quail_pomegr_adult_med_max', wpIds:[14544], url:null},
  {key:'venison_apple_adult_med_max', wpIds:[14715], url:null},
  {key:'venison_apple_adult_mini', wpIds:[14545], url:null},
  {key:'duck_cantaloupe_adult_med_max', wpIds:[14542], url:null},
  {key:'duck_cantaloupe_adult_mini', wpIds:[14541], url:null},
  {key:'lamb_blueberry_puppy_med_max', wpIds:[14534], url:null},
  {key:'chicken_pomegranate_puppy_mini', wpIds:[14526], url:null},
  {key:'chicken_pomegranate_starter_all_br', wpIds:[14525,14524], url:null}
];
// Brute search ID range 380-450 for Pumpkin canine
const out={recipes,fetched:{},failed:[]};
async function fetchUrl(u){try{const buf=execSync(`curl -sk -L --max-time 25 -A "Mozilla/5.0" "${u}"`,{maxBuffer:200000000});return buf.toString();}catch(e){return '';}}
async function head(u){try{const code=execSync(`curl -sk -L -o /dev/null -w '%{http_code}' --max-time 15 -A "Mozilla/5.0" "${u}"`,{encoding:'utf8'});return parseInt(code);}catch(e){return 0;}}
// 1) Jei žinomas knownPdf - download tiesiai
// 2) Jei žinomas url - fetch HTML and extract dosi PDF link  
// 3) Jei nei vienas - skip (rinksim brute paskui)
for(const r of recipes){
  if(r.done){out.fetched[r.key]={status:'already_done',pdf:r.knownPdf};continue;}
  if(r.knownPdf){
    const pdfUrl=`https://www.farmina.com/fotoprodotti/dosi/${r.knownPdf}`;
    try{
      const buf=execSync(`curl -sk -L --max-time 30 -A "Mozilla/5.0" "${pdfUrl}" -o /tmp/p_${r.key}.pdf`,{maxBuffer:200000000});
      const sz=fs.statSync(`/tmp/p_${r.key}.pdf`).size;
      out.fetched[r.key]={pdf:r.knownPdf,bytes:sz};
      putBin(`farmina_pdf_${r.key}.pdf`, fs.readFileSync(`/tmp/p_${r.key}.pdf`));
      continue;
    }catch(e){out.failed.push({k:r.key,err:'known_dl_fail'});continue;}
  }
  if(r.url){
    const html=await fetchUrl(`https://www.farmina.com/us/eshop/dog-food/n&d-pumpkin-grain-free-canine/${r.url}.html`);
    const m=html.match(/fotoprodotti\/dosi\/([^"'\s]+\.pdf)/);
    if(m){
      const pdfPath=m[1];
      execSync(`curl -sk -L --max-time 30 -A "Mozilla/5.0" "https://www.farmina.com/fotoprodotti/dosi/${pdfPath}" -o /tmp/p_${r.key}.pdf`,{maxBuffer:200000000});
      const sz=fs.statSync(`/tmp/p_${r.key}.pdf`).size;
      out.fetched[r.key]={pdf:pdfPath,bytes:sz};
      putBin(`farmina_pdf_${r.key}.pdf`, fs.readFileSync(`/tmp/p_${r.key}.pdf`));
    } else out.failed.push({k:r.key,err:'no_pdf_in_html'});
  } else {
    out.failed.push({k:r.key,err:'no_url'});
  }
}
// BRUTE: probe IDs 380..420 (didžiausia tikimybė N&D Pumpkin canine)
// Surinksim visus dosi PDFs su prefiksu "{id}_" ir žodžiu "pumpkin" + "canine"
const bruteFound=[];
for(let id=380; id<=420; id++){
  const url=`https://www.farmina.com/us/eshop/dog-food/n&d-pumpkin-grain-free-canine/${id}-`;
  // tiesiog probe dosi katalogą per Google nereikia: bandom IDxx tiesiai į html paieška su pirminiu URL HEAD
  // Vietoj to bandysim atsiųsti dažną pattern of PDFs po brute paieška vėliau
}
commit("farmina_pumpkin_pdf_recon.json",JSON.stringify(out,null,1));
console.log("RECON DONE");
