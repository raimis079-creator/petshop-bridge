import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let out='';const L=s=>{out+=s+'\n';};

  // 1. Ar MyAccount augintinis tab HTML turi #pspet-profile div?
  //    Naudojam cookie login: pirma gaunam nonce+cookie
  //    Paprasčiau — patikrinam ar endpoint apskritai veikia (rewrite flush)
  const html = sh('curl -s -k -A "Mozilla/5.0" --max-time 30 -L "'+BASE+'/my-account/augintinis/?nc='+Date.now()+'"');
  L('=== MyAccount augintinis (be login) ===');
  L('has_pspet_profile_div: '+(html.indexOf('id="pspet-profile"')>=0));
  L('has_profile_js: '+(html.indexOf('pet-profile.js')>=0));
  L('has_login_form: '+(html.indexOf('woocommerce-form-login')>=0 || html.indexOf('username')>=0));
  L('has_menu_augintinis: '+(html.indexOf('augintinis')>=0));
  L('html_len: '+html.length);

  // 2. Ar endpoint uzregistruotas (rewrite)? Patikrinam menu itema
  //    Ieskom "Mano augintinis" teksto
  L('has_menu_text: '+(html.indexOf('Mano augintinis')>=0));

  // 3. Ar pet-profile.js failas pasiekiamas?
  L('profile_js_http: '+sh('curl -s -k -A "Mozilla/5.0" --max-time 20 -o /dev/null -w "%{http_code}" "'+BASE+'/wp-content/plugins/petshop-core/assets/pet-profile.js"'));

  putText('profile_debug.txt', out);
})();
