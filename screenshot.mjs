process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'M8REC-1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'m8rec',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const s=await snip('TEMP M8 REC',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_m'] ?? '') !== 'M8rx') return;",
" global \$wpdb; \$o=array(); \$P=\$wpdb->prefix;",
" \$vis=\$wpdb->get_col(\"SHOW TABLES LIKE '{\$P}ps_%'\");",
" \$o['lenteles']=array();",
" foreach(\$vis as \$t){",
"   \$v=str_replace(\$P,'',\$t);",
"   \$o['lenteles'][\$v]=array('n'=>(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM \$t\"),'st'=>\$wpdb->get_col(\"SHOW COLUMNS FROM \$t\"));",
" }",
" /* anketos turinys — pet lenteles pavyzdys */",
" if(in_array(\$P.'ps_pets',\$vis)){ \$o['pets_pvz']=\$wpdb->get_results(\"SELECT * FROM {\$P}ps_pets ORDER BY id DESC LIMIT 3\", ARRAY_A); }",
" if(in_array(\$P.'ps_pet_products',\$vis)){ \$o['pp_pvz']=\$wpdb->get_results(\"SELECT * FROM {\$P}ps_pet_products LIMIT 3\", ARRAY_A); }",
" if(in_array(\$P.'ps_feeding_map',\$vis)){ \$o['fm_n']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM {\$P}ps_feeding_map WHERE is_active=1\"); }",
" /* dabartine ataskaita — koks failas ja piesia */",
" \$mu=@scandir(WPMU_PLUGIN_DIR); \$o['mu_anketa']=array();",
" foreach((array)\$mu as \$f){ if(substr(\$f,-4)==='.php'){ \$k=file_get_contents(WPMU_PLUGIN_DIR.'/'.\$f); if(strpos(\$k,'Augintini')!==false && strpos(\$k,'add_submenu_page')!==false){ \$o['mu_anketa'][]=\$f.' ('.filesize(WPMU_PLUGIN_DIR.'/'.\$f).'B)'; } } }",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.rez=JSON.parse(await (await fetch(WP+'/?ps_m=M8rx')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(s);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
