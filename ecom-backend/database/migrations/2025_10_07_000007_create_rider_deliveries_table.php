<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rider_deliveries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rider_id');
            $table->unsignedBigInteger('order_id');
            $table->enum('status', ['assigned', 'picked', 'on_way', 'delivered'])->default('assigned');
            $table->timestamps();

            $table->foreign('rider_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->unique(['rider_id', 'order_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rider_deliveries');
    }
};
