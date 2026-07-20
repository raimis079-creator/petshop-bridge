import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=`-u "${U}:${P}"`;
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync(`echo ${b}|base64 -d|curl -sk ${AUTH} -X ${m} -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/${path}"`,{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'closeall',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/pj.json "${u}"`).toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
// 1. NEGATYVUS login testas: login3 URL (snippetas jau deaktyvuotas ankstesniame proof2/pw2) -> jokio auth/redirect
const hdr=execSync(`curl -skD - -o /dev/null -m 60 ${AUTH} "https://dev.avesa.lt/?ps_login3=Login3Kw8Nx"`,{maxBuffer:10*1024*1024}).toString();
o.neg_status=(hdr.match(/HTTP\/[\d.]+\s+(\d+)/)||[])[1]||null;
o.neg_location=(hdr.match(/^location:\s*(.+)$/im)||[])[1]||null;
o.neg_redirect_account=(o.neg_location&&/augintinis|my-account|account/i.test(o.neg_location))?true:false;
const sc=(hdr.match(/^set-cookie:.*$/gim)||[]);
o.neg_auth_cookie=sc.filter(c=>/wordpress_logged_in|wordpress_sec/i.test(c)).length>0;
o.NEG_PASS=(!o.neg_redirect_account&&!o.neg_auth_cookie);
// 2+3+baseline+cleanup per snippetas
const SNIP=Buffer.from(`add_action('wp_loaded',function(){
 if(($_GET['ps_final']??'')!=='FinalKw8Nx')return;
 if(($_GET['confirm']??'')!=='CLOSE'){echo json_encode(['err'=>'confirm']);exit;}
 global $wpdb;$pf=$wpdb->prefix;$o=[];
 // fixture NULL
 $wpdb->query("UPDATE {$pf}ps_pets SET current_weight_kg=NULL,weight_updated_at=NULL WHERE id=26");
 $o['pet26']=($wpdb->get_var("SELECT current_weight_kg FROM {$pf}ps_pets WHERE id=26")===null?'NULL':'NE');
 // baseline
 $T=$pf.'ps_feeding_tables';$R=$pf.'ps_feeding_rows';$M=$pf.'ps_feeding_map';
 $tr=$wpdb->get_results("SELECT id,canonical_table_hash,status,is_active FROM {$T} ORDER BY id",ARRAY_A);
 $tp=[];foreach($tr as $r){$tp[]=$r['id'].':'.($r['canonical_table_hash']===null?'NULL':$r['canonical_table_hash']).':'.$r['status'].':'.$r['is_active'];}
 $mr=$wpdb->get_results("SELECT feeding_table_id,product_id,is_active FROM {$M} ORDER BY feeding_table_id,product_id",ARRAY_A);
 $mp=[];foreach($mr as $r){$mp[]=$r['feeding_table_id'].':'.$r['product_id'].':'.$r['is_active'];}
 $rr=$wpdb->get_results("SELECT id,feeding_table_id,cell_type,weight_from_kg,weight_to_kg,amount_from_g,amount_to_g FROM {$R} ORDER BY id",ARRAY_A);
 $rp=[];foreach($rr as $r){$rp[]=$r['id'].':'.$r['feeding_table_id'].':'.$r['cell_type'].':'.$r['weight_from_kg'].':'.$r['weight_to_kg'].':'.$r['amount_from_g'].':'.$r['amount_to_g'];}
 $th=hash('sha256',implode('|',$tp));$mh=hash('sha256',implode('|',$mp));$rh=hash('sha256',implode('|',$rp));
 $o['baseline_F0']=($th==='a6b6f742526c24e45635b77c164fa163ec289d817f170c60618f90dc833a2d25'&&$rh==='948230100c5aaefbea75e081678ead12173c07e9537b3f78af75c3f13ddaddbf'&&$mh==='053db47686759f41fc317dfbeb88ad28577a9a6f004cf044226587011ae59adf');
 $o['counts']=[count($tr),count($rr),count($mr)];
 // #1186 + senas kalkuliatorius
 $o['s1186']=(int)$wpdb->get_var("SELECT active FROM {$pf}snippets WHERE id=1186");
 $o['old_calc']=class_exists('PS_FCalc_Service');
 $o['new_ok']=(class_exists('Petshop_Feeding_Service')&&class_exists('Petshop_Feeding_UI'));
 // cleanup visi temp
 $sn=$wpdb->get_results("SELECT id FROM {$pf}snippets WHERE code LIKE '%Kw8Nx%' AND active=1 AND id<>1186",ARRAY_A);
 $d=0;foreach($sn as $s){$wpdb->update($pf.'snippets',['active'=>0],['id'=>$s['id']]);$d++;}
 $o['cleaned']=$d;
 $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}snippets WHERE code LIKE '%Kw8Nx%' AND active=1 AND id<>1186");
 header('Content-Type: application/json');echo json_encode($o);exit;
});`).toString('base64');
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 FinalClose (temp)',code:Buffer.from(SNIP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let id=null;try{id=JSON.parse(mk).id;o.snip_id=id;}catch(e){o.mk=mk.slice(0,150);}
const raw=execSync(`curl -sk ${AUTH} "https://dev.avesa.lt/?ps_final=FinalKw8Nx&confirm=CLOSE"`,{maxBuffer:20*1024*1024}).toString();
const fi=raw.indexOf('{"');try{o.close=JSON.parse(raw.slice(fi));}catch(e){o.close_raw=raw.slice(0,300);}
if(id){wj('POST',`code-snippets/v1/snippets/${id}`,{active:false});}
console.log('PUT:',pr('closeall.json',o));
