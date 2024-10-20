import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { RootState } from '../../store/store';

export default function Home() {
  let user = useAppSelector((state: RootState) => state.user);
  return (
    <div>
      <h2>Home Page</h2>
      {user.isAuthenticated ? (
        <div>
          <h3>User Information:</h3>
          <p>UID: {user.uid}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>
            Name: {user.firstName} {user.lastName}
          </p>
          <p>Phone: {user.phoneNumber}</p>
        </div>
      ) : (
        <p>No user is currently logged in.</p>
      )}
    </div>
  );
}
