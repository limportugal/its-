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
            $table->string('knox_full_name', 100)->nullable()->after('service_logs_imei');
            $table->string('knox_employee_id', 30)->nullable()->after('knox_full_name');
            $table->string('knox_email', 100)->nullable()->after('knox_employee_id');
            $table->string('knox_company_mobile_number', 25)->nullable()->after('knox_email');
            $table->string('knox_mobile_imei', 32)->nullable()->after('knox_company_mobile_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'knox_full_name',
                'knox_employee_id',
                'knox_email',
                'knox_company_mobile_number',
                'knox_mobile_imei'
            ]);
        });
    }
};
