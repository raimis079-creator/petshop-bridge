<?php
/**
 * Petshop_Pet_Photo — augintinio nuotraukos ikelimas + saugus pateikimas (M8, S198).
 *
 * Pagal MASTER 17.8:
 *   - tikras MIME (finfo, ne plotmuo)
 *   - EXIF pasalinimas (re-encode per GD)
 *   - resize 400x400 (center crop)
 *   - saugoma privaciame kataloge (uploads/ps-pets/) su random-hash pavadinimu
 *   - .htaccess blokuoja tiesiogini priejima; pateikiama per autentifikuota proxy endpoint
 *   - nuosavybes patikra
 *
 * REST:
 *   POST   /petshop/v1/pet-photo/{pet_id}   multipart upload (field: photo)
 *   GET    /petshop/v1/pet-photo/{pet_id}   pateikia nuotrauka (auth proxy)
 *   DELETE /petshop/v1/pet-photo/{pet_id}   pasalina nuotrauka
 *
 * Saugom photo_file_id lauke ps_pets — cia NE WP attachment ID, o failo hash (be plotmuo).
 * Realus kelias: uploads/ps-pets/{hash}.jpg
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Petshop_Pet_Photo {

	const SUBDIR = 'ps-pets';
	const MAX_BYTES = 5242880; // 5 MB
	const DIMENSION = 400;
	const ALLOWED_MIME = array( 'image/jpeg', 'image/png', 'image/webp' );

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_action( 'init', array( __CLASS__, 'ensure_protected_dir' ) );
	}

	public static function register_routes() {
		register_rest_route( 'petshop/v1', '/pet-photo/(?P<id>\d+)', array(
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_upload' ),
				'permission_callback' => 'is_user_logged_in',
			),
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_serve' ),
				'permission_callback' => 'is_user_logged_in',
			),
			array(
				'methods'             => 'DELETE',
				'callback'            => array( __CLASS__, 'handle_delete' ),
				'permission_callback' => 'is_user_logged_in',
			),
		) );
	}

	/**
	 * Sukuria privatu kataloga + .htaccess (blokuoja tiesiogini priejima).
	 */
	public static function ensure_protected_dir() {
		$dir = self::photo_dir();
		if ( ! file_exists( $dir ) ) {
			wp_mkdir_p( $dir );
		}
		$htaccess = $dir . '/.htaccess';
		if ( ! file_exists( $htaccess ) ) {
			$rules = "Order Deny,Allow\nDeny from all\n";
			@file_put_contents( $htaccess, $rules );
		}
		// index.php kad neveiktu directory listing
		$index = $dir . '/index.php';
		if ( ! file_exists( $index ) ) {
			@file_put_contents( $index, "<?php // Silence is golden." );
		}
	}

	private static function photo_dir() {
		$u = wp_upload_dir();
		return $u['basedir'] . '/' . self::SUBDIR;
	}

	private static function pet_owned_by_user( $pet_id, $user_id ) {
		if ( ! class_exists( 'Petshop_Pet_Profile' ) ) {
			return null;
		}
		$pet = Petshop_Pet_Profile::get_pet( $pet_id );
		if ( ! $pet || (int) $pet->user_id !== $user_id || $pet->status === 'deleted' ) {
			return null;
		}
		return $pet;
	}

	/**
	 * POST — ikelia + apdoroja nuotrauka.
	 */
	public static function handle_upload( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];

		$pet = self::pet_owned_by_user( $pet_id, $user_id );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Augintinis nerastas.', array( 'status' => 404 ) );
		}

		$files = $request->get_file_params();
		if ( empty( $files['photo'] ) || empty( $files['photo']['tmp_name'] ) ) {
			return new WP_Error( 'no_file', 'Nuotrauka nepateikta.', array( 'status' => 400 ) );
		}
		$file = $files['photo'];

		// Dydis
		if ( $file['size'] > self::MAX_BYTES ) {
			return new WP_Error( 'too_large', 'Nuotrauka per didelė (max 5 MB).', array( 'status' => 400 ) );
		}
		if ( ! is_uploaded_file( $file['tmp_name'] ) && ! file_exists( $file['tmp_name'] ) ) {
			return new WP_Error( 'invalid', 'Netinkamas failas.', array( 'status' => 400 ) );
		}

		// Tikras MIME (finfo, ne plotmuo)
		$finfo = new finfo( FILEINFO_MIME_TYPE );
		$mime = $finfo->file( $file['tmp_name'] );
		if ( ! in_array( $mime, self::ALLOWED_MIME, true ) ) {
			return new WP_Error( 'bad_type', 'Leidžiami tik JPG, PNG, WEBP.', array( 'status' => 400 ) );
		}

		// Apdorojam per GD: resize+crop 400x400, EXIF pasalinamas re-encode metu
		$processed = self::process_image( $file['tmp_name'], $mime );
		if ( is_wp_error( $processed ) ) {
			return $processed;
		}

		// Istrinam sena nuotrauka jei buvo
		if ( $pet->photo_file_id ) {
			self::delete_file( $pet->photo_file_id );
		}

		// Naujas random-hash pavadinimas
		$hash = wp_generate_password( 32, false, false );
		$path = self::photo_dir() . '/' . $hash . '.jpg';
		if ( ! @file_put_contents( $path, $processed ) ) {
			return new WP_Error( 'save_failed', 'Nepavyko išsaugoti.', array( 'status' => 500 ) );
		}

		// Saugom hash i ps_pets
		global $wpdb;
		$wpdb->update( Petshop_Pet_Profile::table_name(),
			array( 'photo_file_id' => 0, 'updated_at' => gmdate( 'Y-m-d H:i:s' ) ),
			array( 'id' => $pet_id )
		);
		// photo_file_id yra BIGINT — hash netelpa. Saugom i atskira meta lentele/optiona.
		// MVP: saugom hash i wp_options-like per user meta ARBA prapleciam. Cia — user meta.
		update_user_meta( $user_id, 'ps_pet_photo_' . $pet_id, $hash );

		return rest_ensure_response( array(
			'ok'        => true,
			'photo_url' => self::serve_url( $pet_id ),
		) );
	}

	/**
	 * Apdoroja per GD — resize+center-crop 400x400, grazina JPEG binary (be EXIF).
	 */
	private static function process_image( $tmp, $mime ) {
		$src = null;
		if ( $mime === 'image/jpeg' ) {
			$src = @imagecreatefromjpeg( $tmp );
		} elseif ( $mime === 'image/png' ) {
			$src = @imagecreatefrompng( $tmp );
		} elseif ( $mime === 'image/webp' ) {
			$src = @imagecreatefromwebp( $tmp );
		}
		if ( ! $src ) {
			return new WP_Error( 'decode_failed', 'Nepavyko apdoroti nuotraukos.', array( 'status' => 400 ) );
		}

		$w = imagesx( $src );
		$h = imagesy( $src );
		$size = self::DIMENSION;

		// Center crop kvadratui
		$min = min( $w, $h );
		$sx = (int) ( ( $w - $min ) / 2 );
		$sy = (int) ( ( $h - $min ) / 2 );

		$dst = imagecreatetruecolor( $size, $size );
		// Baltas fonas (jei PNG su permatomumu)
		$white = imagecolorallocate( $dst, 255, 255, 255 );
		imagefill( $dst, 0, 0, $white );
		imagecopyresampled( $dst, $src, 0, 0, $sx, $sy, $size, $size, $min, $min );

		ob_start();
		imagejpeg( $dst, null, 85 );
		$binary = ob_get_clean();

		imagedestroy( $src );
		imagedestroy( $dst );

		return $binary;
	}

	/**
	 * GET — pateikia nuotrauka (auth proxy).
	 */
	public static function handle_serve( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];

		$pet = self::pet_owned_by_user( $pet_id, $user_id );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Nerasta.', array( 'status' => 404 ) );
		}

		$hash = get_user_meta( $user_id, 'ps_pet_photo_' . $pet_id, true );
		if ( ! $hash ) {
			return new WP_Error( 'no_photo', 'Nuotraukos nėra.', array( 'status' => 404 ) );
		}
		$path = self::photo_dir() . '/' . $hash . '.jpg';
		if ( ! file_exists( $path ) ) {
			return new WP_Error( 'no_photo', 'Nuotraukos nėra.', array( 'status' => 404 ) );
		}

		// Pateikiam binary tiesiogiai
		header( 'Content-Type: image/jpeg' );
		header( 'Content-Length: ' . filesize( $path ) );
		header( 'Cache-Control: private, max-age=3600' );
		readfile( $path );
		exit;
	}

	/**
	 * DELETE — pasalina nuotrauka.
	 */
	public static function handle_delete( $request ) {
		$user_id = get_current_user_id();
		$pet_id = (int) $request['id'];

		$pet = self::pet_owned_by_user( $pet_id, $user_id );
		if ( ! $pet ) {
			return new WP_Error( 'not_found', 'Nerasta.', array( 'status' => 404 ) );
		}

		$hash = get_user_meta( $user_id, 'ps_pet_photo_' . $pet_id, true );
		if ( $hash ) {
			self::delete_file( $hash );
			delete_user_meta( $user_id, 'ps_pet_photo_' . $pet_id );
		}
		return rest_ensure_response( array( 'ok' => true, 'deleted' => true ) );
	}

	private static function delete_file( $hash ) {
		if ( ! $hash || ! is_string( $hash ) ) {
			return;
		}
		// Saugumas: tik alphanumerinis hash
		if ( ! preg_match( '/^[A-Za-z0-9]+$/', $hash ) ) {
			return;
		}
		$path = self::photo_dir() . '/' . $hash . '.jpg';
		if ( file_exists( $path ) ) {
			@unlink( $path );
		}
	}

	public static function serve_url( $pet_id ) {
		return get_rest_url( null, 'petshop/v1/pet-photo/' . $pet_id );
	}

	/**
	 * Ar augintinis turi nuotrauka (naudoja dashboard).
	 */
	public static function has_photo( $user_id, $pet_id ) {
		$hash = get_user_meta( $user_id, 'ps_pet_photo_' . $pet_id, true );
		return ! empty( $hash );
	}
}
