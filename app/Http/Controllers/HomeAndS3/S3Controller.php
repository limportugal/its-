<?php

namespace App\Http\Controllers\HomeAndS3;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use App\Models\Attachment;

class S3Controller extends Controller
{
    // SHOW THE ATTACHMENT
    public function show($year, $month, $date, $file)
    {
        $s3FilePath = "attachments/$year/$month/$date/$file";
        
        if (Storage::disk('s3')->exists($s3FilePath)) {
            $fileContent = Storage::disk('s3')->get($s3FilePath);
            
            // GET MIME TYPE FROM FILE EXTENSION
            $extension = pathinfo($file, PATHINFO_EXTENSION);
            $mimeType = $this->getMimeTypeFromExtension($extension);
            
            return response($fileContent)
                ->header('Content-Type', $mimeType)
                ->header('Accept-Ranges', 'bytes')
                ->header('Cache-Control', 'public, max-age=3600');
        } else {
            abort(404, "File not found: $s3FilePath");
        }
    }
    
    // HELPER METHOD TO GET MIME TYPE FROM FILE EXTENSION
    private function getMimeTypeFromExtension($extension)
    {
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt' => 'text/plain',
        ];
        
        return $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
    }

    // SHOW THE ATTACHMENT BY UUID
    public function showByUuid($uuid)
    {
        $attachment = Attachment::where('uuid', $uuid)->firstOrFail();
        
        if (Storage::disk('s3')->exists($attachment->file_path)) {
            $fileContent = Storage::disk('s3')->get($attachment->file_path);
            
            // GET MIME TYPE FROM ATTACHMENT RECORD OR FILE EXTENSION
            $mimeType = $attachment->mime_type ?: $this->getMimeTypeFromExtension(pathinfo($attachment->file_path, PATHINFO_EXTENSION));
            
            return response($fileContent)
                ->header('Content-Type', $mimeType)
                ->header('Accept-Ranges', 'bytes')
                ->header('Cache-Control', 'public, max-age=3600')
                ->header('Content-Disposition', 'inline; filename="' . $attachment->original_name . '"');
        } else {
            abort(404, "File not found: {$attachment->file_path}");
        }
    }
}