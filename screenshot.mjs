import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
const BASE="https://dev.avesa.lt/wp-json";

const code=`/**
 * Petshop Slėpti svorį ir dimensijas v1 (display only)
 * Paslepia "Svoris" ir "Išmatavimai" eilutes iš Additional Information tab'o.
 * DB meta (_weight/_length/_width/_height) lieka nepakeisti - siuntimo skaiciavimas veikia.
 */
add_filter( 'woocommerce_display_product_attributes', function( $product_attributes, $product ) {
    unset( $product_attributes['weight'] );
    unset( $product_attributes['dimensions'] );
    return $product_attributes;
}, 10, 2 );`;

const payload={
  name:"Petshop Slėpti svorį ir dimensijas v1 (display only)",
  desc:"Paslepia Svoris/Išmatavimai eilutes iš Additional Information; DB meta lieka",
  code:code,
  active:true,
  scope:"global",
  priority:10
};
fs.writeFileSync('/tmp/snip.json',JSON.stringify(payload));
try{
  const r=execSync(`curl -sk --max-time 30 -X POST -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/snip.json "${BASE}/code-snippets/v1/snippets"`,{env,encoding:'utf8',maxBuffer:200000000});
  const j=JSON.parse(r);
  // Patikrinkim ar aktyvuotas
  let created={id:j.id,active:j.active,scope:j.scope,name:j.name};
  // Aktyvuojam jei ne
  if(!j.active && j.id){
    execSync(`curl -sk -X POST -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/code-snippets/v1/snippets/${j.id}/activate"`,{env});
    const j2=JSON.parse(execSync(`curl -sk -u "$WP_USER:$WP_PASS_CLEAN" "${BASE}/code-snippets/v1/snippets/${j.id}"`,{env,encoding:'utf8'}));
    created.activeAfter=j2.active;
  }
  // Visi atsakymo laukai
  created.raw=JSON.stringify(j).slice(0,500);
  commit("snip_create.json",JSON.stringify(created,null,1));
}catch(e){commit("snip_create.json",JSON.stringify({err:String(e).slice(0,300)},null,1));}
console.log("DONE");
