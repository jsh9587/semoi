<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crawl_target_fields', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignId('crawl_source_id')->constrained('crawl_sources')->onDelete('cascade');
            $table->string('field_name');
            $table->enum('selector_type', ['css', 'xpath']);
            $table->text('selector_value');
            $table->string('attribute')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crawl_target_fields');
    }
};
