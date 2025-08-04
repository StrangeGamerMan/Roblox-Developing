// Particle Network Background (same as before)
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

// Button & card ripple effect
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('feature-card')) {
      const btn = e.target;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }
  });
});

// Section switching logic
function showSection(section) {
  const main = document.getElementById('mainSection');
  if (section === 'register') {
    main.innerHTML = `
      <section>
        <h2>Create Account</h2>
        <input type="text" placeholder="Username" id="regUser">
        <input type="password" placeholder="Password" id="regPass">
        <button onclick="alert('Registration is a demo!')">Register</button>
        <div class="helper-text">No real registration yet (demo only)</div>
      </section>
    `;
  } else if (section === 'scripts') {
    main.innerHTML = `
      <section>
        <h2>Find Scripts & Models</h2>
        <input type="text" placeholder="Search scripts..." id="searchScripts">
        <ul id="scriptList" style="text-align:left;margin-top:15px;">
          <li><b>Example Script 1</b> - <code>print("Hello World")</code></li>
          <li><b>Example Model 2</b> - <code>function add(a,b) return a+b end</code></li>
        </ul>
        <div class="helper-text">Add your own scripts/models here!</div>
      </section>
    `;
  } else if (section === 'ai') {
    main.innerHTML = `
      <section>
        <h2>AI Coding Assistant</h2>
        <textarea placeholder="Ask a coding question..." id="aiQuestion"></textarea>
        <button onclick="askAIDemo()">Ask AI</button>
        <div id="aiResponse" class="helper-text"></div>
        <div class="helper-text">This is a demo. Connect to an AI API for real answers!</div>
      </section>
    `;
  } else if (section === 'community') {
    main.innerHTML = `
      <section>
        <h2>Community</h2>
        <p>Join our forums and chat with other developers!</p>
        <div class="helper-text">Feature coming soon.</div>
      </section>
    `;
  } else if (section === 'resources') {
    main.innerHTML = `
      <section>
        <h2>Resources</h2>
        <ul>
          <li><a href="https://developer.mozilla.org/" target="_blank">MDN Web Docs</a></li>
          <li><a href="https://www.w3schools.com/" target="_blank">W3Schools</a></li>
          <li><a href="https://stackoverflow.com/" target="_blank">Stack Overflow</a></li>
        </ul>
      </section>
    `;
  } else if (section === 'about') {
    main.innerHTML = `
      <section>
        <h2>About</h2>
        <p>Code Helper Hub is your all-in-one platform for coding help, scripts, models, and more.</p>
      </section>
    `;
  } else if (section === 'contact') {
    main.innerHTML = `
      <section>
        <h2>Contact</h2>
        <p>Email: <a href="mailto:info@codehelperhub.com">info@codehelperhub.com</a></p>
        <div class="helper-text">Contact form coming soon.</div>
      </section>
    `;
  }
}

// Demo AI response
function 
