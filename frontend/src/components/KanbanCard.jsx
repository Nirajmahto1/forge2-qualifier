import React from 'react';
import { Calendar, AlertCircle, MessageSquare, Tag as TagIcon, User } from 'lucide-react';

export default function KanbanCard({ card, onClick, lists, onMoveCard }) {
  const isOverdue = card.due_date && new Date(card.due_date) < new Date() && card.status !== 'Done';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`kanban-card ${isOverdue ? 'card-overdue' : ''}`} onClick={() => onClick(card)}>
      {/* Tag Badges */}
      {card.tags && card.tags.length > 0 && (
        <div className="card-tags">
          {card.tags.map((tag) => (
            <span 
              key={tag.id} 
              className="tag-badge" 
              style={{ backgroundColor: tag.color || '#3b82f6' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Card Title */}
      <h3 className="card-title">{card.title}</h3>

      {/* Card Description Excerpt */}
      {card.description && (
        <p className="card-description-excerpt">{card.description}</p>
      )}

      {/* Card Metadata Footer */}
      <div className="card-footer">
        <div className="card-meta-left">
          {/* Due Date & Overdue Indicator */}
          {card.due_date && (
            <div className={`date-badge ${isOverdue ? 'badge-overdue' : 'badge-normal'}`}>
              {isOverdue ? <AlertCircle size={13} /> : <Calendar size={13} />}
              <span>{formatDate(card.due_date)}</span>
              {isOverdue && <span className="overdue-label">OVERDUE</span>}
            </div>
          )}

          {/* Comments count */}
          {card.comments_count > 0 && (
            <div className="comments-badge">
              <MessageSquare size={13} />
              <span>{card.comments_count}</span>
            </div>
          )}
        </div>

        <div className="card-meta-right">
          {/* Assigned Member Avatar */}
          {card.assigned_member ? (
            <div 
              className="member-avatar" 
              style={{ backgroundColor: card.assigned_member.avatar_color || '#10b981' }}
              title={`Assigned to ${card.assigned_member.name}`}
            >
              {card.assigned_member.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="unassigned-avatar" title="Unassigned">
              <User size={13} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Move Selector */}
      {lists && lists.length > 1 && (
        <div className="card-quick-move" onClick={(e) => e.stopPropagation()}>
          <select 
            value={card.board_list_id} 
            onChange={(e) => onMoveCard(card.id, Number(e.target.value))}
            className="quick-move-select"
          >
            {lists.map(list => (
              <option key={list.id} value={list.id}>
                Move to {list.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
