// --- Particle Background ---
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

// --- Ripple Effect ---
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

// --- Simple Local Datastore ---
const store = {
  get(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// --- Tabs ---
function showTab(tab) {
  const main = document.getElementById('mainSection');
  if (tab === 'ai') renderAI(main);
  else if (tab === 'scripts') renderScripts(main);
  else if (tab === 'forum') renderForum(main);
  else if (tab === 'resources') renderResources(main);
  else if (tab === 'account') renderAccount(main);
  else main.innerHTML = '';
}
window.showTab = showTab;

// --- AI Chat Tab ---
function renderAI(main) {
  let chats = store.get('ai_chats', []);
  let currentChat = store.get('ai_current_chat', null);

  function saveChats() {
    store.set('ai_chats', chats);
    store.set('ai_current_chat', currentChat);
  }

  function renderChatList() {
    return `
      <div class="saved-chats-list">
        ${chats.map((c, i) => `
          <button onclick="loadChat(${i})">${c.name || 'Chat ' + (i+1)}</button>
          <button onclick="deleteChat(${i})" style="color:red;">🗑️</button>
        `).join('')}
        <button onclick="newChat()">+ New Chat</button>
      </div>
    `;
  }

  function renderChat() {
    let chat = chats[currentChat] || { messages: [] };
    return `
      <div class="ai-chat">
        ${chat.messages.map(m => `
          <div class="ai-msg ${m.role}"><b>${m.role === 'user' ? 'You' : 'AI'}:</b> ${m.text}</div>
        `).join('')}
      </div>
      <div class="ai-chat-controls">
        <input id="aiInput" placeholder="Ask about Roblox scripting, models, APIs, etc..." onkeydown="if(event.key==='Enter'){sendAIMessage();}">
        <button onclick="sendAIMessage()">Send</button>
      </div>
    `;
  }

  main.innerHTML = `
    <div class="tab-content">
      <h2>AI Assistant</h2>
      <div>
        ${renderChatList()}
        <div id="aiChatArea">${renderChat()}</div>
      </div>
      <div class="helper-text">Ask anything about Roblox game development, scripting, APIs, and more!</div>
    </div>
  `;

  window.sendAIMessage = function() {
    let input = document.getElementById('aiInput');
    let text = input.value.trim();
    if (!text) return;
    if (!chats[currentChat]) chats[currentChat] = { name: '', messages: [] };
    chats[currentChat].messages.push({ role: 'user', text });
    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      chats[currentChat].messages.push({ role: 'ai', text: "This is a demo AI response. For real answers, connect to OpenAI or Gemini API." });
      saveChats();
      renderAI(main);
    }, 800);
    saveChats();
    renderAI(main);
    input.value = '';
  };

  window.loadChat = function(i) {
    currentChat = i;
    saveChats();
    renderAI(main);
  };

  window.deleteChat = function(i) {
    if (confirm("Delete this chat?")) {
      chats.splice(i, 1);
      if (currentChat >= chats.length) currentChat = chats.length - 1;
      saveChats();
      renderAI(main);
    }
  };

  window.newChat = function() {
    chats.push({ name: '', messages: [] });
    currentChat = chats.length - 1;
    saveChats();
    renderAI(main);
  };
}

// --- Scripts & Models Tab ---
function renderScripts(main) {
  let scripts = store.get('scripts', [
    { name: "Hello World", code: 'print("Hello World")', desc: "Basic print script for Roblox." }
  ]);
  main.innerHTML = `
    <div class="tab-content">
      <h2>Scripts & Models</h2>
      <input id="scriptSearch" placeholder="Search scripts/models..." oninput="filterScripts()">
      <div id="scriptsList">
        ${scripts.map((s, i) => `
          <div style="margin-bottom:18px;">
            <b>${s.name}</b> <span style="color:#888;">- ${s.desc}</span>
            <pre style="background:#f7f7f7;padding:8px;border-radius:8px;">${s.code}</pre>
          </div>
        `).join('')}
      </div>
      <h3>Add New Script/Model</h3>
      <input id="newScriptName" placeholder="Name">
      <input id="newScriptDesc" placeholder="Description">
      <textarea id="newScriptCode" placeholder="Paste your code here"></textarea>
      <button onclick="addScript()">Add</button>
    </div>
  `;
  window.filterScripts = function() {
    let val = document.getElementById('scriptSearch').value.toLowerCase();
    let filtered = scripts.filter(s => s.name.toLowerCase().includes(val) || s.desc.toLowerCase().includes(val) || s.code.toLowerCase().includes(val));
    document.getElementById('scriptsList').innerHTML = filtered.map((s, i) => `
      <div style="margin-bottom:18px;">
        <b>${s.name}</b> <span style="color:#888;">- ${s.desc}</span>
        <pre style="background:#f7f7f7;padding:8px;border-radius:8px;">${s.code}</pre>
      </div>
    `).join('');
  };
  window.addScript = function() {
    let name = document.getElementById('newScriptName').value.trim();
    let desc = document.getElementById('newScriptDesc').value.trim();
    let code = document.getElementById('newScriptCode').value.trim();
    if (!name || !code) return alert("Name and code required!");
    scripts.push({ name, desc, code });
    store.set('scripts', scripts);
    renderScripts(main);
  };
}

// --- Forum Tab ---
function renderForum(main) {
  let posts = store.get('forum_posts', [
    { title: "How do I use RemoteEvents?", body: "I'm new to Roblox scripting. How do I use RemoteEvents to communicate between server and client?" }
  ]);
  main.innerHTML = `
    <div class="tab-content">
      <h2>Forum</h2>
      <div>
        ${posts.map(p => `
          <div class="forum-post">
            <div class="forum-title">${p.title}</div>
            <div class="forum-body">${p.body}</div>
          </div>
        `).join('')}
      </div>
      <h3>New Post</h3>
      <input id="forumTitle" placeholder="Title">
      <textarea id="forumBody" placeholder="Your question or info"></textarea>
      <button onclick="addForumPost()">Post</button>
    </div>
  `;
  window.addForumPost = function() {
    let title = document.getElementById('forumTitle').value.trim();
    let body = document.getElementById('forumBody').value.trim();
    if (!title || !body) return alert("Title and body required!");
    posts.push({ title, body });
    store.set('forum_posts', posts);
    renderForum(main);
  };
}

// --- Resources Tab ---
function renderResources(main) {
  main.innerHTML = `
    <div class="tab-content">
      <h2>Resources</h2>
      <ul>
        <li><a href="https://create.roblox.com/docs" target="_blank">Roblox Creator Docs</a></li>
        <li><a href="https://devforum.roblox.com/" target="_blank">Roblox DevForum</a></li>
        <li><a href="https://scriptinghelpers.org/" target="_blank">Scripting Helpers</a></li>
        <li><a href="https://github.com/EgoMoose/roblox-lua-promises" target="_blank">Roblox Lua Promises (GitHub)</a></li>
      </ul>
    </div>
  `;
}

// --- Account Tab (Demo Only) ---
function renderAccount(main) {
  let user = store.get('user', null);
  main.innerHTML = `
    <div class="tab-content">
      <h2>Account</h2>
      ${user ? `
        <p>Welcome, <b>${user.username}</b>!</p>
        <button onclick="logout()">Logout</button>
      ` : `
        <input id="loginUser" placeholder="Username">
        <input id="loginPass" type="password" placeholder="Password">
        <button onclick="login()">Login</button>
        <div class="helper-text">No real authentication yet (demo only)</div>
      `}
    </div>
  `;
  window.login = function() {
    let username = document.getElementById('loginUser').value.trim();
    let password = document.getElementById('loginPass').value.trim();
    if (!username || !password) return alert("Username and password required!");
    store.set('user', { username });
    renderAccount(main);
  };
  window.logout = function() {
    store.set('user', null);
    renderAccount(main);
  };
}

// --- Default Tab ---
showTab('ai');
