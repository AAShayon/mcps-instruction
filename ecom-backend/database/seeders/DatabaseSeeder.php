<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '1234567890',
            'status' => 'active',
            'profile_image' => null,
        ]);

        // Create user
        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '0987654321',
            'status' => 'active',
            'profile_image' => null,
        ]);

        // Create rider
        User::create([
            'name' => 'Rider User',
            'email' => 'rider@example.com',
            'password' => Hash::make('password'),
            'role' => 'rider',
            'phone' => '1122334455',
            'status' => 'active',
            'profile_image' => null,
        ]);

        $this->call([
            EcommerceSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
