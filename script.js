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
  document.querySelector('select[name="interest"]').value = selectedInterest;
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

const invitationDialog = document.getElementById('invitation-dialog');
const invitationForm = document.getElementById('invitation-form');
const invitationEntry = document.getElementById('invitation-entry');
const invitationSuccess = document.getElementById('invitation-success');
const invitationStatus = document.getElementById('invitation-status');
let invitationOpener;
let submittingInvitation = false;
let invitationCompleted = false;
function clearInvitationErrors() {
  invitationForm.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  invitationForm.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  const summary = document.getElementById('invitation-errors'); summary.hidden = true; summary.textContent = '';
  invitationStatus.textContent = '';
}
document.querySelectorAll('.invitation-trigger').forEach(button => button.addEventListener('click', () => {
  invitationOpener = button;
  if (invitationCompleted) { invitationForm.reset(); invitationCompleted = false; }
  invitationEntry.hidden = false; invitationSuccess.hidden = true;
  invitationDialog.setAttribute('aria-labelledby', 'invitation-title'); invitationDialog.setAttribute('aria-describedby', 'invitation-intro');
  invitationForm.elements.product.value = button.dataset.product;
  clearInvitationErrors(); invitationDialog.showModal(); document.body.classList.add('dialog-open');
  document.getElementById('inv-name').focus();
}));
invitationDialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); invitationOpener?.focus(); });
invitationDialog.querySelector('.dialog-close').addEventListener('click', () => invitationDialog.close());
invitationDialog.querySelector('.return-products').addEventListener('click', () => invitationDialog.close());
invitationDialog.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = [...invitationDialog.querySelectorAll('button,input,select,textarea,[tabindex="0"]')].filter(el => !el.disabled && el.getClientRects().length);
  const first = focusable[0], last = focusable.at(-1);
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
invitationForm.addEventListener('submit', async e => {
  e.preventDefault(); if (submittingInvitation) return;
  clearInvitationErrors();
  const invalid = [];
  for (const field of invitationForm.querySelectorAll('[required]')) {
    let error = '';
    if (!field.value.trim()) error = 'Please complete this field.';
    else if (field.type === 'email' && !field.validity.valid) error = 'Enter a valid email address.';
    else if (field.maxLength > 0 && field.value.length > field.maxLength) error = `Use no more than ${field.maxLength} characters.`;
    if (error) { field.setAttribute('aria-invalid', 'true'); document.getElementById(field.id + '-error').textContent = error; invalid.push(field); }
  }
  if (invalid.length) {
    if (invalid.length === 1) invalid[0].focus();
    else { const summary = document.getElementById('invitation-errors'); summary.textContent = 'Please review the highlighted fields.'; summary.hidden = false; summary.focus(); }
    return;
  }
  submittingInvitation = true;
  const button = invitationForm.querySelector('[type="submit"]'); button.disabled = true; button.textContent = 'Submitting your request...';
  invitationStatus.textContent = 'Submitting your request...';
  try {
    const response = await fetch(invitationForm.action, { method: 'POST', body: new FormData(invitationForm), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Submission failed');
    invitationCompleted = true; invitationEntry.hidden = true; invitationSuccess.hidden = false;
    invitationSuccess.querySelector('h2').id = 'invitation-success-title';
    invitationDialog.setAttribute('aria-labelledby', 'invitation-success-title'); invitationDialog.removeAttribute('aria-describedby'); invitationSuccess.focus();
  } catch {
    invitationStatus.textContent = 'We could not submit your request. Please try again.';
  } finally {
    submittingInvitation = false; button.disabled = false; button.textContent = 'Submit Invitation Request';
  }
});
