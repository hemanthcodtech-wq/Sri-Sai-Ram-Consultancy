import { useState, useEffect } from 'react';

const Typewriter = ({ phrases = [], speed = 90, deleteSpeed = 45, pause = 1800, className = '' }) => {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) return;

    const currentPhrase = phrases[phraseIndex % phrases.length];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        if (displayText === currentPhrase) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timer);
  }, [displayText, phraseIndex, isDeleting, phrases, speed, deleteSpeed, pause]);

  return (
    <span className={`inline-block font-black transition-all ${className || 'text-[#C8960C]'}`}>
      {displayText}
      <span className="animate-pulse text-[#C8960C] ml-0.5">|</span>
    </span>
  );
};

export default Typewriter;
