<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'board_list_id',
        'title',
        'description',
        'position',
        'due_date',
        'assigned_member_id',
    ];

    protected $with = ['tags', 'assignedMember'];
    protected $appends = ['comments_count'];

    public function boardList()
    {
        return $this->belongsTo(BoardList::class);
    }

    public function assignedMember()
    {
        return $this->belongsTo(Member::class, 'assigned_member_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->orderBy('created_at', 'asc');
    }

    public function getCommentsCountAttribute()
    {
        return $this->comments()->count();
    }
}
