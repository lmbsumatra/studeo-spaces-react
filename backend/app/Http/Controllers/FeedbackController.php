<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function index()
    {
        // Fetch all feedbacks with their messages in descending order by created_at
        $feedbacks = Feedback::with('message')->orderBy('created_at', 'desc')->get();

        return response()->json($feedbacks);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'message_id' => 'required|exists:messages,id',
            'publish' => 'required|boolean',
        ]);

        $feedback = Feedback::create($validated);
        return response()->json($feedback, 201);
    }

    public function show($id)
    {
        $feedback = Feedback::with('message')->findOrFail($id);
        return response()->json($feedback);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'publish' => 'required|boolean', // Ensure this is required
        ]);

        $feedback = Feedback::findOrFail($id);
        $feedback->publish = $validated['publish'];
        $feedback->save();

        return response()->json($feedback);
    }


    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        return response()->json(null, 204);
    }
}
