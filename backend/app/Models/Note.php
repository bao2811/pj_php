<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use HasFactory;

    protected $table = 'notes';
    protected $primaryKey = 'noteId';
    public $incrementing = true;      
    protected $keyType = 'int'; 

    protected $fillable = [
        'userId',
        'title',
        'content',
    ];
}
