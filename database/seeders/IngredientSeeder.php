<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            // Master Bahan Makanan
            ['name' => 'Daging Sapi Slice', 'category' => 'Daging', 'stock' => 12.0, 'min' => 15.0, 'unit' => 'kg', 'price' => 120000],
            ['name' => 'Beras Jasmine', 'category' => 'Sembako', 'stock' => 45.0, 'min' => 20.0, 'unit' => 'kg', 'price' => 14000],
            ['name' => 'Minyak Goreng', 'category' => 'Bumbu/Cairan', 'stock' => 6.0, 'min' => 10.0, 'unit' => 'L', 'price' => 18000],
            ['name' => 'Telur Ayam', 'category' => 'Sembako', 'stock' => 150, 'min' => 50, 'unit' => 'pcs', 'price' => 2000],
            ['name' => 'Saus Teriyaki', 'category' => 'Bumbu/Cairan', 'stock' => 2.5, 'min' => 3.0, 'unit' => 'L', 'price' => 45000],
            ['name' => 'Bawang Putih Cincang', 'category' => 'Sayur', 'stock' => 3.5, 'min' => 2.0, 'unit' => 'kg', 'price' => 35000],
            ['name' => 'Daging Ayam Fillet', 'category' => 'Daging', 'stock' => 8.0, 'min' => 10.0, 'unit' => 'kg', 'price' => 55000],
            ['name' => 'Mentega / Margarin', 'category' => 'Sembako', 'stock' => 4.0, 'min' => 2.0, 'unit' => 'kg', 'price' => 28000],

            // Master Bahan Minuman
            ['name' => 'Daun Teh Celup', 'category' => 'Sembako', 'stock' => 2.0, 'min' => 1.0, 'unit' => 'kg', 'price' => 40000],
            ['name' => 'Gula Pasir', 'category' => 'Sembako', 'stock' => 15.0, 'min' => 5.0, 'unit' => 'kg', 'price' => 16000],
            ['name' => 'Sirup Lemon', 'category' => 'Bumbu/Cairan', 'stock' => 3.0, 'min' => 1.5, 'unit' => 'L', 'price' => 32000],
            ['name' => 'Bubuk Kopi Espresso', 'category' => 'Sembako', 'stock' => 3.0, 'min' => 1.0, 'unit' => 'kg', 'price' => 110000],
            ['name' => 'Susu UHT Cair', 'category' => 'Bumbu/Cairan', 'stock' => 12.0, 'min' => 5.0, 'unit' => 'L', 'price' => 19000],
            ['name' => 'Gula Aren Cair', 'category' => 'Bumbu/Cairan', 'stock' => 4.0, 'min' => 2.0, 'unit' => 'L', 'price' => 38000],
            ['name' => 'Bubuk Matcha Premium', 'category' => 'Sembako', 'stock' => 1.0, 'min' => 0.5, 'unit' => 'kg', 'price' => 140000],
            ['name' => 'Air Mineral Botol 600ml', 'category' => 'Sembako', 'stock' => 100, 'min' => 30, 'unit' => 'pcs', 'price' => 2500],
        ];

        foreach ($data as $item) {
            Ingredient::create($item);
        }
    }
}