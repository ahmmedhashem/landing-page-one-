<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Dashboard/Content', [
            'page' => PageContent::current()->toPageProps(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'brand_name' => ['required', 'string', 'max:80'],
            'header_phone' => ['nullable', 'string', 'max:40'],
            'back_link_text' => ['nullable', 'string', 'max:80'],
            'back_link_url' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['nullable', 'string', 'max:2000'],
            'details_label' => ['nullable', 'string', 'max:40'],
            'details' => ['array', 'max:12'],
            'details.*' => ['nullable', 'string', 'max:200'],
            'button_text' => ['required', 'string', 'max:40'],
            'form_title' => ['required', 'string', 'max:120'],
            'form_subtitle' => ['nullable', 'string', 'max:300'],
            'question_label' => ['required', 'string', 'max:160'],
            'question_options' => ['required', 'array', 'min:1', 'max:20'],
            'question_options.*' => ['nullable', 'string', 'max:160'],
            'submit_text' => ['required', 'string', 'max:40'],
            'success_message' => ['required', 'string', 'max:300'],
            'footer_text' => ['nullable', 'string', 'max:200'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'remove_image' => ['boolean'],
        ]);

        $page = PageContent::current();

        // Drop empty rows coming from the repeatable inputs.
        $validated['details'] = array_values(array_filter($validated['details'] ?? [], 'filled'));
        $validated['question_options'] = array_values(array_unique(array_filter($validated['question_options'], 'filled')));

        if ($validated['question_options'] === []) {
            return back()->withErrors(['question_options' => 'Add at least one option to the dropdown.']);
        }

        if ($request->hasFile('image') || $request->boolean('remove_image')) {
            if ($page->image_path) {
                Storage::disk('public')->delete($page->image_path);
            }
            $page->image_path = $request->hasFile('image')
                ? $request->file('image')->store('landing', 'public')
                : null;
        }

        $page->content = collect($validated)->except(['image', 'remove_image'])->all();
        $page->save();

        return back()->with('success', 'Page content saved.');
    }
}
