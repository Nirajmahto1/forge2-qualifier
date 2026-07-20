<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function store(Request $request, $listId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'nullable|integer',
            'due_date' => 'nullable|date',
            'assigned_member_id' => 'nullable|exists:members,id',
        ]);

        $card = Card::create([
            'board_list_id' => $listId,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'position' => $validated['position'] ?? 0,
            'due_date' => $validated['due_date'] ?? null,
            'assigned_member_id' => $validated['assigned_member_id'] ?? null,
        ]);

        return response()->json($card->load(['tags', 'assignedMember']), 201);
    }

    public function show($id)
    {
        $card = Card::with(['tags', 'assignedMember', 'comments'])->findOrFail($id);
        return response()->json($card);
    }

    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'position' => 'sometimes|integer',
            'due_date' => 'nullable|date',
            'assigned_member_id' => 'nullable|exists:members,id',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $card->update($validated);

        if (array_key_exists('tag_ids', $validated)) {
            $card->tags()->sync($validated['tag_ids'] ?? []);
        }

        return response()->json($card->load(['tags', 'assignedMember']));
    }

    public function move(Request $request, $id)
    {
        $card = Card::findOrFail($id);
        $validated = $request->validate([
            'list_id' => 'required|exists:board_lists,id',
            'position' => 'nullable|integer',
        ]);

        $card->board_list_id = $validated['list_id'];
        if (isset($validated['position'])) {
            $card->position = $validated['position'];
        }
        $card->save();

        return response()->json($card->load(['tags', 'assignedMember']));
    }

    public function destroy($id)
    {
        $card = Card::findOrFail($id);
        $card->delete();
        return response()->json(['message' => 'Card deleted successfully']);
    }
}
