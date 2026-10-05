<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PageContent extends Model
{
    protected $fillable = ['content', 'image_path'];

    protected function casts(): array
    {
        return [
            'content' => 'array',
        ];
    }

    /**
     * Default content used when nothing has been saved from the dashboard yet.
     *
     * @return array<string, mixed>
     */
    public static function defaults(): array
    {
        return [
            'brand_name' => 'Open House',
            'header_phone' => '+971 4 000 0000',
            'back_link_text' => 'Back to all offers',
            'back_link_url' => '#',
            'title' => 'Open House by Emaar',
            'description' => "Direct access. See it up close. Finance it on the spot.\nMeet our team, explore recent launches, and discover off-plan financing now built into the buying process.",
            'details_label' => 'Details:',
            'details' => [
                'Date: 5 September, 2026 (Saturday)',
                'Time: 9:30 AM to 7 PM',
                'Location: Dubai Hills Estate Sales Centre',
            ],
            'button_text' => 'Register now',
            'form_title' => 'Register your interest',
            'form_subtitle' => 'Leave your details and our team will get in touch to confirm your visit.',
            'question_label' => 'What are you interested in?',
            'question_options' => [
                'Buying a home to live in',
                'Investment property',
                'Off-plan financing',
                'Just exploring',
            ],
            'submit_text' => 'Submit',
            'success_message' => 'Thank you! Your registration has been received. Our team will contact you shortly.',
            'footer_text' => '© '.date('Y').' Open House. All rights reserved.',
        ];
    }

    /**
     * The single page content record, created with defaults when missing.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([], ['content' => static::defaults()]);
    }

    /**
     * Saved content merged over defaults, plus the resolved image URL.
     *
     * @return array<string, mixed>
     */
    public function toPageProps(): array
    {
        return [
            ...static::defaults(),
            ...($this->content ?? []),
            'image_url' => $this->image_path
                ? Storage::disk('public')->url($this->image_path)
                : asset('images/open-house.jpg'),
        ];
    }
}
