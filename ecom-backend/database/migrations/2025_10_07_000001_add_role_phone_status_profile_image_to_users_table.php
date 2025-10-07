<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'user', 'rider'])->default('user')->after('password');
            $table->string('phone')->nullable()->after('role');
            $table->enum('status', ['active', 'blocked'])->default('active')->after('phone');
            $table->string('profile_image')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'status', 'profile_image']);
        });
    }
};
