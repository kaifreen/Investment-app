// Portfolios Logic
let currentPortfolios: any[] = [];

function loadPortfolios(portfolios: any[]): void {
  currentPortfolios = portfolios;
  const container = document.getElementById('portfolios-list') as HTMLElement;
  
  if (!portfolios || portfolios.length === 0) {
    container.innerHTML = '<div class="empty-state">No portfolios yet. Create your first portfolio!</div>';
    return;
  }
  
  container.innerHTML = portfolios.map((portfolio: any) => `
    <div class="portfolio-card">
      <h4>${portfolio.name}</h4>
      <p>${portfolio.description || 'No description'}</p>
      <p><strong>Investments:</strong> ${portfolio.investments?.length || 0}</p>
      <p><strong>Total Value:</strong> $${portfolio.totalValue?.toFixed(2) || '0.00'}</p>
      <div class="portfolio-actions">
        <button class="btn btn-edit btn-small" onclick="editPortfolio('${portfolio._id}')">Edit</button>
        <button class="btn btn-delete btn-small" onclick="deletePortfolioHandler('${portfolio._id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

async function openPortfolioModal(): Promise<void> {
  const modal = document.getElementById('portfolio-modal') as HTMLElement;
  modal.style.display = 'flex';
}

function closePortfolioModal(): void {
  const modal = document.getElementById('portfolio-modal') as HTMLElement;
  modal.style.display = 'none';
}

async function handleAddPortfolio(e: Event): Promise<void> {
  e.preventDefault();
  
  const name = (document.getElementById('port-name') as HTMLInputElement).value;
  const description = (document.getElementById('port-description') as HTMLTextAreaElement).value;
  
  try {
    await apiClient.createPortfolio({ name, description });
    showAlert('Portfolio created successfully!', 'success');
    closePortfolioModal();
    (document.getElementById('portfolio-form') as HTMLFormElement).reset();
    loadDashboard();
  } catch (error) {
    showAlert((error as Error).message, 'error');
  }
}

async function editPortfolio(id: string): Promise<void> {
  const portfolio = currentPortfolios.find((p: any) => p._id === id);
  if (!portfolio) return;
  
  const newName = prompt('Enter portfolio name:', portfolio.name);
  if (newName !== null) {
    try {
      await apiClient.updatePortfolio(id, { name: newName });
      showAlert('Portfolio updated successfully!', 'success');
      loadDashboard();
    } catch (error) {
      showAlert((error as Error).message, 'error');
    }
  }
}

async function deletePortfolioHandler(id: string): Promise<void> {
  if (confirm('Are you sure you want to delete this portfolio?')) {
    try {
      await apiClient.deletePortfolio(id);
      showAlert('Portfolio deleted successfully!', 'success');
      loadDashboard();
    } catch (error) {
      showAlert((error as Error).message, 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addPortfolioBtn = document.getElementById('add-portfolio-btn') as HTMLElement;
  const portfolioForm = document.getElementById('portfolio-form') as HTMLFormElement;
  
  addPortfolioBtn?.addEventListener('click', openPortfolioModal);
  portfolioForm?.addEventListener('submit', handleAddPortfolio);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e: MouseEvent) => {
    const modal = document.getElementById('portfolio-modal') as HTMLElement;
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
