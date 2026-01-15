const root = document.documentElement;

// Navbar scroll effect
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("navbar-scrolled", window.scrollY > 40);
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered animation delay
      entry.target.style.setProperty('--delay', `${index * 0.1}s`);
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".fade-up,.fade-left,.fade-right").forEach(el => observer.observe(el));

// Contact form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.textContent = "Sending...";
    status.style.display = "block";

    const formData = {
      from_name: form.querySelector('[name="name"]').value,
      from_email: form.querySelector('[name="email"]').value,
      user_message: form.querySelector('[name="message"]').value,
      to_email: form.querySelector('[name="email"]').value
    };

    emailjs.send("service_yusnw04", "template_t55fvzr", formData)
      .then(() => {
        status.textContent = "✓ Message sent successfully!";
        status.classList.add("success");
        form.reset();

        emailjs.sendForms("service_yusnw04", "template_t55fvzr", formData)
          .then(() => console.log("Auto-response sent!"))
          .catch(err => console.error("Auto-response error:", err));

        setTimeout(() => {
          status.textContent = "";
          status.classList.remove("success");
        }, 3000);
      })
      .catch(err => {
        status.textContent = "❌ Failed to send message.";
        status.classList.add("error");
        console.error(err);
      });
  });
}




// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Parallax effect on hero avatar
const avatar = document.querySelector('.avatar-wrap');
if (avatar) {
  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 20 - 10;
    const mouseY = (e.clientY / window.innerHeight) * 20 - 10;
    avatar.style.transform = `translateZ(0) rotateX(${mouseY}deg) rotateY(${mouseX}deg)`;
  });
}

// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  });
});

// Counter animation for stats
const animateCounter = (element, target) => {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 30);
};

// Observe stat cards for counter animation
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumber = entry.target.querySelector('.stat-number');
      if (statNumber && !statNumber.dataset.animated) {
        const text = statNumber.textContent;
        const num = parseInt(text) || 0;
        animateCounter(statNumber, num);
        statNumber.dataset.animated = 'true';
      }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(card => statObserver.observe(card));

// Tile tilt interaction (subtle 3D tilt)
const tiles = document.querySelectorAll('.tile');
tiles.forEach(tile => {
  // only apply tilt on non-touch devices
  if ('ontouchstart' in window) return;
  tile.addEventListener('mousemove', (e) => {
    const rect = tile.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    const rotY = (x - 0.5) * 10; // -5..5
    const rotX = (0.5 - y) * 8; // -4..4
    tile.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    tile.dataset.tilt = 'true';
  });
  tile.addEventListener('mouseleave', () => {
    tile.style.transform = '';
    delete tile.dataset.tilt;
  });
});

// Make tiles draggable subtle (optional): hold + drag moves slightly on desktop
let dragItem = null;
tiles.forEach(tile => {
  tile.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    dragItem = { el: tile, startX: e.clientX, startY: e.clientY, ox: 0, oy: 0 };
    tile.style.transition = 'transform 0s';
  });
});
window.addEventListener('mousemove', (e) => {
  if (!dragItem) return;
  const dx = e.clientX - dragItem.startX;
  const dy = e.clientY - dragItem.startY;
  dragItem.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.02)`;
});
window.addEventListener('mouseup', () => {
  if (!dragItem) return;
  dragItem.el.style.transition = '';
  dragItem.el.style.transform = '';
  dragItem = null;
});
