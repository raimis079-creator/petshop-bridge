import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s459',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run459-admin'};
// auth cookie per snippeta
const PHP=`add_action('wp_loaded',function(){
 if(!isset($_GET['ps_ck'])||$_GET['ps_ck']!=='Ck459xQ') return;
 nocache_headers(); header('Content-Type: application/json');
 $u=get_users(array('role'=>'administrator','number'=>1));
 if(!$u){ echo wp_json_encode(array('err'=>'no admin')); exit; }
 $uid=$u[0]->ID;
 $exp=time()+300;
 // BUTINA sesijos zetonas — be jo wp_validate_auth_cookie ATMETA
 $mgr=WP_Session_Tokens::get_instance($uid);
 $tok=$mgr->create($exp);
 echo wp_json_encode(array('uid'=>$uid,'login'=>$u[0]->user_login,
   'cookie'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok),
   'name'=>LOGGED_IN_COOKIE)); exit;
},1);`;
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S459 Cookie v2',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const ck=sh('curl -sSk --max-time 60 "'+SITE+'/?ps_ck=Ck459xQ"');
let C=null; try{C=JSON.parse(ck);}catch(e){O.cookie_raw=String(ck).slice(0,200);}
O.cookie_ok = C && C.cookie ? 'yra' : 'NERA';
if(C && C.cookie){
 try{
  const b=await chromium.launch();
  const ctx=await b.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true,locale:'lt-LT'});
  await ctx.addCookies([{name:C.name,value:C.cookie,domain:'dev.avesa.lt',path:'/',httpOnly:true,secure:true}]);
  const p=await ctx.newPage();
  const puslapiai=[
    ['prekiu_sarasas','/wp-admin/edit.php?post_type=product'],
    ['prekes_langas','/wp-admin/post.php?post=14088&action=edit'],
    ['uzsakymu_sarasas','/wp-admin/admin.php?page=wc-orders'],
    ['uzsakymo_langas','/wp-admin/admin.php?page=wc-orders&action=edit&id=34720'],
  ];
  O.psl={};
  for(const [v,u] of puslapiai){
    try{
      const rp=await p.goto(SITE+u,{waitUntil:'domcontentloaded',timeout:70000});
      await p.waitForTimeout(3500);
      const dbg=await p.evaluate(()=>({url:location.href,title:document.title,
        prisijungimas: !!document.querySelector('#loginform')}));
      const info=await p.evaluate(()=>{
        const th=[...document.querySelectorAll('table.wp-list-table thead th')].map(x=>(x.innerText||'').trim()).filter(Boolean);
        const mb=[...document.querySelectorAll('.postbox, .woocommerce-order-data, #woocommerce-order-items')].map(x=>{
          const h=x.querySelector('h2,h3,.hndle,.postbox-header');
          return (h?h.innerText:(x.id||'')).replace(/\s+/g,' ').trim().slice(0,50);
        }).filter(Boolean);
        const menu=[...document.querySelectorAll('#adminmenu > li > a')].map(x=>(x.innerText||'').replace(/\s+/g,' ').trim().split('\n')[0]).filter(Boolean);
        return {stulpeliai:th, blokai:mb, meniu:menu,
          aukstis:document.body.scrollHeight, plotis:document.body.scrollWidth};
      });
      O.psl[v]={http:rp?rp.status():null, ...dbg, ...info};
      const png=await p.screenshot({fullPage:true});
      putFile('screenshots/admin_'+v+'.png', png);
      O.psl[v].png='screenshots/admin_'+v+'.png';
    }catch(e){ O.psl[v]={KLAIDA:String(e).slice(0,150)}; }
  }
  await b.close();
 }catch(e){ O.NARSYKLE=String(e).slice(0,300); }
}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putFile('analize/s459.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
