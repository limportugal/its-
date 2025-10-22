<?php

namespace App\Services\User;

use App\Models\User;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Carbon\Carbon;


class ProfilePictureService
{
    public function uploadProfilePicture(Request $request, User $user): array
    {
        if (!$request->hasFile('profile_picture')) {
            return [
                'success' => false,
                'message' => 'No profile picture file provided',
                'data' => null
            ];
        }

        $file = $request->file('profile_picture');

        if (!$file->isValid()) {
            return [
                'success' => false,
                'message' => 'Invalid file provided',
                'data' => null
            ];
        }

        // VALIDATE FILE TYPE
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            return [
                'success' => false,
                'message' => 'Only JPG, PNG, and GIF files are allowed',
                'data' => null
            ];
        }

        // VALIDATE FILE SIZE (10MB MAX)
        if ($file->getSize() > 10 * 1024 * 1024) {
            return [
                'success' => false,
                'message' => 'File size must not exceed 10MB',
                'data' => null
            ];
        }

        try {
            // DELETE EXISTING PROFILE PICTURE
            $this->deleteExistingProfilePicture($user);

            // UPLOAD FILE TO S3
            $datePath = Carbon::now()->format('Y/m/d');
            $extension = $file->getClientOriginalExtension();
            $randomName = Str::random(20) . '.' . $extension;
            $filePath = "profile-pictures/{$datePath}/{$randomName}";

            // STORE THE FILE IN S3 (FALLBACK TO LOCAL IF S3 FAILS)
            try {
                $stored = $file->storeAs("profile-pictures/{$datePath}", $randomName, 's3');
            } catch (\Exception $s3Error) {
                $stored = $file->storeAs("profile-pictures/{$datePath}", $randomName, 'local');
                $filePath = "profile-pictures/{$datePath}/{$randomName}";
            }
            
            if (!$stored) {
                return [
                    'success' => false,
                    'message' => 'Failed to store file in S3',
                    'data' => null
                ];
            }

            // CREATE ATTACHMENT RECORD IN DATABASE
            $attachment = Attachment::create([
                'user_id' => $user->id,
                'category' => 'PROFILE_PICTURE',
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $filePath,
                'mime_type' => $file->getMimeType(),
                'attachable_type' => User::class,
                'attachable_id' => $user->id,
            ]);

            return [
                'success' => true,
                'message' => 'Profile picture uploaded successfully',
                'data' => [
                    'attachment' => $attachment,
                    'url' => $this->getProfilePictureUrl($attachment)
                ]
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to upload profile picture: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }

    private function deleteExistingProfilePicture(User $user): void
    {
        $existingPicture = $user->profilePicture;
        
        if ($existingPicture) {
            // DELETE FILE FROM STORAGE (S3 OR LOCAL)
            if (Storage::disk('s3')->exists($existingPicture->file_path)) {
                Storage::disk('s3')->delete($existingPicture->file_path);
            } elseif (Storage::disk('local')->exists($existingPicture->file_path)) {
                Storage::disk('local')->delete($existingPicture->file_path);
            }
            
            // DELETE ATTACHMENT RECORD
            $existingPicture->delete();
        }
    }

    // GET PROFILE PICTURE URL USING UUID
    public function getProfilePictureUrl(Attachment $attachment): string
    {
        // USE UUID-BASED URL FOR BETTER SECURITY AND CONSISTENCY
        return url("/attachment/{$attachment->uuid}");
    }

    // DELETE PROFILE PICTURE
    public function deleteProfilePicture(User $user): array
    {
        try {
            $this->deleteExistingProfilePicture($user);
            
            return [
                'success' => true,
                'message' => 'Profile picture deleted successfully',
                'data' => null
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to delete profile picture: ' . $e->getMessage(),
                'data' => null
            ];
        }
    }
}
