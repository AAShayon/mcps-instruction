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
        // Create test users with different roles
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@ecommerce.test',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '+1234567890',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@ecommerce.test',
                'password' => Hash::make('password123'),
                'role' => 'user',
                'phone' => '+1234567891',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Rider User',
                'email' => 'rider@ecommerce.test',
                'password' => Hash::make('password123'),
                'role' => 'rider',
                'phone' => '+1234567892',
                'status' => 'active',
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert($user);
        }

        // Create sample categories
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and accessories',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Clothing',
                'slug' => 'clothing',
                'description' => 'Apparel and fashion items',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Books',
                'slug' => 'books',
                'description' => 'Books and educational materials',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Home & Garden',
                'slug' => 'home-garden',
                'description' => 'Home improvement and garden supplies',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }

        // Create sample products with all fields
        $products = [
            [
                'name' => 'Smartphone X Pro',
                'slug' => 'smartphone-x-pro',
                'description' => 'Latest model smartphone with advanced features, 5G connectivity, and stunning display',
                'price' => 699.99,
                'discount_price' => 649.99,
                'category_id' => 1,
                'sku' => 'SMRT-PH-001',
                'stock' => 50,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gaming Laptop Ultra',
                'slug' => 'gaming-laptop-ultra',
                'description' => 'High-performance laptop for work and gaming with RTX graphics',
                'price' => 1299.99,
                'discount_price' => 1199.99,
                'category_id' => 1,
                'sku' => 'LPTP-001',
                'stock' => 25,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Wireless Earbuds',
                'slug' => 'wireless-earbuds',
                'description' => 'Premium wireless earbuds with noise cancellation',
                'price' => 129.99,
                'discount_price' => null,
                'category_id' => 1,
                'sku' => 'EARB-001',
                'stock' => 100,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Classic Cotton T-Shirt',
                'slug' => 'classic-cotton-tshirt',
                'description' => 'Comfortable cotton t-shirt available in multiple colors',
                'price' => 19.99,
                'discount_price' => 14.99,
                'category_id' => 2,
                'sku' => 'TSHIRT-001',
                'stock' => 200,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Designer Jeans',
                'slug' => 'designer-jeans',
                'description' => 'Premium quality designer jeans with perfect fit',
                'price' => 89.99,
                'discount_price' => null,
                'category_id' => 2,
                'sku' => 'JEANS-001',
                'stock' => 75,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Programming Mastery Guide',
                'slug' => 'programming-mastery-guide',
                'description' => 'Comprehensive guide to master programming from basics to advanced',
                'price' => 49.99,
                'discount_price' => 39.99,
                'category_id' => 3,
                'sku' => 'BOOK-PRG-001',
                'stock' => 150,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Web Development Bible',
                'slug' => 'web-development-bible',
                'description' => 'Everything you need to know about modern web development',
                'price' => 59.99,
                'discount_price' => null,
                'category_id' => 3,
                'sku' => 'BOOK-WEB-001',
                'stock' => 100,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Garden Tool Set',
                'slug' => 'garden-tool-set',
                'description' => 'Complete set of essential garden tools for home gardening',
                'price' => 79.99,
                'discount_price' => 69.99,
                'category_id' => 4,
                'sku' => 'GARDEN-001',
                'stock' => 50,
                'image_path' => null,
                'video' => null,
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($products as $product) {
            DB::table('products')->insert($product);
        }

        echo "\n✅ Seeding completed successfully!\n";
        echo "📧 Test Accounts Created:\n";
        echo "   Admin: admin@ecommerce.test / password123\n";
        echo "   User: user@ecommerce.test / password123\n";
        echo "   Rider: rider@ecommerce.test / password123\n";
        echo "📦 Categories: 4 created\n";
        echo "🛍️  Products: 8 created\n\n";
    }
}
