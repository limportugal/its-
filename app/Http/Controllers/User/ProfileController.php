<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Services\User\Profile\ShowProfileDataByUuidService;
use App\Services\User\ProfilePictureService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $userUuid = $request->user()->uuid;
        
        if (!$userUuid) {
            return redirect()->back()->withErrors(['error' => 'User UUID not found. Please contact support.']);
        }
        
        $user = (new ShowProfileDataByUuidService())->getProfileDataByUuid($userUuid);
        return Inertia::render('Users/Profile/Profile', [
            'user' => $user
        ]);
    }

    public function showByUuid(string $uuid): Response
    {
        $user = (new ShowProfileDataByUuidService())->getProfileDataByUuid($uuid);
        return Inertia::render('Users/Profile/Profile', [
            'user' => $user
        ]);
    }

    public function showProfileData(string $uuid): Response
    {
        $user = (new ShowProfileDataByUuidService())->getProfileDataByUuid($uuid);
        return Inertia::render('Users/Profile/Profile', [
            'user' => $user
        ]);
    }

    // API ENDPOINT FOR PERSONAL PROFILE JSON DATA
    public function getPersonalProfileData(Request $request): JsonResponse
    {
        $userUuid = $request->user()->uuid;
        
        if (!$userUuid) {
            return response()->json([
                'error' => 'User UUID not found. Please contact support.'
            ], 400);
        }
        
        $user = (new ShowProfileDataByUuidService())->getProfileDataByUuid($userUuid);
        return response()->json($user);
    }

    // API ENDPOINT FOR JSON DATA
    public function getProfileDataByUuid(string $uuid): JsonResponse
    {
        $user = (new ShowProfileDataByUuidService())->getProfileDataByUuid($uuid);
        return response()->json($user);
    }
    
    // UPDATE PROFILE
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    // UPLOAD PROFILE PICTURE
    public function uploadProfilePicture(Request $request): JsonResponse
    {
        $service = new ProfilePictureService();
        $result = $service->uploadProfilePicture($request, $request->user());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'data' => null
        ], 400);
    }

    // DELETE PROFILE PICTURE
    public function deleteProfilePicture(Request $request): JsonResponse
    {
        $service = new ProfilePictureService();
        $result = $service->deleteProfilePicture($request->user());

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => null
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'data' => null
        ], 400);
    }

    // UPLOAD PROFILE PICTURE FOR OTHER USER (ADMIN ONLY)
    public function uploadProfilePictureByUuid(Request $request, string $uuid): JsonResponse
    {
        $user = \App\Models\User::where('uuid', $uuid)->firstOrFail();
        
        $service = new ProfilePictureService();
        $result = $service->uploadProfilePicture($request, $user);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'data' => null
        ], 400);
    }

    // DELETE PROFILE PICTURE FOR OTHER USER (ADMIN ONLY)
    public function deleteProfilePictureByUuid(Request $request, string $uuid): JsonResponse
    {
        $user = \App\Models\User::where('uuid', $uuid)->firstOrFail();
        
        $service = new ProfilePictureService();
        $result = $service->deleteProfilePicture($user);

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => null
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message'],
            'data' => null
        ], 400);
    }
}
