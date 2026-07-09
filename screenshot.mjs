import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const HOME=Buffer.from("PCEtLSB3cDpodG1sIC0tPjxzdHlsZT4ucGgtaGVyb3twb3NpdGlvbjpyZWxhdGl2ZTtib3JkZXItcmFkaXVzOjEycHg7bWFyZ2luOjAgMCA0MHB4O21pbi1oZWlnaHQ6NDIwcHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtvdmVyZmxvdzpoaWRkZW47YmFja2dyb3VuZDojMkQ1RjNGO30ucGgtaGVyby1iZ3twb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2JhY2tncm91bmQtaW1hZ2U6dXJsKGh0dHBzOi8vZGV2LmF2ZXNhLmx0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDI2LzA3L2hlcm8tYXVnaW50aW5pYWktcGFncmluZGluaXMud2VicD92PTIwMjYwNzA5LWU0Yik7YmFja2dyb3VuZC1zaXplOmNvdmVyO2JhY2tncm91bmQtcG9zaXRpb246Y2VudGVyIHJpZ2h0O30ucGgtaGVyby1zY3JpbXtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHJnYmEoMjgsNTUsMzcsLjkyKSAwJSxyZ2JhKDI4LDU1LDM3LC43NSkgMzglLHJnYmEoMjgsNTUsMzcsLjI1KSA2MCUscmdiYSgyOCw1NSwzNywwKSA3OCUpO30ucGgtaGVyby1pbm5lcntwb3NpdGlvbjpyZWxhdGl2ZTt6LWluZGV4OjI7cGFkZGluZzo0OHB4IDU2cHg7bWF4LXdpZHRoOjY4MHB4O30ucGgtaGVyby1iYWRnZXtkaXNwbGF5OmlubGluZS1mbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMTUpO2NvbG9yOiNmZmY7Zm9udC1zaXplOi44NXJlbTtmb250LXdlaWdodDo2MDA7cGFkZGluZzo2cHggMTRweCA2cHggMTBweDtib3JkZXItcmFkaXVzOjEwMHB4O21hcmdpbi1ib3R0b206MThweDtiYWNrZHJvcC1maWx0ZXI6Ymx1cig0cHgpO2xldHRlci1zcGFjaW5nOi4wMmVtO30ucGgtaGVyby1iYWRnZSBpbWd7d2lkdGg6MjJweDtoZWlnaHQ6MjJweDtkaXNwbGF5OmJsb2NrO30ucGgtaGVyby10ZXh0IGgxe2NvbG9yOiNmZmYgIWltcG9ydGFudDtmb250LXNpemU6Mi43cmVtO2xpbmUtaGVpZ2h0OjEuMTI7bWFyZ2luOjAgMCAxOHB4O2ZvbnQtd2VpZ2h0OjgwMDt9LnBoLWhlcm8tdGV4dCBwe2NvbG9yOiNFQUYzRTg7Zm9udC1zaXplOjEuMXJlbTtsaW5lLWhlaWdodDoxLjU7bWFyZ2luOjAgMCAyOHB4O21heC13aWR0aDo0ODBweDt9LnBoLWhlcm8tY3Rhe2Rpc3BsYXk6ZmxleDtnYXA6MTRweDthbGlnbi1pdGVtczpjZW50ZXI7ZmxleC13cmFwOndyYXA7bWFyZ2luLWJvdHRvbToyMnB4O30ucGgtYnRuLXByaW1hcnl7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDojNDM5MTVDO2NvbG9yOiNmZmYgIWltcG9ydGFudDtmb250LXdlaWdodDo3MDA7cGFkZGluZzoxNHB4IDMwcHg7Ym9yZGVyLXJhZGl1czo4cHg7dGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDt0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2U7Ym94LXNoYWRvdzowIDJweCA4cHggcmdiYSgwLDAsMCwuMTUpO30ucGgtYnRuLXByaW1hcnk6aG92ZXJ7YmFja2dyb3VuZDojMzU3YTRiO3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpO2JveC1zaGFkb3c6MCA0cHggMTRweCByZ2JhKDAsMCwwLC4yNSk7fS5waC1idG4tZ2hvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y29sb3I6I2ZmZiAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjYwMDtwYWRkaW5nOjE0cHggMjRweDtib3JkZXI6MS41cHggc29saWQgcmdiYSgxNjgsMjAxLDE2MCwuOCk7Ym9yZGVyLXJhZGl1czo4cHg7dGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDt0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2U7fS5waC1idG4tZ2hvc3Q6aG92ZXJ7Ym9yZGVyLWNvbG9yOiNBOEM5QTA7YmFja2dyb3VuZDpyZ2JhKDE2OCwyMDEsMTYwLC4xNSk7fS5waC1oZXJvLWNoaXBze2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7ZmxleC13cmFwOndyYXA7Z2FwOjhweDttYXJnaW4tdG9wOjhweDt9LnBoLWhlcm8tY2hpcHtkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjE1KTtjb2xvcjojZmZmICFpbXBvcnRhbnQ7Zm9udC1zaXplOi44NXJlbTtmb250LXdlaWdodDo2MDA7cGFkZGluZzo2cHggMTNweDtib3JkZXItcmFkaXVzOjEwMHB4O3RleHQtZGVjb3JhdGlvbjpub25lICFpbXBvcnRhbnQ7Ym9yZGVyOjFweCBzb2xpZCByZ2JhKDE2OCwyMDEsMTYwLC40KTt0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2U7YmFja2Ryb3AtZmlsdGVyOmJsdXIoNHB4KTt3aGl0ZS1zcGFjZTpub3dyYXA7fS5waC1oZXJvLWNoaXA6aG92ZXJ7YmFja2dyb3VuZDpyZ2JhKDE2OCwyMDEsMTYwLC4zNSk7Ym9yZGVyLWNvbG9yOiNBOEM5QTA7Y29sb3I6I2ZmZiAhaW1wb3J0YW50O30ucGgtaGVyby1jaGlwLXNlcHtjb2xvcjpyZ2JhKDI1NSwyNTUsMjU1LC41KTtmb250LXNpemU6Ljg1cmVtO3VzZXItc2VsZWN0Om5vbmU7fS5waC1zZWN0aW9ue21hcmdpbjowIDAgNDRweDt9LnBoLXNlY3Rpb24taGVhZHttYXJnaW46MCAwIDZweDt9LnBoLXNlY3Rpb24tdGl0bGV7Zm9udC1zaXplOjEuNnJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzFmMjkzNzttYXJnaW46MCAwIDZweDt9LnBoLXNlY3Rpb24tc3Vie2NvbG9yOiM2YjcyODA7Zm9udC1zaXplOjFyZW07bWFyZ2luOjAgMCAyMHB4O30ucGgtY2F0LWdyaWR7ZGlzcGxheTpncmlkICFpbXBvcnRhbnQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCg1LG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7Z2FwOjE2cHggIWltcG9ydGFudDt9LnBoLWNhdC1ncmlkIC5waC1jYXQtY2FyZHtkaXNwbGF5OmZsZXggIWltcG9ydGFudDtmbGV4LWRpcmVjdGlvbjpjb2x1bW4gIWltcG9ydGFudDthbGlnbi1pdGVtczpjZW50ZXIgIWltcG9ydGFudDtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyICFpbXBvcnRhbnQ7Z2FwOjE0cHggIWltcG9ydGFudDtwYWRkaW5nOjI0cHggMTJweCAhaW1wb3J0YW50O2JhY2tncm91bmQ6I2ZmZiAhaW1wb3J0YW50O2JvcmRlcjoxcHggc29saWQgI0U1RTdFQiAhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6MTBweCAhaW1wb3J0YW50O3RleHQtZGVjb3JhdGlvbjpub25lICFpbXBvcnRhbnQ7dHJhbnNpdGlvbjphbGwgLjE1cyBlYXNlICFpbXBvcnRhbnQ7fS5waC1jYXQtZ3JpZCAucGgtY2F0LWNhcmQ6aG92ZXJ7Ym9yZGVyLWNvbG9yOiMyRDVGM0YgIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNGN0ZCRjYgIWltcG9ydGFudDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtM3B4KSAhaW1wb3J0YW50O2JveC1zaGFkb3c6MCA2cHggMTZweCByZ2JhKDQ1LDk1LDYzLC4xMikgIWltcG9ydGFudDt9LnBoLWNhdC1ncmlkIC5waC1jYXQtaW1ne3dpZHRoOjk2cHggIWltcG9ydGFudDtoZWlnaHQ6OTZweCAhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6NTAlICFpbXBvcnRhbnQ7b2JqZWN0LWZpdDpjb3ZlciAhaW1wb3J0YW50O2JvcmRlcjozcHggc29saWQgI0VBRjNFOCAhaW1wb3J0YW50O2Rpc3BsYXk6YmxvY2sgIWltcG9ydGFudDt9LnBoLWNhdC1ncmlkIC5waC1jYXQtbmFtZXtmb250LXNpemU6MS4wNXJlbSAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjcwMCAhaW1wb3J0YW50O2NvbG9yOiMyRDVGM0YgIWltcG9ydGFudDt9LnBoLW5lZWQtZ3JpZHtkaXNwbGF5OmdyaWQgIWltcG9ydGFudDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsbWlubWF4KDAsMWZyKSkgIWltcG9ydGFudDtnYXA6MTJweCAhaW1wb3J0YW50O30ucGgtbmVlZC1ncmlkIC5waC1uZWVkLWNhcmR7ZGlzcGxheTpmbGV4ICFpbXBvcnRhbnQ7ZmxleC1kaXJlY3Rpb246Y29sdW1uICFpbXBvcnRhbnQ7Z2FwOjZweCAhaW1wb3J0YW50O3BhZGRpbmc6MThweCAyMHB4ICFpbXBvcnRhbnQ7YmFja2dyb3VuZDojRjdGQkY2ICFpbXBvcnRhbnQ7Ym9yZGVyOjFweCBzb2xpZCAjRENFQUQ2ICFpbXBvcnRhbnQ7Ym9yZGVyLXJhZGl1czoxMHB4ICFpbXBvcnRhbnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDt0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2UgIWltcG9ydGFudDt9LnBoLW5lZWQtZ3JpZCAucGgtbmVlZC1jYXJkOmhvdmVye2JvcmRlci1jb2xvcjojMkQ1RjNGICFpbXBvcnRhbnQ7YmFja2dyb3VuZDojRUFGM0U4ICFpbXBvcnRhbnQ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTJweCkgIWltcG9ydGFudDtib3gtc2hhZG93OjAgNHB4IDEycHggcmdiYSg0NSw5NSw2MywuMSkgIWltcG9ydGFudDt9LnBoLW5lZWQtZ3JpZCAucGgtbmVlZC10aXRsZXtmb250LXNpemU6MXJlbSAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjcwMCAhaW1wb3J0YW50O2NvbG9yOiMyRDVGM0YgIWltcG9ydGFudDt9LnBoLW5lZWQtZ3JpZCAucGgtbmVlZC1kZXNje2ZvbnQtc2l6ZTouODVyZW0gIWltcG9ydGFudDtjb2xvcjojNWI2YjVlICFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6MS4zNSAhaW1wb3J0YW50O31AbWVkaWEobWF4LXdpZHRoOjkwMHB4KXsucGgtY2F0LWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7fS5waC1uZWVkLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7fS5waC1oZXJvLXRleHQgaDF7Zm9udC1zaXplOjJyZW07fS5waC1oZXJvLWlubmVye3BhZGRpbmc6MzZweCAyOHB4O21heC13aWR0aDoxMDAlO30ucGgtaGVyby1zY3JpbXtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI4LDU1LDM3LC45NSkgMCUscmdiYSgyOCw1NSwzNywuODUpIDU1JSxyZ2JhKDI4LDU1LDM3LC41NSkgMTAwJSk7fS5waC1jYXQtZ3JpZCAucGgtY2F0LWltZ3t3aWR0aDo4NHB4ICFpbXBvcnRhbnQ7aGVpZ2h0Ojg0cHggIWltcG9ydGFudDt9fUBtZWRpYShtYXgtd2lkdGg6NjAwcHgpey5waC1jYXQtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDIsbWlubWF4KDAsMWZyKSkgIWltcG9ydGFudDt9LnBoLW5lZWQtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyICFpbXBvcnRhbnQ7fS5waC1oZXJve21pbi1oZWlnaHQ6MzgwcHg7fS5waC1oZXJvLXRleHQgaDF7Zm9udC1zaXplOjEuN3JlbTt9LnBoLWhlcm8tYmd7YmFja2dyb3VuZC1wb3NpdGlvbjpjZW50ZXIgcmlnaHQgLTQwcHg7fS5waC1oZXJvLXNjcmlte2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDE4MGRlZyxyZ2JhKDI4LDU1LDM3LC45KSAwJSxyZ2JhKDI4LDU1LDM3LC43KSA2MCUscmdiYSgyOCw1NSwzNywuODUpIDEwMCUpO30ucGgtaGVyby1jaGlwc3tnYXA6NnB4O30ucGgtaGVyby1jaGlwe2ZvbnQtc2l6ZTouOHJlbTtwYWRkaW5nOjVweCAxMnB4O30ucGgtY2F0LWdyaWQgLnBoLWNhdC1pbWd7d2lkdGg6ODhweCAhaW1wb3J0YW50O2hlaWdodDo4OHB4ICFpbXBvcnRhbnQ7fX0ucGgtYmFubmVyc3tkaXNwbGF5OmdyaWQgIWltcG9ydGFudDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmciAhaW1wb3J0YW50O2dhcDoyMHB4ICFpbXBvcnRhbnQ7bWFyZ2luOjAgMCA0NHB4ICFpbXBvcnRhbnQ7fS5waC1iYW5uZXJ7cG9zaXRpb246cmVsYXRpdmUgIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjEycHggIWltcG9ydGFudDtvdmVyZmxvdzpoaWRkZW4gIWltcG9ydGFudDttaW4taGVpZ2h0OjI4MHB4ICFpbXBvcnRhbnQ7ZGlzcGxheTpmbGV4ICFpbXBvcnRhbnQ7YWxpZ24taXRlbXM6Y2VudGVyICFpbXBvcnRhbnQ7YmFja2dyb3VuZDojRUZFN0Q2ICFpbXBvcnRhbnQ7fS5waC1iYW5uZXItYmd7cG9zaXRpb246YWJzb2x1dGUgIWltcG9ydGFudDtpbnNldDowICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1zaXplOmNvdmVyICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1wb3NpdGlvbjpjZW50ZXIgcmlnaHQgIWltcG9ydGFudDt9LnBoLWJhbm5lci1zY3JpbXtwb3NpdGlvbjphYnNvbHV0ZSAhaW1wb3J0YW50O2luc2V0OjAgIWltcG9ydGFudDtiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCg5MGRlZyxyZ2JhKDI0NSwyMzksMjI1LC45NikgMCUscmdiYSgyNDUsMjM5LDIyNSwuODIpIDMyJSxyZ2JhKDI0NSwyMzksMjI1LC4zNSkgNTUlLHJnYmEoMjQ1LDIzOSwyMjUsMCkgNzIlKSAhaW1wb3J0YW50O30ucGgtYmFubmVyLWlubmVye3Bvc2l0aW9uOnJlbGF0aXZlICFpbXBvcnRhbnQ7ei1pbmRleDoyICFpbXBvcnRhbnQ7cGFkZGluZzozMnB4IDM0cHggIWltcG9ydGFudDttYXgtd2lkdGg6NjIlICFpbXBvcnRhbnQ7fS5waC1iYW5uZXItYmFkZ2V7ZGlzcGxheTppbmxpbmUtYmxvY2sgIWltcG9ydGFudDtiYWNrZ3JvdW5kOiMyRDVGM0YgIWltcG9ydGFudDtjb2xvcjojZmZmICFpbXBvcnRhbnQ7Zm9udC1zaXplOi43MnJlbSAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjcwMCAhaW1wb3J0YW50O3BhZGRpbmc6NXB4IDEycHggIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjEwMHB4ICFpbXBvcnRhbnQ7bWFyZ2luLWJvdHRvbToxMnB4ICFpbXBvcnRhbnQ7bGV0dGVyLXNwYWNpbmc6LjAzZW0gIWltcG9ydGFudDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2UgIWltcG9ydGFudDt9LnBoLWJhbm5lci10aXRsZXtmb250LXNpemU6MS41cmVtICFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6ODAwICFpbXBvcnRhbnQ7Y29sb3I6IzJENUYzRiAhaW1wb3J0YW50O2xpbmUtaGVpZ2h0OjEuMTUgIWltcG9ydGFudDttYXJnaW46MCAwIDEwcHggIWltcG9ydGFudDt9LnBoLWJhbm5lci10ZXh0e2ZvbnQtc2l6ZTouOTVyZW0gIWltcG9ydGFudDtjb2xvcjojNWI1MzQ0ICFpbXBvcnRhbnQ7bGluZS1oZWlnaHQ6MS40NSAhaW1wb3J0YW50O21hcmdpbjowIDAgMThweCAhaW1wb3J0YW50O30ucGgtYmFubmVyLWN0YXtkaXNwbGF5OmlubGluZS1ibG9jayAhaW1wb3J0YW50O2JhY2tncm91bmQ6IzQzOTE1QyAhaW1wb3J0YW50O2NvbG9yOiNmZmYgIWltcG9ydGFudDtmb250LXdlaWdodDo3MDAgIWltcG9ydGFudDtwYWRkaW5nOjExcHggMjJweCAhaW1wb3J0YW50O2JvcmRlci1yYWRpdXM6OHB4ICFpbXBvcnRhbnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDtmb250LXNpemU6LjkycmVtICFpbXBvcnRhbnQ7dHJhbnNpdGlvbjphbGwgLjE1cyBlYXNlICFpbXBvcnRhbnQ7Ym94LXNoYWRvdzowIDJweCA4cHggcmdiYSg0NSw5NSw2MywuMikgIWltcG9ydGFudDt9LnBoLWJhbm5lci1jdGE6aG92ZXJ7YmFja2dyb3VuZDojMzU3YTRiICFpbXBvcnRhbnQ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCkgIWltcG9ydGFudDtjb2xvcjojZmZmICFpbXBvcnRhbnQ7fUBtZWRpYShtYXgtd2lkdGg6OTAwcHgpey5waC1iYW5uZXJze2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgIWltcG9ydGFudDt9LnBoLWJhbm5lcnttaW4taGVpZ2h0OjI0MHB4ICFpbXBvcnRhbnQ7fS5waC1iYW5uZXItaW5uZXJ7bWF4LXdpZHRoOjY4JSAhaW1wb3J0YW50O3BhZGRpbmc6MjZweCAyOHB4ICFpbXBvcnRhbnQ7fX1AbWVkaWEobWF4LXdpZHRoOjYwMHB4KXsucGgtYmFubmVye21pbi1oZWlnaHQ6MjEwcHggIWltcG9ydGFudDt9LnBoLWJhbm5lci1pbm5lcnttYXgtd2lkdGg6NzglICFpbXBvcnRhbnQ7cGFkZGluZzoyMnB4IDIycHggIWltcG9ydGFudDt9LnBoLWJhbm5lci10aXRsZXtmb250LXNpemU6MS4yNXJlbSAhaW1wb3J0YW50O30ucGgtYmFubmVyLXNjcmlte2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDkwZGVnLHJnYmEoMjQ1LDIzOSwyMjUsLjk3KSAwJSxyZ2JhKDI0NSwyMzksMjI1LC45KSA1NSUscmdiYSgyNDUsMjM5LDIyNSwuNTUpIDEwMCUpICFpbXBvcnRhbnQ7fX0ucGgtdGJ7ZGlzcGxheTpmbGV4ICFpbXBvcnRhbnQ7YWxpZ24taXRlbXM6Y2VudGVyICFpbXBvcnRhbnQ7anVzdGlmeS1jb250ZW50OmNlbnRlciAhaW1wb3J0YW50O2ZsZXgtd3JhcDp3cmFwICFpbXBvcnRhbnQ7Z2FwOjAgIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNGN0ZCRjYgIWltcG9ydGFudDtib3JkZXI6MXB4IHNvbGlkICNEQ0VBRDYgIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjEwcHggIWltcG9ydGFudDtwYWRkaW5nOjE0cHggMjBweCAhaW1wb3J0YW50O21hcmdpbjowIDAgNDBweCAhaW1wb3J0YW50O30ucGgtdGItaXRlbXtkaXNwbGF5OmlubGluZS1mbGV4ICFpbXBvcnRhbnQ7YWxpZ24taXRlbXM6Y2VudGVyICFpbXBvcnRhbnQ7Zm9udC1zaXplOi44OHJlbSAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjYwMCAhaW1wb3J0YW50O2NvbG9yOiMyRDVGM0YgIWltcG9ydGFudDtwYWRkaW5nOjRweCAxNnB4ICFpbXBvcnRhbnQ7d2hpdGUtc3BhY2U6bm93cmFwICFpbXBvcnRhbnQ7fS5waC10Yi1zZXB7Y29sb3I6I0E4QzlBMCAhaW1wb3J0YW50O2ZvbnQtc2l6ZTouODVyZW0gIWltcG9ydGFudDt1c2VyLXNlbGVjdDpub25lICFpbXBvcnRhbnQ7cGFkZGluZzowICFpbXBvcnRhbnQ7fUBtZWRpYShtYXgtd2lkdGg6OTAwcHgpey5waC10YntwYWRkaW5nOjEycHggMTJweCAhaW1wb3J0YW50O30ucGgtdGItaXRlbXtmb250LXNpemU6LjgycmVtICFpbXBvcnRhbnQ7cGFkZGluZzo0cHggMTBweCAhaW1wb3J0YW50O319QG1lZGlhKG1heC13aWR0aDo2MDBweCl7LnBoLXRie2Rpc3BsYXk6Z3JpZCAhaW1wb3J0YW50O2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnIgMWZyICFpbXBvcnRhbnQ7Z2FwOjEwcHggNnB4ICFpbXBvcnRhbnQ7cGFkZGluZzoxNHB4IDEycHggIWltcG9ydGFudDt9LnBoLXRiLWl0ZW17Zm9udC1zaXplOi43NHJlbSAhaW1wb3J0YW50O3BhZGRpbmc6MCAhaW1wb3J0YW50O3doaXRlLXNwYWNlOm5vcm1hbCAhaW1wb3J0YW50O2xpbmUtaGVpZ2h0OjEuMyAhaW1wb3J0YW50O2p1c3RpZnktY29udGVudDpjZW50ZXIgIWltcG9ydGFudDt0ZXh0LWFsaWduOmNlbnRlciAhaW1wb3J0YW50O30ucGgtdGItc2Vwe2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50O319PC9zdHlsZT48ZGl2IGNsYXNzPSJwaC1oZXJvIj48ZGl2IGNsYXNzPSJwaC1oZXJvLWJnIj48L2Rpdj48ZGl2IGNsYXNzPSJwaC1oZXJvLXNjcmltIj48L2Rpdj48ZGl2IGNsYXNzPSJwaC1oZXJvLWlubmVyIj48ZGl2IGNsYXNzPSJwaC1oZXJvLXRleHQiPjxzcGFuIGNsYXNzPSJwaC1oZXJvLWJhZGdlIj48aW1nIHNyYz0iaHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDcvdXBsX2xvZ28tbWFyay12Mi5wbmc/dj0yMDI2MDcwOS1lNGIiIGFsdD0iUGV0c2hvcCIgd2lkdGg9IjIyIiBoZWlnaHQ9IjIyIi8+TnVvIDIwMTAgbS48L3NwYW4+PGgxPlByZWvEl3MgYXVnaW50aW5pdWkgcGFnYWwgcmVhbMWzIHBvcmVpa8SvPC9oMT48cD5NYWlzdGFzLCBwcmllxb5pxatyYSBpciBzcHJlbmRpbWFpIMWhdW5pbXMsIGthdMSXbXMgYmVpIGtpdGllbXMgYXVnaW50aW5pYW1zLiBOdW8gMjAxMCBtLiBwYWRlZGFtZSBpxaFzaXJpbmt0aSBuZSBwYWdhbCByZWtsYW3EhSwgbyBwYWdhbCBzdWTEl3TErywgZ2FtaW50b2rEhSBpciBwcmFrdGluxK8gbmF1ZG9qaW3EhS48L3A+PGRpdiBjbGFzcz0icGgtaGVyby1jdGEiPjxhIGhyZWY9Ii9rYXRlZ29yaWphL3N1bmltcy8iIGNsYXNzPSJwaC1idG4tcHJpbWFyeSI+UGVyxb5pxatyxJd0aSBwcmVrZXMg4oaSPC9hPjxhIGhyZWY9Ii9zcHJlbmRpbWFpLyIgY2xhc3M9InBoLWJ0bi1naG9zdCI+UmFzdGkgc3ByZW5kaW3EhSDihpI8L2E+PC9kaXY+PGRpdiBjbGFzcz0icGgtaGVyby1jaGlwcyI+PGEgaHJlZj0iL2hpcG9hbGVyZ2luaXMtbWFpc3Rhcy8iIGNsYXNzPSJwaC1oZXJvLWNoaXAiPkhpcG9hbGVyZ2luaXM8L2E+PHNwYW4gY2xhc3M9InBoLWhlcm8tY2hpcC1zZXAiPsK3PC9zcGFuPjxhIGhyZWY9Ii9tb25vcHJvdGVpbmlzLW1haXN0YXMvIiBjbGFzcz0icGgtaGVyby1jaGlwIj5Nb25vcHJvdGVpbjwvYT48c3BhbiBjbGFzcz0icGgtaGVyby1jaGlwLXNlcCI+wrc8L3NwYW4+PGEgaHJlZj0iL2JlLWdydWR1LW1haXN0YXMvIiBjbGFzcz0icGgtaGVyby1jaGlwIj5CZSBncsWrZMWzPC9hPjxzcGFuIGNsYXNzPSJwaC1oZXJvLWNoaXAtc2VwIj7Ctzwvc3Bhbj48YSBocmVmPSIvamF1dHJ1cy12aXJza2luaW1hcy8iIGNsYXNzPSJwaC1oZXJvLWNoaXAiPkphdXRyaWFtIHZpcsWha2luaW11aTwvYT48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJwaC10YiI+PHNwYW4gY2xhc3M9InBoLXRiLWl0ZW0iPk5lbW9rYW1hcyBwcmlzdGF0eW1hcyDEryBwYcWhdG9tYXR1cyBudW8gMzAg4oKsPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC10Yi1zZXAiPsK3PC9zcGFuPjxzcGFuIGNsYXNzPSJwaC10Yi1pdGVtIj5Lb25zdWx0YWNpamEgZMSXbCBwcm9kdWt0xbM8L3NwYW4+PHNwYW4gY2xhc3M9InBoLXRiLXNlcCI+wrc8L3NwYW4+PHNwYW4gY2xhc3M9InBoLXRiLWl0ZW0iPlBhZ2FsYmEgcmVua2FudGlzIHBhZ2FsIHBvcmVpa8SvPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC10Yi1zZXAiPsK3PC9zcGFuPjxzcGFuIGNsYXNzPSJwaC10Yi1pdGVtIj5TYXVndXMgYXBtb2vEl2ppbWFzPC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9InBoLXNlY3Rpb24iPjxkaXYgY2xhc3M9InBoLXNlY3Rpb24taGVhZCI+PGgyIGNsYXNzPSJwaC1zZWN0aW9uLXRpdGxlIj5QYWdyaW5kaW7El3Mga2F0ZWdvcmlqb3M8L2gyPjwvZGl2PjxkaXYgY2xhc3M9InBoLWNhdC1ncmlkIj48YSBocmVmPSIva2F0ZWdvcmlqYS9zdW5pbXMvIiBjbGFzcz0icGgtY2F0LWNhcmQiPjxpbWcgY2xhc3M9InBoLWNhdC1pbWciIHNyYz0iaHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDcvdXBsX2NhdC1zdW5pbXMtdjIud2VicD92PTIwMjYwNzA5LWU0YiIgYWx0PSLFoHVuaW1zIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiLz48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPsWgdW5pbXM8L3NwYW4+PC9hPjxhIGhyZWY9Ii9rYXRlZ29yaWphL2thdGVtcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PGltZyBjbGFzcz0icGgtY2F0LWltZyIgc3JjPSJodHRwczovL2Rldi5hdmVzYS5sdC93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wNy91cGxfY2F0LWthdGVtcy12Mi53ZWJwP3Y9MjAyNjA3MDktZTRiIiBhbHQ9IkthdMSXbXMiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIvPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+S2F0xJdtczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEvZ3JhdXppa2Ftcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PGltZyBjbGFzcz0icGgtY2F0LWltZyIgc3JjPSJodHRwczovL2Rldi5hdmVzYS5sdC93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wNy91cGxfY2F0LWdyYXV6aWthbXMtdjIud2VicD92PTIwMjYwNzA5LWU0YiIgYWx0PSJHcmF1xb5pa2FtcyIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ii8+PHNwYW4gY2xhc3M9InBoLWNhdC1uYW1lIj5HcmF1xb5pa2Ftczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEvcGF1a3NjaWFtcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PGltZyBjbGFzcz0icGgtY2F0LWltZyIgc3JjPSJodHRwczovL2Rldi5hdmVzYS5sdC93cC1jb250ZW50L3VwbG9hZHMvMjAyNi8wNy91cGxfY2F0LXBhdWtzY2lhbXMtdjIud2VicD92PTIwMjYwNzA5LWU0YiIgYWx0PSJQYXVrxaHEjWlhbXMiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIvPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+UGF1a8WhxI1pYW1zPC9zcGFuPjwvYT48YSBocmVmPSIva2F0ZWdvcmlqYS96dXZpbXMvIiBjbGFzcz0icGgtY2F0LWNhcmQiPjxpbWcgY2xhc3M9InBoLWNhdC1pbWciIHNyYz0iaHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDcvdXBsX2NhdC16dXZpbXMtdjIud2VicD92PTIwMjYwNzA5LWU0YiIgYWx0PSLFvXV2aW1zIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiLz48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPsW9dXZpbXM8L3NwYW4+PC9hPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9InBoLWJhbm5lcnMiPjxhIGhyZWY9Ii9uYXVqYXMtYXVnaW50aW5pcy8iIGNsYXNzPSJwaC1iYW5uZXIiPjxkaXYgY2xhc3M9InBoLWJhbm5lci1iZyIgc3R5bGU9ImJhY2tncm91bmQtaW1hZ2U6dXJsKGh0dHBzOi8vZGV2LmF2ZXNhLmx0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDI2LzA3L2Jhbm5lci1zdGFydGVyLndlYnA/dj0yMDI2MDcwOS1lNGIpOyI+PC9kaXY+PGRpdiBjbGFzcz0icGgtYmFubmVyLXNjcmltIj48L2Rpdj48ZGl2IGNsYXNzPSJwaC1iYW5uZXItaW5uZXIiPjxzcGFuIGNsYXNzPSJwaC1iYW5uZXItYmFkZ2UiPlBpcm1haSBwcmFkxb5pYWk8L3NwYW4+PGRpdiBjbGFzcz0icGgtYmFubmVyLXRpdGxlIj5OYXVqYW0gYXVnaW50aW5pdWk8L2Rpdj48ZGl2IGNsYXNzPSJwaC1iYW5uZXItdGV4dCI+TWFpc3RhcywgcHJpZcW+acWrcmEgaXIgc3ZhcmJpYXVzaW9zIHByaWVtb27El3MgcGlybWFpIHByYWTFvmlhaS48L2Rpdj48c3BhbiBjbGFzcz0icGgtYmFubmVyLWN0YSI+UmFzdGksIGtvIHJlaWtpYSDihpI8L3NwYW4+PC9kaXY+PC9hPjxhIGhyZWY9Ii9wYXNpdWx5bWFpLyIgY2xhc3M9InBoLWJhbm5lciI+PGRpdiBjbGFzcz0icGgtYmFubmVyLWJnIiBzdHlsZT0iYmFja2dyb3VuZC1pbWFnZTp1cmwoaHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtY29udGVudC91cGxvYWRzLzIwMjYvMDcvYmFubmVyLWRlYWxzLndlYnA/dj0yMDI2MDcwOS1lNGIpOyI+PC9kaXY+PGRpdiBjbGFzcz0icGgtYmFubmVyLXNjcmltIj48L2Rpdj48ZGl2IGNsYXNzPSJwaC1iYW5uZXItaW5uZXIiPjxzcGFuIGNsYXNzPSJwaC1iYW5uZXItYmFkZ2UiPkF0cmlua3RpIHBhc2nFq2x5bWFpPC9zcGFuPjxkaXYgY2xhc3M9InBoLWJhbm5lci10aXRsZSI+QWtjaWpvcyBpciBkYXVnaWF1ID0gcGlnaWF1PC9kaXY+PGRpdiBjbGFzcz0icGgtYmFubmVyLXRleHQiPsWgaXVvIG1ldHUgZ2FsaW9qYW7EjWlvcyBha2Npam9zIGlyIGtpZWtpbyBwYXNpxatseW1haSBhdWdpbnRpbmlhbXMuPC9kaXY+PHNwYW4gY2xhc3M9InBoLWJhbm5lci1jdGEiPlBlcsW+acWrcsSXdGkgcGFzacWrbHltdXMg4oaSPC9zcGFuPjwvZGl2PjwvYT48L2Rpdj48ZGl2IGNsYXNzPSJwaC1zZWN0aW9uIj48ZGl2IGNsYXNzPSJwaC1zZWN0aW9uLWhlYWQiPjxoMiBjbGFzcz0icGgtc2VjdGlvbi10aXRsZSI+Umlua2l0xJdzIHBhZ2FsIHBvcmVpa8SvPC9oMj48cCBjbGFzcz0icGgtc2VjdGlvbi1zdWIiPlBhZGVkYW1lIGnFoXNpcmlua3RpIHBhZ2FsIGF1Z2ludGluaW8gc3ZlaWthdMSFIGlyIHBvcmVpa2l1cywgbmUgcGFnYWwgcmVrbGFtxIUuPC9wPjwvZGl2PjxkaXYgY2xhc3M9InBoLW5lZWQtZ3JpZCI+PGEgaHJlZj0iL2hpcG9hbGVyZ2luaXMtbWFpc3Rhcy8iIGNsYXNzPSJwaC1uZWVkLWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1uZWVkLXRpdGxlIj5IaXBvYWxlcmdpbmlzPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1uZWVkLWRlc2MiPkFpxaFraWFpIMSvdmFyZGludGFzIGJhbHR5bWFzLCBiZSBkYcW+bmlhdXNpYWkgamF1dHJpbmFuxI1pxbMgaW5ncmVkaWVudMWzLjwvc3Bhbj48L2E+PGEgaHJlZj0iL21vbm9wcm90ZWluaXMtbWFpc3Rhcy8iIGNsYXNzPSJwaC1uZWVkLWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1uZWVkLXRpdGxlIj5WaWVuYXMgYmFsdHltbyDFoWFsdGluaXM8L3NwYW4+PHNwYW4gY2xhc3M9InBoLW5lZWQtZGVzYyI+TW9ub3Byb3RlaW5pcyBtYWlzdGFzIOKAlCB2aWVuYSByxavFoWlzLCBhacWha2kgc3VkxJd0aXMuPC9zcGFuPjwvYT48YSBocmVmPSIvYmUtZ3J1ZHUtbWFpc3Rhcy8iIGNsYXNzPSJwaC1uZWVkLWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1uZWVkLXRpdGxlIj5CZSBncsWrZMWzPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1uZWVkLWRlc2MiPkdyYWluLWZyZWUgbWFpc3RhcyDigJQgYW5nbGlhdmFuZGVuaWFpIGnFoSBkYXLFvm92acWzIGFyIGFua8WhdGluacWzLjwvc3Bhbj48L2E+PGEgaHJlZj0iL2phdXRydXMtdmlyc2tpbmltYXMvIiBjbGFzcz0icGgtbmVlZC1jYXJkIj48c3BhbiBjbGFzcz0icGgtbmVlZC10aXRsZSI+SmF1dHJpYW0gdmlyxaFraW5pbXVpPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1uZWVkLWRlc2MiPlN1ZMSXdGlzIMWhdmVsbmVzbmlhbSBza3JhbmTFvml1aSBpciBzdGFiaWxlc25pYW0gdmlyxaFraW5pbXVpLjwvc3Bhbj48L2E+PGEgaHJlZj0iL3N0ZXJpbGl6dW90YXMtYXVnaW50aW5pcy8iIGNsYXNzPSJwaC1uZWVkLWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1uZWVkLXRpdGxlIj5TdGVyaWxpenVvdGFtIGF1Z2ludGluaXVpPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1uZWVkLWRlc2MiPlN2b3JpbyBpciBlbmVyZ2lqb3MgYmFsYW5zYXMgcG8gc3RlcmlsaXphY2lqb3MuPC9zcGFuPjwvYT48YSBocmVmPSIvb2RhaS1pci1rYWlsaXVpLyIgY2xhc3M9InBoLW5lZWQtY2FyZCI+PHNwYW4gY2xhc3M9InBoLW5lZWQtdGl0bGUiPk9kYWkgaXIga2FpbGl1aTwvc3Bhbj48c3BhbiBjbGFzcz0icGgtbmVlZC1kZXNjIj5PbWVnYSByxatnxaF0eXMsIHBhcGlsZGFpIGlyIMWhdmVsbmlvcyBwcmllxb5pxatyb3MgcHJpZW1vbsSXcy48L3NwYW4+PC9hPjwvZGl2PjwvZGl2PjwhLS0gL3dwOmh0bWwgLS0+","base64").toString("utf8");
const SNIP=Buffer.from("LyoqCiAqIFBldHNob3AgVG9wYmFyIFJpZ2h0IEhpZGUgdjEKICoKICogUGFzYWxpbnUgRmxhdHNvbWUgdG9wLWJhciBkZXNpbmlhamkgSFRNTCB3aWRnZXQnYSBnbG9iYWxpYWkgdmlzYW1lIHNpdGUnZS4KICogTmF1ZG9qYW0gdGhlbWVfbW9kIGZpbHRlcid1cyAoZHZpIGdhbGltb3MgRmxhdHNvbWUgdmVyc2lqb3M6IHRvcGJhcl9yaWdodCBpciB0b3BfYmFyX3JpZ2h0KS4KICogVmllbmkgc2l0b3MgdmVyc2lqb3MgdmVpa3MsIGtpdGkg4oCUIG5vLW9wLiBSZXp1bHRhdGFzOiByZW5kZXJpbmFtYSB0dXNjaWEgc3RyaW5nYS4KICovCmFkZF9maWx0ZXIoJ3RoZW1lX21vZF90b3BiYXJfcmlnaHQnLCAnX19yZXR1cm5fZW1wdHlfc3RyaW5nJywgOTkpOwphZGRfZmlsdGVyKCd0aGVtZV9tb2RfdG9wX2Jhcl9yaWdodCcsICdfX3JldHVybl9lbXB0eV9zdHJpbmcnLCA5OSk7CmFkZF9maWx0ZXIoJ3RoZW1lX21vZF90b3BiYXJfcmlnaHRfd2lkZ2V0X2h0bWwnLCAnX19yZXR1cm5fZW1wdHlfc3RyaW5nJywgOTkpOwphZGRfZmlsdGVyKCd0aGVtZV9tb2RfdG9wX2Jhcl9yaWdodF93aWRnZXRfaHRtbCcsICdfX3JldHVybl9lbXB0eV9zdHJpbmcnLCA5OSk7","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'e4b',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(u){ try{ return execSync('curl -sk -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000}); }catch(e){ return ''; } }
(async()=>{
  let out='';

  // === 1. Deploy homepage v8_tb ===
  api('/wp-json/wp/v2/pages/34543','POST',{content:HOME,status:'publish'});
  out += 'homepage deployed\n';

  // === 2. Sukurti snippet'a NEAKTYVU ===
  const created = api('/wp-json/code-snippets/v1/snippets','POST',{
    name: 'Petshop Topbar Right Hide v1',
    code: SNIP,
    scope: 'front-end',
    active: false,
    priority: 10
  });
  let snipId = null;
  try{ const j = JSON.parse(created); snipId = j.id; out += 'snippet created: id='+snipId+'\n'; }
  catch(e){ out += 'CREATE ERR: '+created.slice(0,200)+'\n'; }

  // === 3. Patikrinti code_error ===
  if(snipId){
    const back = api('/wp-json/code-snippets/v1/snippets/'+snipId);
    try{
      const j = JSON.parse(back);
      out += 'code_error: '+(j.code_error === null ? 'null (OK)' : JSON.stringify(j.code_error))+'\n';
      if(j.code_error === null){
        api('/wp-json/code-snippets/v1/snippets/'+snipId,'PUT',{active:true});
        out += 'snippet activated\n';
      }
    }catch(e){ out += 'readback ERR\n'; }
  }

  await new Promise(r=>setTimeout(r,4000));

  // === 4. Anoniminio konteksto patikra (kaip owner mato) ===
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });

  // Homepage
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  const nlog = [];
  p.on('response', r => { const u = r.url(); if(u.includes('/2026/07/')) nlog.push(r.status()+' '+u.replace(DEV,'').split('?')[0]); });
  await p.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(4000);
  const chk = await p.evaluate(()=>{
    const topbarLeft = document.querySelector('.html_topbar_left');
    const topbarRight = document.querySelector('.html_topbar_right');
    const heroBg = document.querySelector('.ph-hero-bg');
    const badge = document.querySelector('.ph-hero-badge img');
    const cats = [...document.querySelectorAll('.ph-cat-img')];
    const tb = document.querySelector('.ph-tb');
    const tbItems = [...document.querySelectorAll('.ph-tb-item')];
    const oldE4 = document.querySelector('.ph-e4');
    const oldGuide = document.querySelectorAll('.ph-guide-card').length;
    const order = [];
    document.querySelectorAll('.ph-hero,.ph-tb,.ph-cat-grid,.ph-banners,.ph-need-grid').forEach(el=>{
      order.push([el.className.split(' ')[0], Math.round(el.getBoundingClientRect().top + window.scrollY)]);
    });
    order.sort((a,b)=>a[1]-b[1]);
    return {
      topbar_left_text: topbarLeft ? topbarLeft.innerText.trim() : 'NERA',
      topbar_right_exists: !!topbarRight,
      topbar_right_content: topbarRight ? (topbarRight.innerText||'').trim().slice(0,100) : '-',
      hero_bg_loaded: heroBg ? getComputedStyle(heroBg).backgroundImage.includes('hero-augintiniai') : false,
      badge_natural: badge ? badge.naturalWidth+'x'+badge.naturalHeight : '-',
      cats_loaded: cats.filter(i=>i.complete&&i.naturalWidth>0).length+'/'+cats.length,
      tb_exists: !!tb,
      tb_bg: tb ? getComputedStyle(tb).backgroundColor : '-',
      tb_items: tbItems.length,
      tb_texts: tbItems.map(x=>x.innerText),
      old_e4_exists: !!oldE4,
      old_guide_cards: oldGuide,
      section_order: order.map(x=>x[0]),
    };
  });
  out += '\n=== DESKTOP (anoniminis) ===\n';
  out += 'tinklo /2026/07/:\n';
  nlog.forEach(l=>out += '  '+l+'\n');
  out += 'DOM:\n'+JSON.stringify(chk,null,1)+'\n';
  putBin('e4b_desktop.png', await p.screenshot({ fullPage:false }));
  // trust bar zoom
  await p.evaluate(()=>{ const t=document.querySelector('.ph-tb'); if(t) t.scrollIntoView({block:'center'}); });
  await p.waitForTimeout(1000);
  putBin('e4b_trust.png', await p.screenshot({ fullPage:false }));
  // pilna apacia - kad matyti kad senojo E4 nebera
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await p.waitForTimeout(1000);
  putBin('e4b_bottom.png', await p.screenshot({ fullPage:false }));
  await ctx.close();

  // Mobile
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(3500);
  const chkM = await pm.evaluate(()=>{
    const tb = document.querySelector('.ph-tb');
    const tbItems = document.querySelectorAll('.ph-tb-item');
    const tr = document.querySelector('.html_topbar_right');
    return {
      tb_exists: !!tb,
      tb_display: tb ? getComputedStyle(tb).display : '-',
      tb_gridcols: tb ? getComputedStyle(tb).gridTemplateColumns : '-',
      tb_items: tbItems.length,
      topbar_right_exists: !!tr,
    };
  });
  out += '\n=== MOBILE ===\n'+JSON.stringify(chkM,null,1)+'\n';
  await pm.evaluate(()=>{ const t=document.querySelector('.ph-tb'); if(t) t.scrollIntoView({block:'center'}); });
  await pm.waitForTimeout(1000);
  putBin('e4b_mobile_trust.png', await pm.screenshot({ fullPage:false }));
  await cm.close();

  // === Antrinis puslapis — patikrinti kad top-bar right dingo VISUR ===
  const ctx2 = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:600} });
  const p2 = await ctx2.newPage();
  await p2.goto(DEV+'/apie-mus/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p2.waitForTimeout(2000);
  const chk2 = await p2.evaluate(()=>{
    const tr = document.querySelector('.html_topbar_right');
    const tl = document.querySelector('.html_topbar_left');
    return {
      tr_exists: !!tr,
      tr_content: tr ? (tr.innerText||'').trim().slice(0,80) : '-',
      tl_text: tl ? (tl.innerText||'').trim() : '-',
    };
  });
  out += '\n=== KITAS PUSLAPIS (/apie-mus/) — globali patikra ===\n'+JSON.stringify(chk2,null,1)+'\n';
  putBin('e4b_apie_topbar.png', await p2.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:60} }));
  await ctx2.close();

  await b.close();
  putFile('deploy_e4b.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,250)); });
