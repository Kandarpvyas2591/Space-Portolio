"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface IconCloudProps {
  images: string[];
}

export function IconCloud({ images }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const breathingRef = useRef(0);
  
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      image: string;
      rotation: number;
      scale: number;
      phi: number;    // Spherical coordinate
      theta: number;  // Spherical coordinate
      radius: number; // Distance from center
    }>
  >([]);

  // Initialize container size
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Create particles in a spherical arrangement
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;
    
    // Responsive adjustment
    const base = containerSize.width < 480 ? 14 : containerSize.width < 640 ? 18 : 22;
    const particleCount = Math.min(images.length, base);
    
    // Filter out any undefined or empty image paths
    const validImages = images.filter(img => img && img.trim() !== '');
    
    if (validImages.length === 0) return;
    
    // Create particles distributed on a sphere (using the Fibonacci sphere algorithm)
    const newParticles = [];
    const radius = Math.min(containerSize.width, containerSize.height) * 0.38;
    
    // Fibonacci sphere distribution for evenly spaced points
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < particleCount; i++) {
      // Spherical coordinates
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount); // Latitude
      const theta = 2 * Math.PI * i / goldenRatio; // Longitude
      
      // Convert spherical to cartesian coordinates (initial position)
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi); // Z-coordinate for 3D effect
      
      // Icon size based on z-position (perspective effect)
      const size = containerSize.width < 640 
        ? 15 + 10 * ((z / radius) + 1) / 2  // Smaller on mobile
        : 25 + 10 * ((z / radius) + 1) / 2; // Larger on desktop
      
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

  // Mouse interaction and animation
  useEffect(() => {
    if (particles.length === 0 || !containerRef.current) return;
    
    // "Breathing" effect - subtle pulsing of the globe
    let breathingAngle = 0;
    const breathingSpeed = 0.01;
    const breathingAmount = 0.02; // How much the globe "breathes"
    
    // Handle mouse movement to rotate the sphere
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Only rotate when mouse is over the container
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX < rect.left || 
        e.clientX > rect.right || 
        e.clientY < rect.top || 
        e.clientY > rect.bottom
      ) return;
      
      // Disable auto-rotation when user interacts
      setAutoRotate(false);
      
      // Calculate rotation based on mouse position relative to center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Smooth rotation - gradual movement toward target angle
      const targetRotationX = -(e.clientY - centerY) / (rect.height / 2) * 0.8;
      const targetRotationY = (e.clientX - centerX) / (rect.width / 2) * 0.8;
      
      rotationRef.current = {
        x: rotationRef.current.x + (targetRotationX - rotationRef.current.x) * 0.05,
        y: rotationRef.current.y + (targetRotationY - rotationRef.current.y) * 0.05
      };
      
      // Auto-rotate after 3 seconds of no mouse movement
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setAutoRotate(true);
      }, 3000);
    };
    
    // Touch events for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;
      
      const touch = e.touches[0];
      // Simulate mouse movement with touch
      const simulatedEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => {},
        stopPropagation: () => {}
      } as MouseEvent;
      
      handleMouseMove(simulatedEvent);
    };
    
    // Animation function
    const animate = () => {
      // Breathing effect
      breathingAngle += breathingSpeed;
      breathingRef.current = Math.sin(breathingAngle) * breathingAmount;
      
      // Auto-rotation increments
      if (autoRotate) {
        rotationRef.current.y += 0.002;
        rotationRef.current.x = Math.sin(rotationRef.current.y * 0.5) * 0.2;
      }
      
      // Apply 3D rotation to all particles
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const radius = particle.radius * (1 + breathingRef.current);
          
          // Original spherical coordinates
          const phi = particle.phi;
          const theta = particle.theta + 0.002; // Add continuous slow rotation
          
          // Convert to cartesian coordinates
          let x = radius * Math.sin(phi) * Math.cos(theta);
          let y = radius * Math.sin(phi) * Math.sin(theta);
          let z = radius * Math.cos(phi);
          
          // Apply Y-axis rotation
          const x1 = x * cosY - z * sinY;
          const z1 = z * cosY + x * sinY;
          
          // Apply X-axis rotation
          const y1 = y * cosX - z1 * sinX;
          const z2 = z1 * cosX + y * sinX;
          
          // Apply perspective and center in container
          const centerX = containerSize.width / 2;
          const centerY = containerSize.height / 2;
          const perspective = 800;
          const scale = perspective / (perspective - z2);
          
          // Calculate screen position with perspective
          const screenX = centerX + x1 * scale;
          const screenY = centerY + y1 * scale;
          
          // Calculate icon size based on z-depth (perspective effect)
          const baseSize = containerSize.width < 640 ? 15 : 22;
          const size = baseSize * scale; // Size varies with depth
          
          return {
            ...particle,
            x: screenX,
            y: screenY,
            z: z2,
            size,
            theta, // Store updated theta for continuous rotation
            scale: Math.max(0.4, (z2 + radius) / (radius * 2)) // Opacity based on z
          };
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, containerSize, autoRotate]);
  
  // Hover state for particles
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative size-full min-h-[350px] overflow-hidden rounded-lg select-none touch-none"
    >
      {/* Subtle background glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/5 to-blue-500/5 blur-3xl"></div>
      
      {particles.map((particle, index) => (
        <div
          key={index}
          className="absolute cursor-pointer transition-all duration-200"
          style={{
            left: `${particle.x - particle.size/2}px`,
            top: `${particle.y - particle.size/2}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            transform: `rotate(${particle.rotation}deg) scale(${hoveredIndex === index ? 1.3 : 1})`,
            zIndex: Math.floor(1000 + particle.z),
            opacity: particle.scale,
            willChange: 'transform, opacity, left, top',
            // Only show icons on the front half of the sphere
            visibility: particle.z > -particle.radius/3 ? 'visible' : 'hidden'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={particle.image}
            alt={`Tech icon ${index}`}
            width={particle.size}
            height={particle.size}
            className="size-full rounded-lg object-contain p-1 hover:drop-shadow-[0_0_15px_rgba(120,78,250,0.7)] transition-all"
            priority
            loading="eager"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
