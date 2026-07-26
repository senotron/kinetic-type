/**
 * KineticType.js v1.0.0
 * Dynamic Typography & Text Physics Engine
 * Zero-dependency open-source JS library for interactive kinetic text & physics simulations.
 * (c) 2026 Antigravity Open Source. MIT License.
 */

(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.KineticType = factory();
  }
}(typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  class Particle {
    constructor(x, y, color, size) {
      this.originX = x;
      this.originY = y;
      this.x = x + (Math.random() - 0.5) * 20;
      this.y = y + (Math.random() - 0.5) * 20;
      this.vx = 0;
      this.vy = 0;
      this.color = color;
      this.size = size;
      this.baseSize = size;
      this.alpha = 1;
      this.angle = Math.random() * Math.PI * 2;
    }

    update(mouse, options, canvasHeight) {
      const mode = options.mode || 'magnetic';
      const physics = options.physics || {};
      const stiffness = physics.stiffness || 0.08;
      const damping = physics.damping || 0.85;
      const forceRadius = physics.forceRadius || 120;
      const forceStrength = (physics.forceStrength || 1.0) * 100;
      const gravity = physics.gravity || 0.4;
      const bounce = physics.bounce || 0.7;

      // Calculate distance to mouse
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Mouse Physics forces
      let forceX = 0;
      let forceY = 0;

      if (dist < forceRadius && mouse.x !== null) {
        const force = (1 - dist / forceRadius) * forceStrength;
        const angle = Math.atan2(dy, dx);

        if (mode === 'magnetic') {
          // Attract towards mouse
          forceX = Math.cos(angle) * force * 0.8;
          forceY = Math.sin(angle) * force * 0.8;
        } else if (mode === 'explode' || mode === 'repulse') {
          // Push away from mouse
          forceX = -Math.cos(angle) * force * 1.5;
          forceY = -Math.sin(angle) * force * 1.5;
        } else if (mode === 'wave') {
          // Ripple swirl
          forceX = Math.sin(angle + Math.PI / 2) * force * 1.2;
          forceY = Math.cos(angle + Math.PI / 2) * force * 1.2;
        }
      }

      if (mode === 'gravity') {
        // Apply downwards gravity
        this.vy += gravity;
        // Floor collision
        if (this.y >= canvasHeight - this.size * 2) {
          this.y = canvasHeight - this.size * 2;
          this.vy = -this.vy * bounce;
          this.vx *= damping;
        }
      }

      // Spring force returning to origin (Hooke's Law: F = -k * (x - target))
      const springX = (this.originX - this.x) * stiffness;
      const springY = (this.originY - this.y) * stiffness;

      this.vx += springX + forceX;
      this.vy += springY + forceY;

      // Apply damping (friction)
      this.vx *= damping;
      this.vy *= damping;

      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Dynamic sizing based on velocity
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.size = Math.min(this.baseSize * 2.2, this.baseSize + speed * 0.15);
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class KineticType {
    constructor(target, options = {}) {
      this.targetElement = typeof target === 'string' ? document.querySelector(target) : target;
      if (!this.targetElement) {
        throw new Error(`KineticType: Target element "${target}" not found.`);
      }

      // Merge default options
      this.options = Object.assign({
        text: this.targetElement.innerText.trim() || 'KINETIC',
        mode: 'magnetic', // 'magnetic' | 'explode' | 'wave' | 'gravity' | 'matrix'
        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
        fontSize: 90,
        fontWeight: '800',
        density: 4, // Particle step interval (lower = higher resolution)
        color: ['#00f2fe', '#4facfe', '#6b11ff'],
        glow: true,
        glowColor: 'rgba(0, 242, 254, 0.4)',
        physics: {
          stiffness: 0.08,
          damping: 0.85,
          mass: 1.0,
          forceRadius: 130,
          forceStrength: 1.2,
          gravity: 0.4,
          bounce: 0.7
        }
      }, options);

      this.particles = [];
      this.mouse = { x: null, y: null, isDown: false };
      this.animationFrameId = null;
      this.waveTime = 0;

      this.init();
    }

    init() {
      // Create offscreen sampling canvas & main canvas
      this.container = this.targetElement;
      this.container.innerHTML = '';
      this.container.style.position = 'relative';
      this.container.style.overflow = 'hidden';

      this.canvas = document.createElement('canvas');
      this.canvas.style.display = 'block';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.container.appendChild(this.canvas);

      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

      this.resizeCanvas();
      this.bindEvents();
      this.buildTextParticles();
      this.animate();
    }

    resizeCanvas() {
      const rect = this.container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      this.width = rect.width || 800;
      this.height = rect.height || 400;

      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    buildTextParticles() {
      this.particles = [];

      // Create virtual canvas for crisp text sampling
      const sampleCanvas = document.createElement('canvas');
      sampleCanvas.width = this.width;
      sampleCanvas.height = this.height;
      const sampleCtx = sampleCanvas.getContext('2d');

      sampleCtx.clearRect(0, 0, this.width, this.height);
      sampleCtx.fillStyle = '#ffffff';
      sampleCtx.font = `${this.options.fontWeight} ${this.options.fontSize}px ${this.options.fontFamily}`;
      sampleCtx.textAlign = 'center';
      sampleCtx.textBaseline = 'middle';

      // Support multi-line text or single line
      const lines = this.options.text.split('\n');
      const lineHeight = this.options.fontSize * 1.15;
      const startY = this.height / 2 - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, index) => {
        sampleCtx.fillText(line, this.width / 2, startY + index * lineHeight);
      });

      // Sample pixel grid
      const imgData = sampleCtx.getImageData(0, 0, this.width, this.height);
      const data = imgData.data;
      const step = Math.max(2, parseInt(this.options.density));
      const particleRadius = Math.max(1, step / 2.1);

      const colors = Array.isArray(this.options.color) 
        ? this.options.color 
        : [this.options.color];

      for (let y = 0; y < this.height; y += step) {
        for (let x = 0; x < this.width; x += step) {
          const index = (y * this.width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            // Pick color gradient based on X position
            const colorProgress = x / this.width;
            const colorIdx = Math.floor(colorProgress * colors.length);
            const particleColor = colors[Math.min(colors.length - 1, colorIdx)];

            this.particles.push(new Particle(x, y, particleColor, particleRadius));
          }
        }
      }
    }

    bindEvents() {
      this.handleMouseMove = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      };

      this.handleMouseLeave = () => {
        this.mouse.x = null;
        this.mouse.y = null;
      };

      this.handleClick = () => {
        if (this.mouse.x !== null) {
          this.triggerExplosion(this.mouse.x, this.mouse.y, 250);
        }
      };

      this.handleResize = () => {
        this.resizeCanvas();
        this.buildTextParticles();
      };

      this.canvas.addEventListener('mousemove', this.handleMouseMove);
      this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
      this.canvas.addEventListener('click', this.handleClick);
      window.addEventListener('resize', this.handleResize);
    }

    triggerExplosion(centerX, centerY, radius = 200, force = 30) {
      this.particles.forEach(p => {
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          const angle = Math.atan2(dy, dx);
          const push = (1 - dist / radius) * force;
          p.vx += Math.cos(angle) * push + (Math.random() - 0.5) * 10;
          p.vy += Math.sin(angle) * push + (Math.random() - 0.5) * 10;
        }
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.waveTime += 0.05;

      // Glow effect pass
      if (this.options.glow) {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.options.glowColor || 'rgba(0, 242, 254, 0.5)';
      } else {
        this.ctx.shadowBlur = 0;
      }

      // Matrix Wave Mode distortion
      if (this.options.mode === 'matrix') {
        this.particles.forEach((p, i) => {
          p.originY += Math.sin(this.waveTime + p.originX * 0.02) * 0.4;
        });
      }

      // Update & Draw particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.update(this.mouse, this.options, this.height);
        p.draw(this.ctx);
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    setText(text) {
      this.options.text = text;
      this.buildTextParticles();
    }

    setMode(mode) {
      this.options.mode = mode;
    }

    updateOptions(newOptions) {
      this.options = Object.assign(this.options, newOptions);
      if (newOptions.physics) {
        this.options.physics = Object.assign(this.options.physics, newOptions.physics);
      }
      this.buildTextParticles();
    }

    reset() {
      this.buildTextParticles();
    }

    destroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
      this.canvas.removeEventListener('click', this.handleClick);
      window.removeEventListener('resize', this.handleResize);
      this.container.innerHTML = '';
    }
  }

  return KineticType;
}));
