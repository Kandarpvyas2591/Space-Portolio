'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export interface IconCloudProps {
  images: string[];
}

export function IconCloud({ images }: IconCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      image: string;
      rotation: number;
      rotationSpeed: number;
      scale: number;
      phi: number; // Spherical coordinate
      theta: number; // Spherical coordinate
      radius: number; // Distance from center
    }>
  >([]);

  // Initialize particles when the container size changes or images array changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    // Responsive adjustment: fewer particles on smaller screens
    const base =
      containerSize.width < 480 ? 12 : containerSize.width < 640 ? 16 : 20;
    const particleCount = Math.min(images.length, base);

    // Filter out any undefined or empty image paths
    const validImages = images.filter((img) => img && img.trim() !== '');

    if (validImages.length === 0) return;

    // Create particles distributed on a sphere (using the Fibonacci sphere algorithm)
    const newParticles = [];
    const radius = Math.min(containerSize.width, containerSize.height) * 0.35;
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;

    // Fibonacci sphere distribution for evenly spaced points
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < particleCount; i++) {
      // Spherical coordinates
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount); // Latitude
      const theta = (2 * Math.PI * i) / goldenRatio; // Longitude

      // Convert spherical to cartesian coordinates
      const x = centerX + radius * Math.sin(phi) * Math.cos(theta);
      const y = centerY + radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi); // Z-coordinate for 3D effect
      // Icon size based on z-position (perspective effect) - increased sizes
      const size =
        containerSize.width < 640
          ? 25 + (15 * (z / radius + 1)) / 2 // Larger on mobile
          : 35 + (20 * (z / radius + 1)) / 2; // Larger on desktop
      newParticles.push({
        x,
        y,
        z,
        size,
        image: validImages[i % validImages.length],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        scale: 1,
        phi,
        theta,
        radius: radius,
      });
    }
    setParticles(newParticles);
  }, [containerSize, images]);

  useEffect(() => {
    if (particles.length === 0) return;

    // Mouse interaction variables
    const rotationSpeed = 0.003;
    let isMouseOver = false;
    let mouseX = 0,
      mouseY = 0;

    // Use a lower frame rate for better performance
    const fps = 30;
    const fpsInterval = 1000 / fps;
    let then = Date.now();
    let elapsed;
    let rotationAngleX = 0;
    let rotationAngleY = 0;

    // Handle mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX = ((e.clientX - centerX) / (rect.width / 2)) * Math.PI;
      mouseY = ((e.clientY - centerY) / (rect.height / 2)) * Math.PI;

      isMouseOver =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      // Auto-rotate when mouse is not over the component
      if (!isMouseOver) {
        rotationAngleY += rotationSpeed;
        rotationAngleX = Math.sin(rotationAngleY) * 0.3;
      } else {
        // Use mouse position for rotation
        rotationAngleX = mouseY * 0.1;
        rotationAngleY = -mouseX * 0.1;
      }

      // Calculate rotation matrices
      const cosX = Math.cos(rotationAngleX);
      const sinX = Math.sin(rotationAngleX);
      const cosY = Math.cos(rotationAngleY);
      const sinY = Math.sin(rotationAngleY);

      // Apply 3D rotation to all particles
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          const radius = particle.radius;

          // Original spherical coordinates
          const phi = particle.phi;
          const theta = particle.theta + rotationAngleY * 0.2; // Add rotation to longitude

          // Convert to cartesian coordinates
          let x = radius * Math.sin(phi) * Math.cos(theta);
          let y = radius * Math.sin(phi) * Math.sin(theta);
          let z = radius * Math.cos(phi);

          // Apply X-axis rotation
          const y1 = y * cosX - z * sinX;
          const z1 = z * cosX + y * sinX;

          // Apply perspective and center in container
          const centerX = containerSize.width / 2;
          const centerY = containerSize.height / 2;
          const scale = 800 / (800 - z1); // Perspective effect
          // Calculate icon size based on z-depth (perspective effect) - increased sizes
          const baseSize = containerSize.width < 640 ? 30 : 40;
          const size = baseSize * (1 + 0.3 * ((z1 + radius) / (radius * 2))); // Size variation based on depth

          return {
            ...particle,
            x: centerX + x * scale,
            y: centerY + y1 * scale,
            z: z1,
            size: Math.max(20, size), // Ensure minimum size
            scale: Math.max(0.6, (z1 + radius) / (radius * 2)), // Opacity based on z-depth
            theta: theta, // Update the theta for continuous rotation
          };
        })
      );
    };

    // RequestAnimationFrame with throttling for better performance
    let animationFrameId: number;

    const animateFrame = () => {
      animationFrameId = requestAnimationFrame(animateFrame);

      const now = Date.now();
      elapsed = now - then;

      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        animate();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animateFrame);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particles, containerSize]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[400px] aspect-square min-h-[300px] min-w-[300px] mx-auto overflow-hidden rounded-lg select-none touch-none"
      style={{ minHeight: 300, minWidth: 300 }}
    >
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
            pointerEvents: particle.z > 0 ? 'auto' : 'none'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Image
            src={particle.image}
            alt={`Tech icon ${index}`}
            width={Math.round(particle.size)}
            height={Math.round(particle.size)}
            className="size-full rounded-lg object-contain p-1 hover:drop-shadow-[0_0_15px_rgba(120,78,250,0.7)] transition-all"
            priority={index < 5}
            loading={index < 5 ? "eager" : "lazy"}
            unoptimized={true}
          />
        </div>
      ))}
    </div>
  );
}
