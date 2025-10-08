<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20|unique:users',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user', // Default to user role for all registrations
            'phone' => $validated['phone'] ?? null,
        ]);

        // Create token for the user
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login' => 'required|string', // Accept either email or phone
            'password' => 'required|string',
        ]);

        // Determine if login is by email or phone
        $loginType = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'phone';
        
        // Find user by either email or phone
        $user = User::where($loginType, $request->login)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            $fieldName = $loginType === 'email' ? 'email' : 'login';
            throw ValidationException::withMessages([
                $fieldName => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create token for the user
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * Update authenticated user
     */
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Log the request data for debugging
        \Log::info('Profile update request data:', $request->all());
        \Log::info('File received:', ['hasFile' => $request->hasFile('profile_image')]);
        \Log::info('Raw input:', $request->input()); // Log non-file inputs
        \Log::info('Request keys:', array_keys($request->all())); // Log all keys in request
        
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:20',
                'profile_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Optional profile image
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Profile update validation error: ' . json_encode($e->errors()));
            \Log::error('Validation error details:', $e->validator->errors()->toArray());
            return response()->json(['message' => 'Validation failed', 'errors' => $e->errors()], 422);
        }

        try {
            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                // Delete old profile image if exists
                if ($user->profile_image) {
                    $oldImagePath = storage_path('app/public/' . $user->profile_image);
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }
                
                // Store new profile image
                $profileImage = $request->file('profile_image');
                $profileImageName = time() . '_' . $user->id . '.' . $profileImage->getClientOriginalExtension();
                $profileImagePath = $profileImage->storeAs('profile_images', $profileImageName, 'public');
                $validated['profile_image'] = $profileImagePath;
            }

            $user->update($validated);

            return response()->json($user);
        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating profile: ' . $e->getMessage()], 500);
        }
    }
}