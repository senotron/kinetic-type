# KineticType ⚛️

> **Dynamic Typography & Text Physics Engine for the Web.**  
> Transform static headings into interactive particle explosions, magnetic fluid typography, and 60 FPS spring physics simulations.

[![npm version](https://img.shields.io/badge/npm-v1.0.0-00f2fe.svg?style=flat-square)](https://www.npmjs.com/)
[![license](https://img.shields.io/badge/license-MIT-6b11ff.svg?style=flat-square)](LICENSE)
[![zero dependencies](https://img.shields.io/badge/dependencies-zero-00ff87.svg?style=flat-square)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff0844.svg?style=flat-square)](https://github.com/senotron/kinetic-type)

---

## 🌟 Highlights & Features

- **⚡ Zero Dependencies & Lightweight (~5KB)**: Built with pure Vanilla JS and HTML5 Canvas API. No Three.js or WebGL overhead.
- **🧲 Multiple Physics Modes**:
  - `magnetic`: Smooth fluid attraction towards the cursor.
  - `explode`: Detonates text into reactive particles with elastic Hooke's Law spring rebound.
  - `wave`: Continuous liquid distortion and wave ripple effect.
  - `gravity`: Drops glyph particles with floor bounce physics.
  - `matrix`: Sine-wave matrix typography warping.
- **🎨 Custom Gradients & Typography**: Compatible with any Google Font, SVG glyphs, or custom web fonts.
- **🚀 60 FPS Performance**: Optimized pixel-grid sampling and requestAnimationFrame loop.
- **🖥️ Interactive Studio App**: Includes a full-featured web app studio for live physics tweaking and code snippet export.

---

## 📦 Quick Start

### 1. Via Script Tag

```html
<!-- Include container -->
<div id="heroText" style="width: 100%; height: 350px;"></div>

<!-- Import KineticType.js -->
<script src="kinetic-type.js"></script>

<script>
  const kt = new KineticType('#heroText', {
    text: 'A visual masterpiece',
    mode: 'magnetic',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 90,
    color: ['#00f2fe', '#4facfe', '#6b11ff'],
    physics: {
      stiffness: 0.08,
      damping: 0.85,
      forceRadius: 130
    }
  });
</script>
```

---

## 🛠️ API Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `text` | `String` | `'KINETIC'` | Display text string (supports multi-line `\n`). |
| `mode` | `String` | `'magnetic'` | Physics mode (`magnetic`, `explode`, `wave`, `gravity`, `matrix`). |
| `fontFamily` | `String` | `'Space Grotesk'` | CSS font-family name. |
| `fontSize` | `Number` | `90` | Font size in pixels. |
| `density` | `Number` | `4` | Particle sampling resolution (2 = Ultra high, 4 = High, 6 = Med). |
| `color` | `String \| Array` | `['#00f2fe', ...]` | Hex or RGB color string or gradient array. |
| `glow` | `Boolean` | `true` | Enables canvas glow shadow effect. |
| `physics.stiffness` | `Number` | `0.08` | Spring stiffness constant $k$ (0.01 - 0.25). |
| `physics.damping` | `Number` | `0.85` | Friction damping constant $c$ (0.50 - 0.98). |
| `physics.forceRadius` | `Number` | `130` | Distance radius in pixels for mouse interaction. |
| `physics.forceStrength` | `Number` | `1.2` | Push/pull force multiplier. |

### Instance Methods

```javascript
// Change display text dynamically
kt.setText('NEW HEADLINE');

// Switch mode on the fly
kt.setMode('explode');

// Update options
kt.updateOptions({ fontSize: 110, color: ['#ff0844', '#ffb199'] });

// Trigger manual explosion at coordinate
kt.triggerExplosion(x, y, radius, force);

// Clean up canvas and event listeners
kt.destroy();
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
