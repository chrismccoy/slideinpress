<?php
/**

 * Plugin Name: Slide In Press
 * Plugin URI: http://github.com/chrismccoy/slideinpress
 * Description: Show Footer Slide In Ad with Video
 * Version: 1.0
 * Author: Chris McCoy
 * Author URI: http://github.com/chrismccoy
 *
 * @copyright 2024
 * @author Chris McCoy
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package Slidein_Press
 */

if (!defined('ABSPATH')) {
    exit();
} // Exit if accessed directly

use Carbon_Fields\Container;
use Carbon_Fields\Field;

require_once trailingslashit(plugin_dir_path(__FILE__)) . 'vendor/autoload.php';

/**
 * Initiate Slidein Press Class on plugins_loaded
 *
 */

if (!function_exists('slidein_press')) {
    function slidein_press()
    {
        $slidein_press = new Slidein_Press();
    }

    add_action('plugins_loaded', 'slidein_press');
}

/**
 * Slidein Press
 *
 */

if (!class_exists('Slidein_Press')) {
    class Slidein_Press
    {
        /**
         * Hooks for scripts, options and fields.
         *
         */

        public function __construct()
        {
            add_action('after_setup_theme', [$this, 'after_setup_theme']);
            add_action('carbon_fields_register_fields', [$this, 'carbon_fields_register_fields']);
            add_action('wp_enqueue_scripts', [$this, 'wp_enqueue_scripts']);
        }

        /**
         * Boot Custom Fields
         *
         */
        public function after_setup_theme()
        {
            \Carbon_Fields\Carbon_Fields::boot();
        }

        /**
         * Add option to enable/disable slidein script, and set variables of the script
         *
         */
        public function carbon_fields_register_fields()
        {
            Container::make('theme_options', 'Slide In Options')
                ->set_page_menu_title('Slidein Ads')
                ->set_page_file('slidein-options')
                ->set_page_parent('options-general.php')
                ->add_fields([
                    Field::make('radio', 'slidein_enabled', 'Enabled')->add_options([
                        'yes' => 'Yes',
                        'no' => 'No',
                    ]),
                    Field::make('radio', 'slidein_type', 'Type')->add_options([
                        'video' => 'Video',
                        'img' => 'Image',
                    ])->set_default_value( 'video' ),
                    Field::make('radio', 'slidein_direction', 'Direction')->add_options([
                        'left' => 'Left',
                        'right' => 'Right',
			'up' => 'Up',
			'down' => 'Down',
                    ])->set_default_value( 'left' ),
                    Field::make('radio', 'slidein_animation', 'Animation')->add_options([
                        'slide' => 'Slide',
                        'fade' => 'Fade',
                    ])->set_default_value( 'slide' ),
                    Field::make('radio', 'slidein_verticalpos', 'Vertical Position')->add_options([
                        'top' => 'Top',
                        'bottom' => 'Bottom',
			'center' => 'Center',
                    ])->set_default_value( 'bottom' ),
                    Field::make('radio', 'slidein_horizontalpos', 'Horizontal Position')->add_options([
                        'right' => 'Right',
                        'left' => 'Left',
			'center' => 'Center',
                    ])->set_default_value( 'right' ),
                    Field::make('text', 'slidein_width', 'Width')->set_default_value( '320px' ),
                    Field::make('text', 'slidein_height', 'Height')->set_default_value( '170px' ),
                    Field::make('text', 'slidein_url', 'URL to Slide To')->set_default_value( 'https://www.google.com' ),
		    Field::make( 'text', 'slidein_content_url', 'Content to Use for AD' ),
                    Field::make('text', 'slidein_timeout', 'Timeout')->set_default_value( '100' ),
                    Field::make('text', 'slidein_delay', 'Close Delay')->set_default_value( '7000' ),
                    Field::make('text', 'slidein_cookie', 'Cookie Name')->set_default_value( 'wpslidein' ),
                    Field::make('select', 'slidein_expire', 'Cookie Expire Time')->set_options([
                        '1' => '1 Hours',
                        '4' => '4 Hours',
                        '6' => '6 Hours',
                        '12' => '12 Hours',
                        '24' => '24 Hours',
                        '36' => '36 Hours',
                        '48' => '48 Hours',
                        '60' => '60 Hours',
                        '72' => '72 Hours',
                    ]),
                    Field::make('radio', 'slidein_clickstart', 'Click Start')->add_options([
                        'true' => 'Yes',
                        'false' => 'No',
                    ])->set_default_value( 'false' ),
                    Field::make('radio', 'slidein_closeintent', 'Close Intent')->add_options([
                        'true' => 'Yes',
                        'false' => 'No',
                    ])->set_default_value( 'false' ),
                    Field::make('radio', 'slidein_lead', 'Lead Out')->add_options([
                        'true' => 'Yes',
                        'false' => 'No',
                    ])->set_default_value( 'true' ),
                ]);
        }

        /**
         * Load script and vars
         *
         */
        public function wp_enqueue_scripts()
        {
            if (carbon_get_theme_option('slidein_enabled') == 'yes') {
                wp_enqueue_script('slidein', plugin_dir_url(__FILE__) . 'js/slidein.js', null, null, true);
                wp_enqueue_script('slidein-init', plugin_dir_url(__FILE__) . 'js/slidein-init.js', null, null, true);

		$slidein_defaults = [
		    'url' => carbon_get_theme_option('slidein_url'),
		    'content' => carbon_get_theme_option('slidein_content_url'),
		    'type' => carbon_get_theme_option('slidein_type'),
		    'direction' => carbon_get_theme_option('slidein_direction'),
		    'clickstart' => carbon_get_theme_option('slidein_clickstart'),
		    'closeintent' => carbon_get_theme_option('slidein_closeintent'),
		    'lead' => carbon_get_theme_option('slidein_lead'),
		    'timeout' => carbon_get_theme_option('slidein_timeout'),
		    'animation' => carbon_get_theme_option('slidein_animation'),
		    'cookie' => carbon_get_theme_option('slidein_cookie'),
		    'delay' => carbon_get_theme_option('slidein_delay'),
		    'expire' => carbon_get_theme_option('slidein_expire'),
		    'width' => carbon_get_theme_option('slidein_width'),
		    'height' => carbon_get_theme_option('slidein_height'),
		    'vert' => carbon_get_theme_option('slidein_verticalpos'),
		    'horiz' => carbon_get_theme_option('slidein_horizontalpos'),
                ];

                wp_localize_script('slidein-init', 'slidein', $slidein_defaults);
            }
        }
    }
}
