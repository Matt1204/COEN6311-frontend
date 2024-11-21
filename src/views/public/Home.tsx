import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { RootState } from '../../store/store';
import { useDemoRequestQuery } from '../../store/apiSlices/apiSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export default function Home() {
  let user = useAppSelector((state: RootState) => state.user);
  // auto-revoked when re-render OR parameter changes
  const { data: demoRes, error: demoErr, refetch, ...demoQueryOthers } = useDemoRequestQuery({});

  useEffect(() => {
    // console.log('demoErr update:');
    // console.log(demoErr);
    // if (demoErr && 'originalStatus' in demoErr) {
    //   // A type guard for FetchBaseQueryError
    //   // console.log('Original status:', (demoErr as FetchBaseQueryError).status);
    //   console.log(demoErr?.originalStatus);
    // }
  }, [demoErr]);
  useEffect(() => {
    console.log('demoRes update:');
    console.log(demoRes);
  }, [demoRes]);

  let renders = user.accessToken ? (
    <div>
      <h3>userSlice:</h3>
      <p>
        uId: {user.uId} {`(${typeof user.uId})`}
      </p>
      <p>email: {user.email}</p>
      <p>role: {user.role}</p>
      <p>firstName: {user.firstName}</p>
      <p>lasstName: {user.lastName}</p>
      <p>accessToken: {user.accessToken}</p>
    </div>
  ) : (
    <p>No user is currently logged in. (empty AT)</p>
  );

  return (
    <>
      <h1>Home page(public, for debugging) </h1>
      {renders}
      <hr />
      <button onClick={() => refetch()}>send demo request</button>
    </>
  );
}
