import React, { useState } from 'react';
import KanbanCard from './KanbanCard';
import { Plus, X, Trash2 } from 'lucide-react';

export default function KanbanList({ list, cards, lists, onCardClick, onAddCard, onDeleteList, onMoveCard }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCard(list.id, { title: newTitle.trim(), description: newDescription.trim() });
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <div className="kanban-list-column">
      <div className="list-header">
        <div className="list-title-group">
          <h2 className="list-name">{list.name}</h2>
          <span className="card-counter">{cards.length}</span>
        </div>
        <button 
          onClick={() => onDeleteList(list.id)} 
          className="btn-ghost btn-icon-only text-danger"
          title="Delete List"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="list-cards-container">
        {cards.map((card) => (
          <KanbanCard 
            key={card.id} 
            card={card} 
            onClick={onCardClick} 
            lists={lists}
            onMoveCard={onMoveCard}
          />
        ))}

        {isAdding ? (
          <form onSubmit={handleCreate} className="add-card-form">
            <input 
              type="text" 
              placeholder="Card title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="form-input"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="form-textarea"
              rows={2}
            />
            <div className="form-actions">
              <button type="submit" className="btn-primary btn-sm">Add Card</button>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                className="btn-secondary btn-sm btn-icon-only"
              >
                <X size={16} />
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setIsAdding(true)} className="btn-add-card">
            <Plus size={16} />
            <span>Add Card</span>
          </button>
        )}
      </div>
    </div>
  );
}
