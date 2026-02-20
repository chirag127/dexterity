document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['provider', 'apiKey'], (items) => {
    if (items.provider) document.getElementById('provider').value = items.provider;
    if (items.apiKey) document.getElementById('apiKey').value = items.apiKey;
  });
});

document.getElementById('save').addEventListener('click', () => {
  const provider = document.getElementById('provider').value;
  const apiKey = document.getElementById('apiKey').value;

  chrome.storage.local.set({ provider, apiKey }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Configuration saved securely.';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});
