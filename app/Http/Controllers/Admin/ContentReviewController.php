<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class ContentReviewController extends Controller
{
    public function index()
    {
        $pendingEvents = Event::where('status', 'pending')->with('crawlSource')->get();
        return view('admin.review.index', compact('pendingEvents'));
    }

    public function approve($eventId)
    {
        $this->updateStatus($eventId, 'approved');
        return redirect()->route('admin.review.index')->with('success', 'Event approved successfully.');
    }

    public function reject($eventId)
    {
        $this->updateStatus($eventId, 'rejected');
        return redirect()->route('admin.review.index')->with('success', 'Event rejected successfully.');
    }

    private function updateStatus($eventId, $status)
    {
        $event = Event::findOrFail($eventId);
        $event->status = $status;
        $event->save();
    }
}
