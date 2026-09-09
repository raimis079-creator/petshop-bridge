/**
 * PETSHOP ADS RECON v1.0 (S1665) — TIK SKAITO, NIEKO NEKEIČIA.
 * Surenka pilną paskyros nuotrauką ir atsiunčia į petshop.lt.
 * Naudojimas: Google Ads → Tools → Scripts → + → įklijuoti → Authorize → RUN (ne Preview būtina — POST'ui reikia Run).
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';

function main() {
  var out = { v: 'ADS RECON v1.0', kada: new Date().toISOString(), klaidos: [] };

  var acc = AdsApp.currentAccount();
  out.paskyra = { cid: acc.getCustomerId(), vardas: acc.getName(),
    valiuta: acc.getCurrencyCode(), laiko_juosta: acc.getTimeZone() };

  out.kampanijos      = gaql(out, 'kampanijos',
    'SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, ' +
    'campaign.advertising_channel_sub_type, campaign.bidding_strategy_type, ' +
    'campaign.maximize_conversion_value.target_roas, campaign.target_roas.target_roas, ' +
    'campaign_budget.amount_micros, campaign.serving_status ' +
    'FROM campaign ORDER BY campaign.id');

  out.stat_7d         = gaql(out, 'stat_7d',
    'SELECT campaign.id, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, ' +
    'metrics.conversions, metrics.conversions_value, metrics.search_impression_share ' +
    'FROM campaign WHERE metrics.impressions > 0 AND segments.date DURING LAST_7_DAYS');

  out.stat_30d        = gaql(out, 'stat_30d',
    'SELECT campaign.id, metrics.impressions, metrics.clicks, metrics.cost_micros, ' +
    'metrics.conversions, metrics.conversions_value ' +
    'FROM campaign WHERE metrics.impressions > 0 AND segments.date DURING LAST_30_DAYS');

  out.konversijos     = gaql(out, 'konversijos',
    'SELECT conversion_action.id, conversion_action.name, conversion_action.status, ' +
    'conversion_action.type, conversion_action.category, conversion_action.primary_for_goal, ' +
    'conversion_action.include_in_conversions_metric ' +
    'FROM conversion_action WHERE conversion_action.status != "REMOVED"');

  out.raktazodziai    = gaql(out, 'raktazodziai',
    'SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ' +
    'ad_group_criterion.keyword.match_type, ad_group_criterion.status ' +
    'FROM keyword_view WHERE campaign.advertising_channel_type = "SEARCH" LIMIT 300');

  out.neigiami_kamp   = gaql(out, 'neigiami_kamp',
    'SELECT campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type ' +
    'FROM campaign_criterion WHERE campaign_criterion.negative = TRUE ' +
    'AND campaign_criterion.type = "KEYWORD" LIMIT 300');

  out.bendri_sarasai  = gaql(out, 'bendri_sarasai',
    'SELECT shared_set.id, shared_set.name, shared_set.type, shared_set.status, ' +
    'shared_set.member_count FROM shared_set WHERE shared_set.status != "REMOVED"');

  out.sarasu_priskyrimai = gaql(out, 'sarasu_priskyrimai',
    'SELECT campaign.name, shared_set.name FROM campaign_shared_set ' +
    'WHERE campaign_shared_set.status != "REMOVED"');

  out.pmax_grupes     = gaql(out, 'pmax_grupes',
    'SELECT campaign.name, asset_group.name, asset_group.status FROM asset_group LIMIT 100');

  out.skelbimai_search = gaql(out, 'skelbimai_search',
    'SELECT campaign.name, ad_group.name, ad_group_ad.status, ' +
    'ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.final_urls ' +
    'FROM ad_group_ad WHERE campaign.advertising_channel_type = "SEARCH" LIMIT 100');

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
    while (it.hasNext() && rows.length < 400) { rows.push(flat(it.next())); }
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
