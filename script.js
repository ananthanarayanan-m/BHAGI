// Set your flipbook / PDF link here (e.g., Heyzine, FlipHTML5, Google Drive, or assets/magazine.pdf)
const MAGAZINE_URL = "https://heyzine.com/flip-book/c5a88bbf30.html";

const r = document.getElementById('read');
if (r) {
    if (MAGAZINE_URL) {
        r.href = MAGAZINE_URL;
    }
    r.addEventListener('click', e => {
        if (!r.href || r.getAttribute('href') === '#') {
            e.preventDefault();
            r.textContent = "Coming soon";
        }
    });
}

// ── Book 3D tilt on mouse ──
const b = document.getElementById('book');
addEventListener('pointermove', e => {
    if (innerWidth < 800) return;
    const x = (e.clientX / innerWidth - .5) * 10,
          y = (e.clientY / innerHeight - .5) * 10;
    b.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg)`;
});

// ── Starfield Canvas ──
(function () {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    const N = 180; // number of stars
    let W, H, stars = [], shooters = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }

    function rnd(min, max) { return min + Math.random() * (max - min); }

    function initStars() {
        stars = Array.from({ length: N }, () => ({
            x: rnd(0, W),
            y: rnd(0, H),
            r: rnd(0.3, 1.6),
            alpha: rnd(0.3, 1),
            delta: rnd(0.003, 0.012), // twinkle speed
            phase: rnd(0, Math.PI * 2)
        }));
    }

    function spawnShooter() {
        shooters.push({
            x: rnd(W * 0.1, W * 0.85),
            y: rnd(0, H * 0.4),
            len: rnd(100, 200),
            speed: rnd(12, 22),
            angle: Math.PI / 5,
            alpha: 1,
            tail: []
        });
    }

    // spawn a shooting star every 3.5–7 seconds
    setInterval(() => { if (Math.random() < 0.75) spawnShooter(); }, 4000);

    function draw(ts) {
        ctx.clearRect(0, 0, W, H);

        // Draw stars
        stars.forEach(s => {
            s.phase += s.delta;
            const a = (Math.sin(s.phase) * 0.5 + 0.5) * s.alpha;
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle = '#f5e7b8';
            ctx.shadowBlur = s.r > 1.2 ? 6 : 0;
            ctx.shadowColor = '#f5c63c';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw shooting stars
        shooters = shooters.filter(s => s.alpha > 0.02);
        shooters.forEach(s => {
            const dx = Math.cos(s.angle) * s.speed;
            const dy = Math.sin(s.angle) * s.speed;
            s.x += dx;
            s.y += dy;
            s.alpha -= 0.018;

            const tx = s.x - Math.cos(s.angle) * s.len;
            const ty = s.y - Math.sin(s.angle) * s.len;

            const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
            grad.addColorStop(0, 'rgba(245,198,60,0)');
            grad.addColorStop(1, `rgba(255,245,200,${s.alpha})`);

            ctx.save();
            ctx.globalAlpha = s.alpha;
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(245,198,60,0.8)';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(s.x, s.y);
            ctx.stroke();
            ctx.restore();
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initStars(); });
    resize();
    initStars();
    requestAnimationFrame(draw);
})();