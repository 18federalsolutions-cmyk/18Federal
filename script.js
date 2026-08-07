document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('leadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const note = document.getElementById('formNote');
  note.textContent = 'Form is ready for setup. Connect Formspree, Basin, or another form service before going live.';
});
