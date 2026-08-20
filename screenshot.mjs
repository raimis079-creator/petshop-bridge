process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'H179-atgaivinimas'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const saknis = await fetch(WP+'/'); out.saknis_kodas = saknis.status;
  if(saknis.status >= 500){ out.STOP='svetaine dar 500'; }
  else {
    /* atstatymo snippet: backup -> mu-plugins, su sintakses patikra PRIES rasant */
    const PHP = `<?php
add_action('wp_loaded', function(){
 if((isset($_GET['ps_h179']) ? $_GET['ps_h179'] : '') !== 'GO') return;
 @set_time_limit(180);
 $o=array('v'=>'H179','laikas'=>current_time('mysql'));
 $bd = trailingslashit(wp_upload_dir()['basedir']).'ps-backups/';
 $tik = WPMU_PLUGIN_DIR.'/petshop-katalogas.php';
 $off = WPMU_PLUGIN_DIR.'/petshop-katalogas.php.off';
 $o['off_yra'] = file_exists($off);
 $o['tik_yra'] = file_exists($tik);
 /* kandidatai nuo naujausio */
 $kand = array('petshop-katalogas-v873-BACKUP-2026-08-21.php',
               'petshop-katalogas-v872-BACKUP-2026-08-21.php',
               'petshop-katalogas-v871-BACKUP-2026-08-20.php');
 foreach($kand as $k){
   $kel = $bd.$k;
   if(!file_exists($kel)) { $o[$k]='nera'; continue; }
   $t = file_get_contents($kel);
   try { token_get_all($t, TOKEN_PARSE); }
   catch(Throwable $e){ $o[$k]='SINTAKSES KLAIDA — praleidziu'; continue; }
   $o['pasirinktas'] = $k;
   $o['irasyta'] = file_put_contents($tik, $t);
   $o['md5'] = md5_file($tik);
   break;
 }
 if(function_exists('opcache_reset')) @opcache_reset();
 $r = wp_remote_get(home_url('/'), array('timeout'=>25,'sslverify'=>false,'redirection'=>0));
 $o['loopback'] = is_wp_error($r) ? $r->get_error_message() : (int)wp_remote_retrieve_response_code($r);
 header('Content-Type: application/json; charset=utf-8');
 echo wp_json_encode($o); exit;
}, 131);`;
    const ls=await api('/wp-json/code-snippets/v1/snippets');
    let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
    for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
    const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H179 katalogo atstatymas',code:PHP,scope:'global',active:true,priority:5})});
    let j=null; try{j=JSON.parse(cr.t);}catch(e){ out.cr = cr.t.slice(0,200); }
    await miegok(8000);
    const r1=await fetch(WP+'/?ps_h179=GO'); const t1=await r1.text();
    try{ out.ATSTATYMAS=JSON.parse(t1); }catch(e){ out.ATSTATYMAS={ZALIAS:t1.slice(0,500)}; }
    if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
    const po=await fetch(WP+'/'); out.saknis_po = po.status;
    const adm=await fetch(WP+'/wp-login.php'); out.login_po = adm.status;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h179.json', Buffer.from(JSON.stringify(out,null,1)), 'h179 atstatymas');
