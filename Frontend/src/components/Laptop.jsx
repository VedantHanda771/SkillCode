import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Laptop.css'; // Adjust the path as necessary

gsap.registerPlugin(ScrollTrigger);

const Laptop = ({ onLidStateChange }) => {
  const partTopRef = useRef(null);
  const [imageSource, setImageSource] = useState('https://i.ibb.co/hHZtvn4/img1lap.png');
  const [isLidOpen, setIsLidOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const partTop = partTopRef.current;
      const rect = partTop.getBoundingClientRect();
      const isAtTop = window.scrollY === 0;

      if (partTop) {
        if (isAtTop) {
          partTop.style.transform = 'translate3d(0, 0, 0) rotateX(-90deg)';
          setIsLidOpen(false);
        } else if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          partTop.style.transform = 'translate3d(0, 0, 0) rotateX(0deg)';
          setIsLidOpen(true);
        } else {
          partTop.style.transform = 'translate3d(0, 0, 0) rotateX(-90deg)';
          setIsLidOpen(false);
        }
        onLidStateChange(isLidOpen); // Pass lid state to parent
      }
    };

    const updateImageSource = () => {
      const scrollY = window.scrollY;

      if (scrollY <= 800) {
        setImageSource('https://i.ibb.co/hHZtvn4/img1lap.png'); // First image
      } else if (scrollY <= 1400) {
        setImageSource('https://i.ibb.co/K0YhRMp/Screenshot-2024-08-13-at-1-43-06-PM.png'); // Second image
      } else if (scrollY <= 2000) {
        setImageSource('https://i.ibb.co/kgrDVnf/Screenshot-2024-08-13-at-1-52-20-PM.png'); // Third image
      }
    };

    ScrollTrigger.create({
      trigger: '.container',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: () => {
        updateImageSource(); // Update image on scroll
      }
    });

    window.addEventListener('scroll', handleScroll);
    updateImageSource();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onLidStateChange, isLidOpen]);

  return (
    <div className="container fixed mt-24 ml-48" style={{ height: '2500px' }}>
      <div className={`mockup mockup-macbook loaded ${isLidOpen ? 'opened' : ''}`}>
        <div className="part top" ref={partTopRef}>
          <img
            src="https://d1xm195wioio0k.cloudfront.net/images/mockup/macbook-top.svg"
            alt="Laptop Top"
            className="top"
          />
          <img
            src="https://d1xm195wioio0k.cloudfront.net/images/mockup/macbook-cover.svg"
            alt="Laptop Cover"
            className="cover"
          />
          <img
            src={imageSource}
            alt="Laptop Screen Content"
            className="screen-content"
          />
        </div>
        <div className="part bottom">
          <img
            src="https://d1xm195wioio0k.cloudfront.net/images/mockup/macbook-cover.svg"
            alt="Laptop Cover"
            className="cover"
          />
          <img
            src="https://d1xm195wioio0k.cloudfront.net/images/mockup/macbook-bottom.svg"
            alt="Laptop Bottom"
            className="bottom"
          />
        </div>
      </div>
    </div>
  );
};

export default Laptop;
