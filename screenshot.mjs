process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'RECON-A1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const kodas=[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_rec'] ?? '') !== 'RecA1x') return;",
" global \$wpdb; \$o=array('v'=>'RECON-A1');",
" \$o['php']=PHP_VERSION; \$o['wp']=get_bloginfo('version');",
" \$o['wc']=defined('WC_VERSION')?WC_VERSION:'nera';",
" \$o['prefiksas']=\$wpdb->prefix;",
" /* HPOS */",
" \$o['hpos']= (class_exists('Automattic\\\\WooCommerce\\\\Utilities\\\\OrderUtil') && Automattic\\\\WooCommerce\\\\Utilities\\\\OrderUtil::custom_orders_table_usage_is_enabled()) ? 'taip':'ne';",
" /* mu-plugins */",
" \$f=@scandir(WPMU_PLUGIN_DIR); \$o['mu']=array();",
" foreach((array)\$f as \$x){ if(substr(\$x,-4)==='.php'){ \$o['mu'][\$x]=filesize(WPMU_PLUGIN_DIR.'/'.\$x); } }",
" /* lenteles */",
" \$t1=\$wpdb->prefix.'ps_laukai_ivykiai'; \$t2=\$wpdb->prefix.'ps_ataskaitu_dienos';",
" \$o['t_ivykiai']=(\$wpdb->get_var(\"SHOW TABLES LIKE '\$t1'\")===\$t1)?'yra':'nera';",
" \$o['t_dienos']=(\$wpdb->get_var(\"SHOW TABLES LIKE '\$t2'\")===\$t2)?'yra':'nera';",
" if(\$o['t_ivykiai']==='yra'){",
"   \$o['ivykiai_stulpeliai']=\$wpdb->get_col(\"SHOW COLUMNS FROM \$t1\");",
"   \$o['ivykiu_sk']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM \$t1\");",
" }",
" \$o['opt_schema']=get_option('ps_stat_schema');",
" \$o['opt_pradzia']=get_option('ps_stat_pradzia');",
" /* meniu registracija */",
" \$o['reports_klase']=class_exists('Petshop_Admin_Reports')?'yra':'nera';",
" \$o['ataskaitu_klase']=class_exists('Petshop_Rinkiniu_Ataskaita')?'yra':'nera';",
" \$o['statistikos_klase']=class_exists('Petshop_Statistika')?'yra':'nera';",
" /* dezes */",
" \$dz=get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>40,'fields'=>'ids','meta_query'=>array(array('key'=>'_ps_laukas','value'=>'yes'))));",
" \$o['dezes']=array();",
" foreach(\$dz as \$id){ \$p=wc_get_product(\$id); \$o['dezes'][]=array('id'=>(int)\$id,'pav'=>get_the_title(\$id),'tipas'=>\$p?\$p->get_type():'?','dydis'=>get_post_meta(\$id,'_ps_laukas_dydis',true),'statusas'=>get_post_status(\$id)); }",
" /* MnM paruosti rinkiniai (ne laukai) */",
" \$mnm=\$wpdb->get_col(\"SELECT ID FROM {\$wpdb->posts} p WHERE p.post_type='product' AND p.post_status IN ('publish','draft') LIMIT 400\");",
" \$o['mnm_paruosti']=array(); \$o['dp_pakai']=array(); \$n1=0; \$n2=0;",
" foreach(\$mnm as \$id){",
"   \$p=wc_get_product(\$id); if(!\$p) continue;",
"   if(\$p->get_type()==='mix-and-match' && get_post_meta(\$id,'_ps_laukas',true)!=='yes'){ \$n1++; if(count(\$o['mnm_paruosti'])<6) \$o['mnm_paruosti'][]=array('id'=>(int)\$id,'pav'=>get_the_title(\$id)); }",
"   \$b=get_post_meta(\$id,'_dp_base_product_id',true); if(\$b){ \$n2++; if(count(\$o['dp_pakai'])<6) \$o['dp_pakai'][]=array('id'=>(int)\$id,'pav'=>get_the_title(\$id),'baze'=>(int)\$b,'qty'=>get_post_meta(\$id,'_dp_pack_qty',true)); }",
" }",
" \$o['mnm_paruostu_sk']=\$n1; \$o['dp_paku_sk']=\$n2;",
" /* uzsakymu apzvalga */",
" \$uz=wc_get_orders(array('limit'=>5,'status'=>array('processing','completed','on-hold'),'orderby'=>'date','order'=>'DESC'));",
" \$o['uzsakymai']=array();",
" foreach(\$uz as \$ord){",
"   \$e=array(); foreach(\$ord->get_items() as \$it){ \$mk=array(); foreach(\$it->get_meta_data() as \$m){ \$d=\$m->get_data(); \$mk[]=\$d['key']; } \$e[]=array('pav'=>mb_substr(\$it->get_name(),0,28),'pid'=>\$it->get_product_id(),'qty'=>\$it->get_quantity(),'meta'=>\$mk); }",
"   \$o['uzsakymai'][]=array('id'=>\$ord->get_id(),'data'=>\$ord->get_date_created()?\$ord->get_date_created()->date('Y-m-d'):'','suma'=>\$ord->get_total(),'eilutes'=>\$e);",
" }",
" /* MnM vaiku lentele */",
" \$tm=\$wpdb->prefix.'wc_mnm_child_items';",
" \$o['t_mnm_child']=(\$wpdb->get_var(\"SHOW TABLES LIKE '\$tm'\")===\$tm)?'yra':'nera';",
" if(\$o['t_mnm_child']==='yra'){ \$o['mnm_child_stulpeliai']=\$wpdb->get_col(\"SHOW COLUMNS FROM \$tm\"); \$o['mnm_child_sk']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM \$tm\"); }",
" /* Complianz */",
" \$o['cmplz']=function_exists('cmplz_has_consent')?'yra':'nera';",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL);
const s = await snip('TEMP RECON ATA A1', kodas);
out.snip_id = s;
await new Promise(r=>setTimeout(r,5000));
try{ out.rez = JSON.parse(await (await fetch(WP+'/?ps_rec=RecA1x')).text()); }catch(e){ out.klaida=String(e).slice(0,200); }
await off(s);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
