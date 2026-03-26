<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('powerform_client_name', 100)->nullable()->after('powerform_imei');
        });

        // Backfill existing Power Form Additional Store data for backward compatibility.
        DB::table('tickets')
            ->whereNotNull('client_name')
            ->whereNull('powerform_client_name')
            ->whereNotNull('powerform_store_code')
            ->update(['powerform_client_name' => DB::raw('client_name')]);
    }

    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn('powerform_client_name');
        });
    }
};

