function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === pageId);
    });
    document.getElementById('navLinks').classList.remove('show');
    window.scrollTo(0, 0);
}

function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('show');
}

window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
});

function filterVideos(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.video-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.4s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function selectPlan(plan) {
    const form = document.getElementById('signupForm');
    const display = document.getElementById('selectedPlanDisplay');
    const planNames = {
        monthly: 'Monthly - $4.99/month',
        annual: 'Annual - $39.99/year',
        group: 'Group - $2.99/user/month'
    };
    display.value = planNames[plan];
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSubmit(e, type) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="loader"></span> Processing...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        e.target.reset();
        if (type === 'subscription') {
            document.getElementById('signupForm').style.display = 'none';
        }
        showToast(type === 'licensing'
            ? 'Enquiry submitted! Our team will contact you within 2 business days.'
            : 'Registration successful! Redirecting to secure payment...');
    }, 1500);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        document.getElementById('navLinks').classList.remove('show');
    }
});
