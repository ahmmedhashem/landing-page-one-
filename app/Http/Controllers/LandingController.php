<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Landing', [
            'page' => PageContent::current()->toPageProps(),
        ]);
    }

    public function storeLead(Request $request): RedirectResponse
    {
        $page = PageContent::current()->toPageProps();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'mobile' => ['required', 'string', 'regex:/^\+?[0-9\s\-()]{7,20}$/'],
            'question' => ['required', 'string', Rule::in($page['question_options'])],
        ], [
            'mobile.regex' => 'Please enter a valid mobile number.',
            'question.in' => 'Please select one of the available options.',
        ]);

        Lead::create([
            ...$validated,
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        return back()->with('success', $page['success_message']);
    }
}
