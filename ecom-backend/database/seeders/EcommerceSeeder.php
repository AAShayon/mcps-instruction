<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and accessories'],
            ['name' => 'Clothing', 'slug' => 'clothing', 'description' => 'Apparel and fashion items'],
            ['name' => 'Books', 'slug' => 'books', 'description' => 'Books and educational materials'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Home improvement and garden supplies'],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }

        // Create sample products
        $products = [
            [
                'name' => 'Smartphone',
                'description' => 'Latest model smartphone with advanced features',
                'price' => 699.99,
                'category_id' => 1,
                'sku' => 'SMRT-PH-001',
                'stock' => 50,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Laptop',
                'description' => 'High-performance laptop for work and gaming',
                'price' => 1299.99,
                'category_id' => 1,
                'sku' => 'LPTP-001',
                'stock' => 25,
                'is_featured' => true,
                'is_active' => true,
            ],
            [
                'name' => 'T-Shirt',
                'description' => 'Comfortable cotton t-shirt',
                'price' => 19.99,
                'category_id' => 2,
                'sku' => 'TSHIRT-001',
                'stock' => 100,
                'is_featured' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Programming Book',
                'description' => 'Learn programming with this comprehensive guide',
                'price' => 49.99,
                'category_id' => 3,
                'sku' => 'BOOK-PRG-001',
                'stock' => 75,
                'is_featured' => true,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert($product);
        }

        // Create sample users
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ],
            [
                'name' => 'Customer User',
                'email' => 'customer@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ],
            [
                'name' => 'Rider User',
                'email' => 'rider@example.com',
                'password' => Hash::make('password'),
                'role' => 'rider',
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }
    }
}