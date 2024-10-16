import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { RootState } from '../../store/store';

export default function Home() {
  let loginUser = useAppSelector((state: RootState) => state.user);
  return (
    <>
      {Object.values(loginUser).map(item => {
        return <p>{item}</p>;
      })}
    </>
  );
}
