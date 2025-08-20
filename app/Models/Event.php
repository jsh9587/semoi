<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'crawl_source_id',
        'title',
        'description',
        'original_url',
        'start_at',
        'end_at',
        'location_text',
        'address',
        'latitude',
        'longitude',
        'price',
        'image_url',
        'status',
    ];

    public function crawlSource()
    {
        return $this->belongsTo(CrawlSource::class);
    }
}
