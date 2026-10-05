<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Dashboard\ContentController;
use App\Http\Controllers\Dashboard\LeadController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'show'])->name('landing');
Route::post('/leads', [LandingController::class, 'storeLead'])
    ->middleware('throttle:10,1')
    ->name('leads.store');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store'])->middleware('throttle:5,1');
});

Route::middleware('auth')->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::redirect('/', '/dashboard/leads')->name('home');

    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/export', [LeadController::class, 'export'])->name('leads.export');
    Route::patch('/leads/{lead}/read', [LeadController::class, 'markRead'])->name('leads.read');
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');

    Route::get('/content', [ContentController::class, 'edit'])->name('content.edit');
    Route::post('/content', [ContentController::class, 'update'])->name('content.update');
});

Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth')->name('logout');
