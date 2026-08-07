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
      document.getElementById('thank-you').hidden = false;
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

