<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Normalize unexpected values before constraining the column to ENUM.
        DB::statement("
            UPDATE ownerships
            SET status = 'active'
            WHERE status IS NULL OR status NOT IN ('active', 'inactive', 'deleted')
        ");

        DB::statement("
            UPDATE store_types
            SET status = 'active'
            WHERE status IS NULL OR status NOT IN ('active', 'inactive', 'deleted')
        ");

        DB::statement("
            ALTER TABLE ownerships
            MODIFY COLUMN status ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active'
        ");

        DB::statement("
            ALTER TABLE store_types
            MODIFY COLUMN status ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active'
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("
            ALTER TABLE ownerships
            MODIFY COLUMN status VARCHAR(255) NOT NULL DEFAULT 'active'
        ");

        DB::statement("
            ALTER TABLE store_types
            MODIFY COLUMN status VARCHAR(255) NOT NULL DEFAULT 'active'
        ");
    }
};
