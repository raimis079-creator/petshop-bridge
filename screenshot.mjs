import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const FIX="if ( ! defined( 'ABSPATH' ) ) { return; }\n\n/**\n * Petshop Build-a-box UI Valymas v1\n * Build-a-box (Mix and Match) produktuose Raimio custom \u201epsc-form\"/\u201eJ\u016bs\u0173 rinkinys\"\n * UI pakei\u010dia MNM default. Bet apa\u010dioje liko MNM default: validacijos \u017einut\u0117\n * (.mnm_message) + container kiekis (form.cart > .quantity). Paslepiam juos.\n * Scope: TIK body.petshop-choice-page (build-a-box). Normal\u016bs produktai nepaliesti.\n * form.cart > .quantity = TIESIOGINIS vaikas (container kiekis); preki\u0173 kiekiai\n * s\u0105ra\u0161e yra <td> viduje (giliau) -> child-combinator j\u0173 nelie\u010dia.\n */\nadd_action( 'wp_head', function () {\n\tif ( ! function_exists( 'is_product' ) || ! is_product() ) { return; }\n\techo '<style id=\"ps-boxui\">\n\tbody.petshop-choice-page .mnm_message{display:none !important;}\n\tbody.petshop-choice-page form.cart > .quantity{display:none !important;}\n\t</style>' . \"\\n\";\n}, 99 );\n";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{let id=0;try{
  const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'Petshop Build-a-box UI Valymas v1',desc:'hide MNM default message+qty on build-a-box',code:FIX,scope:'global',active:true,priority:10});
  try{id=JSON.parse(c.body).id;}catch(e){}
  L('boxui snippet id='+id+' http='+c.code);
  if(!id){L('fail '+c.body.slice(0,200));putText('_boxui.txt',out);return;}
  execSync('sleep 3');
  // curl-verify CSS in head + build-a-box body class
  const h=execSync('curl -s -k -L --max-time 45 "'+BASE+'/product/susidek-konservu-rinkini-sunims/"',{encoding:'utf8',maxBuffer:30000000});
  L('CSS ps-boxui galvoj: '+(h.indexOf('ps-boxui')>-1));
  L('petshop-choice-page body: '+(h.indexOf('petshop-choice-page')>-1));
  L('.mnm_message HTML yra (bus paslėptas CSS): '+(h.indexOf('mnm_message')>-1));
  // regresija: normalus produktas neturi petshop-choice-page (CSS nesuveiks jam)
  const norm=execSync('curl -s -k -L --max-time 45 "'+BASE+'/product/animonda-grancarno-adult-beef-duck-hearts-konservai-suaugusiems-sunims-su-jautiena-ir-anciu-sirdelemis-400-g-x-6-vnt/"',{encoding:'utf8',maxBuffer:30000000});
  L('normalus produktas petshop-choice-page(turi_but_false): '+(norm.indexOf('petshop-choice-page')>-1));
}catch(e){L('!!! '+e);}
finally{ putText('_boxui.txt',out+'\nID='+id); }
})();
