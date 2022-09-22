import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Store } from '../Store';

export default function SellerRoutes({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? (
    userInfo.isSeller ? (
      children
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <Navigate to="/login" />
  );
}
