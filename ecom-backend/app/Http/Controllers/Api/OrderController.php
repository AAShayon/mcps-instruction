<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $orders = Order::with(['user', 'userAddress'])->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'user_address_id' => 'required|exists:user_addresses,id',
            'order_number' => 'required|string|unique:orders,order_number',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'string|in:pending,paid,failed',
            'payment_method' => 'nullable|string|in:cod,online',
            'notes' => 'nullable|string',
        ]);

        $order = Order::create($validated);

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $order = Order::with(['user', 'userAddress', 'orderItems.product'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'exists:users,id',
            'user_address_id' => 'exists:user_addresses,id',
            'order_number' => 'string|unique:orders,order_number,' . $order->id,
            'total_amount' => 'numeric|min:0',
            'status' => 'string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'string|in:pending,paid,failed',
            'payment_method' => 'nullable|string|in:cod,online',
            'notes' => 'nullable|string',
            'shipped_at' => 'nullable|date',
            'delivered_at' => 'nullable|date',
        ]);

        $order->update($validated);

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json(null, 204);
    }
}