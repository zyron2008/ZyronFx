import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      let users = JSON.parse(localStorage.getItem('users'));
      if (!users) {
        users = [{
          id: 1,
          username: 'admin',
          password: 'admin',
          role: 'admin',
          mustChangePassword: true
        }];
        localStorage.setItem('users', JSON.stringify(users));
      }

      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));
      if (loggedInUser) {
        const fullUser = users.find(u => u.id === loggedInUser.id);
        if (fullUser) {
          setUser(fullUser);
        }
      }
    };
    initializeAuth();
  }, []);

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('user', JSON.stringify(foundUser));
      return foundUser;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(users));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = { user, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};