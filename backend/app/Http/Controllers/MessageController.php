<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

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

        $message = Message::create($validatedData);

        return response()->json($message, 201);
    }

    public function index()
    {
        $messages = Message::all();

        return response()->json($messages);
    }
}
