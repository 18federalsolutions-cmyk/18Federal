document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('leadForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  const note = document.getElementById('formNote');

  button.disabled = true;
  button.textContent = 'Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
  form.reset();
  window.location.hash = 'thank-you';
  document.getElementById('thank-you').scrollIntoView({ behavior: 'smooth' });
    } else {
      note.textContent = 'There was a problem sending your request. Please try again.';
    }
  } catch (error) {
    note.textContent = 'There was a problem sending your request. Please try again.';
  } finally {
    button.disabled = false;
    button.textContent = 'Start the Conversation';
  }
});
if (window.location.hash === '#thank-you') {
  const thankYou = document.getElementById('thank-you');
  thankYou.hidden = false;
  thankYou.scrollIntoView();
}

const selectedInterest = new URLSearchParams(window.location.search).get('interest');
if (selectedInterest && ['Pursuit Support', 'Software Demo', 'Strategic Partnership'].includes(selectedInterest)) {
  document.querySelector('select[name="interest"]').value = selectedInterest === 'Software Demo' ? 'Software Invitation' : selectedInterest;
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('primary-nav');
function closeMenu() { navigation.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navigation.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
menuButton.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
const navLinks = [...navigation.querySelectorAll('a')];
const observedSections = [...document.querySelectorAll('main > section[id]')];
function updateActiveNavigation() {
  let active = '';
  for (const section of observedSections) if (section.getBoundingClientRect().top <= 130) active = section.id;
  for (const link of navLinks) { if (link.hash === '#' + active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); }
}
window.addEventListener('scroll', updateActiveNavigation, { passive: true });
window.addEventListener('hashchange', updateActiveNavigation);
updateActiveNavigation();

document.querySelectorAll('.invitation-trigger').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#leadForm select[name="interest"]').value = 'Software Invitation';
  document.getElementById('contact-product').value = link.dataset.product;
}));
