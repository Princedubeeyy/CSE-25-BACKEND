const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.join(__dirname, 'students.json');

function readStudents() {
	try {
		if (!fs.existsSync(DATA_FILE)) {
			return [];
		}

		const fileContents = fs.readFileSync(DATA_FILE, 'utf8');
		return fileContents.trim() ? JSON.parse(fileContents) : [];
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

function sendHtml(response, statusCode, html) {
	response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
	response.end(html);
}

function page(title, content) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${escapeHtml(title)}</title>
	<style>
		body { font-family: Arial, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #222; }
		form { display: grid; gap: 12px; max-width: 500px; }
		label { font-weight: bold; }
		input { padding: 9px; font-size: 1rem; }
		button, a { display: inline-block; padding: 10px 16px; background: #1769aa; color: white; border: 0; text-decoration: none; cursor: pointer; }
		button:hover, a:hover { background: #0d4f82; }
		table { border-collapse: collapse; width: 100%; margin-top: 24px; }
		th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
		th { background: #eef5fb; }
		.message { padding: 12px; background: #eaf7ea; margin-bottom: 20px; }
	</style>
</head>
<body>
	${content}
</body>
</html>`;
}

function formPage(message = '') {
	return page('Student Records', `${message ? `<p class="message">${escapeHtml(message)}</p>` : ''}
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
		<p><a href="/students">View Student Records</a></p>`);
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

	return page('Student Records', `<h1>Student Records</h1>
		<table>
			<thead><tr><th>Name</th><th>Roll Number</th><th>Course</th><th>Email</th></tr></thead>
			<tbody>${rows}</tbody>
		</table>
		<p><a href="/">Add Another Student</a></p>`);
}

const server = http.createServer((request, response) => {
	if (request.method === 'GET' && request.url === '/') {
		sendHtml(response, 200, formPage());
		return;
	}

	if (request.method === 'GET' && request.url === '/students') {
		sendHtml(response, 200, studentsPage());
		return;
	}

	if (request.method === 'POST' && request.url === '/students') {
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

	sendHtml(response, 404, page('Page Not Found', '<h1>404 - Page Not Found</h1><p><a href="/">Return Home</a></p>'));
});

server.listen(PORT, () => {
	console.log(`Student Records server is running at http://localhost:${PORT}`);
});
