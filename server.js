const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

function readStudents() {
	if (!fs.existsSync(DATA_FILE)) {
		return [];
	}

	try {
		const contents = fs.readFileSync(DATA_FILE, 'utf8').trim();
		return contents ? JSON.parse(contents) : [];
	} catch (error) {
		console.error('Could not read students.json:', error.message);
		return [];
	}
}

function saveStudents(students) {
	fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function renderPage(title, content) {
	return `<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${escapeHtml(title)}</title>
	<style>
		:root { color-scheme: light; font-family: Arial, sans-serif; background: #f4f7fb; color: #172033; }
		body { margin: 0; }
		main { max-width: 880px; margin: 0 auto; padding: 48px 20px; }
		.panel { background: #fff; border: 1px solid #dbe3ef; border-radius: 10px; padding: 28px; box-shadow: 0 8px 24px rgba(23, 32, 51, .06); }
		h1 { margin-top: 0; color: #123b63; }
		form { display: grid; gap: 14px; max-width: 520px; }
		label { font-weight: 700; }
		input { border: 1px solid #b9c7d8; border-radius: 5px; box-sizing: border-box; font-size: 1rem; padding: 11px; width: 100%; }
		button, a.button { background: #1261a0; border: 0; border-radius: 5px; color: #fff; cursor: pointer; display: inline-block; font-size: 1rem; padding: 11px 16px; text-decoration: none; }
		button:hover, a.button:hover { background: #0d4775; }
		.actions { margin-top: 22px; }
		.notice { background: #e7f5eb; border-left: 4px solid #218739; padding: 12px; }
		table { border-collapse: collapse; margin-top: 22px; width: 100%; }
		th, td { border: 1px solid #dbe3ef; padding: 12px; text-align: left; }
		th { background: #edf4fb; color: #123b63; }
		@media (max-width: 620px) { .panel { padding: 20px; overflow-x: auto; } table { min-width: 600px; } }
	</style>
</head>
<body><main><section class="panel">${content}</section></main></body>
</html>`;
}

function sendHtml(response, statusCode, html) {
	response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
	response.end(html);
}

function formPage(message = '') {
	return renderPage('Student Records', `${message ? `<p class="notice">${escapeHtml(message)}</p>` : ''}
		<h1>Student Records</h1>
		<p>Welcome to the Student Records application.</p>
		<form method="POST" action="/students">
			<label for="name">Student Name</label>
			<input id="name" name="name" type="text" required>

			<label for="rollNumber">Roll Number</label>
			<input id="rollNumber" name="rollNumber" type="text" required>

			<label for="course">Course</label>
			<input id="course" name="course" type="text" required>

			<label for="email">Email</label>
			<input id="email" name="email" type="email" required>

			<button type="submit">Add Student</button>
		</form>
		<div class="actions"><a class="button" href="/students">View Student Records</a></div>`);
}

function studentsPage() {
	const students = readStudents();
	const rows = students.length
		? students.map((student) => `<tr>
				<td>${escapeHtml(student.name)}</td>
				<td>${escapeHtml(student.rollNumber)}</td>
				<td>${escapeHtml(student.course)}</td>
				<td>${escapeHtml(student.email)}</td>
			</tr>`).join('')
		: '<tr><td colspan="4">No student records found.</td></tr>';

	return renderPage('Student Records', `<h1>Student Records</h1>
		<table>
			<thead><tr><th>Name</th><th>Roll Number</th><th>Course</th><th>Email</th></tr></thead>
			<tbody>${rows}</tbody>
		</table>
		<div class="actions"><a class="button" href="/">Add Another Student</a></div>`);
}

const server = http.createServer((request, response) => {
	const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

	if (request.method === 'GET' && url.pathname === '/') {
		sendHtml(response, 200, formPage());
		return;
	}

	if (request.method === 'GET' && url.pathname === '/students') {
		sendHtml(response, 200, studentsPage());
		return;
	}

	if (request.method === 'POST' && url.pathname === '/students') {
		let body = '';

		request.on('data', (chunk) => {
			body += chunk;
			if (body.length > 10000) {
				request.destroy();
			}
		});

		request.on('end', () => {
			const fields = querystring.parse(body);
			const student = {
				name: String(fields.name || '').trim(),
				rollNumber: String(fields.rollNumber || '').trim(),
				course: String(fields.course || '').trim(),
				email: String(fields.email || '').trim()
			};

			if (Object.values(student).some((value) => !value)) {
				sendHtml(response, 400, formPage('All fields are required.'));
				return;
			}

			const students = readStudents();
			students.push(student);
			saveStudents(students);
			response.writeHead(302, { Location: '/students' });
			response.end();
		});
		return;
	}

	sendHtml(response, 404, renderPage('Page Not Found', '<h1>404 - Page Not Found</h1><p><a class="button" href="/">Return Home</a></p>'));
});

server.listen(PORT, () => {
	console.log(`Student Records server is running at http://localhost:${PORT}`);
});
