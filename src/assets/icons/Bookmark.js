import React from 'react';

export default function Bookmark({ color = 'black', size = 18, fill = false }) {
  if (fill) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
      >
        <path d="M17 3a1 1 0 0 1 1 1v18.143a.5.5 0 0 1-.766.424L12 18.286l-5.234 3.281A.5.5 0 0 1 6 22.143V4a1 1 0 0 1 1-1h10z" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1zm13 2H6v15.432l6-3.761 6 3.761V4z" />
    </svg>
  );
}