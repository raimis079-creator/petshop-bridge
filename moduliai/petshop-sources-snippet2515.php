/**
 * Petshop Sources v2.3 (šaltinių REGISTRAS + gyvi skaičiai + palaikymas + sandėlio pildymas + dviejų sandėlių eilutės)
 *
 * v2.3 DVIEJŲ SANDĖLIŲ EILUTĖS (S1592, 2026-09-02). Priežastis: suskaiciuoti()
 *   tiekėjo eilutę kūrė TIK iš `_ps_sandelis` (viena reikšmė). AV+VF / AV+ZB
 *   prekės (Exclusion Hypo, Monge, Bioveterinary) vf/zb eilutės negaudavo —
 *   tik rankiniai 08-07/08-20 batch'ai. Naujoms VF prekėms uzpildyti_sandeli()
 *   reikalavo registro eilutės, kurios be sandėlio neatsiranda (užburtas ratas):
 *   41 VF + 32 ZB be tiekėjo eilutės, 38 publish be sandėlio.
 *   Taisyklės:
 *   - suskaiciuoti(): be sandėlio eilutės pridedamos vf/zb eilutės, kai prekė
 *     turi tiekėjo meta (`_vf_supplier_sku` / `_zb_supplier_sku` arba `_zb_qty`);
 *     priority: AV 1, sandėlio tiekėjas 2, kiti 3. Šešėliai (`_ps_shadow_of`) —
 *     nepildomi (jų eilutės priklauso AV prekei, žr. petshop-seseliai.php).
 *   - uzpildyti_sandeli(): kai registre 0 šaltinių, sandėlis nustatomas iš
 *     tiekėjo meta, jei LYGIAI VIENAS tiekėjas ir nėra savo likučio.
 *   - laukai('zb'): sku `_zb_supplier_sku` (buvo `_zb_sku` — tokio meta nėra).
 *   Ta pati logika bus taikoma ZB (savininko nurodymas 2026-09-02).
 *
 * E0 pirmas žingsnis. Daugiašaltinis prekės modelis (TŽ 37.2).
 *
 * SAUGA:
 *  - ?ps_src=dry     TIK SKAITO. Nieko nerašo, lentelės nekuria.
 *  - ?ps_src=fix     vienkartinis pataisymas: 0 ir 0000-00-00 -> NULL
 *
 * v1.1: NULL saugomas kaip NULL. „Nezinoma" ir „lygu nuliui" — skirtingi dalykai.
 *
 * v2.0 HIBRIDINIS MODELIS (S642). Lentelė padalinta pagal tai, KAS duomenis valdo:
 *   REGISTRAS (žmogus, keičiasi retai)  product_id · source · supplier_sku · ean
 *                                       priority · is_active · is_sellable
 *   GYVI SKAIČIAI (importas, kas val.)  stock_qty · cost_net · synced_at — IŠ META
 *   Lentelės stock_qty/cost_net lieka kaip momentinė kopija ataskaitoms.
 *   Parduodamo kiekio skaičiavimas jų NELIEČIA — jos pasensta per valandą.
 *
 *   registras($pid)   šaltinių sąrašas iš lentelės
 *   gyvi($pid,$src)   likutis/savikaina/data iš meta
 *   saltiniai($pid)   abu sujungti; nėra įrašo lentelėje → FALLBACK į suskaiciuoti()
 *
 * v2.1 PALAIKYMAS (S643). Be jo registras liktų vienkartinė migracijos nuotrauka:
 *   nauja prekė į jį nepatektų ir amžinai eitų atsarginiu keliu.
 *   sinchronizuoti($pid)   suderina prekės registrą su meta būsena
 *   hook woocommerce_update_product / save_post  → prekei išsaugojus
 *   hook _ps_sandelis pakeitimas                 → sandėlį pakeitus
 *   cron ps_sources_naktinis                     → pilnas resync + momentinė kopija
 *
 * v2.2 SANDĖLIO PILDYMAS (S719). Priežastis: `_ps_sandelis` neturėjo nė vieno
 *   rašytojo kode — vienintelis buvo TEMP S595 vienkartinis, o WPAI ZB profiliai
 *   su full_update lauką trynė (S718). Taisyklės:
 *   uzpildyti_sandeli($pid)  pildo TIK TUŠČIĄ lauką, TIK kai registre lygiai
 *                            vienas aktyvus šaltinis; kiekvienas įrašas — į
 *                            žurnalą (option ps_sandelio_uzpildymai) undo'ui
 *   kviečiama iš sinchronizuoti() → hook'ai ir naktinis cron gydo automatiškai
 *   endpoint'ai: ?ps_src=sandelisdry / sandelisapply / sandelisundo
 *
 * APSAUGOS:
 *   - dirba tik su post_type=product
 *   - rekursijos sargas (statinis žymeklis)
 *   - importo metu (WP All Import) NEVYKDOMA — pakanka naktinio resync
 *   - prekė be jokio šaltinio pažymima _ps_be_saltinio=1, NIEKO netrinant
 *  - ?ps_src=apply   kuria lentelę ir rašo įrašus. Kviečiama TIK sąmoningai.
 *  - Abu reikalauja rakto. Esamų laukų nekeičia NIEKADA — _ps_sandelis lieka vietoje.
 */

if ( ! class_exists('Petshop_Sources') ) {

class Petshop_Sources {

    const VERSIJA = '2.3';
    const AV = 'av';

    public static function lentele() {
        global $wpdb; return $wpdb->prefix . 'ps_sources';
    }

    /** Lentelės schema. Kuriama tik per apply. */
    public static function kurti_lentele() {
        global $wpdb;
        $t = self::lentele();
        $col = $wpdb->get_charset_collate();
        $sql = "CREATE TABLE {$t} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            product_id BIGINT UNSIGNED NOT NULL,
            source VARCHAR(32) NOT NULL,
            supplier_sku VARCHAR(64) NULL,
            ean VARCHAR(32) NULL,
            stock_qty INT NULL,
            cost_net DECIMAL(12,4) NULL,
            synced_at DATETIME NULL,
            is_active TINYINT(1) NOT NULL DEFAULT 1,
            is_sellable TINYINT(1) NOT NULL DEFAULT 1,
            priority SMALLINT NOT NULL DEFAULT 10,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (id),
            UNIQUE KEY prod_src (product_id, source),
            KEY source (source),
            KEY prio (product_id, priority)
        ) {$col};";
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
        return $wpdb->get_var("SHOW TABLES LIKE '{$t}'") === $t;
    }

    /** Kurie meta laukai kuriam tiekėjui. */
    public static function laukai($src) {
        $m = array(
            'vf' => array('sku'=>'_vf_supplier_sku','qty'=>'_vf_qty','cost'=>'_vf_cost','sync'=>'_vf_last_sync','ean'=>'_vf_barcode'),
            'zb' => array('sku'=>'_zb_supplier_sku','qty'=>'_zb_qty','cost'=>'_zb_cost','sync'=>'_zb_last_sync','ean'=>'_zb_barcode'), // v2.3: _zb_supplier_sku
        );
        return isset($m[$src]) ? $m[$src] : array('sku'=>null,'qty'=>null,'cost'=>'_cost_price','sync'=>null,'ean'=>null);
    }

    /**
     * Iš esamų meta duomenų sudėlioja šaltinių sąrašą VIENAI prekei.
     * GRYNA FUNKCIJA — nieko nerašo.
     */
    public static function suskaiciuoti($pid) {
        $sand = get_post_meta($pid, '_ps_sandelis', true);
        $own  = get_post_meta($pid, '_own_stock_qty', true);
        $stock= get_post_meta($pid, '_stock', true);
        $out  = array();

        // 1) AV šaltinis — kai sandėlis av ARBA turime savo likutį
        $turi_av = ($sand === self::AV) || ($own !== '' && (int)$own > 0);
        if ($turi_av) {
            $qty = ($sand === self::AV)
                 ? (($own !== '') ? (int)$own : (($stock !== '' && $stock !== null) ? (int)$stock : null))
                 : (int)$own;
            $out[] = array(
                'source'       => self::AV,
                'supplier_sku' => null,
                'ean'          => null,
                'stock_qty'    => $qty,
                'cost_net'     => self::sk(get_post_meta($pid,'_cost_price',true)),
                'synced_at'    => null,
                'is_active'    => 1,
                'is_sellable'  => 1,
                'priority'     => 1,   // AV visada pirma (TŽ 37.2 v1 taisyklė)
            );
        }

        // 2) Tiekėjo šaltinis
        if ($sand !== '' && $sand !== self::AV) {
            $L = self::laukai($sand);
            $qty = $L['qty'] ? get_post_meta($pid,$L['qty'],true) : '';
            if ($qty === '') $qty = $stock;
            $cost = $L['cost'] ? get_post_meta($pid,$L['cost'],true) : '';
            if ($cost === '' || (float)$cost <= 0) $cost = get_post_meta($pid,'_cost_price',true);
            $out[] = array(
                'source'       => $sand,
                'supplier_sku' => $L['sku'] ? (get_post_meta($pid,$L['sku'],true) ?: null) : null,
                'ean'          => $L['ean'] ? (get_post_meta($pid,$L['ean'],true) ?: null) : null,
                'stock_qty'    => ($qty === '' || $qty === null) ? null : (int)$qty,
                'cost_net'     => self::sk($cost),
                'synced_at'    => $L['sync'] ? (get_post_meta($pid,$L['sync'],true) ?: null) : null,
                'is_active'    => 1,
                'is_sellable'  => 1,
                'priority'     => 2,   // po AV
            );
        }

        // 3) v2.3: kiti tiekėjai iš meta (dviejų sandėlių modelis)
        if ( get_post_meta($pid, '_ps_shadow_of', true) === '' ) {
            foreach ( self::tiekejai_is_meta($pid) as $src ) {
                if ( $src === $sand ) continue;
                $L = self::laukai($src);
                $qty  = get_post_meta($pid, $L['qty'], true);
                $cost = get_post_meta($pid, $L['cost'], true);
                $out[] = array(
                    'source'       => $src,
                    'supplier_sku' => get_post_meta($pid, $L['sku'], true) ?: null,
                    'ean'          => $L['ean'] ? (get_post_meta($pid, $L['ean'], true) ?: null) : null,
                    'stock_qty'    => ($qty === '' || $qty === null) ? null : (int)$qty,
                    'cost_net'     => ($cost === '' || (float)$cost <= 0) ? null : self::sk($cost),
                    'synced_at'    => get_post_meta($pid, $L['sync'], true) ?: null,
                    'is_active'    => 1,
                    'is_sellable'  => 1,
                    'priority'     => ($sand !== '' && $sand !== self::AV) ? 3 : 2,
                );
            }
        }
        return $out;
    }

    /** v2.3: kurie tiekėjai (vf/zb) matomi iš prekės meta. GRYNA. */
    public static function tiekejai_is_meta($pid) {
        $t = array();
        if ( get_post_meta($pid, '_vf_supplier_sku', true) !== '' ) $t[] = 'vf';
        if ( get_post_meta($pid, '_zb_supplier_sku', true) !== '' || get_post_meta($pid, '_zb_qty', true) !== '' ) $t[] = 'zb';
        return $t;
    }

    private static function sk($v){ return ($v === '' || $v === null) ? null : round((float)$v, 4); }

    /** Teksto laukas: NULL arba %s */
    private static function val($v){ return ($v === null || $v === '') ? 'NULL' : '%s'; }
    /** Skaicius: NULL arba %f */
    private static function num($v){ return ($v === null) ? 'NULL' : '%f'; }

    /** Vienkartinis pataisymas: 0 ir 0000-00-00 virsta NULL ten, kur meta reiksmes nera. */
    public static function taisyti() {
        global $wpdb; $t = self::lentele();
        $rez = array();
        $rez['synced_pries'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE synced_at='0000-00-00 00:00:00'");
        $rez['cost0_pries']  = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE cost_net=0");
        $rez['qty0_pries']   = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE stock_qty=0");

        /* synced_at: tuscia data visada reiskia „nezinoma" */
        $wpdb->query("UPDATE {$t} SET synced_at=NULL WHERE synced_at='0000-00-00 00:00:00' OR synced_at='' ");

        /* cost_net: 0 -> NULL TIK ten, kur meta lauko realiai nera.
           Tikrinam kiekviena eilute atskirai, kad neistrintume tikros nulines savikainos. */
        $eil = $wpdb->get_results("SELECT id,product_id,source FROM {$t} WHERE cost_net=0", ARRAY_A);
        $pak = 0; $liko = 0;
        foreach ($eil as $e) {
            $s = Petshop_Sources::suskaiciuoti($e['product_id']);
            $rasta = null;
            foreach ($s as $x) if ($x['source'] === $e['source']) $rasta = $x;
            if ($rasta === null || $rasta['cost_net'] === null) {
                $wpdb->query($wpdb->prepare("UPDATE {$t} SET cost_net=NULL WHERE id=%d", $e['id']));
                $pak++;
            } else { $liko++; }
        }
        $rez['cost_pakeista_i_null'] = $pak;
        $rez['cost_liko_tikras_0']   = $liko;

        /* stock_qty: 0 -> NULL ten, kur likutis apskritai nezinomas */
        $eil2 = $wpdb->get_results("SELECT id,product_id,source FROM {$t} WHERE stock_qty=0", ARRAY_A);
        $pak2 = 0;
        foreach ($eil2 as $e) {
            $s = Petshop_Sources::suskaiciuoti($e['product_id']);
            $rasta = null;
            foreach ($s as $x) if ($x['source'] === $e['source']) $rasta = $x;
            if ($rasta !== null && $rasta['stock_qty'] === null) {
                $wpdb->query($wpdb->prepare("UPDATE {$t} SET stock_qty=NULL WHERE id=%d", $e['id']));
                $pak2++;
            }
        }
        $rez['qty_pakeista_i_null'] = $pak2;

        $rez['synced_po'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE synced_at='0000-00-00 00:00:00'");
        $rez['cost_null_po'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE cost_net IS NULL");
        $rez['cost0_po'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t} WHERE cost_net=0");
        $rez['irasu_viso'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$t}");
        return $rez;
    }



    /* ================= v2.1 REGISTRO PALAIKYMAS ================= */

    /** Ar dabar vyksta importas — tada hook'ai tyli, dirba naktinis resync. */
    public static function importas_vyksta() {
        if ( defined('IMPORT_DEBUG') ) return true;
        if ( defined('PMXI_VERSION') && isset($_GET['import_key']) ) return true;
        if ( isset($GLOBALS['ps_sources_importas']) && $GLOBALS['ps_sources_importas'] ) return true;
        return false;
    }

    /**
     * Suderina VIENOS prekės registrą su meta būsena.
     * NIEKO NETRINA be reikalo: šaltinis, kurio meta nebeliko, pažymimas
     * is_active=0 ir lieka lentelėje kaip istorija.
     *
     * @return array ką padarė
     */
    public static function sinchronizuoti($pid, $rasyti_kopija = false) {
        global $wpdb;
        $pid = (int) $pid;
        $t   = self::lentele();
        $rez = array('pid'=>$pid,'prideta'=>0,'atnaujinta'=>0,'isjungta'=>0,'be_saltinio'=>false);

        if ( ! $pid || $wpdb->get_var("SHOW TABLES LIKE '{$t}'") !== $t ) return $rez;
        if ( get_post_type($pid) !== 'product' ) return $rez;

        /* v2.2: tuščio sandėlio lauko užpildymas pagal registrą (S719) */
        self::uzpildyti_sandeli($pid);

        $meta = self::suskaiciuoti($pid);
        $now  = current_time('mysql');

        /* Prekė be jokio šaltinio — pažymim, bet registro NELIEČIAM. */
        if ( ! $meta ) {
            $rez['be_saltinio'] = true;
            update_post_meta($pid, '_ps_be_saltinio', 1);
            return $rez;
        }
        delete_post_meta($pid, '_ps_be_saltinio');

        $esami = array();
        foreach ( self::registras($pid) as $r ) { $esami[ $r['source'] ] = $r; }
        $meta_src = array();

        foreach ( $meta as $x ) {
            $meta_src[] = $x['source'];
            if ( isset($esami[ $x['source'] ]) ) {
                $e = $esami[ $x['source'] ];
                /* NIEKO NEKEIČIAM, jei niekas nepasikeitė — kitaip importas darytų
                   tūkstančius bereikalingų UPDATE per vieną praėjimą. */
                $skiriasi = false;
                if ( $x['supplier_sku'] !== null && (string) $e['supplier_sku'] !== (string) $x['supplier_sku'] ) $skiriasi = true;
                if ( $x['ean'] !== null && (string) $e['ean'] !== (string) $x['ean'] ) $skiriasi = true;
                if ( (int) $e['is_active'] === 0 ) $skiriasi = true;
                if ( ! $skiriasi && ! $rasyti_kopija ) { continue; }

                /* Registro laukai (sku, ean) — atnaujinam TIK jei meta turi reikšmę.
                   Ranka įvestas tiekėjo kodas neturi dingti dėl tuščio XML lauko. */
                $set = array(); $arg = array();
                if ( $x['supplier_sku'] !== null ) { $set[] = 'supplier_sku=%s'; $arg[] = $x['supplier_sku']; }
                if ( $x['ean'] !== null )          { $set[] = 'ean=%s';          $arg[] = $x['ean']; }
                $set[] = 'updated_at=%s'; $arg[] = $now;
                if ( $rasyti_kopija ) {
                    $set[] = 'stock_qty=' . ( $x['stock_qty'] === null ? 'NULL' : '%d' );
                    if ( $x['stock_qty'] !== null ) $arg[] = (int) $x['stock_qty'];
                    $set[] = 'cost_net=' . ( $x['cost_net'] === null ? 'NULL' : '%f' );
                    if ( $x['cost_net'] !== null ) $arg[] = (float) $x['cost_net'];
                }
                /* šaltinis grįžo — vėl įjungiam */
                if ( (int) $e['is_active'] === 0 ) { $set[] = 'is_active=1'; }
                $arg[] = $pid; $arg[] = $x['source'];
                $sql = "UPDATE {$t} SET " . implode(',', $set) . " WHERE product_id=%d AND source=%s";
                $wpdb->query( $wpdb->prepare($sql, $arg) );
                $rez['atnaujinta']++;
            } else {
                $wpdb->query( $wpdb->prepare(
                    "INSERT INTO {$t} (product_id,source,supplier_sku,ean,stock_qty,cost_net,synced_at,
                     is_active,is_sellable,priority,created_at,updated_at)
                     VALUES (%d,%s,%s,%s,NULL,NULL,NULL,1,1,%d,%s,%s)
                     ON DUPLICATE KEY UPDATE is_active=1, updated_at=VALUES(updated_at)",
                    $pid, $x['source'], $x['supplier_sku'], $x['ean'], (int) $x['priority'], $now, $now ) );
                $rez['prideta']++;
            }
        }

        /* Registre yra šaltinis, kurio meta nebeturi → IŠJUNGIAM, netrinam. */
        foreach ( $esami as $src => $r ) {
            if ( in_array($src, $meta_src, true) ) continue;
            if ( (int) $r['is_active'] === 0 ) continue;
            $wpdb->query( $wpdb->prepare(
                "UPDATE {$t} SET is_active=0, updated_at=%s WHERE product_id=%d AND source=%s",
                $now, $pid, $src ) );
            $rez['isjungta']++;
        }
        return $rez;
    }

    /** Naktinis pilnas resync + momentinė skaičių kopija ataskaitoms. */
    public static function naktinis() {
        global $wpdb; $p = $wpdb->prefix;
        $ids = $wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product'
                               AND post_status IN ('publish','draft','private')");
        $s = array('prekiu'=>0,'prideta'=>0,'atnaujinta'=>0,'isjungta'=>0,'be_saltinio'=>0);
        foreach ($ids as $pid) {
            $r = self::sinchronizuoti($pid, true);
            $s['prekiu']++;
            $s['prideta']    += $r['prideta'];
            $s['atnaujinta'] += $r['atnaujinta'];
            $s['isjungta']   += $r['isjungta'];
            if ($r['be_saltinio']) $s['be_saltinio']++;
        }
        update_option('ps_sources_naktinis_rez', array('laikas'=>current_time('mysql')) + $s, false);
        return $s;
    }

    /** Prekės be šaltinio — sąrašas Katalogo darbo eilei „Klausimai". */
    public static function be_saltinio_sarasas($limit = 200) {
        global $wpdb; $p = $wpdb->prefix;
        return $wpdb->get_col( $wpdb->prepare(
            "SELECT pm.post_id FROM {$p}postmeta pm
             INNER JOIN {$p}posts po ON po.ID = pm.post_id AND po.post_type='product'
             WHERE pm.meta_key='_ps_be_saltinio' AND pm.meta_value='1' LIMIT %d", (int) $limit ) );
    }

    /* ================= v2.0 REGISTRAS ================= */

    /**
     * ŠALTINIŲ REGISTRAS iš lentelės — kurie šaltiniai priskirti prekei.
     * stock_qty / cost_net / synced_at ČIA SĄMONINGAI NEIMAMI: lentelėje jie
     * pasensta per valandą, nes VF/ZB importas rašo tiesiai į meta.
     */
    public static function registras($pid) {
        global $wpdb;
        $t = self::lentele();
        if ($wpdb->get_var("SHOW TABLES LIKE '{$t}'") !== $t) return array();
        $eil = $wpdb->get_results($wpdb->prepare(
            "SELECT source, supplier_sku, ean, is_active, is_sellable, priority
             FROM {$t} WHERE product_id = %d ORDER BY priority ASC, id ASC", (int)$pid), ARRAY_A);
        return $eil ? $eil : array();
    }

    /** GYVI SKAIČIAI iš meta pagal šaltinio tipą. */
    public static function gyvi($pid, $source) {
        $sand  = get_post_meta($pid, '_ps_sandelis', true);
        $own   = get_post_meta($pid, '_own_stock_qty', true);
        $stock = get_post_meta($pid, '_stock', true);

        if ($source === self::AV) {
            $qty = ($sand === self::AV)
                 ? (($own !== '') ? (int)$own : (($stock !== '' && $stock !== null) ? (int)$stock : null))
                 : (int)$own;
            return array(
                'stock_qty' => $qty,
                'cost_net'  => self::sk(get_post_meta($pid,'_cost_price',true)),
                'synced_at' => null,
            );
        }
        $L    = self::laukai($source);
        $qty  = $L['qty'] ? get_post_meta($pid,$L['qty'],true) : '';
        if ($qty === '') $qty = $stock;
        $cost = $L['cost'] ? get_post_meta($pid,$L['cost'],true) : '';
        if ($cost === '' || (float)$cost <= 0) $cost = get_post_meta($pid,'_cost_price',true);
        return array(
            'stock_qty' => ($qty === '' || $qty === null) ? null : (int)$qty,
            'cost_net'  => self::sk($cost),
            'synced_at' => $L['sync'] ? (get_post_meta($pid,$L['sync'],true) ?: null) : null,
        );
    }

    /**
     * Registras + gyvi skaičiai.
     * Nėra įrašo lentelėje (nauja prekė) → senas meta kelias, kad niekas nesustotų.
     */
    public static function saltiniai($pid) {
        $reg = self::registras($pid);
        if (!$reg) {
            return array('saltiniai' => self::suskaiciuoti($pid), 'is_lenteles' => false);
        }
        $out = array();
        foreach ($reg as $r) {
            $g = self::gyvi($pid, $r['source']);
            $out[] = array(
                'source'       => $r['source'],
                'supplier_sku' => $r['supplier_sku'],
                'ean'          => $r['ean'],
                'stock_qty'    => $g['stock_qty'],
                'cost_net'     => $g['cost_net'],
                'synced_at'    => $g['synced_at'],
                'is_active'    => (int)$r['is_active'],
                'is_sellable'  => (int)$r['is_sellable'],
                'priority'     => (int)$r['priority'],
            );
        }
        return array('saltiniai' => $out, 'is_lenteles' => true);
    }

    /** Ar prekė turi įrašą registre. Naudoja E0.3 „prekė be šaltinio → Klausimai". */
    public static function yra_registre($pid) {
        global $wpdb; $t = self::lentele();
        if ($wpdb->get_var("SHOW TABLES LIKE '{$t}'") !== $t) return false;
        return (int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$t} WHERE product_id=%d", (int)$pid)) > 0;
    }

    /* ================= v2.2 SANDĖLIO PILDYMAS (S719) ================= */

    /** Leistinos _ps_sandelis reikšmės (7 sandėlių modelis). */
    public static function sandelio_reiksmes() {
        return array('av','vf','zb','quattro','prins','ambrosia','belcor_tofu');
    }

    /**
     * Užpildo TUŠČIĄ _ps_sandelis pagal registrą, kai šaltinis vienareikšmis.
     *  - netuščio lauko NIEKADA neliečia;
     *  - rašo tik kai registre LYGIAI VIENAS aktyvus šaltinis;
     *  - įrašas fiksuojamas žurnale undo'ui.
     * @return string|false įrašytas sandėlis arba false
     */
    public static function uzpildyti_sandeli($pid) {
        static $dirba = array();
        $pid = (int) $pid;
        if ( ! $pid || isset($dirba[$pid]) ) return false;
        $dabar = get_post_meta($pid, '_ps_sandelis', true);
        if ( $dabar !== '' && $dabar !== null && $dabar !== false ) return false;
        global $wpdb; $t = self::lentele();
        if ( $wpdb->get_var("SHOW TABLES LIKE '{$t}'") !== $t ) return false;
        $akt = $wpdb->get_col( $wpdb->prepare(
            "SELECT DISTINCT source FROM {$t} WHERE product_id=%d AND is_active=1", $pid ) );
        /* v2.3: registras tuščias → iš tiekėjo meta, jei LYGIAI VIENAS tiekėjas
           ir nėra savo likučio (kitaip AV+tiekėjas — sprendžia žmogus). */
        if ( count($akt) === 0 && get_post_meta($pid, '_ps_shadow_of', true) === '' ) {
            $own = get_post_meta($pid, '_own_stock_qty', true);
            if ( $own === '' || (int)$own <= 0 ) $akt = self::tiekejai_is_meta($pid);
        }
        if ( count($akt) !== 1 ) return false;
        $src = $akt[0];
        if ( ! in_array($src, self::sandelio_reiksmes(), true) ) return false;
        $dirba[$pid] = 1;
        update_post_meta($pid, '_ps_sandelis', $src);
        $z = get_option('ps_sandelio_uzpildymai', array());
        if ( ! is_array($z) ) $z = array();
        $z[] = array('pid'=>$pid,'sandelis'=>$src,'laikas'=>current_time('mysql'));
        if ( count($z) > 5000 ) $z = array_slice($z, -5000);
        update_option('ps_sandelio_uzpildymai', $z, false);
        unset($dirba[$pid]);
        return $src;
    }

    /** Kandidatai pildymui: tuščias laukas + lygiai vienas aktyvus registro šaltinis. */
    public static function sandelio_kandidatai() {
        global $wpdb; $p = $wpdb->prefix; $t = self::lentele();
        if ( $wpdb->get_var("SHOW TABLES LIKE '{$t}'") !== $t ) return array();
        return $wpdb->get_results(
            "SELECT po.ID pid, po.post_status busena, MIN(s.source) sandelis_bus
             FROM {$p}posts po
             INNER JOIN {$t} s ON s.product_id=po.ID AND s.is_active=1
             LEFT JOIN {$p}postmeta m ON m.post_id=po.ID AND m.meta_key='_ps_sandelis'
             WHERE po.post_type='product' AND po.post_status IN ('publish','draft')
               AND ( m.meta_id IS NULL OR m.meta_value='' )
             GROUP BY po.ID, po.post_status
             HAVING COUNT(DISTINCT s.source)=1", ARRAY_A);
    }

    /** Kurį šaltinį naudoti DABAR — v1 taisyklė: AV, tada pagrindinis tiekėjas. */
    public static function pirmas($pid) {
        $x = self::saltiniai($pid);
        $s = $x['saltiniai'];
        usort($s, function($a,$b){ return $a['priority'] - $b['priority']; });
        foreach ($s as $x) {
            if (!$x['is_active'] || !$x['is_sellable']) continue;
            if ($x['source'] === self::AV && (int)$x['stock_qty'] <= 0) continue;
            return $x['source'];
        }
        return $s ? $s[0]['source'] : null;
    }
}

} // class_exists


/* ---------------- v2.1 REGISTRO PALAIKYMAS: HOOK'AI ---------------- */

/** Rekursijos sargas — sinchronizuoti() gali paliesti meta. */
if ( ! function_exists('ps_sources_sync_saugiai') ) {
function ps_sources_sync_saugiai( $pid ) {
    static $dirba = array();
    $pid = (int) $pid;
    if ( ! $pid || isset($dirba[$pid]) ) return;
    if ( ! class_exists('Petshop_Sources') ) return;
    if ( Petshop_Sources::importas_vyksta() ) return;
    if ( get_post_type($pid) !== 'product' ) return;
    if ( wp_is_post_revision($pid) || wp_is_post_autosave($pid) ) return;
    $dirba[$pid] = 1;
    try { Petshop_Sources::sinchronizuoti($pid, false); }
    catch ( Throwable $e ) { /* registro klaida NEGALI sustabdyti prekės išsaugojimo */ }
    unset($dirba[$pid]);
}
}

add_action('woocommerce_update_product', 'ps_sources_sync_saugiai', 20, 1);
add_action('woocommerce_new_product',    'ps_sources_sync_saugiai', 20, 1);

/* Sandėlio lauko pakeitimas — svarbiausias registro signalas. */
add_action('updated_post_meta', function( $mid, $pid, $key ) {
    if ( $key === '_ps_sandelis' ) ps_sources_sync_saugiai( $pid );
}, 20, 3);
add_action('added_post_meta', function( $mid, $pid, $key ) {
    if ( $key === '_ps_sandelis' ) ps_sources_sync_saugiai( $pid );
}, 20, 3);

/* Naktinis pilnas resync — saugiklis viskam, ką hook'ai praleido. */
add_action('ps_sources_naktinis', function () {
    if ( class_exists('Petshop_Sources') ) Petshop_Sources::naktinis();
});
add_action('init', function () {
    if ( ! wp_next_scheduled('ps_sources_naktinis') ) {
        wp_schedule_event( strtotime('tomorrow 04:20') , 'daily', 'ps_sources_naktinis' );
    }
}, 20);

/* ---------------- ENDPOINT'AI ---------------- */
add_action('wp_loaded', function () {
    $veiksmas = isset($_GET['ps_src']) ? sanitize_key($_GET['ps_src']) : '';
    if ($veiksmas === '') return;

    $ok = current_user_can('manage_options') || ( isset($_GET['k']) && $_GET['k'] === 'ps2026' );
    if (!$ok) return;

    if (!headers_sent()) { nocache_headers(); header('Content-Type: application/json; charset=utf-8'); }
    @set_time_limit(280);
    global $wpdb; $p = $wpdb->prefix;

    $r = array('VERSIJA' => 'sources-'.Petshop_Sources::VERSIJA, 'veiksmas' => $veiksmas);
    $lent = Petshop_Sources::lentele();
    $r['lentele_yra'] = ($wpdb->get_var("SHOW TABLES LIKE '{$lent}'") === $lent) ? 'TAIP' : 'NE';


    /* ---------- v2.1: REGISTRO PALAIKYMO PATIKRA ---------- */
    if ($veiksmas === 'syncdry') {
        $ids = $wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft','private')");
        $s = array('prekiu'=>0,'reiktu_prideti'=>0,'reiktu_isjungti'=>0,'be_saltinio'=>0,'tvarkoje'=>0);
        $pvz = array();
        foreach ($ids as $pid) {
            $s['prekiu']++;
            $meta = Petshop_Sources::suskaiciuoti($pid);
            $reg  = array(); foreach (Petshop_Sources::registras($pid) as $x) $reg[$x['source']] = $x;
            if (!$meta) { $s['be_saltinio']++; continue; }
            $ms = array(); foreach ($meta as $x) $ms[] = $x['source'];
            $prid = array_diff($ms, array_keys($reg));
            $isj  = array();
            foreach ($reg as $src => $x) if (!in_array($src,$ms,true) && (int)$x['is_active']===1) $isj[] = $src;
            if (!$prid && !$isj) { $s['tvarkoje']++; continue; }
            $s['reiktu_prideti']  += count($prid);
            $s['reiktu_isjungti'] += count($isj);
            if (count($pvz) < 25) $pvz[] = array('id'=>$pid,'pav'=>mb_substr(html_entity_decode(get_the_title($pid)),0,38),
                'busena'=>get_post_status($pid),'meta'=>array_values($ms),'registre'=>array_keys($reg),
                'prideti'=>array_values($prid),'isjungti'=>$isj);
        }
        $r['SYNC_DRY'] = $s;
        $r['SYNC_PVZ'] = $pvz;
        $r['cron_kitas'] = wp_next_scheduled('ps_sources_naktinis') ? date('Y-m-d H:i:s', wp_next_scheduled('ps_sources_naktinis')) : 'NESUPLANUOTA';
        $r['PASTABA'] = 'Nieko neirasyta.';
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    if ($veiksmas === 'naktinis') {
        if (!isset($_GET['patvirtinu']) || $_GET['patvirtinu'] !== 'taip') {
            $r['KLAIDA'] = 'Truksta &patvirtinu=taip';
            echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
        }
        $r['naktinis'] = Petshop_Sources::naktinis();
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    /* ---------- v2.2: SANDĖLIO PILDYMAS (S719) ---------- */
    if ($veiksmas === 'sandelisdry') {
        $k = Petshop_Sources::sandelio_kandidatai();
        $pagal = array(); $pvz = array();
        foreach ($k as $x) {
            $s = $x['sandelis_bus'];
            if (!isset($pagal[$s])) $pagal[$s] = 0;
            $pagal[$s]++;
            if (count($pvz) < 40) $pvz[] = array('id'=>(int)$x['pid'],'busena'=>$x['busena'],'bus'=>$s,
                'pav'=>mb_substr(html_entity_decode(get_the_title($x['pid'])),0,44));
        }
        $r['kandidatu'] = count($k);
        $r['pagal_sandeli'] = $pagal;
        $r['zurnale_jau'] = count((array)get_option('ps_sandelio_uzpildymai', array()));
        $r['pvz'] = $pvz;
        $r['PASTABA'] = 'Nieko neirasyta.';
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    if ($veiksmas === 'sandelisapply') {
        if (!isset($_GET['patvirtinu']) || $_GET['patvirtinu'] !== 'taip') {
            $r['KLAIDA'] = 'Truksta &patvirtinu=taip';
            echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
        }
        $k = Petshop_Sources::sandelio_kandidatai();
        $n = 0; $pagal = array();
        foreach ($k as $x) {
            $src = Petshop_Sources::uzpildyti_sandeli((int)$x['pid']);
            if ($src) { $n++; if (!isset($pagal[$src])) $pagal[$src]=0; $pagal[$src]++; }
        }
        $r['irasyta'] = $n;
        $r['pagal_sandeli'] = $pagal;
        $r['liko_kandidatu'] = count(Petshop_Sources::sandelio_kandidatai());
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    if ($veiksmas === 'sandelisundo') {
        if (!isset($_GET['patvirtinu']) || $_GET['patvirtinu'] !== 'taip') {
            $r['KLAIDA'] = 'Truksta &patvirtinu=taip';
            echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
        }
        $z = get_option('ps_sandelio_uzpildymai', array());
        $n = 0;
        foreach ((array)$z as $e) {
            $pid = (int)($e['pid'] ?? 0); if (!$pid) continue;
            if (get_post_meta($pid,'_ps_sandelis',true) === (string)($e['sandelis'] ?? '')) {
                delete_post_meta($pid,'_ps_sandelis'); $n++;
            }
        }
        delete_option('ps_sandelio_uzpildymai');
        $r['atstatyta'] = $n;
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    /* ---------- DRY: TIK SKAITO ---------- */
    if ($veiksmas === 'dry') {
        $ids = $wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft','private')");
        $stat = array('prekiu'=>0,'irasu'=>0,'be_saltinio'=>0,'daugiasaltiniu'=>0);
        $pagal_src = array(); $pagal_kiek = array();
        $be = array(); $daug = array(); $kryzmines = array(); $nesutampa = 0; $tikrinta_kryzm = 0;

        foreach ($ids as $pid) {
            $stat['prekiu']++;
            $s = Petshop_Sources::suskaiciuoti($pid);
            $stat['irasu'] += count($s);

            $n = count($s);
            if (!isset($pagal_kiek[$n])) $pagal_kiek[$n] = 0;
            $pagal_kiek[$n]++;

            if ($n === 0) { $stat['be_saltinio']++; if (count($be)<20) $be[] = array('id'=>$pid,'pav'=>mb_substr(get_the_title($pid),0,45)); }
            if ($n > 1)  { $stat['daugiasaltiniu']++; if (count($daug)<20) $daug[] = array('id'=>$pid,'pav'=>mb_substr(get_the_title($pid),0,45),
                                'saltiniai'=>array_map(function($x){return $x['source'].':'.$x['stock_qty'];}, $s)); }

            foreach ($s as $x) {
                $k = $x['source'];
                if (!isset($pagal_src[$k])) $pagal_src[$k] = array('irasu'=>0,'su_likuciu'=>0,'su_savikaina'=>0,'be_savikainos'=>0);
                $pagal_src[$k]['irasu']++;
                if ((int)$x['stock_qty'] > 0) $pagal_src[$k]['su_likuciu']++;
                if ($x['cost_net'] !== null && $x['cost_net'] > 0) $pagal_src[$k]['su_savikaina']++;
                else $pagal_src[$k]['be_savikainos']++;
            }

            /* KRYŽMINĖ PATIKRA: naujas modelis vs dabartinis resolve() (tik publish) */
            if (get_post_status($pid) === 'publish' && class_exists('Petshop_AV_Source')) {
                $tikrinta_kryzm++;
                $senas = null;
                try {
                    $x = Petshop_AV_Source::resolve($pid);
                    $senas = is_array($x) ? (isset($x['source']) ? $x['source'] : null) : $x;
                } catch (Throwable $e) { $senas = 'KLAIDA'; }
                $naujas = Petshop_Sources::pirmas($pid);
                if (strtolower((string)$senas) !== strtolower((string)$naujas)) {
                    $nesutampa++;
                    if (count($kryzmines) < 30) $kryzmines[] = array(
                        'id'=>$pid, 'pav'=>mb_substr(get_the_title($pid),0,42),
                        'sandelis'=>get_post_meta($pid,'_ps_sandelis',true),
                        'own_stock'=>get_post_meta($pid,'_own_stock_qty',true),
                        'senas_resolve'=>$senas, 'naujas_sources'=>$naujas);
                }
            }
        }
        ksort($pagal_kiek);
        $r['santrauka']        = $stat;
        $r['pagal_saltini']    = $pagal_src;
        $r['saltiniu_skaicius']= $pagal_kiek;
        $r['be_saltinio_pvz']  = $be;
        $r['daugiasaltiniu_pvz']= $daug;
        $r['KRYZMINE'] = array(
            'tikrinta' => $tikrinta_kryzm,
            'nesutampa' => $nesutampa,
            'sutampa' => $tikrinta_kryzm - $nesutampa,
            'pvz' => $kryzmines,
        );
        $r['PASTABA'] = 'Nieko neirasyta. Lentele nesukurta.';
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    /* ---------- APPLY: rašo ---------- */
    if ($veiksmas === 'apply') {
        if (!isset($_GET['patvirtinu']) || $_GET['patvirtinu'] !== 'taip') {
            $r['KLAIDA'] = 'Truksta &patvirtinu=taip';
            echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
        }
        $r['lentele_sukurta'] = Petshop_Sources::kurti_lentele() ? 'TAIP' : 'NE';
        $ids = $wpdb->get_col("SELECT ID FROM {$p}posts WHERE post_type='product' AND post_status IN ('publish','draft','private')");
        $now = current_time('mysql');
        $ir = 0; $pr = 0;
        foreach ($ids as $pid) {
            $s = Petshop_Sources::suskaiciuoti($pid);
            if (!$s) continue;
            $pr++;
            foreach ($s as $x) {
                /* v1.1: NULL lieka NULL — %s su null duotu '0000-00-00', %f duotu 0 */
                $sql = "INSERT INTO {$lent}
                    (product_id,source,supplier_sku,ean,stock_qty,cost_net,synced_at,is_active,is_sellable,priority,created_at,updated_at)
                    VALUES (%d,%s,"
                    . self::val($x['supplier_sku']) . ","
                    . self::val($x['ean']) . ","
                    . self::num($x['stock_qty']) . ","
                    . self::num($x['cost_net']) . ","
                    . self::val($x['synced_at']) . ","
                    . "%d,%d,%d,%s,%s)
                    ON DUPLICATE KEY UPDATE supplier_sku=VALUES(supplier_sku), ean=VALUES(ean),
                      stock_qty=VALUES(stock_qty), cost_net=VALUES(cost_net), synced_at=VALUES(synced_at),
                      priority=VALUES(priority), updated_at=VALUES(updated_at)";
                $args = array($pid, $x['source']);
                foreach (array('supplier_sku','ean') as $k) if ($x[$k] !== null) $args[] = $x[$k];
                foreach (array('stock_qty','cost_net') as $k) if ($x[$k] !== null) $args[] = $x[$k];
                if ($x['synced_at'] !== null) $args[] = $x['synced_at'];
                $args[] = $x['is_active']; $args[] = $x['is_sellable']; $args[] = $x['priority'];
                $args[] = $now; $args[] = $now;
                $wpdb->query($wpdb->prepare($sql, $args));
                $ir++;
            }
        }
        $r['irasyta_prekiu'] = $pr;
        $r['irasyta_irasu']  = $ir;
        $r['lenteleje_dabar']= (int)$wpdb->get_var("SELECT COUNT(*) FROM {$lent}");
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    if ($veiksmas === 'fix') {
        if (!isset($_GET['patvirtinu']) || $_GET['patvirtinu'] !== 'taip') {
            $r['KLAIDA'] = 'Truksta &patvirtinu=taip';
            echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
        }
        $r['taisymas'] = Petshop_Sources::taisyti();
        echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
    }

    $r['KLAIDA'] = 'Nezinomas veiksmas';
    echo wp_json_encode($r, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
}, 1);
