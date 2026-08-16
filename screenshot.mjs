process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'PATIKRA-H1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'patikra',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const sT=await snip('TEMP PATIKRA H',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_p'] ?? '') !== 'PatHx') return;",
" global \$wpdb; \$t=\$wpdb->prefix.'ps_laukai_ivykiai'; \$o=array();",
" \$o['pagal_tipa']=\$wpdb->get_results(\"SELECT tipas, COUNT(*) kiek, COUNT(DISTINCT NULLIF(sesija,'')) ses FROM \$t GROUP BY tipas ORDER BY kiek DESC\", ARRAY_A);",
" \$o['svarbus']=\$wpdb->get_results(\"SELECT laikas,tipas,preke_id,verte,kiek_dezeje FROM \$t WHERE tipas IN ('min_pasiekta','dovana_atrakinta','dovana_rinko','krepselis','dydis_perjunge') ORDER BY id DESC LIMIT 12\", ARRAY_A);",
" \$o['paskutiniai']=\$wpdb->get_results(\"SELECT tipas,preke_id,verte,kiek_dezeje FROM \$t ORDER BY id DESC LIMIT 6\", ARRAY_A);",
" delete_transient('ps_ata_siandien_'.current_time('Y-m-d'));",
" \$o['agreguota']=Petshop_Ataskaitu_Agregavimas::agreguoti_diena(current_time('Y-m-d'));",
" \$d=\$wpdb->prefix.'ps_ataskaitu_dienos';",
" \$o['piltuvelis']=\$wpdb->get_results(\$wpdb->prepare(\"SELECT tipas,sesiju FROM \$d WHERE diena=%s AND sritis='piltuvelis'\", current_time('Y-m-d')), ARRAY_A);",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.rez=JSON.parse(await (await fetch(WP+'/?ps_p=PatHx')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(sT);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
