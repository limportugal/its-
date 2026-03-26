<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ownerships', function (Blueprint $table) {
            $table->id();
            $table->string('ownership_name', 100)->unique();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        Schema::create('store_types', function (Blueprint $table) {
            $table->id();
            $table->string('store_type_name', 100)->unique();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        DB::table('ownerships')->insert([
            ['ownership_name' => 'Company Own', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['ownership_name' => 'Subsidiary', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['ownership_name' => 'Franchise', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('store_types')->insert([
            ['store_type_name' => 'Full Store', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
            ['store_type_name' => 'Bake Shop', 'status' => 'active', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_types');
        Schema::dropIfExists('ownerships');
    }
};

