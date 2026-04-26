"use strict";
// Portfolios Logic
let currentPortfolios = [];
function loadPortfolios(portfolios) {
    currentPortfolios = portfolios;
    const container = document.getElementById('portfolios-list');
    if (!portfolios || portfolios.length === 0) {
        container.innerHTML = '<div class="empty-state">No portfolios yet. Create your first portfolio!</div>';
        return;
    }
    container.innerHTML = portfolios.map((portfolio) => `
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
async function openPortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    modal.style.display = 'flex';
}
function closePortfolioModal() {
    const modal = document.getElementById('portfolio-modal');
    modal.style.display = 'none';
}
async function handleAddPortfolio(e) {
    e.preventDefault();
    const name = document.getElementById('port-name').value;
    const description = document.getElementById('port-description').value;
    try {
        await apiClient.createPortfolio({ name, description });
        showAlert('Portfolio created successfully!', 'success');
        closePortfolioModal();
        document.getElementById('portfolio-form').reset();
        loadDashboard();
    }
    catch (error) {
        showAlert(error.message, 'error');
    }
}
async function editPortfolio(id) {
    const portfolio = currentPortfolios.find((p) => p._id === id);
    if (!portfolio)
        return;
    const newName = prompt('Enter portfolio name:', portfolio.name);
    if (newName !== null) {
        try {
            await apiClient.updatePortfolio(id, { name: newName });
            showAlert('Portfolio updated successfully!', 'success');
            loadDashboard();
        }
        catch (error) {
            showAlert(error.message, 'error');
        }
    }
}
async function deletePortfolioHandler(id) {
    if (confirm('Are you sure you want to delete this portfolio?')) {
        try {
            await apiClient.deletePortfolio(id);
            showAlert('Portfolio deleted successfully!', 'success');
            loadDashboard();
        }
        catch (error) {
            showAlert(error.message, 'error');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const addPortfolioBtn = document.getElementById('add-portfolio-btn');
    const portfolioForm = document.getElementById('portfolio-form');
    addPortfolioBtn?.addEventListener('click', openPortfolioModal);
    portfolioForm?.addEventListener('submit', handleAddPortfolio);
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('portfolio-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
//# sourceMappingURL=portfolios.js.map