<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Feedback; // Make sure to include the Feedback model

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'email' => 'required|email|max:255',
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'message_type' => 'string',
        ]);

        // Create the message
        $message = Message::create($validatedData);

        // Check if the message type is 'feedback' and create a feedback entry
        if ($validatedData['message_type'] === 'feedback') {
            Feedback::create([
                'message_id' => $message->id,
                'publish' => false, // Set to false or true based on your requirements
            ]);
        }

        return response()->json($message, 201);
    }

    public function index()
    {
        $messages = Message::all();

        return response()->json($messages);
    }
}
