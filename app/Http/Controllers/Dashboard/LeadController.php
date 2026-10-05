<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $leads = $this->filtered($search)
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Dashboard/Leads', [
            'leads' => $leads,
            'filters' => ['search' => $search],
            'stats' => [
                'total' => Lead::count(),
                'today' => Lead::whereDate('created_at', today())->count(),
                'unread' => Lead::whereNull('read_at')->count(),
            ],
        ]);
    }

    public function markRead(Lead $lead): RedirectResponse
    {
        $lead->update(['read_at' => $lead->read_at ? null : now()]);

        return back();
    }

    public function destroy(Lead $lead): RedirectResponse
    {
        $lead->delete();

        return back()->with('success', 'Lead deleted.');
    }

    public function export(Request $request): StreamedResponse
    {
        $query = $this->filtered(trim((string) $request->query('search', '')))->latest();

        return response()->streamDownload(function () use ($query) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Name', 'Mobile', 'Answer', 'Submitted at']);

            $query->chunk(500, function ($leads) use ($out) {
                foreach ($leads as $lead) {
                    fputcsv($out, [
                        $lead->id,
                        $lead->name,
                        $lead->mobile,
                        $lead->question,
                        $lead->created_at->toDateTimeString(),
                    ]);
                }
            });

            fclose($out);
        }, 'leads-'.now()->format('Y-m-d').'.csv', ['Content-Type' => 'text/csv']);
    }

    private function filtered(string $search): Builder
    {
        return Lead::query()->when($search !== '', function (Builder $query) use ($search) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('mobile', 'like', "%{$search}%")
                    ->orWhere('question', 'like', "%{$search}%");
            });
        });
    }
}
