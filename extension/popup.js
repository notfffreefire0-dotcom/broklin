
document.addEventListener('DOMContentLoaded', async () => {
  const titleInput = document.getElementById('title');
  const typeInput = document.getElementById('type');
  const contentInput = document.getElementById('content');
  const saveBtn = document.getElementById('saveBtn');
  const viewBtn = document.getElementById('viewBtn');
  const statusDiv = document.getElementById('status');

  // 1. Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  titleInput.value = tab.title;

  // 2. Handle Save Click
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.innerText = "Saving...";

    const data = {
      type: typeInput.value,
      title: titleInput.value,
      url: tab.url,
      content: contentInput.value,
      metadata: { source: "chrome_extension", savedAt: new Date().toISOString() }
    };

    try {
      // Send to your local server
      const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        statusDiv.innerText = "Values Synced";
        statusDiv.className = "success";
        saveBtn.innerText = "Saved!";

        // Reset after a moment
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      statusDiv.innerText = "Error: Is Server running?";
      statusDiv.className = "error";
      saveBtn.disabled = false;
      saveBtn.innerText = "Save to Brain";
    }
  });

  // 3. Handle View Dashboard
  viewBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'http://localhost:3000' });
  });
});