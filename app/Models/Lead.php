<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'mobile', 'question', 'ip_address', 'user_agent', 'read_at'];

    protected $hidden = ['user_agent'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
