/**
 * PETSHOP ADS APPLY #1 v1.2 (S1666)
 * Veiksmai: 1) Prins Puppy -> PAUSED. 2) Brand_Exclusion PRISKIRIA abiem PMax (mutate).
 * 3) Istraukia PMax asset grupiu final URL + url expansion (skaito).
 * Rezultatus atsiuncia i petshop.lt. Biudzetu/tROAS NELIECIA.
 * Naudojimas: Tools -> Scripts -> pakeisti koda -> Issaugoti -> Run.
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var PRINS_ID = 23394555043;

function main() {
  var out = { v: 'APPLY1 v1.2', kada: new Date().toISOString(), klaidos: [] };

  // 1) Prins Puppy -> PAUSED
  try {
    var it = AdsApp.campaigns().withIds([PRINS_ID]).get();
    if (it.hasNext()) {
      var c = it.next();
      var buvo = c.isPaused() ? 'PAUSED' : (c.isEnabled() ? 'ENABLED' : '?');
      if (c.isEnabled()) { c.pause(); }
      var po = AdsApp.campaigns().withIds([PRINS_ID]).get().next();
      out.prins = { buvo: buvo, dabar: po.isPaused() ? 'PAUSED' : 'ENABLED' };
    } else { out.klaidos.push('prins: nerasta'); }
  } catch (e) { out.klaidos.push('prins: ' + e); }

  // 2) Brand_Exclusion -> abu PMax (natyvus addNegativeKeywordList)
  try {
    var li = AdsApp.negativeKeywordLists().withCondition('Name = "Brand_Exclusion"').get();
    if (!li.hasNext()) { out.klaidos.push('sarasas Brand_Exclusion nerastas'); }
    else {
      var list = li.next();
      out.priskyrimas = [];
      var pm = AdsApp.performanceMaxCampaigns().withIds([21472017542, 21565450990]).get();
      while (pm.hasNext()) {
        var k = pm.next();
        try { k.addNegativeKeywordList(list); out.priskyrimas.push('OK ' + k.getName()); }
        catch (e2) { out.priskyrimas.push('FAIL ' + k.getName() + ': ' + e2); }
      }
    }
  } catch (e) { out.klaidos.push('priskyrimas: ' + e); }

  // 2b) Priskyrimu patikra po mutate
  out.sarasu_priskyrimai = gaql(out, 'priskyrimai',
    'SELECT campaign.name, shared_set.name, campaign_shared_set.status ' +
    'FROM campaign_shared_set WHERE campaign_shared_set.status != "REMOVED"');

  // 3) PMax asset grupiu URL + url expansion
  out.pmax_urls = gaql(out, 'pmax_urls',
    'SELECT campaign.name, asset_group.name, asset_group.final_urls, ' +
    'asset_group.status FROM asset_group');
  // 4) Galutine visu kampaniju busena
  out.busenos = gaql(out, 'busenos',
    'SELECT campaign.id, campaign.name, campaign.status FROM campaign ' +
    'ORDER BY campaign.id');

  var body = JSON.stringify(out);
  Logger.log('Dydis: ' + body.length + ' B, klaidos: ' + out.klaidos.length);
  var resp = UrlFetchApp.fetch(URL, {
    method: 'post', contentType: 'application/json', payload: body,
    headers: { 'x-ps-key': KEY }, muteHttpExceptions: true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText());
}

function gaql(out, vardas, q) {
  var rows = [];
  try {
    var it = AdsApp.search(q);
    while (it.hasNext() && rows.length < 200) { rows.push(flat(it.next())); }
  } catch (e) { out.klaidos.push(vardas + ': ' + e); }
  return rows;
}

function flat(o) {
  var r = {};
  (function eiti(x, pre) {
    for (var k in x) {
      var v = x[k];
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) { eiti(v, pre + k + '.'); }
      else { r[pre + k] = v; }
    }
  })(o, '');
  return r;
}
