<?php

namespace App\Utils;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;


class JWTUtil
{
    private static $secretKey = null;

    public static function getSecretKey()
    {
        if (!self::$secretKey) {
            self::$secretKey = env('JWT_SECRET');
        }
        return self::$secretKey;
    }

    public static function generateToken($userId, $expiryMinutes = 60)
    {
        $issuedAt = time();
        $expiry = $issuedAt + ($expiryMinutes * 60);

        $payload = [
            'iss' => 'your-issuer',
            'aud' => 'your-audience',
            'iat' => $issuedAt,
            'exp' => $expiry,
            'sub' => $userId,
        ];

        return JWT::encode($payload, self::getSecretKey(), 'HS256');
    }

    public static function extractToken($token) {
        try {
            $decoded = JWT::decode($token, new Key(self::getSecretKey(), 'HS256'));
            return $decoded;
        } catch (ExpiredException $e) {
            return null; 
        } catch (\Exception $e) {
            return null;
        }
    }


    public static function validateToken(string $token) {
        try {
            $decoded = self::extractToken($token);
            if (!$decoded) {
                return "Invalid token";
            }
            return $decoded;
        } catch (ExpiredException $e) {
            // Token hết hạn
            throw new \Exception('Token expired');
        } catch (SignatureInvalidException $e) {
            // Sai chữ ký (SECRET_KEY không khớp)
            throw new \Exception('Invalid signature');
        } catch (\Exception $e) {
            // Lỗi khác (token hỏng, thiếu claim…)
            throw new \Exception('Invalid token: ' . $e->getMessage());
        }
    }

}