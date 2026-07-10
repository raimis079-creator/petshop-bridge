import { execSync } from "child_process";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
// saugus curl: niekad nemeta, grazina {code, body}
function req(url, auth){
  const a = auth ? '-u "'+auth+'" ' : '';
  try{
    const r = execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 30 '+a+'"'+url+'" 2>/dev/null || echo "CURLFAIL"',{encoding:'utf8'}).trim();
    let body=''; try{ body=execSync('cat /tmp/r.json',{encoding:'utf8'}); }catch(e){}
    return {code:r, body};
  }catch(e){ return {code:'ERR', body:(e.message||'').slice(0,120)}; }
}
const U=process.env.WP_USER||'';
const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;

L('=== WORDPRESS dev.avesa.lt ===');
L('  WP_USER: '+U+'   WP_APP_PASS: '+P.length+' chars');
L('');

const checks = [
  ['/wp-json/wp/v2/users/me?context=edit','Auth (users/me)'],
  ['/wp-json/wp/v2/plugins?search=complianz','Complianz plugin'],
  ['/wp-json/code-snippets/v1/snippets?per_page=1','Code Snippets API'],
  ['/wp-json/wc/v3/system_status','WooCommerce'],
];
for(const [path,label] of checks){
  const r = req('https://dev.avesa.lt'+path, AUTH);
  L('  '+label.padEnd(24)+' HTTP '+r.code);
  if(r.code==='200'){
    try{
      const j=JSON.parse(r.body);
      if(path.includes('users/me')) L('      -> '+j.name+' (id '+j.id+') roles='+(j.roles||[]).join(','));
      if(path.includes('plugins')&&Array.isArray(j)) j.forEach(p=>L('      -> '+p.name+' v'+p.version+' — '+p.status));
      if(path.includes('code-snippets')) L('      -> snippets API veikia ('+(Array.isArray(j)?j.length:'?')+' irasas)');
      if(path.includes('system_status')) L('      -> WC '+(j.environment?.version||'?')+' | WP '+(j.environment?.wp_version||'?')+' | PHP '+(j.environment?.php_version||'?'));
    }catch(e){ L('      -> (parse err)'); }
  } else if(r.code!=='200'){
    L('      -> '+r.body.slice(0,140).replace(/\n/g,' '));
  }
}
L('');
L('=== Aktyvus TEMP snippet check ===');
const s = req('https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?per_page=100&status=active', AUTH);
if(s.code==='200'){
  try{
    const arr=JSON.parse(s.body);
    L('  aktyvus snippet: '+arr.length);
    const temp=arr.filter(x=>/TEMP|probe|test/i.test(x.name));
    L('  aktyvus TEMP/probe/test: '+temp.length);
    temp.forEach(x=>L('    ['+x.id+'] '+x.name));
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+s.code);
putFile('conn_check2.txt', out); console.log(out);
