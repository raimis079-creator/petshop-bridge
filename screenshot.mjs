process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'ZIP-J1'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'zip recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,c){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code:c,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const s=await snip('TEMP ZIP RECON',[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_z'] ?? '') !== 'ZipJx') return;",
" \$o=array();",
" \$o['ZipArchive']=class_exists('ZipArchive')?'yra':'NERA';",
" \$o['PhpSpreadsheet']=class_exists('PhpOffice'.chr(92).'PhpSpreadsheet'.chr(92).'Spreadsheet')?'yra':'nera';",
" \$o['zip_ext']=extension_loaded('zip')?'yra':'nera';",
" \$o['mbstring']=extension_loaded('mbstring')?'yra':'nera';",
" \$o['tmp']=sys_get_temp_dir(); \$o['tmp_rasomas']=is_writable(sys_get_temp_dir())?'taip':'ne';",
" \$o['upload']=wp_upload_dir(); \$o['upload_rasomas']=is_writable(\$o['upload']['basedir'])?'taip':'ne';",
" \$o['memory']=ini_get('memory_limit');",
" if(class_exists('ZipArchive')){",
"   \$f=tempnam(sys_get_temp_dir(),'pstest'); \$z=new ZipArchive();",
"   \$r=\$z->open(\$f, ZipArchive::CREATE|ZipArchive::OVERWRITE);",
"   if(\$r===true){ \$z->addFromString('bandymas.txt','labas'); \$z->close(); \$o['zip_testas']='OK '.filesize(\$f).'B'; } else { \$o['zip_testas']='klaida '.\$r; }",
"   @unlink(\$f);",
" }",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.rez=JSON.parse(await (await fetch(WP+'/?ps_z=ZipJx')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(s);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
