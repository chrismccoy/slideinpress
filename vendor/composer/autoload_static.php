<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit6ab4a69c1970d546c160c3bcf68db14c
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'Carbon_Fields\\' => 14,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Carbon_Fields\\' => 
        array (
            0 => __DIR__ . '/..' . '/htmlburger/carbon-fields/core',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit6ab4a69c1970d546c160c3bcf68db14c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit6ab4a69c1970d546c160c3bcf68db14c::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit6ab4a69c1970d546c160c3bcf68db14c::$classMap;

        }, null, ClassLoader::class);
    }
}
