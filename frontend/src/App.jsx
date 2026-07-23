import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KanbanBoard from './components/KanbanBoard';
import CardDetailModal from './components/CardDetailModal';
import MemberManagerModal from './components/MemberManagerModal';
import { api } from './services/api';

const MOCK_BOARD = {
  id: 1,
  name: 'Forge 2 Qualifier Sprint',
  description: 'Main development board for two-agent system qualification project.',
};

const MOCK_MEMBERS = [
  { id: 1, board_id: 1, name: 'Niraj Mahto', email: 'itsnirajmahto@gmail.com', avatar_color: '#3b82f6' },
  { id: 2, board_id: 1, name: 'Priya Sharma', email: 'priya@example.com', avatar_color: '#10b981' },
  { id: 3, board_id: 1, name: 'Hermes Agent', email: 'hermes@agent.ai', avatar_color: '#8b5cf6' },
];

const MOCK_TAGS = [
  { id: 1, name: 'Backend', color: '#ef4444' },
  { id: 2, name: 'Frontend', color: '#3b82f6' },
  { id: 3, name: 'Feature', color: '#10b981' },
  { id: 4, name: 'Bug', color: '#f59e0b' },
  { id: 5, name: 'DevOps', color: '#8b5cf6' },
];

const MOCK_LISTS = [
  { id: 1, board_id: 1, name: 'To-Do', position: 0 },
  { id: 2, board_id: 1, name: 'In Progress', position: 1 },
  { id: 3, board_id: 1, name: 'Done', position: 2 },
];

const MOCK_CARDS = [
  {
    id: 1,
    board_list_id: 1,
    title: 'Implement Overdue Cards Notification',
    description: 'Add visual highlights and warning badges for cards past their due date.',
    position: 0,
    due_date: '2026-07-21 10:00:00',
    assigned_member_id: 1,
    assigned_member: MOCK_MEMBERS[0],
    tags: [MOCK_TAGS[1], MOCK_TAGS[3]],
    comments_count: 0,
  },
  {
    id: 2,
    board_list_id: 1,
    title: 'Setup CORS & API Throttle Middleware',
    description: 'Configure REST API headers to permit cross-origin requests from React Vite frontend.',
    position: 1,
    due_date: '2026-07-28 18:00:00',
    assigned_member_id: 2,
    assigned_member: MOCK_MEMBERS[1],
    tags: [MOCK_TAGS[0]],
    comments_count: 0,
  },
  {
    id: 3,
    board_list_id: 2,
    title: 'Build React Vite Kanban Drag & Drop UI',
    description: 'Interactive board layout with custom color tags, member avatars, and inline status updates.',
    position: 0,
    due_date: '2026-07-26 12:00:00',
    assigned_member_id: 1,
    assigned_member: MOCK_MEMBERS[0],
    tags: [MOCK_TAGS[1], MOCK_TAGS[3]],
    comments_count: 1,
  },
  {
    id: 4,
    board_list_id: 3,
    title: 'Wire OpenClaw & Hermes to Slack Socket Mode',
    description: 'Configure Slack bot tokens (xoxb/xapp) and verify roundtrip messaging API.',
    position: 0,
    due_date: '2026-07-22 15:00:00',
    assigned_member_id: 3,
    assigned_member: MOCK_MEMBERS[2],
    tags: [MOCK_TAGS[4]],
    comments_count: 1,
  },
];

export default function App() {
  const [boards, setBoards] = useState([MOCK_BOARD]);
  const [activeBoard, setActiveBoard] = useState(MOCK_BOARD);
  const [lists, setLists] = useState(MOCK_LISTS);
  const [cards, setCards] = useState(MOCK_CARDS);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [tags, setTags] = useState(MOCK_TAGS);
  
  const [selectedCard, setSelectedCard] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const boardsList = await api.getBoards();
      setBoards(boardsList);

      if (boardsList.length > 0) {
        await loadBoardDetails(boardsList[0].id);
      }
      const tagsList = await api.getTags();
      setTags(tagsList);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Backend API cold start; operating with fallback board until live sync:", err);
      setIsLiveConnected(false);
      setBoards([MOCK_BOARD]);
      setActiveBoard(MOCK_BOARD);
      setLists(MOCK_LISTS);
      setCards(MOCK_CARDS);
      setMembers(MOCK_MEMBERS);
      setTags(MOCK_TAGS);
    } finally {
      setLoading(false);
    }
  };

  const loadBoardDetails = async (boardId) => {
    try {
      const boardData = await api.getBoard(boardId);
      setActiveBoard(boardData);
      setLists(boardData.lists || []);
      const allCards = (boardData.lists || []).flatMap(l => l.cards || []);
      setCards(allCards);

      const boardMembers = await api.getMembers(boardId);
      setMembers(boardMembers);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Using local board fallback state:", err);
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
      setBoards(prev => [...prev, created]);
      await loadBoardDetails(created.id);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local board creation fallback:", err);
      const newBoard = { id: Date.now(), name: name.trim(), description: 'New Kanban Board' };
      setBoards(prev => [...prev, newBoard]);
      setActiveBoard(newBoard);
      setLists([]);
      setCards([]);
    }
  };

  const handleAddList = async (title) => {
    if (!activeBoard) return;
    try {
      const newList = await api.createList(activeBoard.id, { name: title, position: lists.length });
      newList.cards = [];
      setLists(prev => [...prev, newList]);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local list creation fallback:", err);
      const newList = { id: Date.now(), board_id: activeBoard.id, name: title, position: lists.length };
      setLists(prev => [...prev, newList]);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this list and all its cards?")) return;
    try {
      await api.deleteList(listId);
      setLists(prev => prev.filter(l => l.id !== listId));
      setCards(prev => prev.filter(c => c.board_list_id !== listId));
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local list delete fallback:", err);
      setLists(prev => prev.filter(l => l.id !== listId));
      setCards(prev => prev.filter(c => c.board_list_id !== listId));
    }
  };

  const handleAddCard = async (listId, cardData) => {
    try {
      const listCards = cards.filter(c => c.board_list_id === listId);
      const createdCard = await api.createCard(listId, { ...cardData, position: listCards.length });
      setCards(prev => [...prev, createdCard]);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local card creation fallback:", err);
      const listCards = cards.filter(c => c.board_list_id === listId);
      const newCard = {
        id: Date.now(),
        board_list_id: listId,
        title: cardData.title,
        description: cardData.description || '',
        position: listCards.length,
        due_date: null,
        assigned_member_id: null,
        tags: [],
        comments_count: 0,
      };
      setCards(prev => [...prev, newCard]);
    }
  };

  const handleUpdateCard = async (cardId, updatedData) => {
    try {
      const updated = await api.updateCard(cardId, updatedData);
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, ...updated } : c));
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(prev => ({ ...prev, ...updated }));
      }
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local card update fallback:", err);
      const card = cards.find(c => c.id === cardId);
      if (!card) return;
      const assigned = members.find(m => m.id === Number(updatedData.assigned_member_id));
      const cardTags = tags.filter(t => (updatedData.tag_ids || []).includes(t.id));
      const updatedCard = {
        ...card,
        title: updatedData.title,
        description: updatedData.description,
        due_date: updatedData.due_date,
        assigned_member_id: updatedData.assigned_member_id,
        assigned_member: assigned || null,
        tags: cardTags,
      };
      setCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
      if (selectedCard && selectedCard.id === cardId) {
        setSelectedCard(updatedCard);
      }
    }
  };

  const handleMoveCard = async (cardId, newListId) => {
    try {
      const updated = await api.moveCard(cardId, newListId, 0);
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, board_list_id: newListId, ...updated } : c));
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local card move fallback:", err);
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, board_list_id: newListId } : c));
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await api.deleteCard(cardId);
      setCards(prev => prev.filter(c => c.id !== cardId));
      if (selectedCard && selectedCard.id === cardId) setSelectedCard(null);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local card delete fallback:", err);
      setCards(prev => prev.filter(c => c.id !== cardId));
      if (selectedCard && selectedCard.id === cardId) setSelectedCard(null);
    }
  };

  const handleAddMember = async (memberData) => {
    if (!activeBoard) return;
    try {
      const created = await api.createMember(activeBoard.id, memberData);
      setMembers(prev => [...prev, created]);
      setIsLiveConnected(true);
    } catch (err) {
      console.warn("Local member add fallback:", err);
      const newMember = { id: Date.now(), board_id: activeBoard.id, ...memberData };
      setMembers(prev => [...prev, newMember]);
    }
  };

  if (loading) {
    return (
      <div className="full-page-center">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Connecting to Live Laravel Backend API...</p>
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
        isLiveConnected={isLiveConnected}
        onRetrySync={loadInitialData}
      />
      
      <main className="main-content">
        <KanbanBoard 
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
          members={members}
          tags={tags}
          onClose={() => setSelectedCard(null)}
          onUpdate={handleUpdateCard}
          onDelete={handleDeleteCard}
        />
      )}

      {showMemberModal && activeBoard && (
        <MemberManagerModal 
          board={activeBoard}
          members={members}
          onClose={() => setShowMemberModal(false)}
          onAddMember={handleAddMember}
        />
      )}
    </div>
  );
}
