import { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div id="preloader">
      <div className="jumper">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
