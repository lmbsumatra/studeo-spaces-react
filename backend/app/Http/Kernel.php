<?php


protected $middleware = [
    // Other middleware...
    \App\Http\Middleware\CorsMiddleware::class,
];


protected $middleware = [
    // Other middleware...
    \App\Http\Middleware\CorsMiddleware::class,
];

protected $routeMiddleware = [
    'admin.auth' => \App\Http\Middleware\AdminAuthMiddleware::class,
];


?>
