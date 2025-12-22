<?php

namespace App\Jobs;

use App\Models\Attachment;
use App\Models\Ticket;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\File;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class UploadClosedTicketAttachmentToS3 implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public function __construct(
        public int $ticketId,
        public ?int $userId,
        public string $tempPath, // local disk relative path (storage/app/...)
        public string $originalName,
        public ?string $mimeType,
        public string $datePath,
        public string $fileName,
    ) {
    }

    public function handle(): void
    {
        $ticket = Ticket::findOrFail($this->ticketId);

        $localDisk = Storage::disk('local');
        $s3Disk = Storage::disk('s3');

        if (!$localDisk->exists($this->tempPath)) {
            // Temp file missing; nothing we can do.
            return;
        }

        $localFullPath = $localDisk->path($this->tempPath);
        $destinationDir = "attachments/{$this->datePath}";
        $filePath = "{$destinationDir}/{$this->fileName}";

        // Upload to S3
        $s3Disk->putFileAs($destinationDir, new File($localFullPath), $this->fileName);

        // Record in DB
        Attachment::create([
            'user_id' => $this->userId,
            'category' => 'CLOSED TICKET ATTACHMENT',
            'original_name' => $this->originalName,
            'file_path' => $filePath,
            'mime_type' => $this->mimeType,
            'attachable_type' => Ticket::class,
            'attachable_id' => $ticket->id,
        ]);

        // Cleanup temp file
        $localDisk->delete($this->tempPath);
    }
}


