<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use App\Models\InventoryLog;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function getIngredients()
    {
        return response()->json(Ingredient::all());
    }

    public function getLogs()
    {
        return response()->json(InventoryLog::orderBy('id', 'desc')->take(15)->get());
    }

    public function storeIngredient(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'unit' => 'required|string',
            'stock' => 'required|numeric',
            'min' => 'required|numeric',
            'price' => 'required|numeric',
        ]);

        $ingredient = Ingredient::create($data);
        return response()->json($ingredient);
    }

    public function updateStock(Request $request, $id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json(['success' => false, 'message' => 'Bahan baku tidak ditemukan'], 404);
        }

        $qty = (float) $request->qty;
        $ingredient->stock += $qty;
        if ($ingredient->stock < 0) {
            $ingredient->stock = 0;
        }
        $ingredient->save();

        InventoryLog::create([
            'type' => $request->type ?? 'RESTOCK',
            'ingredient' => $ingredient->name,
            'qty' => ($qty > 0 ? '+' : '') . $qty . ' ' . $ingredient->unit,
            'reason' => $request->reason ?? 'Manual Restock'
        ]);

        return response()->json(['success' => true, 'data' => $ingredient]);
    }
}