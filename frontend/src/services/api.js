const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://forge-kanban-api-mq9r.onrender.com/api';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error ${response.status}: ${response.statusText}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch (e) {
      // Keep error text if not json
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Boards
  getBoards: () => request('/boards'),
  getBoard: (id) => request(`/boards/${id}`),
  createBoard: (data) => request('/boards', { method: 'POST', body: data }),
  
  // Lists
  createList: (boardId, data) => request(`/boards/${boardId}/lists`, { method: 'POST', body: data }),
  updateList: (listId, data) => request(`/lists/${listId}`, { method: 'PUT', body: data }),
  deleteList: (listId) => request(`/lists/${listId}`, { method: 'DELETE' }),

  // Cards
  createCard: (listId, data) => request(`/lists/${listId}/cards`, { method: 'POST', body: data }),
  getCard: (cardId) => request(`/cards/${cardId}`),
  updateCard: (cardId, data) => request(`/cards/${cardId}`, { method: 'PUT', body: data }),
  moveCard: (cardId, listId, position) => request(`/cards/${cardId}/move`, { method: 'POST', body: { list_id: listId, position } }),
  deleteCard: (cardId) => request(`/cards/${cardId}`, { method: 'DELETE' }),

  // Members
  getMembers: (boardId) => request(`/boards/${boardId}/members`),
  createMember: (boardId, data) => request(`/boards/${boardId}/members`, { method: 'POST', body: data }),

  // Tags
  getTags: () => request('/tags'),
  createTag: (data) => request('/tags', { method: 'POST', body: data }),
  assignTag: (cardId, tagId) => request(`/cards/${cardId}/tags`, { method: 'POST', body: { tag_id: tagId } }),
  removeTag: (cardId, tagId) => request(`/cards/${cardId}/tags/${tagId}`, { method: 'DELETE' }),

  // Comments
  getComments: (cardId) => request(`/cards/${cardId}/comments`),
  addComment: (cardId, data) => request(`/cards/${cardId}/comments`, { method: 'POST', body: data }),
};
