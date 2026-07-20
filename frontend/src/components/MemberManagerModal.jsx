import React, { useState } from 'react';
import { X, UserPlus, Mail, User } from 'lucide-react';

export default function MemberManagerModal({ members, onClose, onAddMember }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const avatarColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    onAddMember({ name: name.trim(), email: email.trim(), avatar_color: randomColor });
    setName('');
    setEmail('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <UserPlus size={20} />
            <h2>Board Members</h2>
          </div>
          <button onClick={onClose} className="btn-ghost btn-icon-only">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="add-member-form">
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
              <input 
                type="email" 
                placeholder="Email (optional)" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn-primary btn-sm">Add</button>
            </div>
          </form>

          <div className="members-list">
            <h3>Current Team ({members.length})</h3>
            {members.map(member => (
              <div key={member.id} className="member-row">
                <div className="member-info">
                  <div 
                    className="member-avatar-lg" 
                    style={{ backgroundColor: member.avatar_color || '#3b82f6' }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="member-name">{member.name}</h4>
                    {member.email && <p className="member-email">{member.email}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
