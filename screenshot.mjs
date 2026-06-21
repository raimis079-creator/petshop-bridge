import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function prods(catId){
  let all=[];
  for(let p=1;p<=3;p++){
    const r=JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products?category=${catId}&per_page=100&page=${p}&status=any&_fields=id,name,attributes"`,{encoding:"utf8",env,maxBuffer:20*1024*1024}));
    all=all.concat(r.map(x=>{
      const a={};(x.attributes||[]).forEach(at=>{ if(/tipas|dydis/i.test(at.name)) a[at.name]=(at.options||[]).join(",");});
      return {id:x.id,name:x.name,attr:a};
    }));
    if(r.length<100) break;
  }
  return all;
}
const out={};
try{ out.draskykles = prods(124); }catch(e){ out.d_err=String(e).slice(0,80); }
try{ out.apranga = prods(305); }catch(e){ out.a_err=String(e).slice(0,80); }
fs.writeFileSync("screenshots/audit_terms.txt", JSON.stringify(out));
