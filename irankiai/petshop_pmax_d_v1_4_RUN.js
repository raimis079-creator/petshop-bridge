/**
 * PMax D v1.4 (S1676: nuotraukos tame pačiame create, be listingSource; listing filtrų sudėtiniai temp ID -1~-N; tekstai ribojami 5/3/4, nuotraukos atskiru mutate partialFailure, be urlExpansion) — nauja struktūra: pervadina šunų kampaniją, €40/d, URL expansion OFF,
 * sukuria 6 asset grupes (PAUSED) su listing filtrais, tekstais/logo iš Generic, ps_* nuotraukomis; kačių kampaniją PAUSE.
 * Preview = DRY (nieko nekeičia, rašo planą). Run: DRY=false. Rezultatas → ps_ads_recon.
 */
var DRY = false;
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon', KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var C = '7541530584', DOG = '21472017542', CAT = '21565450990', BUDGET_MICROS = 40000000;
var NEW_NAME = 'P-max | LT | petshop.lt';
var G = [
 {n:'D1 Exclusion LTV 7-12 kg', url:'https://petshop.lt/gamintojas/exclusion/', tema:'Exclusion LTV (7/12 kg)', f:{brand:['Exclusion'], cl1:['reklamuoti_ltv']}},
 {n:'D2 Exclusion konservai', url:'https://petshop.lt/kategorija/sunims/konservai-sunims/', tema:'Exclusion konservai', f:{brand:['Exclusion'], cl2:['konservai-sunims']}},
 {n:'D3 Josera sunims', url:'https://petshop.lt/gamintojas/josera/', tema:'Josera šunims (sausas)', f:{brand:['Josera'], cl2:['sausas-maistas-sunims'], cl0:['A','B']}},
 {n:'D4 Ontario konservai sunims', url:'https://petshop.lt/kategorija/sunims/konservai-sunims/', tema:'Konservai šunims (Ontario mono)', f:{brand:['Ontario'], cl2:['konservai-sunims']}},
 {n:'D5 Josera katems', url:'https://petshop.lt/gamintojas/josera/', tema:'Josera katėms', f:{brand:['Josera'], cl2:['sausas-maistas-katems'], cl0:['A','B']}},
 {n:'D6 Konservai katems Miamor Ontario', url:'https://petshop.lt/kategorija/katems/konservai-katems/', tema:['Konservai katėms (Miamor)','Konservai katėms (Ontario)'], f:{brand:['Miamor','Ontario'], cl2:['konservai-katems']}, max:20}
];
var MAN = 'https://raw.githubusercontent.com/raimis079-creator/petshop-bridge/main/pmax_s1672/manifest.json';
var FT = {sq:'SQUARE_MARKETING_IMAGE', ls:'MARKETING_IMAGE', pt:'PORTRAIT_MARKETING_IMAGE'};

function main() {
  var out = { v:'PMAX D v1.4', dry:DRY, kada:new Date().toISOString(), klaidos:[], zingsniai:[] };
  try {
    // 1. Generic šunų grupė → tekstai, logo, video, business name
    var gen = null, it = AdsApp.performanceMaxCampaigns().withIds([Number(DOG)]).get();
    var camp = it.next(); var ags = camp.assetGroups().get(); while (ags.hasNext()) { var a = ags.next(); if (!gen) gen = a; }
    out.generic = gen.getName();
    var copy = [], q = AdsApp.search('SELECT asset.resource_name, asset_group_asset.field_type FROM asset_group_asset WHERE asset_group.id = ' + gen.getId() +
      ' AND asset_group_asset.status != "REMOVED" AND asset_group_asset.field_type IN ("HEADLINE","LONG_HEADLINE","DESCRIPTION","BUSINESS_NAME","LOGO","YOUTUBE_VIDEO","CALL_TO_ACTION_SELECTION")');
    while (q.hasNext()) { var r = q.next(); copy.push({a:r.asset.resourceName, ft:r.assetGroupAsset.fieldType}); }
    var LIM = {HEADLINE:5, LONG_HEADLINE:3, DESCRIPTION:4, YOUTUBE_VIDEO:1, LOGO:1, BUSINESS_NAME:1, CALL_TO_ACTION_SELECTION:1}, cnt = {}, copy2 = [];
    copy.forEach(function(x){ cnt[x.ft] = (cnt[x.ft]||0)+1; if (cnt[x.ft] <= (LIM[x.ft]||0)) copy2.push(x); }); copy = copy2;
    out.kopijuojama = copy.length;
    // 2. ps_* nuotraukos bibliotekoje
    var imgs = {}, qi = AdsApp.search('SELECT asset.resource_name, asset.name FROM asset WHERE asset.type = "IMAGE" AND asset.name LIKE "ps_%"');
    while (qi.hasNext()) { var ri = qi.next(); imgs[ri.asset.name] = ri.asset.resourceName; }
    out.ps_bibliotekoje = Object.keys(imgs).length;
    var man = JSON.parse(UrlFetchApp.fetch(MAN).getContentText());
    // 3. kampanija: vardas, biudžetas, URL expansion
    var cops = [{ campaignOperation:{ update:{ resourceName:'customers/'+C+'/campaigns/'+DOG, name:NEW_NAME }, updateMask:'name' } },
                { campaignBudgetOperation:{ update:{ resourceName:AdsApp.search('SELECT campaign_budget.resource_name FROM campaign WHERE campaign.id = '+DOG).next().campaignBudget.resourceName, amountMicros:String(BUDGET_MICROS) }, updateMask:'amount_micros' } }];
    out.zingsniai.push({k:'kampanija', ops:cops.length, dabar:{vardas:camp.getName(), biudzetas:camp.getBudget().getAmount()}});
    if (!DRY) out.zingsniai[out.zingsniai.length-1].rez = res(AdsApp.mutateAll(cops, {partialFailure:false}));
    // 4. grupės
    G.forEach(function(g){
      var temas = [].concat(g.tema), files = man.filter(function(m){ return temas.indexOf(m.tema) >= 0; });
      var pick = [], miss = [];
      files.forEach(function(m){ var nm = 'ps_' + m.name.replace(/\.jpg$/,''); if (imgs[nm]) pick.push({a:imgs[nm], ft:FT[m.name.slice(-6,-4)]}); else miss.push(nm); });
      if (g.max && pick.length > g.max) pick = pick.slice(0, g.max);
      var ag = 'customers/'+C+'/assetGroups/-1', ops = [{ assetGroupOperation:{ create:{ resourceName:ag, campaign:'customers/'+C+'/campaigns/'+DOG, name:g.n, finalUrls:[g.url], status:'PAUSED' } } }];
      copy.concat(pick).forEach(function(x){ ops.push({ assetGroupAssetOperation:{ create:{ assetGroup:ag, asset:x.a, fieldType:x.ft } } }); });
      ops = ops.concat(listing(ag, g.f));
      var z = {k:g.n, nuotraukos:pick.length, trukstamos:miss, ops:ops.length};
      if (!DRY) {
        var r1 = AdsApp.mutateAll(ops, {partialFailure:false}); z.rez = res(r1);
        var agRn = r1[0].isSuccessful() ? r1[0].getResourceName() : null; z.grupe = agRn;
      }
      out.zingsniai.push(z);
    });
    // 5. kačių kampanija PAUSE
  } catch (e) { out.klaidos.push(String(e)); }
  Logger.log(JSON.stringify(out).slice(0, 4000));
  var resp = UrlFetchApp.fetch(URL, { method:'post', contentType:'application/json', payload:JSON.stringify(out), headers:{'x-ps-key':KEY}, muteHttpExceptions:true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText().slice(0,200));
}
// listing medis: root SUBDIVISION → lygiai pagal f (brand, cl0, cl1, cl2); kiekvienam lygiui UNIT_INCLUDED nariams + "kita" UNIT_EXCLUDED
function listing(ag, f) {
  var ops = [], id = -10, keys = ['brand','cl0','cl1','cl2'].filter(function(k){ return f[k]; });
  function node(parent, k, val, type) {
    var rn = 'customers/'+C+'/assetGroupListingGroupFilters/-1~'+(id--);
    var c = { resourceName:rn, assetGroup:ag, type:type };
    if (parent) c.parentListingGroupFilter = parent;
    if (k) c.caseValue = (k === 'brand') ? { productBrand: (val === null ? {} : {value:val}) } :
      { productCustomAttribute: (val === null ? {index:'INDEX'+k.slice(2)} : {index:'INDEX'+k.slice(2), value:val}) };
    ops.push({ assetGroupListingGroupFilterOperation:{ create:c } }); return rn;
  }
  function build(parent, i) {
    if (i >= keys.length) return;
    var k = keys[i], last = (i === keys.length - 1);
    f[k].forEach(function(v){ var n = node(parent, k, v, last ? 'UNIT_INCLUDED' : 'SUBDIVISION'); if (!last) build(n, i+1); });
    node(parent, k, null, 'UNIT_EXCLUDED');
  }
  var root = node(null, null, null, 'SUBDIVISION'); build(root, 0); return ops;
}
function res(r) { var o = {ok:0, kl:[]}; for (var i = 0; i < r.length; i++) { if (r[i].isSuccessful()) o.ok++; else o.kl.push(r[i].getErrorMessages().join('; ')); } return o; }
