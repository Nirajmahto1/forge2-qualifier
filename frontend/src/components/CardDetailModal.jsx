import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag as TagIcon, MessageSquare, Send, Check, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function CardDetailModal({ card, onClose, onUpdateCard, onDeleteCard, members, availableTags }) {
  const [title, setTitle] = useState(card.title || '');
  const [description, setDescription] = useState(card.description || '');
  const [dueDate, setDueDate] = useState(card.due_date ? card.due_date.substring(0, 10) : '');
  const [assignedMemberId, setAssignedMemberId] = useState(card.assigned_member_id || '');
  const [selectedTagIds, setSelectedTagIds] = useState(card.tags ? card.tags.map(t => t.id) : []);
  
  const [comments, setComments] = useState([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState('Niraj Mahto');
  const [newCommentText, setNewCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [card.id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await api.getComments(card.id);
      setComments(res);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      title,
      description,
      due_date: dueDate || null,
      assigned_member_id: assignedMemberId ? Number(assignedMemberId) : null,
      tag_ids: selectedTagIds,
    };
    await onUpdateCard(card.id, updatedData);
    onClose();
  };

  const handleToggleTag = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    try {
      const added = await api.addComment(card.id, {
        author_name: newCommentAuthor,
        content: newCommentText.trim(),
      });
      setComments([...comments, added]);
      setNewCommentText('');
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content card-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="modal-title-input"
            placeholder="Card Title"
          />
          <button onClick={onClose} className="btn-ghost btn-icon-only">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body grid-layout">
          {/* Main Content Area */}
          <div className="main-col">
            <div className="section-block">
              <label className="section-label">Description</label>
              <textarea 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a detailed description..."
                className="form-textarea"
              />
            </div>

            {/* Comments Feed */}
            <div className="section-block">
              <div className="section-header">
                <MessageSquare size={16} />
                <label className="section-label">Comments & Activity</label>
              </div>

              <form onSubmit={handleAddComment} className="comment-input-form">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  className="form-input author-input"
                />
                <div className="comment-text-row">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="form-input comment-input"
                  />
                  <button type="submit" className="btn-primary btn-sm">
                    <Send size={14} />
                  </button>
                </div>
              </form>

              <div className="comments-list">
                {comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      {comment.author_name ? comment.author_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="comment-content">
                      <div className="comment-meta">
                        <span className="comment-author">{comment.author_name}</span>
                        <span className="comment-time">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="comment-body">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="sidebar-col">
            {/* Assign Member */}
            <div className="control-group">
              <label className="control-label">
                <User size={14} /> Assignee
              </label>
              <select 
                value={assignedMemberId} 
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="form-select"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="control-group">
              <label className="control-label">
                <Calendar size={14} /> Due Date
              </label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            {/* Tags Toggle */}
            <div className="control-group">
              <label className="control-label">
                <TagIcon size={14} /> Tags / Labels
              </label>
              <div className="tags-toggle-list">
                {availableTags.map(tag => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button 
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className={`tag-toggle-btn ${isSelected ? 'selected' : ''}`}
                      style={{ backgroundColor: tag.color || '#3b82f6' }}
                    >
                      <span>{tag.name}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions-sidebar">
              <button onClick={handleSave} className="btn-primary w-full">Save Changes</button>
              <button 
                onClick={() => { onDeleteCard(card.id); onClose(); }} 
                className="btn-danger-outline w-full"
              >
                <Trash2 size={14} /> Delete Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
