<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($cardId)
    {
        return response()->json(Comment::where('card_id', $cardId)->orderBy('created_at', 'asc')->get());
    }

    public function store(Request $request, $cardId)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'card_id' => $cardId,
            'author_name' => $validated['author_name'],
            'content' => $validated['content'],
        ]);

        return response()->json($comment, 201);
    }
}
