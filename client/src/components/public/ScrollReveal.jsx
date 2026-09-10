import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smooth scroll-triggered fade in, zoom, and slide animation wrapper.
 * Defaults to once=true to eliminate layout jitter and shaking/vibration on scroll.
 */
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 600, 
  className = '', 
  once = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    const el = domRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [once]);

  const getDirectionStyles = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0';

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-6 scale-[0.98]';
      case 'down':
        return 'opacity-0 -translate-y-6 scale-[0.98]';
      case 'left':
        return 'opacity-0 -translate-x-6 scale-[0.98]';
      case 'right':
        return 'opacity-0 translate-x-6 scale-[0.98]';
      case 'zoom':
        return 'opacity-0 scale-[0.95]';
      default:
        return 'opacity-0 translate-y-6 scale-[0.98]';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all ease-out will-change-transform ${getDirectionStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
