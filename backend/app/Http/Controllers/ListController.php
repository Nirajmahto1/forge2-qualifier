<?php

namespace App\Http\Controllers;

use App\Models\BoardList;
use Illuminate\Http\Request;

class ListController extends Controller
{
    public function store(Request $request, $boardId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'nullable|integer',
        ]);

        $list = BoardList::create([
            'board_id' => $boardId,
            'name' => $validated['name'],
            'position' => $validated['position'] ?? 0,
        ]);

        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {
        $list = BoardList::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'position' => 'sometimes|integer',
        ]);

        $list->update($validated);
        return response()->json($list);
    }

    public function destroy($id)
    {
        $list = BoardList::findOrFail($id);
        $list->delete();
        return response()->json(['message' => 'List deleted successfully']);
    }
}
