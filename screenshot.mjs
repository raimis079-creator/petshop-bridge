import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'catc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
// 1. dovanos kategorija
out.dovanos=wp('/wp-json/wp/v2/product_cat?search=dovan&_fields=slug,link,count');
// 2. ar yra prieziuros-priemones parent (platesnis nei antiparazitines)
out.prieziuros=wp('/wp-json/wp/v2/product_cat?search=prieziuros&_fields=slug,link,count');
// 3. antiparazitines - visos
out.antiparaz=wp('/wp-json/wp/v2/product_cat?search=antiparaz&_fields=slug,link,count');
// 4. veisles/breed index puslapis (page ar post)
out.veisles_page=wp('/wp-json/wp/v2/pages?search=veisl&_fields=slug,link,status&per_page=5');
out.veisles_cat=wp('/wp-json/wp/v2/product_cat?search=veisl&_fields=slug,link,count');
// 5. sunims prieziuros - ar yra parent kategorija su daug prekiu
out.sunims_care=wp('/wp-json/wp/v2/product_cat?search=sunims&_fields=slug,link,count&per_page=30');
putFile('catcontent.json',JSON.stringify(out));
