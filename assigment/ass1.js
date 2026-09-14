import http from 'http';
import fs from 'fs';

const PORT = 3000;
const studentsFile = './assigment/students.json';

const escapeHtml = (value) => String(value)
	.replaceAll('&', '&amp;')
	.replaceAll('<', '&lt;')
	.replaceAll('>', '&gt;')
	.replaceAll('"', '&quot;')
	.replaceAll("'", '&#039;');

const readStudents = () => {
	try {
		const data = fs.readFileSync(studentsFile, 'utf8');
		if (!data.trim()) {
			return [];
		}
		return JSON.parse(data);
	} catch (error) {
		if (error.code === 'ENOENT') {
			fs.writeFileSync(studentsFile, '[]');
			return [];
		}
		throw error;
	}
};

const sendHtml = (response, statusCode, html) => {
	response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
	response.end(html);
};

const formPage = (message = '') => `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Student Records</title>
</head>
<body>
	<h1>Student Records</h1>
	<p>${message}</p>
	<form action="/students" method="POST">
		<label>Student Name: <input type="text" name="name" required></label><br><br>
		<label>Roll Number: <input type="text" name="rollNumber" required></label><br><br>
		<label>Course: <input type="text" name="course" required></label><br><br>
		<label>Email: <input type="email" name="email" required></label><br><br>
		<button type="submit">Add Student</button>
	</form>
	<p><a href="/students">View all student records</a></p>
</body>
</html>`;

const studentsPage = () => {
	const students = readStudents();
	const rows = students.length === 0
		? '<tr><td colspan="4">No student records found.</td></tr>'
		: students.map((student) => `<tr>
				<td>${escapeHtml(student.name)}</td>
				<td>${escapeHtml(student.rollNumber)}</td>
				<td>${escapeHtml(student.course)}</td>
				<td>${escapeHtml(student.email)}</td>
			</tr>`).join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Student Records</title>
</head>
<body>
	<h1>Student Records</h1>
	<table border="1" cellpadding="8">
		<thead><tr><th>Name</th><th>Roll Number</th><th>Course</th><th>Email</th></tr></thead>
		<tbody>${rows}</tbody>
	</table>
	<p><a href="/">Add another student</a></p>
</body>
</html>`;
};

const server = http.createServer((request, response) => {
	if (request.method === 'GET' && request.url === '/') {
		sendHtml(response, 200, formPage('Welcome to the Student Records application.'));
		return;
	}

	if (request.method === 'GET' && request.url === '/students') {
		sendHtml(response, 200, studentsPage());
		return;
	}

	if (request.method === 'POST' && request.url === '/students') {
		let body = '';
		request.on('data', (chunk) => { body += chunk; });
		request.on('end', () => {
			const formData = new URLSearchParams(body);
			const student = {
				name: formData.get('name')?.trim() || '',
				rollNumber: formData.get('rollNumber')?.trim() || '',
				course: formData.get('course')?.trim() || '',
				email: formData.get('email')?.trim() || ''
			};

			if (Object.values(student).some((value) => !value)) {
				sendHtml(response, 400, formPage('Please complete every field.'));
				return;
			}

			const students = readStudents();
			students.push(student);
			fs.writeFileSync(studentsFile, JSON.stringify(students, null, 2));
			response.writeHead(302, { Location: '/students' });
			response.end();
		});
		return;
	}

	sendHtml(response, 404, '<h1>404 - Page not found</h1>');
});

server.listen(PORT, () => {
	console.log(`Student Records server is running at http://localhost:${PORT}`);
});
//Problem Statement-
// Develop a Node.js application using only the built-in http and fs modules.
// The application should manage Student Records stored in a text/JSON file.

