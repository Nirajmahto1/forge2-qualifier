import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import CardDetailModal from './components/CardDetailModal';
import MemberManagerModal from './components/MemberManagerModal';
import { api } from './services/api';

export default function App() {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [tags, setTags] = useState([]);
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const boardsList = await api.getBoards();
      setBoards(boardsList);

      if (boardsList.length > 0) {
        await loadBoardDetails(boardsList[0].id);
      } else {
        const newBoard = await api.createBoard({ name: 'Forge 2 Qualifier Sprint' });
        setBoards([newBoard]);
        await loadBoardDetails(newBoard.id);
      }

      const tagsList = await api.getTags();
      setTags(tagsList);
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setError("Unable to connect to backend API. Please make sure Laravel is running on http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  const loadBoardDetails = async (boardId) => {
    try {
      const boardData = await api.getBoard(boardId);
      setActiveBoard(boardData);
      setLists(boardData.lists || []);
      
      // Extract all cards from board lists
      const allCards = (boardData.lists || []).flatMap(l => l.cards || []);
      setCards(allCards);

      const boardMembers = await api.getMembers(boardId);
      setMembers(boardMembers);
    } catch (err) {
      console.error("Failed to load board details:", err);
    }
  };

  const handleSelectBoard = (boardId) => {
    loadBoardDetails(boardId);
  };

  const handleCreateBoard = async () => {
    const name = prompt("Enter new board name:");
    if (!name || !name.trim()) return;
    try {
      const created = await api.createBoard({ name: name.trim() });
      setBoards([...boards, created]);
      await loadBoardDetails(created.id);
    } catch (err) {
      alert("Failed to create board: " + err.message);
    }
  };

  const handleAddList = async (title) => {
    if (!activeBoard) return;
    try {
      const newList = await api.createList(activeBoard.id, { name: title, position: lists.length });
      newList.cards = [];
      setLists([...lists, newList]);
    } catch (err) {
      alert("Failed to create list: " + err.message);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this list and all its cards?")) return;
    try {
      await api.deleteList(listId);
      setLists(lists.filter(l => l.id !== listId));
      setCards(cards.filter(c => c.board_list_id !== listId));
    } catch (err) {
      alert("Failed to delete list: " + err.message);
    }
  };

  const handleAddCard = async (listId, cardData) => {
    try {
      const listCards = cards.filter(c => c.board_list_id === listId);
      const createdCard = await api.createCard(listId, { ...cardData, position: listCards.length });
      setCards([...cards, createdCard]);
    } catch (err) {
      alert("Failed to create card: " + err.message);
    }
  };

  const handleUpdateCard = async (cardId, updatedData) => {
    try {
      const updated = await api.updateCard(cardId, updatedData);
      setCards(cards.map(c => c.id === cardId ? updated : c));
    } catch (err) {
      alert("Failed to update card: " + err.message);
    }
  };

  const handleMoveCard = async (cardId, newListId) => {
    try {
      const updated = await api.moveCard(cardId, newListId, 0);
      setCards(cards.map(c => c.id === cardId ? updated : c));
    } catch (err) {
      alert("Failed to move card: " + err.message);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.deleteCard(cardId);
      setCards(cards.filter(c => c.id !== cardId));
    } catch (err) {
      alert("Failed to delete card: " + err.message);
    }
  };

  const handleAddMember = async (memberData) => {
    if (!activeBoard) return;
    try {
      const created = await api.createMember(activeBoard.id, memberData);
      setMembers([...members, created]);
    } catch (err) {
      alert("Failed to add member: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="full-page-center">
        <div className="loading-spinner"></div>
        <p>Connecting to Forge Kanban Backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-page-center error-page">
        <div className="error-box">
          <h2>⚠️ Backend Connection Error</h2>
          <p>{error}</p>
          <button onClick={loadInitialData} className="btn-primary mt-4">Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar 
        boards={boards}
        activeBoard={activeBoard}
        onSelectBoard={handleSelectBoard}
        onCreateBoard={handleCreateBoard}
        onOpenMembers={() => setShowMemberModal(true)}
      />

      <main className="main-board-area">
        <KanbanBoard 
          board={activeBoard}
          lists={lists}
          cards={cards}
          onAddList={handleAddList}
          onDeleteList={handleDeleteList}
          onAddCard={handleAddCard}
          onCardClick={(card) => setSelectedCard(card)}
          onMoveCard={handleMoveCard}
        />
      </main>

      {selectedCard && (
        <CardDetailModal 
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onUpdateCard={handleUpdateCard}
          onDeleteCard={handleDeleteCard}
          members={members}
          availableTags={tags}
        />
      )}

      {showMemberModal && (
        <MemberManagerModal 
          members={members}
          onClose={() => setShowMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}
    </div>
  );
}
