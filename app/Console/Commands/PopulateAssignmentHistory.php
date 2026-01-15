<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Ticket;
use App\Models\TicketAssignmentHistory;

class PopulateAssignmentHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:populate-assignment-history {--force : Force repopulation even if data exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate assignment history table with existing ticket assignment data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $existingCount = TicketAssignmentHistory::count();

        if ($existingCount > 0 && !$this->option('force')) {
            $this->warn("Assignment history table already has {$existingCount} records. Use --force to repopulate.");
            return;
        }

        if ($this->option('force') && $existingCount > 0) {
            TicketAssignmentHistory::truncate();
            $this->info('Truncated existing assignment history records.');
        }

        $tickets = Ticket::whereNotNull('assigned_by_id')->get();
        $bar = $this->output->createProgressBar($tickets->count());
        $bar->start();

        $created = 0;
        foreach ($tickets as $ticket) {
            TicketAssignmentHistory::create([
                'ticket_id' => $ticket->id,
                'assigned_by_user_id' => $ticket->assigned_by_id,
                'assigned_to_user_id' => $ticket->assign_to_user_id,
                'assigned_at' => $ticket->assigned_at ?: $ticket->created_at,
            ]);
            $created++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Successfully populated assignment history for {$created} tickets.");
    }
}
