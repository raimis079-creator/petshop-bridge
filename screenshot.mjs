import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsl.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsl.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message.slice(0,150); } }
const landing=Buffer.from("PCEtLSB3cDpodG1sIC0tPgo8ZGl2IGNsYXNzPSJwc2MtcGFzLWxhbmRpbmciPgogIDxwIGNsYXNzPSJwc2MtcGFzLWludHJvIj7EjGlhIHJhc2l0ZSDFoWl1byBtZXR1IGdhbGlvamFuxI1pYXMgYWtjaWphcyBpciBraWVraW8gcGFzacWrbHltdXMsIGthaSBwZXJrYW50IGRhdWdpYXUgdmllbmV0byBrYWluYSB0YW1wYSBnZXJlc27Ely48L3A+CiAgPGRpdiBjbGFzcz0icHNjLXBhcy1jYXJkcyI+CiAgICA8YSBocmVmPSIvYWtjaWpvcy8iIGNsYXNzPSJwc2MtcGFzLWNhcmQiPgogICAgICA8ZGl2IGNsYXNzPSJwc2MtcGFzLWNhcmQtaWNvbiI+JTwvZGl2PgogICAgICA8aDM+QWtjaWpvczwvaDM+CiAgICAgIDxwPsWgaXVvIG1ldHUgZ2FsaW9qYW50eXMgc3BlY2lhbMWrcyBwYXNpxatseW1haSBpciBwcmVrxJdzIHXFviBnZXJlc27EmSBrYWluxIUuPC9wPgogICAgICA8c3BhbiBjbGFzcz0icHNjLXBhcy1idG4iPlBlcsW+acWrcsSXdGkgYWtjaWphczwvc3Bhbj4KICAgIDwvYT4KICAgIDxhIGhyZWY9Ii9kYXVnaWF1LXBpZ2lhdS8iIGNsYXNzPSJwc2MtcGFzLWNhcmQiPgogICAgICA8ZGl2IGNsYXNzPSJwc2MtcGFzLWNhcmQtaWNvbiI+JiMxMjgyMzA7PC9kaXY+CiAgICAgIDxoMz5EYXVnaWF1ID0gcGlnaWF1PC9oMz4KICAgICAgPHA+RWtvbm9tacWha29zIHBha3VvdMSXcyBpciBraWVraW8gcGFzacWrbHltYWkg4oCUIHBhdG9ndSwgamVpIHTEhSBwYcSNacSFIHByZWvEmSBwZXJrYXRlIHJlZ3VsaWFyaWFpLjwvcD4KICAgICAgPHNwYW4gY2xhc3M9InBzYy1wYXMtYnRuIj5QZXLFvmnFq3LEl3RpIGtpZWtpbyBwYXNpxatseW11czwvc3Bhbj4KICAgIDwvYT4KICA8L2Rpdj4KPC9kaXY+CjxzdHlsZT4KLnBzYy1wYXMtbGFuZGluZ3ttYXgtd2lkdGg6OTAwcHg7bWFyZ2luOjAgYXV0b30KLnBzYy1wYXMtaW50cm97Zm9udC1zaXplOjE3cHg7bGluZS1oZWlnaHQ6MS42O2NvbG9yOiM1NTU7bWFyZ2luOjAgMCAzMnB4O3RleHQtYWxpZ246Y2VudGVyfQoucHNjLXBhcy1jYXJkc3tkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjI0cHh9Ci5wc2MtcGFzLWNhcmR7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O3BhZGRpbmc6MzJweCAyOHB4O2JhY2tncm91bmQ6I2ZmZjtib3JkZXI6MXB4IHNvbGlkICNlNWU1ZTU7Ym9yZGVyLXJhZGl1czoxMnB4O3RleHQtZGVjb3JhdGlvbjpub25lO3RyYW5zaXRpb246YWxsIC4xOHMgZWFzZTtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC4wNCl9Ci5wc2MtcGFzLWNhcmQ6aG92ZXJ7Ym9yZGVyLWNvbG9yOiMyZjVmNDY7Ym94LXNoYWRvdzowIDZweCAyMHB4IHJnYmEoNDcsOTUsNzAsLjEyKTt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtM3B4KTt0ZXh0LWRlY29yYXRpb246bm9uZX0KLnBzYy1wYXMtY2FyZC1pY29ue3dpZHRoOjU2cHg7aGVpZ2h0OjU2cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2JhY2tncm91bmQ6I2VlZjRmMTtib3JkZXItcmFkaXVzOjUwJTtmb250LXNpemU6MjZweDtjb2xvcjojMmY1ZjQ2O21hcmdpbi1ib3R0b206MThweDtmb250LXdlaWdodDo3MDB9Ci5wc2MtcGFzLWNhcmQgaDN7bWFyZ2luOjAgMCAxMHB4O2ZvbnQtc2l6ZToyMnB4O2NvbG9yOiMxYTFhMWF9Ci5wc2MtcGFzLWNhcmQgcHttYXJnaW46MCAwIDIycHg7Y29sb3I6IzY2NjtsaW5lLWhlaWdodDoxLjU1O2ZvbnQtc2l6ZToxNXB4O2ZsZXgtZ3JvdzoxfQoucHNjLXBhcy1idG57ZGlzcGxheTppbmxpbmUtYmxvY2s7cGFkZGluZzoxMXB4IDIycHg7YmFja2dyb3VuZDojMmY1ZjQ2O2NvbG9yOiNmZmY7Ym9yZGVyLXJhZGl1czoyNHB4O2ZvbnQtd2VpZ2h0OjYwMDtmb250LXNpemU6MTRweDt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjE1cyBlYXNlfQoucHNjLXBhcy1jYXJkOmhvdmVyIC5wc2MtcGFzLWJ0bntiYWNrZ3JvdW5kOiMyNjRjMzh9CkBtZWRpYSAobWF4LXdpZHRoOjcwMHB4KXsucHNjLXBhcy1jYXJkc3tncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyfX0KPC9zdHlsZT4KPCEtLSAvd3A6aHRtbCAtLT4=",'base64').toString('utf8');
(async()=>{
  // 1. Atnaujinam puslapio turini
  fs.writeFileSync('/tmp/pgupd.json', JSON.stringify({content: landing}));
  var r = exec('curl -sk -m 30 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/pgupd.json "'+BASE+'/wp-json/wp/v2/pages/34477"');
  var okId=null; try{ okId=JSON.parse(r).id; }catch(e){}
  // 2. Deaktyvuojam grid shortcode 571 (nebereikalingas)
  fs.writeFileSync('/tmp/deact.json', JSON.stringify({active:false}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/deact.json "'+BASE+'/wp-json/code-snippets/v1/snippets/571"');
  // 3. Verify
  var page = exec('curl -sk -m 25 "'+BASE+'/pasiulymai/"');
  commit('set_landing.json', JSON.stringify({
    page_updated: okId,
    has_h1_context: page.includes('psc-pas-landing'),
    has_2_cards: (page.match(/psc-pas-card"/g)||[]).length,
    has_akcijos_link: page.includes('/akcijos/'),
    has_dp_link: page.includes('/daugiau-pigiau/'),
    has_intro: page.includes('galiojančias akcijas ir kiekio'),
    NO_product_grid: !page.includes('psc-po-filter') && !page.includes('add-to-cart'),
    status: exec('curl -sk -m 15 -o /dev/null -w "%{http_code}" "'+BASE+'/pasiulymai/"'),
  }));
  console.log('done');
})();
