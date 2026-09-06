import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smooth scroll-triggered fade and slide animation wrapper.
 */
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 700, 
  className = '', 
  once = false 
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [once]);

  const getDirectionStyles = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100 blur-0';

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-10 scale-95 blur-[2px]';
      case 'down':
        return 'opacity-0 -translate-y-10 scale-95 blur-[2px]';
      case 'left':
        return 'opacity-0 -translate-x-12 blur-[2px]';
      case 'right':
        return 'opacity-0 translate-x-12 blur-[2px]';
      case 'zoom':
        return 'opacity-0 scale-90 blur-[2px]';
      default:
        return 'opacity-0 translate-y-8 blur-[2px]';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all ease-out ${getDirectionStyles()} ${className}`}
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
