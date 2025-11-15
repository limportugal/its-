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
            $table->string('powerform_full_name', 100)->nullable()->after('fsr_no');
            $table->string('powerform_employee_id', 30)->nullable()->after('powerform_full_name');
            $table->string('powerform_email', 100)->nullable()->after('powerform_employee_id');
            $table->string('powerform_company_number', 25)->nullable()->after('powerform_email');
            $table->string('powerform_imei', 32)->nullable()->after('powerform_company_number');
        });
    }

    /**
     * REVERSE THE MIGRATIONS.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'powerform_full_name',
                'powerform_employee_id',
                'powerform_email',
                'powerform_company_number',
                'powerform_imei',
            ]);
        });
    }
};

