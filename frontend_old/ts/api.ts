// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
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
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(name: string, email: string, password: string): Promise<any> {
    return this.request('POST', '/auth/register', { name, email, password });
  }

  async login(email: string, password: string): Promise<any> {
    return this.request('POST', '/auth/login', { email, password });
  }

  async getProfile(): Promise<any> {
    return this.request('GET', '/auth/profile');
  }

  // Investment endpoints
  async createInvestment(data: any): Promise<any> {
    return this.request('POST', '/investments', data);
  }

  async getInvestments(): Promise<any> {
    return this.request('GET', '/investments');
  }

  async getInvestment(id: string): Promise<any> {
    return this.request('GET', `/investments/${id}`);
  }

  async updateInvestment(id: string, data: any): Promise<any> {
    return this.request('PUT', `/investments/${id}`, data);
  }

  async deleteInvestment(id: string): Promise<any> {
    return this.request('DELETE', `/investments/${id}`);
  }

  // Portfolio endpoints
  async createPortfolio(data: any): Promise<any> {
    return this.request('POST', '/portfolios', data);
  }

  async getPortfolios(): Promise<any> {
    return this.request('GET', '/portfolios');
  }

  async getPortfolio(id: string): Promise<any> {
    return this.request('GET', `/portfolios/${id}`);
  }

  async updatePortfolio(id: string, data: any): Promise<any> {
    return this.request('PUT', `/portfolios/${id}`, data);
  }

  async deletePortfolio(id: string): Promise<any> {
    return this.request('DELETE', `/portfolios/${id}`);
  }

  async addInvestmentToPortfolio(portfolioId: string, investmentId: string): Promise<any> {
    return this.request('POST', `/portfolios/${portfolioId}/add-investment`, { investmentId });
  }
}

const apiClient = new APIClient();
