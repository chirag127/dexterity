let activeInput = null;
let dexterBtn = null;

function createButton() {
  if (dexterBtn) return;
  dexterBtn = document.createElement('div');
  dexterBtn.className = 'dexter-btn';
  dexterBtn.textContent = 'D';
  dexterBtn.title = 'Call Dexter';
  dexterBtn.style.display = 'none';
  document.body.appendChild(dexterBtn);

  dexterBtn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // Prevent input from losing focus
    handleDexterClick();
  });
}

function positionButton(inputElement) {
  const rect = inputElement.getBoundingClientRect();
  dexterBtn.style.top = `${window.scrollY + rect.top + 5}px`;
  dexterBtn.style.left = `${window.scrollX + rect.right - 30}px`;
  dexterBtn.style.display = 'flex';
}

function hideButton() {
  if (dexterBtn) dexterBtn.style.display = 'none';
}

document.addEventListener('focusin', (e) => {
  const target = e.target;
  if (target.tagName === 'TEXTAREA' || (target.tagName === 'INPUT' && target.type === 'text')) {
    activeInput = target;
    createButton();
    positionButton(activeInput);
  }
});

document.addEventListener('focusout', (e) => {
  setTimeout(() => {
    if (document.activeElement !== activeInput && e.relatedTarget !== dexterBtn) {
      hideButton();
    }
  }, 150);
});

function scrapeContext(targetElement) {
  let context = '';
  const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
  if (headings.length > 0) {
    context +=
      'Page Headings: ' +
      headings
        .map((h) => h.innerText)
        .slice(0, 3)
        .join(' | ') +
      '\n';
  }

  let parent = targetElement.parentElement;
  if (parent) {
    context += 'Surrounding text: ' + parent.innerText.substring(0, 500);
  }

  return context.trim().substring(0, 1000);
}

async function handleDexterClick() {
  if (!activeInput) return;
  const context = scrapeContext(activeInput);
  const currentInputValue = activeInput.value || '';

  dexterBtn.classList.add('loading');
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'GET_SUGGESTION',
      context: context,
      inputValue: currentInputValue,
    });

    if (response.error) {
      console.error('Dexter Error:', response.error);
      alert('Dexter encountered an issue: ' + response.error);
    } else if (response.suggestion) {
      const val = activeInput.value;
      if (typeof activeInput.selectionStart === 'number') {
        const start = activeInput.selectionStart;
        const end = activeInput.selectionEnd;
        activeInput.value = val.slice(0, start) + response.suggestion + val.slice(end);
        activeInput.selectionStart = activeInput.selectionEnd = start + response.suggestion.length;
      } else {
        activeInput.value += response.suggestion;
      }
      activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      activeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  } catch (err) {
    console.error('Dexter script error:', err);
  } finally {
    dexterBtn.classList.remove('loading');
  }
}
