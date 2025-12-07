import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import UserListItem from './UserListItem';

const UserList = ({ users, onUserUpdated }) => {
  const [editingUserId, setEditingUserId] = useState(null);

  const handleEdit = (userId) => {
    setEditingUserId(userId === editingUserId ? null : userId);
  };
  
  if (users.length === 0) {
    return <p className="text-center text-gray-400 py-8">No users found.</p>;
  }

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      <AnimatePresence>
        {users.map(user => (
          <UserListItem
            key={user.id}
            user={user}
            isEditing={editingUserId === user.id}
            onEdit={handleEdit}
            onUserUpdated={onUserUpdated}
            onCancelEdit={() => setEditingUserId(null)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UserList;