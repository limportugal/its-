<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * RUN THE MIGRATIONS.
     */
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->string('service_logs_mobile_no', 25)->nullable()->after('powerform_imei');
            $table->string('service_logs_mobile_model', 100)->nullable()->after('service_logs_mobile_no');
            $table->string('service_logs_mobile_serial_no', 100)->nullable()->after('service_logs_mobile_model');
            $table->string('service_logs_imei', 32)->nullable()->after('service_logs_mobile_serial_no');
        });
    }

    /**
     * REVERSE THE MIGRATIONS.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'service_logs_mobile_no',
                'service_logs_mobile_model',
                'service_logs_mobile_serial_no',
                'service_logs_imei',
            ]);
        });
    }
};
