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
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('store_code', 50)->nullable()->after('description');
            $table->string('store_name', 100)->nullable()->after('store_code');
            $table->string('store_address', 510)->nullable()->after('store_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn(['store_code', 'store_name', 'store_address']);
        });
    }
};
