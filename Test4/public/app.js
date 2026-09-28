const form = document.getElementById('requestForm');
const requestList = document.getElementById('requestList');
const submitButton = document.getElementById('submitButton');
const cancelEditButton = document.getElementById('cancelEdit');
const requestIdInput = document.getElementById('requestId');

let isEditing = false;

async function fetchRequests() {
  const response = await fetch('/api/requests');
  const requests = await response.json();
  renderRequests(requests);
}

function renderRequests(requests) {
  if (!requests.length) {
    requestList.innerHTML = '<div class="empty-state">No requests submitted yet.</div>';
    return;
  }

  requestList.innerHTML = requests
    .map(
      (request) => `
        <article class="request-card">
          <div class="request-card-header">
            <div class="request-title">${request.studentName}</div>
            <span class="priority-badge priority-${request.priority.toLowerCase()}">${request.priority}</span>
          </div>
          <div class="meta"><strong>Email:</strong> ${request.email}</div>
          <div class="meta"><strong>Category:</strong> ${request.category}</div>
          <div class="meta"><strong>Problem:</strong> ${request.problemDescription}</div>
          <div class="request-actions">
            <button class="edit-btn" data-id="${request.id}">Edit</button>
            <button class="delete-btn" data-id="${request.id}">Delete</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.edit-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.id);
      const response = await fetch(`/api/requests/${id}`);
      const request = await response.json();
      populateForm(request);
    });
  });

  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.id);
      const response = await fetch(`/api/requests/${id}`, { method: 'DELETE' });

      if (response.ok) {
        await fetchRequests();
      }
    });
  });
}

function populateForm(request) {
  isEditing = true;
  requestIdInput.value = request.id;
  document.getElementById('studentName').value = request.studentName;
  document.getElementById('email').value = request.email;
  document.getElementById('category').value = request.category;
  document.getElementById('problemDescription').value = request.problemDescription;
  document.getElementById('priority').value = request.priority;
  submitButton.textContent = 'Update Request';
  cancelEditButton.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  form.reset();
  isEditing = false;
  requestIdInput.value = '';
  submitButton.textContent = 'Submit Request';
  cancelEditButton.classList.add('hidden');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    studentName: document.getElementById('studentName').value,
    email: document.getElementById('email').value,
    category: document.getElementById('category').value,
    problemDescription: document.getElementById('problemDescription').value,
    priority: document.getElementById('priority').value
  };

  const url = isEditing ? `/api/requests/${requestIdInput.value}` : '/api/requests';
  const method = isEditing ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();

  if (!response.ok) {
    alert(result.message || 'Something went wrong');
    return;
  }

  resetForm();
  await fetchRequests();
});

cancelEditButton.addEventListener('click', resetForm);

fetchRequests();
