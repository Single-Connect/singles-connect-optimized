/**
 * Flying Hearts Component
 * Displays animated hearts floating up across the screen
 * Used throughout the Single-Connect app for romantic atmosphere
 */
export default function FlyingHearts() {
  const hearts = ['💖', '💗', '💕', '💓', '💝', '❤️'];
  
  return (
    <div className="flying-hearts-container">
      {hearts.map((heart, index) => (
        <div key={index} className="flying-heart">
          {heart}
        </div>
      ))}
    </div>
  );
}
