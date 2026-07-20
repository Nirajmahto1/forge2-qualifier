<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index($boardId)
    {
        return response()->json(Member::where('board_id', $boardId)->get());
    }

    public function store(Request $request, $boardId)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'avatar_color' => 'nullable|string',
        ]);

        $member = Member::create([
            'board_id' => $boardId,
            'name' => $validated['name'],
            'email' => $validated['email'] ?? null,
            'avatar_color' => $validated['avatar_color'] ?? '#3b82f6',
        ]);

        return response()->json($member, 201);
    }
}
