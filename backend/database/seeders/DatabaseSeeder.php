<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Member;
use App\Models\Tag;
use App\Models\Card;
use App\Models\Comment;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Default Board
        $board = Board::create([
            'name' => 'Forge 2 Qualifier Sprint',
            'description' => 'Main development board for two-agent system qualification project.',
        ]);

        // 2. Create Default Members
        $m1 = Member::create([
            'board_id' => $board->id,
            'name' => 'Niraj Mahto',
            'email' => 'itsnirajmahto@gmail.com',
            'avatar_color' => '#3b82f6',
        ]);

        $m2 = Member::create([
            'board_id' => $board->id,
            'name' => 'Priya Sharma',
            'email' => 'priya@example.com',
            'avatar_color' => '#10b981',
        ]);

        $m3 = Member::create([
            'board_id' => $board->id,
            'name' => 'Hermes Agent',
            'email' => 'hermes@agent.local',
            'avatar_color' => '#8b5cf6',
        ]);

        // 3. Create Default Tags
        $tagBackend = Tag::create(['name' => 'Backend', 'color' => '#ef4444']);
        $tagFrontend = Tag::create(['name' => 'Frontend', 'color' => '#3b82f6']);
        $tagBug = Tag::create(['name' => 'Bug', 'color' => '#f59e0b']);
        $tagFeature = Tag::create(['name' => 'Feature', 'color' => '#10b981']);
        $tagDevOps = Tag::create(['name' => 'DevOps', 'color' => '#8b5cf6']);

        // 4. Create Board Lists
        $listTodo = BoardList::create(['board_id' => $board->id, 'name' => 'To-Do', 'position' => 0]);
        $listDoing = BoardList::create(['board_id' => $board->id, 'name' => 'In Progress', 'position' => 1]);
        $listDone = BoardList::create(['board_id' => $board->id, 'name' => 'Done', 'position' => 2]);

        // 5. Create Cards
        $card1 = Card::create([
            'board_list_id' => $listTodo->id,
            'title' => 'Implement Overdue Cards Notification',
            'description' => 'Add visual highlights and warning badges for cards past their due date.',
            'position' => 0,
            'due_date' => '2026-07-21 10:00:00', // Past due date relative to 2026-07-23 (OVERDUE!)
            'assigned_member_id' => $m1->id,
        ]);
        $card1->tags()->attach([$tagFrontend->id, $tagFeature->id]);

        $card2 = Card::create([
            'board_list_id' => $listTodo->id,
            'title' => 'Setup CORS & API Throttle Middleware',
            'description' => 'Configure REST API headers to permit cross-origin requests from React Vite frontend.',
            'position' => 1,
            'due_date' => '2026-07-28 18:00:00',
            'assigned_member_id' => $m2->id,
        ]);
        $card2->tags()->attach([$tagBackend->id]);

        $card3 = Card::create([
            'board_list_id' => $listDoing->id,
            'title' => 'Build React Vite Kanban Drag & Drop UI',
            'description' => 'Interactive board layout with custom color tags, member avatars, and inline status updates.',
            'position' => 0,
            'due_date' => '2026-07-26 12:00:00',
            'assigned_member_id' => $m1->id,
        ]);
        $card3->tags()->attach([$tagFrontend->id, $tagFeature->id]);

        Comment::create([
            'card_id' => $card3->id,
            'author_name' => 'Hermes Agent',
            'content' => 'Scaffolding task assigned to OpenClaw in #agent-coder. UI components created successfully.',
        ]);

        $card4 = Card::create([
            'board_list_id' => $listDone->id,
            'title' => 'Wire OpenClaw & Hermes to Slack Socket Mode',
            'description' => 'Configure Slack bot tokens (xoxb/xapp) and verify roundtrip messaging API.',
            'position' => 0,
            'due_date' => '2026-07-22 15:00:00',
            'assigned_member_id' => $m3->id,
        ]);
        $card4->tags()->attach([$tagDevOps->id]);

        Comment::create([
            'card_id' => $card4->id,
            'author_name' => 'Niraj Mahto',
            'content' => 'Verified with live curl round-trip test! auth.test and postMessage passed clean.',
        ]);
    }
}
