import { db, onSnapshot, collection } from '../firebase';

export const fetchUsers = (setUsers: (users: any[]) => void) => {
  const usersRef = collection(db, 'users');
  return onSnapshot(usersRef, (snapshot) => {
    const usersData = snapshot.docs.map((doc) => doc.data());
    setUsers(usersData);
  });
};
