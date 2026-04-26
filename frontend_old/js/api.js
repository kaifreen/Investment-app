"use strict";
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';
class APIClient {
    constructor() {
        this.token = null;
        this.token = localStorage.getItem('token');
    }
    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }
    getToken() {
        return this.token;
    }
    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
    async request(method, endpoint, data) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders(),
        };
        if (data) {
            options.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'API Error');
            }
            return result;
        }
        catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    // Auth endpoints
    async register(name, email, password) {
        return this.request('POST', '/auth/register', { name, email, password });
    }
    async login(email, password) {
        return this.request('POST', '/auth/login', { email, password });
    }
    async getProfile() {
        return this.request('GET', '/auth/profile');
    }
    // Investment endpoints
    async createInvestment(data) {
        return this.request('POST', '/investments', data);
    }
    async getInvestments() {
        return this.request('GET', '/investments');
    }
    async getInvestment(id) {
        return this.request('GET', `/investments/${id}`);
    }
    async updateInvestment(id, data) {
        return this.request('PUT', `/investments/${id}`, data);
    }
    async deleteInvestment(id) {
        return this.request('DELETE', `/investments/${id}`);
    }
    // Portfolio endpoints
    async createPortfolio(data) {
        return this.request('POST', '/portfolios', data);
    }
    async getPortfolios() {
        return this.request('GET', '/portfolios');
    }
    async getPortfolio(id) {
        return this.request('GET', `/portfolios/${id}`);
    }
    async updatePortfolio(id, data) {
        return this.request('PUT', `/portfolios/${id}`, data);
    }
    async deletePortfolio(id) {
        return this.request('DELETE', `/portfolios/${id}`);
    }
    async addInvestmentToPortfolio(portfolioId, investmentId) {
        return this.request('POST', `/portfolios/${portfolioId}/add-investment`, { investmentId });
    }
}
const apiClient = new APIClient();
//# sourceMappingURL=api.js.map