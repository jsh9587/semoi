<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Add this line

class CrawlTargetField extends Model
{
    use HasFactory; // Add this line

    protected $fillable = [
        'crawl_source_id',
        'field_name',
        'selector_type',
        'selector_value',
        'attribute',
    ];

    /**
     * Get the crawl source that owns the target field.
     */
    public function crawlSource()
    {
        return $this->belongsTo(CrawlSource::class);
    }
}
