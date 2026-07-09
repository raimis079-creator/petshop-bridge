import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function probe(u){
  try{
    const r = execSync('curl -sk -o /dev/null -w "%{http_code}|%{redirect_url}" -u "$WPU:$WPP" --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim();
    const [code, loc] = r.split('|');
    return { code, loc };
  }catch(e){ return { code:'TO', loc:'' }; }
}
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
// Abu variantai: root ir /sprendimai/ vaikas
const cands = [
  ['Naujas šuniukas',        ['/naujas-suniukas/','/sprendimai/naujas-suniukas/']],
  ['Naujas kačiukas',        ['/naujas-kaciukas/','/sprendimai/naujas-kaciukas/']],
  ['Jautrus virškinimas',    ['/jautrus-virskinimas/','/sprendimai/jautrus-virskinimas/']],
  ['Sterilizuotas augintinis',['/sterilizuotas-augintinis/','/sprendimai/sterilizuotas-augintinis/']],
  ['Išrankus augintinis',    ['/isrankus-augintinis/','/sprendimai/isrankus-augintinis/']],
  ['Kraiko pasirinkimas',    ['/kraiko-pasirinkimas/','/sprendimai/kraiko-pasirinkimas/']],
];
for(const [name, urls] of cands){
  out += name+'\n';
  for(const u of urls){
    const p = probe(u);
    let extra = '';
    if(p.code === '200'){
      const html = get(u);
      const h1 = (html.match(/<h1[^>]*>([\s\S]{0,120}?)<\/h1>/)||[])[1];
      extra = ' h1="'+(h1?h1.replace(/<[^>]+>/g,'').trim().slice(0,55):'nera')+'"';
    }
    out += '  '+p.code.padEnd(4)+u+(p.loc?(' -> '+p.loc):'')+extra+'\n';
  }
  out += '\n';
}
out += 'HUB /sprendimai/: '+probe('/sprendimai/').code+'\n';
putFile('gidai.txt', out);
