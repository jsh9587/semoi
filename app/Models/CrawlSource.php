<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CrawlSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'source_url',
        'is_active',
        'last_crawled_at',
    ];

    /**
     * Get the target fields for the crawl source.
     */
    public function fields()
    {
        return $this->hasMany(CrawlTargetField::class);
    }
}
