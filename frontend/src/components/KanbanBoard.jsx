import React, { useState } from 'react';
import KanbanList from './KanbanList';
import { Plus } from 'lucide-react';

export default function KanbanBoard({ 
  board, 
  lists, 
  cards, 
  onAddList, 
  onDeleteList, 
  onAddCard, 
  onCardClick, 
  onMoveCard 
}) {
  const [newListTitle, setNewListTitle] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onAddList(newListTitle.trim());
    setNewListTitle('');
    setIsAddingList(false);
  };

  return (
    <div className="kanban-board-wrapper">
      <div className="kanban-columns">
        {lists.map((list) => {
          const listCards = cards.filter(card => card.board_list_id === list.id);
          return (
            <KanbanList
              key={list.id}
              list={list}
              cards={listCards}
              lists={lists}
              onCardClick={onCardClick}
              onAddCard={onAddCard}
              onDeleteList={onDeleteList}
              onMoveCard={onMoveCard}
            />
          );
        })}

        <div className="add-list-column">
          {isAddingList ? (
            <form onSubmit={handleCreateList} className="add-list-form">
              <input 
                type="text" 
                placeholder="Enter list title..." 
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="form-input"
                autoFocus
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary btn-sm">Add List</button>
                <button 
                  type="button" 
                  onClick={() => setIsAddingList(false)} 
                  className="btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsAddingList(true)} className="btn-add-list">
              <Plus size={18} />
              <span>Add another list</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
