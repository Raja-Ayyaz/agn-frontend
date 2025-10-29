import CONFIG from '../Config/config';

const BASE = CONFIG.BASE_URL.replace(/\/$/, '');

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(json && json.error ? json.error : `Request failed: ${res.status}`);
      err.response = json;
      throw err;
    }
    return json;
  } catch (e) {
    // non-json or parse fail
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return text;
  }
}

export async function adminLogin(username, password) {
  return request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function employerLogin(username, password) {
  return request('/api/employer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
}

export async function employerSignup({ username, company_name, email, password }) {
  return request('/api/employer/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, company_name, email, password }),
  });
}

export async function listEmployees(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/employees?${qs}`);
}

export async function getEmployee(employeeId) {
  return request(`/api/employee/${employeeId}`);
}

export async function insertEmployee(formData) {
  // formData should be a FormData instance for file uploads
  return request('/insert_employee', {
    method: 'POST',
    body: formData,
  });
}

export async function updateEmployeeCv(employeeId, formData) {
  return request(`/api/employee/${employeeId}/update_cv`, {
    method: 'POST',
    body: formData,
  });
}

export async function createHireRequest({ employer_id, employee_id, message }) {
  return request('/api/hire-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ employer_id, employee_id, message }),
  });
}

export async function getEmployerHireRequests(employer_id) {
  return request(`/api/hire-requests/${employer_id}`);
}

export async function getAllHireRequests() {
  return request('/api/admin/hire-requests');
}

export async function respondToHireRequest({ request_id, status, response_message }) {
  return request('/api/admin/hire-request/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ request_id, status, response_message }),
  });
}

export default {
  adminLogin,
  employerLogin,
  employerSignup,
  listEmployees,
  getEmployee,
  insertEmployee,
  updateEmployeeCv,
  createHireRequest,
  getEmployerHireRequests,
  getAllHireRequests,
  respondToHireRequest,
};
