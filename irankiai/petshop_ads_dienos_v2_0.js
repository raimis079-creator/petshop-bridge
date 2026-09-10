/**
 * Petshop Ads Dienos v2.0 (kampanijų dienos metrika -> petshop.lt ps-web/v1/ads)
 * S1668: v1 siuntė į dev.avesa.lt (nebegyvas po T-0). Tvarkaraštis: KASDIEN ~06:00.
 * Siunčia 8 paskutines pilnas dienas (priėmiklis perrašo pakitusias: new/upd/same).
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var DIENU = 8;

function main() {
  var acc = AdsApp.currentAccount();
  var tz = acc.getTimeZone();
  var d = function (n) { return Utilities.formatDate(new Date(Date.now() - n * 86400000), tz, 'yyyy-MM-dd'); };
  var q = 'SELECT segments.date, campaign.id, campaign.name, metrics.impressions, metrics.clicks, ' +
    'metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign ' +
    "WHERE segments.date BETWEEN '" + d(DIENU) + "' AND '" + d(1) + "'";
  var rows = [], it = AdsApp.search(q);
  while (it.hasNext()) {
    var r = it.next();
    rows.push({
      date: r.segments.date, campaign_id: String(r.campaign.id), campaign: r.campaign.name,
      impressions: Number(r.metrics.impressions || 0), clicks: Number(r.metrics.clicks || 0),
      cost: Math.round(Number(r.metrics.costMicros || 0) / 10000) / 100,
      conversions: Number(r.metrics.conversions || 0), conv_value: Number(r.metrics.conversionsValue || 0)
    });
  }
  var resp = UrlFetchApp.fetch(URL, {
    method: 'post', contentType: 'application/json',
    headers: { 'x-ps-key': KEY }, muteHttpExceptions: true,
    payload: JSON.stringify({ currency: acc.getCurrencyCode(), rows: rows })
  });
  var code = resp.getResponseCode();
  Logger.log('Eilučių: ' + rows.length + ' | HTTP ' + code + ' | ' + resp.getContentText().substring(0, 200));
  if (code !== 200) { throw new Error('Priėmiklis grąžino HTTP ' + code); }
}
