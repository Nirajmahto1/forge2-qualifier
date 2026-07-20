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
  { id: 3, board_id: 1, name: 'Hermes Agent', email: 'hermes@agent.local', avatar_color: '#8b5cf6' },
];

const MOCK_TAGS = [
  { id: 1, name: 'Backend', color: '#ef4444' },
  { id: 2, name: 'Frontend', color: '#3b82f6' },
  { id: 3, name: 'Bug', color: '#f59e0b' },
  { id: 4, name: 'Feature', color: '#10b981' },
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
    due_date: '2026-07-20 10:00:00',
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
    due_date: '2026-07-25 18:00:00',
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
    due_date: '2026-07-22 12:00:00',
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
    due_date: '2026-07-19 15:00:00',
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
  const [usingMock, setUsingMock] = useState(false);

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
      setUsingMock(false);
    } catch (err) {
      console.warn("Backend API not reachable; operating in live demonstration mode:", err);
      setUsingMock(true);
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
    } catch (err) {
      console.warn("Using local board fallback state");
    }
  };

  const handleSelectBoard = (boardId) => {
    if (usingMock) {
      const found = boards.find(b => b.id === boardId);
      if (found) setActiveBoard(found);
    } else {
      loadBoardDetails(boardId);
    }
  };

  const handleCreateBoard = async () => {
    const name = prompt("Enter new board name:");
    if (!name || !name.trim()) return;
    if (usingMock) {
      const newBoard = { id: Date.now(), name: name.trim(), description: 'New Kanban Board' };
      setBoards([...boards, newBoard]);
      setActiveBoard(newBoard);
      setLists([]);
      setCards([]);
    } else {
      try {
        const created = await api.createBoard({ name: name.trim() });
        setBoards([...boards, created]);
        await loadBoardDetails(created.id);
      } catch (err) {
        alert("Failed to create board: " + err.message);
      }
    }
  };

  const handleAddList = async (title) => {
    if (!activeBoard) return;
    if (usingMock) {
      const newList = { id: Date.now(), board_id: activeBoard.id, name: title, position: lists.length };
      setLists([...lists, newList]);
    } else {
      try {
        const newList = await api.createList(activeBoard.id, { name: title, position: lists.length });
        newList.cards = [];
        setLists([...lists, newList]);
      } catch (err) {
        alert("Failed to create list: " + err.message);
      }
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this list and all its cards?")) return;
    if (usingMock) {
      setLists(lists.filter(l => l.id !== listId));
      setCards(cards.filter(c => c.board_list_id !== listId));
    } else {
      try {
        await api.deleteList(listId);
        setLists(lists.filter(l => l.id !== listId));
        setCards(cards.filter(c => c.board_list_id !== listId));
      } catch (err) {
        alert("Failed to delete list: " + err.message);
      }
    }
  };

  const handleAddCard = async (listId, cardData) => {
    if (usingMock) {
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
      setCards([...cards, newCard]);
    } else {
      try {
        const listCards = cards.filter(c => c.board_list_id === listId);
        const createdCard = await api.createCard(listId, { ...cardData, position: listCards.length });
        setCards([...cards, createdCard]);
      } catch (err) {
        alert("Failed to create card: " + err.message);
      }
    }
  };

  const handleUpdateCard = async (cardId, updatedData) => {
    if (usingMock) {
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
      setCards(cards.map(c => c.id === cardId ? updatedCard : c));
    } else {
      try {
        const updated = await api.updateCard(cardId, updatedData);
        setCards(cards.map(c => c.id === cardId ? updated : c));
      } catch (err) {
        alert("Failed to update card: " + err.message);
      }
    }
  };

  const handleMoveCard = async (cardId, newListId) => {
    if (usingMock) {
      setCards(cards.map(c => c.id === cardId ? { ...c, board_list_id: newListId } : c));
    } else {
      try {
        const updated = await api.moveCard(cardId, newListId, 0);
        setCards(cards.map(c => c.id === cardId ? updated : c));
      } catch (err) {
        alert("Failed to move card: " + err.message);
      }
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (usingMock) {
      setCards(cards.filter(c => c.id !== cardId));
    } else {
      try {
        await api.deleteCard(cardId);
        setCards(cards.filter(c => c.id !== cardId));
      } catch (err) {
        alert("Failed to delete card: " + err.message);
      }
    }
  };

  const handleAddMember = async (memberData) => {
    if (!activeBoard) return;
    if (usingMock) {
      const newMember = { id: Date.now(), board_id: activeBoard.id, ...memberData };
      setMembers([...members, newMember]);
    } else {
      try {
        const created = await api.createMember(activeBoard.id, memberData);
        setMembers([...members, created]);
      } catch (err) {
        alert("Failed to add member: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="full-page-center">
        <div className="loading-spinner"></div>
        <p>Loading Forge Kanban Application...</p>
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
