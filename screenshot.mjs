import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'hw',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

const php = `/**
 * Petshop Slepia Footer 1 Produktu Widgetus Legal/Info Puslapiuose v1
 * Flatsome tema deda 4 WooCommerce widget_products i footer-1 sekcija (Naujausi, Populiariausi,
 * Geriausiai ivertinti). Ant legal/info puslapiu jie atrodo kaip atsitiktinis widget salatas
 * ir muza pasitikejima. Sis snippet'as sleptia CSS boodo tik SPECIFINIUOSE puslapiuose.
 * Kiti puslapiai (shop, product, home) - lieka kaip yra.
 */
add_action('wp_head', function() {
    if (!is_page(['apie-mus','kontaktai','pristatymas','apmokejimas','grazinimas','taisykles','privatumo-politika','slapuku-politika','sunu-veisles'])) {
        return;
    }
    echo '<style>.footer-widgets.footer.footer-1{display:none !important;}</style>';
}, 100);`;

const out={};
// kuriam neaktyvu, tikrinam code_error, aktyvuojam
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'Petshop Slepia Footer1 Widgetus Legal Puslapiuose v1',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid; out.create=c.slice(0,200);
if(sid){
  const chk=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=id,active,code_error');
  let err=''; try{ err=JSON.parse(chk).code_error; }catch(e){}
  out.pre_error=err;
  if(!err || err==='null' || err===null){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    const chk2=api('/wp-json/code-snippets/v1/snippets/'+sid+'?_fields=id,active,code_error');
    out.post_activate=chk2.slice(0,200);
    // verify - traukiam apie-mus ir tikrinam ar footer-1 slepiamas
    const html=get('/apie-mus/?nc='+Date.now());
    out.has_hide_style=html.indexOf('.footer-widgets.footer.footer-1{display:none')>=0;
    out.footer1_present=html.indexOf('footer-widgets footer footer-1')>=0;
    // ir home page - turi VISVIEN turit footer-1 (kad site-wide neislugtu)
    const home=get('/?nc='+Date.now());
    out.home_has_style=home.indexOf('.footer-widgets.footer.footer-1{display:none')>=0;
    out.home_has_footer1=home.indexOf('footer-widgets footer footer-1')>=0;
  }
}
putFile('hidewidget.json',JSON.stringify(out));
console.log('done',sid);
