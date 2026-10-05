<?php

namespace Tests\Feature;

use App\Models\Lead;
use App\Models\PageContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class LandingPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
    }

    public function test_landing_page_renders_default_content(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Landing')
                ->where('page.title', 'Open House by Emaar')
                ->has('page.details', 3)
                ->has('page.question_options', 4));
    }

    public function test_visitor_can_submit_a_lead(): void
    {
        $this->post('/leads', [
            'name' => 'Sara Ahmed',
            'mobile' => '+971 50 123 4567',
            'question' => 'Investment property',
        ])->assertRedirect()->assertSessionHasNoErrors();

        $this->assertDatabaseHas('leads', ['name' => 'Sara Ahmed', 'question' => 'Investment property']);
    }

    public function test_lead_requires_valid_fields_and_known_option(): void
    {
        $this->post('/leads', ['name' => '', 'mobile' => 'abc', 'question' => 'Something else'])
            ->assertSessionHasErrors(['name', 'mobile', 'question']);

        $this->assertDatabaseCount('leads', 0);
    }

    public function test_dashboard_requires_login(): void
    {
        $this->get('/dashboard/leads')->assertRedirect('/login');
        $this->get('/dashboard/content')->assertRedirect('/login');
    }

    public function test_admin_can_log_in(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        $this->post('/login', ['email' => $user->email, 'password' => 'secret123'])
            ->assertRedirect('/dashboard/leads');

        $this->assertAuthenticatedAs($user);
    }

    public function test_admin_sees_leads_and_can_search(): void
    {
        Lead::create(['name' => 'Alice', 'mobile' => '0501111111', 'question' => 'Just exploring']);
        Lead::create(['name' => 'Bob', 'mobile' => '0502222222', 'question' => 'Off-plan financing']);

        $this->actingAs(User::factory()->create())
            ->get('/dashboard/leads?search=Bob')
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Leads')
                ->has('leads.data', 1)
                ->where('leads.data.0.name', 'Bob')
                ->where('stats.total', 2));
    }

    public function test_admin_can_export_and_delete_leads(): void
    {
        $lead = Lead::create(['name' => 'Alice', 'mobile' => '0501111111', 'question' => 'Just exploring']);
        $admin = User::factory()->create();

        $csv = $this->actingAs($admin)->get('/dashboard/leads/export');
        $csv->assertOk();
        $this->assertStringContainsString('Alice', $csv->streamedContent());

        $this->actingAs($admin)->delete("/dashboard/leads/{$lead->id}")->assertRedirect();
        $this->assertDatabaseCount('leads', 0);
    }

    public function test_admin_can_update_content_and_image(): void
    {
        Storage::fake('public');

        $payload = [
            ...PageContent::defaults(),
            'title' => 'New Title',
            'details' => ['Date: today', ''],
            'question_options' => ['Option A', 'Option B', ''],
            'image' => UploadedFile::fake()->image('hero.jpg', 800, 560),
        ];

        $this->actingAs(User::factory()->create())
            ->post('/dashboard/content', $payload)
            ->assertRedirect()
            ->assertSessionHasNoErrors();

        $props = PageContent::current()->toPageProps();
        $this->assertSame('New Title', $props['title']);
        $this->assertSame(['Date: today'], $props['details']);
        $this->assertSame(['Option A', 'Option B'], $props['question_options']);
        Storage::disk('public')->assertExists(PageContent::current()->image_path);

        // The lead form now only accepts the new options.
        $this->post('/leads', ['name' => 'X', 'mobile' => '0501234567', 'question' => 'Just exploring'])
            ->assertSessionHasErrors('question');
    }
}
