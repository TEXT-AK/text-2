import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from 'react-use-gesture';

const sections = [
  {
    title: "Revolutionary Design",
    description: "Experience the future of technology with our sleek and innovative design.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
    bgColor: "bg-gray-900"
  },
  {
    title: "Unparalleled Performance",
    description: "Powered by cutting-edge technology for lightning-fast responsiveness.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
    bgColor: "bg-gray-800"
  },
  {
    title: "Seamless Integration",
    description: "Connect effortlessly with your digital ecosystem for a unified experience.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
    bgColor: "bg-gray-700"
  },
  {
    title: "Sustainable Innovation",
    description: "Designed with the environment in mind, for a better tomorrow.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80",
    bgColor: "bg-gray-600"
  }
];

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [{ y }, set] = useSpring(() => ({ y: 0 }));

  const bind = useGesture({
    onWheel: ({ delta: [, dy] }) => {
      if (scrollContainerRef.current) {
        const newY = y.get() + dy;
        const maxY = (sections.length - 1) * window.innerHeight;
        set({ y: Math.max(0, Math.min(newY, maxY)) });
        const newSection = Math.round(newY / window.innerHeight);
        setCurrentSection(newSection);
      }
    },
  });

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTo = (index: number) => {
    setCurrentSection(index);
    set({ y: index * window.innerHeight });
  };

  return (
    <div className="relative">
      <animated.div
        {...bind()}
        ref={scrollContainerRef}
        style={{
          transform: y.to(y => `translateY(-${y}px)`),
          willChange: 'transform',
        }}
      >
        {sections.map((section, index) => (
          <animated.div
            key={index}
            className={`section ${section.bgColor} text-white`}
            style={{
              opacity: y.to(y => 1 - Math.abs((y - index * window.innerHeight) / window.innerHeight)),
              transform: y.to(y => {
                const progress = (y - index * window.innerHeight) / window.innerHeight;
                const scale = 1 - Math.abs(progress) * 0.1;
                return `scale(${scale})`;
              }),
            }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-full px-8">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <animated.img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-auto rounded-lg shadow-2xl"
                  style={{
                    transform: y.to(y => {
                      const progress = (y - index * window.innerHeight) / window.innerHeight;
                      const translateY = progress * 50;
                      return `translateY(${translateY}px)`;
                    }),
                  }}
                />
              </div>
              <div className="w-full md:w-1/2 md:pl-12">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{section.title}</h2>
                <p className="text-xl md:text-2xl mb-8">{section.description}</p>
              </div>
            </div>
          </animated.div>
        ))}
      </animated.div>
      <div className="nav-dots">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`nav-dot ${currentSection === index ? 'active' : ''}`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;