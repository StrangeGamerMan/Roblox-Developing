// Particle Network Background (same as your original, but no changes needed)
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
const maxParticles = 90;
const maxDistance = 130;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(devicePixelRatio, devicePixelRatio);
}
window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;
    this.size = 2 + Math.random() * 2;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,0,0,0.13)';
    ctx.shadowColor = 'rgba(0,0,0,0.13)';
    ctx.shadowBlur = 6;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

particles = [];
for (let i = 0; i < maxParticles; i++) {
  particles.push(new Particle());
}

let mouse = { x: width / 2, y: height / 2 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  for (let i = 0; i < maxParticles; i++) {
    for (let j = i + 1; j < maxParticles; j++) {
      let p1 = particles[i];
      let p2 = particles[j];
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDistance) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,0,0,${0.18 * (1 - dist / maxDistance)})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }

    let p = particles[i];
    let dxm = p.x - mouse.x;
    let dym = p.y - mouse.y;
    let distMouse = Math.sqrt(dxm * dxm + dym * dym);
    if (distMouse < maxDistance) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(0,0,0,${0.18 * (1 - distMouse / maxDistance)})`;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  }

  requestAnimationFrame(animate);
}
animate();

// Button Ripple Effect
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });
});

// Section switching logic
function showSection(section) {
  const main = document.getElementById('mainSection');
  if (section === 'register') {
    main.innerHTML = `
      <h3>Create Account</h3>
      <input type="text" placeholder="Username" id="regUser">
      <input type="password" placeholder="Password" id="regPass">
      <button onclick="alert('Registration is a demo!')">Register</button>
      <div class="helper-text">No real registration yet (demo only)</div>
    `;
  } else if (section === 'scripts') {
    main.innerHTML = `
      <h3>Find Scripts & Models</h3>
      <input type="text" placeholder="Search scripts..." id="searchScripts">
      <ul id="scriptList" style="text-align:left;margin-top:15px;">
        <li><b>Example Script 1</b> - <code>print("Hello World")</code></li>
        <li><b>Example Model 2</b> - <code>function add(a,b) return a+b end</code></li>
      </ul>
      <div class="helper-text">Add your own scripts/models here!</div>
    `;
  } else if (section === 'ai') {
    main.innerHTML = `
      <h3>AI Coding Assistant</h3>
      <textarea placeholder="Ask a coding question..." id="aiQuestion"></textarea>
      <button onclick="askAIDemo()">Ask AI</button>
      <div id="aiResponse" class="helper-text"></div>
      <div class="helper-text">This is a demo. Connect to an AI API for real answers!</div>
    `;
  }
}

// Demo AI response
function askAIDemo() {
  const q = document.getElementById('aiQuestion').value.trim();
  const resp = document.getElementById('aiResponse');
  if (!q) {
    resp.textContent = "Please enter a question!";
    return;
  }
  resp.textContent = "Thinking...";
  setTimeout(() => {
    resp.textContent = "This is a demo response. Connect to an AI API for real answers!";
  }, 1200);
}
