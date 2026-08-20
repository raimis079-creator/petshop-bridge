<?php
defined( 'ABSPATH' ) || exit;

/**
 * Petshop_Fulfillment v1.6.1
 *
 * v1.6.1 (2026-08-20): `own_stock` PAŠALINTAS iš `_stock` šaltinių sąrašo.
 *
 *   PRIEŽASTIS: S590 architektūroje (petshop-katalogas.php:919, av-stock,
 *   av-limit, av-reduce) `_own_stock_qty` yra ATSKIRAS AV sandėlio kiekis,
 *   gyvenantis ŠALIA `_stock`:
 *     - `_stock`          = tiekėjo kiekis (ZB/VF sync jį perrašo)
 *     - `_own_stock_qty`  = AV lentynos kiekis (S477: jo rašymas neliečia _stock)
 *     - rodymui juos sudeda Petshop_AV_Limit (3 sluoksnis)
 *     - nusirašymą pagal _ps_source atskiria petshop-av-reduce
 *   Senoji v1.3–v1.5 logika `_own_stock_qty` laikė `_stock` šaltiniu su
 *   aukščiausia pirmenybe — dvigubai prekei tai arba perrašydavo tiekėjo
 *   kiekį savu, arba (kartu su AV_Limit) skaičiuodavo AV du kartus.
 *   Matavimas 2026-08-20: prekių su dviem šaltiniais buvo 0, todėl elgsenos
 *   pakeitimas esamam katalogui = 0 prekių.
 *
 *   update_own_stock() paliktas suderinamumui: rašo meta ir perskaičiuoja,
 *   bet `_stock` nuo šiol atspindi tik tiekėjus.
 *
 * v1.5.0 (2026-06-05): pridėtas VF dropship sluoksnis + update_vf_qty().
 * v1.3 (paveldėta): set_wc_stock() naudoja wc_update_product_stock('set').
 */
class Petshop_Fulfillment {

    /**
     * TIEKĖJŲ pirmenybės sąrašas (top-down). AV sandėlio čia NĖRA (v1.6.1) —
     * AV kiekį prie rodomo likučio prideda Petshop_AV_Limit.
     */
    private array $suppliers = [
        'zb_dropship' => '_zb_qty',
        'vf_dropship' => '_vf_qty',
        // 'supplier_4' => '_s4_qty',
    ];

    /**
     * Perskaičiuoja WC likutį (TIEKĖJO) ir active_fulfillment_source.
     */
    public function recalculate( int $post_id ): string {
        $quantities = $this->get_all_quantities( $post_id );

        foreach ( $this->suppliers as $source_key => $meta_key ) {
            $qty = (int) ( $quantities[ $source_key ] ?? 0 );
            if ( $qty > 0 ) {
                $this->set_wc_stock( $post_id, $qty, $source_key );
                return $source_key;
            }
        }

        $this->set_wc_stock( $post_id, 0, 'out_of_stock' );
        return 'out_of_stock';
    }

    public function get_all_quantities( int $post_id ): array {
        $result = [];
        foreach ( $this->suppliers as $source_key => $meta_key ) {
            $result[ $source_key ] = (int) get_post_meta( $post_id, $meta_key, true );
        }
        return $result;
    }

    /**
     * Nustato WC likutį.
     * wc_update_product_stock($id, $qty, 'set') — ne rankinis _stock rašymas (fix #1).
     */
    private function set_wc_stock( int $post_id, int $qty, string $source ): void {
        update_post_meta( $post_id, '_manage_stock', 'yes' );
        update_post_meta( $post_id, '_active_fulfillment_source', $source );
        wc_update_product_stock( $post_id, $qty, 'set' );
    }

    public function update_zb_qty( int $post_id, int $qty ): void {
        update_post_meta( $post_id, '_zb_qty', $qty );
        $this->recalculate( $post_id );
    }

    public function update_vf_qty( int $post_id, int $qty ): void {
        update_post_meta( $post_id, '_vf_qty', $qty );
        $this->recalculate( $post_id );
    }

    /**
     * v1.6.1: rašo AV meta (suderinamumui), bet `_stock` skaičiuojamas
     * tik iš tiekėjų — AV kiekį rodymui prideda Petshop_AV_Limit.
     */
    public function update_own_stock( int $post_id, int $qty ): void {
        update_post_meta( $post_id, '_own_stock_qty', $qty );
        $this->recalculate( $post_id );
    }

    public function get_active_source( int $post_id ): string {
        return (string) get_post_meta( $post_id, '_active_fulfillment_source', true ) ?: 'unknown';
    }

    public function get_suppliers(): array { return $this->suppliers; }
}
