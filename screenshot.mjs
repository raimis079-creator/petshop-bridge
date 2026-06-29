import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function call(method, path, bodyObj){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(bodyObj)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,300)}; }
}
function newItem(title, catId, order, parent){
  const body={ title, type:'taxonomy', object:'product_cat', object_id:catId, menus:232, status:'publish', menu_order:order, parent:parent||0 };
  const r=call('POST','/wp-json/wp/v2/menu-items', body);
  return {title, catId, id:(r&&r.id)||null, err:(r&&(r.__exc||r.code||(r.__pe?r.raw:null)))||null};
}
function reparent(itemId, parentId, order){
  const r=call('POST','/wp-json/wp/v2/menu-items/'+itemId, {parent:parentId, menu_order:order});
  return {itemId, newParent:(r&&r.parent), order:(r&&r.menu_order), err:(r&&(r.__exc||r.code||(r.__pe?r.raw:null)))||null};
}
(async()=>{
  const out={ts:new Date().toISOString(), tops:[], children:[], reparent:[]};
  // 1. TOP items after ŽUVIMS (order 48)
  const R = newItem('RINKINIAI', 679, 49, 0);
  const S = newItem('SPRENDIMAI', 680, 50, 0);
  const P = newItem('PASIŪLYMAI', 681, 51, 0);
  out.tops=[R,S,P];

  // 2. CHILDREN
  if(R.id){
    out.children.push(newItem('Konservų rinkiniai',682,1,R.id));
    out.children.push(newItem('Skanėstų rinkiniai',683,2,R.id));
    out.children.push(newItem('Kramtalų rinkiniai',684,3,R.id));
  }
  if(S.id){
    out.children.push(newItem('Naujas šuniukas',685,1,S.id));
    out.children.push(newItem('Naujas kačiukas',686,2,S.id));
    out.children.push(newItem('Jautrus virškinimas',687,3,S.id));
    out.children.push(newItem('Šuo kasosi',688,4,S.id));
  }
  if(P.id){
    out.children.push(newItem('Akcijiniai pasiūlymai',689,1,P.id));
    // 3. RE-PARENT existing DOVANOS(2972) + DAUGIAU=PIGIAU(2971) under PASIŪLYMAI menu item
    out.reparent.push(reparent(2972, P.id, 2)); // DOVANOS
    out.reparent.push(reparent(2971, P.id, 3)); // DAUGIAU=PIGIAU
  }
  commit('build_menu.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
