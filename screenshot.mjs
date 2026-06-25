import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function wc(path){for(let i=0;i<3;i++){try{execSync(`curl -sk --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}" -o /tmp/w.json`,{encoding:'utf8',env,maxBuffer:80000000});return JSON.parse(fs.readFileSync('/tmp/w.json','utf8'));}catch(e){execSync('sleep 2');}}return null;}
const ids=[21663,21661,21659,20493,20490,20487,20484,20481,20478,20475,20472,20469,20466,20463,20461,20458,20455];
const names={21663:"Jr Menu Turkey 400",21661:"Jr Menu Chicken 400",21659:"Jr Pure Beef 400",20493:"Menu Chick+Carrot 400",20490:"Menu Duck+Pumpkin 400",20487:"Menu Beef+Potato 400",20484:"Pure Turkey 400",20481:"Pure Lamb 400",20478:"Pure Chicken 400",20475:"Pure Beef 400",20472:"Menu Duck+Pumpkin 800",20469:"Menu Chick+Carrot 800",20466:"Menu Beef+Potato 800",20463:"Pure Turkey 800",20461:"Pure Lamb 800",20458:"Pure Chicken 800",20455:"Pure Beef 800"};
const out=[];
const r=wc(`products?include=${ids.join(',')}&per_page=100&_fields=id,name,status,stock_status,stock_quantity,manage_stock,meta_data`);
if(Array.isArray(r)){
  for(const p of r){
    const m={}; (p.meta_data||[]).forEach(x=>{ if(["_vf_qty","_zb_qty","_zb_stock","_stock","_legacy_manufacturer","_vf_last_sync"].includes(x.key)) m[x.key]=x.value; });
    out.push({id:p.id,n:names[p.id]||p.name,st:p.status,stk:p.stock_status,qty:p.stock_quantity,manage:p.manage_stock,vf:m._vf_qty,zb:m._zb_qty||m._zb_stock,mf:m._legacy_manufacturer});
  }
}
out.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
commit("konstock_"+Date.now()+".json", JSON.stringify({count:out.length,items:out},null,1));
console.log("DONE",out.length);
