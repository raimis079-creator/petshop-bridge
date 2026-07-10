import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<5;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'diag2 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 3'); }
  return false;
}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
function sh(c){ try{ return execSync(c,{encoding:'utf8',stdio:['pipe','pipe','pipe']}); }catch(e){ return 'EXIT='+e.status+' '+String(e.stderr||'').slice(0,120); } }

const PATHS=[
 '/sunims','/katems','/sunims/maistas-sunims','/katems/maistas-katems',
 '/sunims/maistas-sunims/sausas-maistas-sunims','/katems/maistas-katems/sausas-maistas-katems',
 '/sunims/antiparazitines-priemones-sunims','/katems/tualetai-kraiku-semtuveliai-kilimeliai',
 '/katems/antiparazitines-priemones-katems','/zuvims-2007550667/tvenkiniu-zuvu-maistas',
 '/katems/kraikai-kaciu-tualetams','/katems/zaislai-katems',
 '/exclusion','/prins-petfoods','/dovanos-sunims-bei-katems','/hipoalerginis-maistas-sunims',
 '/sepija-mineralas-skanestas-pauksciams-20-cm-1-vnt','/athena-pienas-katems-200-ml'
];
const HOSTS=['https://dev.avesa.lt','https://petshop.lt'];
const res=[];
for(const p of PATHS){
  for(const variant of [p, p+'/']){
    for(const h of HOSTS){
      // pilna grandine: statuso kodai + Location antrastes
      const chain=sh('curl -sS -k -m 25 -o /dev/null -A "Mozilla/5.0 (iPhone)" -L -w "%{http_code}|%{num_redirects}|%{url_effective}" "'+h+variant+'"');
      const heads=sh('curl -sS -k -m 25 -I -A "Mozilla/5.0 (iPhone)" "'+h+variant+'" | tr -d "\\r" | grep -Ei "^(HTTP/|location:|x-redirect-by:|link:)" | tr "\\n" " ; "');
      res.push({path:variant,host:h,chain:chain.trim(),heads:heads.trim()});
    }
  }
}
putFile('redirect_probe.json',JSON.stringify(res,null,1));
for(const r of res) L(`${r.host.replace('https://','')}${r.path}\n    -> ${r.chain}\n    hdr: ${r.heads}`);
// ar Redirection pluginas apskritai idiegtas dev'e?
L('--- WP plugin check per REST ---');
L(sh('curl -sS -k -m 20 "https://dev.avesa.lt/wp-json/" | head -c 300'));
L('--- robots/htaccess uzuominos ---');
L(sh('curl -sS -k -m 20 "https://dev.avesa.lt/robots.txt" | head -c 400'));
putFile('_diag2_log.txt',out);
