import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../util/fetchUsers';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = fetchUsers(setUsers);
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <div className='user-list'>
      <h3>Logged-in Players: {users.length}</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name || 'Unknown Player'}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
