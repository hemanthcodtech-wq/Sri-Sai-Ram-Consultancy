import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smooth scroll-triggered fade in, fade out, zoom, and slide animation wrapper.
 */
const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 650, 
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
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
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
        return 'opacity-0 translate-y-12 scale-[0.97] blur-[1px]';
      case 'down':
        return 'opacity-0 -translate-y-12 scale-[0.97] blur-[1px]';
      case 'left':
        return 'opacity-0 -translate-x-12 scale-[0.98] blur-[1px]';
      case 'right':
        return 'opacity-0 translate-x-12 scale-[0.98] blur-[1px]';
      case 'zoom':
        return 'opacity-0 scale-[0.92] blur-[1px]';
      default:
        return 'opacity-0 translate-y-10 scale-[0.97] blur-[1px]';
    }
  };

  return (
    <div
      ref={domRef}
      className={`transition-all will-change-transform ${getDirectionStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;

