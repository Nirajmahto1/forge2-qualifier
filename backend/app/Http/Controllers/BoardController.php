<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index()
    {
        return response()->json(Board::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board = Board::create($validated);
        return response()->json($board, 201);
    }

    public function show($id)
    {
        $board = Board::with(['lists.cards.tags', 'lists.cards.assignedMember', 'members'])->findOrFail($id);
        return response()->json($board);
    }

    public function update(Request $request, $id)
    {
        $board = Board::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $board->update($validated);
        return response()->json($board);
    }

    public function destroy($id)
    {
        $board = Board::findOrFail($id);
        $board->delete();
        return response()->json(['message' => 'Board deleted successfully']);
    }
}
