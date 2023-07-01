import React from 'react';

export default function UserHome(props) {
  return (
    <div>
      <h1>Welcome, {props.username}!</h1>
      <p>This is your user home page.</p>
    </div>
  );
}

