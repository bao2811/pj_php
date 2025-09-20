<?php

require __DIR__ . '/../../../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;

$token = "Y636mOdc5UbbgkQW4uuuyQjzqhEU1Kjtce2qkwFX8ddd20b7";

$decoded = JWT::decode($token, new Key("bao281105", 'HS256'));

echo json_encode($decoded);