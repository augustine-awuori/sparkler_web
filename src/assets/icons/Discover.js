export default function Discover({ color = 'black', size = 18, fill = false }) {
  if (fill)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
      >
        <path fill="none" d="M0 0h24v24H0z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 5.95l-2.85 6.99a1.5 1.5 0 0 1-.94.93l-6.99 2.85a.5.5 0 0 1-.65-.65l2.85-6.99a1.5 1.5 0 0 1 .93-.94l6.99-2.85a.5.5 0 0 1 .65.65zM11 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={color}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.95 5.95l-2.85 6.99a1.5 1.5 0 0 1-.94.93l-6.99 2.85a.5.5 0 0 1-.65-.65l2.85-6.99a1.5 1.5 0 0 1 .93-.94l6.99-2.85a.5.5 0 0 1 .65.65zM11 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
    </svg>
  );
}
