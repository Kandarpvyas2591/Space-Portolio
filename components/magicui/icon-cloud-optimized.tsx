"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import Image from "next/image";

export interface IconCloudProps {
  images: string[];
}

// Use memo to avoid unnecessary re-renders
const IconItem = memo(({ 
  image, 
  x, 
  y, 
  size, 
  rotation, 
  scale, 
  zIndex, 
  index, 
  setHoveredIndex, 
  hoveredIndex,
  visibility
}: { 
  image: string, 
  x: number, 
  y: number, 
  size: number, 
  rotation: number, 
  scale: number, 
  zIndex: number, 
  index: number, 
  setHoveredIndex: (i: number | null) => void, 
  hoveredIndex: number | null,
  visibility: 'visible' | 'hidden' | undefined
}) => (
  <div
    className="absolute cursor-pointer transition-all duration-200"
    style={{
      left: `${x - size/2}px`,
      top: `${y - size/2}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: `rotate(${rotation}deg) scale(${hoveredIndex === index ? 1.3 : 1})`,
      zIndex: zIndex,
      opacity: scale,
      willChange: 'transform, opacity',
      visibility: visibility as 'visible' | 'hidden' // Type assertion for React CSSProperties
    }}
    onMouseEnter={() => setHoveredIndex(index)}
    onMouseLeave={() => setHoveredIndex(null)}
  >
    <Image
      src={image}
      alt={`Tech icon ${index}`}
      width={size}
      height={size}
      className="size-full rounded-lg object-contain p-1 hover:drop-shadow-[0_0_15px_rgba(120,78,250,0.7)] transition-all"
      loading={index < 10 ? "eager" : "lazy"} // Only prioritize first few images
      unoptimized
    />
  </div>
));

IconItem.displayName = 'IconItem';

export function IconCloud({ images }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breathingRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      image: string;
      rotation: number;
      scale: number;
      phi: number;
      theta: number;
      radius: number;
    }>
  >([]);

  // Initialize container size with a debounced resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    
    let resizeTimer: NodeJS.Timeout;
    
    const handleResize = (entries: ResizeObserverEntry[]) => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const { width, height } = entries[0].contentRect;
        setContainerSize({ width, height });
      }, 100); // Debounce resize events
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      clearTimeout(resizeTimer);
      resizeObserver.disconnect();
    };
  }, []);

  // Create particles in a spherical arrangement with optimized calculations
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    
    // Reduce particle count for better performance
    const base = containerSize.width < 480 ? 10 : containerSize.width < 640 ? 14 : 18;
    const particleCount = Math.min(images.length, base);
    
    const validImages = images.filter(img => img && img.trim() !== '');
    if (validImages.length === 0) return;
    
    // Create particles distributed on a sphere using the Fibonacci sphere algorithm
    const newParticles = [];
    const radius = Math.min(containerSize.width, containerSize.height) * 0.38;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = 2 * Math.PI * i / goldenRatio;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const size = containerSize.width < 640 
        ? 15 + 10 * ((z / radius) + 1) / 2
        : 25 + 10 * ((z / radius) + 1) / 2;
      
      newParticles.push({
        x,
        y,
        z,
        size,
        image: validImages[i % validImages.length],
        rotation: Math.random() * 360,
        scale: 1,
        phi,
        theta,
        radius
      });
    }
    
    setParticles(newParticles);
  }, [containerSize, images]);

  // Optimized animation and interaction handling
  useEffect(() => {
    if (particles.length === 0 || !containerRef.current) return;
    
    let breathingAngle = 0;
    const breathingSpeed = 0.005; // Reduced speed
    const breathingAmount = 0.015; // Reduced amount
    
    // Mouse movement handler with throttling
    let lastMouseMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveTime < 16) return; // ~60fps throttling
      lastMouseMoveTime = now;
      
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX < rect.left || 
        e.clientX > rect.right || 
        e.clientY < rect.top || 
        e.clientY > rect.bottom
      ) return;
      
      setAutoRotate(false);
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const targetRotationX = -(e.clientY - centerY) / (rect.height / 2) * 0.8;
      const targetRotationY = (e.clientX - centerX) / (rect.width / 2) * 0.8;
      
      rotationRef.current = {
        x: rotationRef.current.x + (targetRotationX - rotationRef.current.x) * 0.05,
        y: rotationRef.current.y + (targetRotationY - rotationRef.current.y) * 0.05
      };
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setAutoRotate(true);
      }, 3000);
    };
    
    // Simplified touch handler
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      const simulatedEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY
      } as MouseEvent;
      
      handleMouseMove(simulatedEvent);
    };
    
    // Optimized animation function - reduced calculations
    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      // Only update breathing every few frames
      if (frameCount % 3 === 0) {
        breathingAngle += breathingSpeed;
        breathingRef.current = Math.sin(breathingAngle) * breathingAmount;
      }
      
      // Slower auto-rotation
      if (autoRotate) {
        rotationRef.current.y += 0.001;
        rotationRef.current.x = Math.sin(rotationRef.current.y * 0.5) * 0.2;
      }
      
      // Only update particles when needed - rough throttling
      if (frameCount % 2 === 0) {
        // Precompute trig functions to avoid repeated calculations
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);
        
        setParticles(prevParticles => 
          prevParticles.map(particle => {
            const radius = particle.radius * (1 + breathingRef.current);
            const phi = particle.phi;
            const theta = particle.theta + 0.001; // Slower rotation
            
            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.sin(phi) * Math.sin(theta);
            let z = radius * Math.cos(phi);
            
            // Apply rotations
            const x1 = x * cosY - z * sinY;
            const z1 = z * cosY + x * sinY;
            const y1 = y * cosX - z1 * sinX;
            const z2 = z1 * cosX + y * sinX;
            
            // Apply perspective
            const centerX = containerSize.width / 2;
            const centerY = containerSize.height / 2;
            const perspective = 800;
            const scale = perspective / (perspective - z2);
            
            const screenX = centerX + x1 * scale;
            const screenY = centerY + y1 * scale;
            
            const baseSize = containerSize.width < 640 ? 15 : 22;
            const size = baseSize * scale;
            
            return {
              ...particle,
              x: screenX,
              y: screenY,
              z: z2,
              size,
              theta,
              scale: Math.max(0.4, (z2 + radius) / (radius * 2))
            };
          })
        );
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Passive event listeners for better performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, containerSize, autoRotate]);

  return (
    <div
      ref={containerRef}
      className="relative size-full min-h-[350px] overflow-hidden rounded-lg select-none touch-none"
    >
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 blur-3xl"></div>
      
      {particles.map((particle, index) => (
        <IconItem
          key={index}
          image={particle.image}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          rotation={particle.rotation}
          scale={particle.scale}
          zIndex={Math.floor(1000 + particle.z)}
          index={index}
          setHoveredIndex={setHoveredIndex}
          hoveredIndex={hoveredIndex}
          visibility={particle.z > -particle.radius/3 ? 'visible' : 'hidden'}
        />
      ))}
    </div>
  );
}
