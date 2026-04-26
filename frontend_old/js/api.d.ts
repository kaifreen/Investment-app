declare const API_BASE_URL = "http://localhost:5000/api";
declare class APIClient {
    private token;
    constructor();
    setToken(token: string): void;
    getToken(): string | null;
    clearToken(): void;
    private getHeaders;
    request(method: string, endpoint: string, data?: any): Promise<any>;
    register(name: string, email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
    getProfile(): Promise<any>;
    createInvestment(data: any): Promise<any>;
    getInvestments(): Promise<any>;
    getInvestment(id: string): Promise<any>;
    updateInvestment(id: string, data: any): Promise<any>;
    deleteInvestment(id: string): Promise<any>;
    createPortfolio(data: any): Promise<any>;
    getPortfolios(): Promise<any>;
    getPortfolio(id: string): Promise<any>;
    updatePortfolio(id: string, data: any): Promise<any>;
    deletePortfolio(id: string): Promise<any>;
    addInvestmentToPortfolio(portfolioId: string, investmentId: string): Promise<any>;
}
declare const apiClient: APIClient;
//# sourceMappingURL=api.d.ts.map