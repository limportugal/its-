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
            $table->string('powerform_store_code', 50)->nullable()->after('powerform_imei');
            $table->string('powerform_store_name', 100)->nullable()->after('powerform_store_code');
            $table->string('powerform_store_address', 510)->nullable()->after('powerform_store_name');
            $table->string('powerform_store_ownership', 100)->nullable()->after('powerform_store_address');
            $table->string('powerform_store_type', 100)->nullable()->after('powerform_store_ownership');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'powerform_store_code',
                'powerform_store_name',
                'powerform_store_address',
                'powerform_store_ownership',
                'powerform_store_type',
            ]);
        });
    }
};
