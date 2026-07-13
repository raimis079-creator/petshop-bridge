import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop UI Lokalizacija v1\n * Nei\u0161verst\u0173 angli\u0161k\u0173 UI eilu\u010di\u0173 vertimas \u012f lietuvi\u0173 (gettext override).\n * Ple\u010diama: prid\u0117k eilut\u0119 \u012f $map. Match pagal originali\u0105 (angli\u0161k\u0105) eilut\u0119.\n * Rodoma DID\u017dIOSIOM raid\u0117m da\u017enai per CSS (text-transform) \u2014 ver\u010diam normali\u0105 eilut\u0119.\n */\nfunction petshop_ui_l10n_map() {\n\treturn array(\n\t\t// YITH Ajax filtras\n\t\t'Active filters'    => 'Aktyv\u016bs filtrai',\n\t\t'Clear'             => 'I\u0161valyti',\n\t\t// WooCommerce\n\t\t'Select options'    => 'Pasirinkti',\n\t\t'Add to cart'       => '\u012e krep\u0161el\u012f',\n\t\t'Read more'         => 'Pla\u010diau',\n\t\t// Rinkinio d\u0117\u017e\u0117 (build-a-box)\n\t\t'Clear selections'  => 'I\u0161valyti pasirinkimus',\n\t\t'Clear selection'   => 'I\u0161valyti pasirinkim\u0105',\n\t);\n}\n\nadd_filter( 'gettext', function ( $translation, $text, $domain ) {\n\t$map = petshop_ui_l10n_map();\n\tif ( isset( $map[ $text ] ) ) {\n\t\treturn $map[ $text ];\n\t}\n\treturn $translation;\n}, 20, 3 );\n\n// su_domain variantas (kai kurie plugin'ai naudoja gettext_with_context)\nadd_filter( 'gettext_with_context', function ( $translation, $text, $context, $domain ) {\n\t$map = petshop_ui_l10n_map();\n\tif ( isset( $map[ $text ] ) ) {\n\t\treturn $map[ $text ];\n\t}\n\treturn $translation;\n}, 20, 4 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function chk(u){try{return execSync('curl -s -k -L --max-time 45 "'+u+'"',{encoding:'utf8',maxBuffer:30000000});}catch(e){return '';}}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop UI Lokalizacija v1',desc:'gettext EN->LT',code:FIX,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('lokalizacija snippet id='+id+' http='+c.code);
  if(!id){L('fail '+c.body.slice(0,200));putText('_lok.txt',out);return;}
  execSync('sleep 3');
  // kategorija su variable produktais (Select options) + konservai
  const kat=chk(BASE+'/kategorija/sunims/konservai-sunims/');
  L('/konservai-sunims/: Pasirinkti='+(kat.indexOf('Pasirinkti')>-1)+' SelectOptions(EN,turi_but_false)='+(kat.indexOf('Select options')>-1||kat.indexOf('Select Options')>-1)+' ĮkrepšelĮ='+(kat.indexOf('krepšel')>-1)+' AddToCart(EN)='+(kat.indexOf('Add to cart')>-1||kat.indexOf('Add to Cart')>-1));
  // build-a-box produktas
  const box=chk(BASE+'/product/susidek-konservu-rinkini-sunims/');
  L('/susidek-konservu-rinkini-sunims/: ĮkrepšelĮ='+(box.indexOf('Į krepšelį')>-1||box.indexOf('krepšel')>-1)+' AddToCart(EN)='+(box.indexOf('Add to cart')>-1)+' IšvalytiPasirinkimus='+(box.indexOf('Išvalyti pasirinkimus')>-1)+' ClearSelections(EN)='+(box.indexOf('Clear selections')>-1||box.indexOf('Clear Selections')>-1));
}catch(e){L('!!! '+e);}
finally{ putText('_lok.txt',out+'\nID='+id); }
})();
