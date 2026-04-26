"use strict";
// Dashboard Logic
async function loadDashboard() {
    try {
        const investments = await apiClient.getInvestments();
        const portfolios = await apiClient.getPortfolios();
        updateDashboardStats(investments);
        loadInvestments(investments);
        loadPortfolios(portfolios);
    }
    catch (error) {
        console.error('Error loading dashboard:', error);
    }
}
function updateDashboardStats(investments) {
    let totalValue = 0;
    let totalCost = 0;
    investments.forEach((inv) => {
        totalValue += inv.currentValue || 0;
        totalCost += inv.totalCost || 0;
    });
    const gain = totalValue - totalCost;
    const gainPercentage = totalCost > 0 ? (gain / totalCost) * 100 : 0;
    const totalInvestmentsElement = document.getElementById('total-investments');
    const portfolioValueElement = document.getElementById('portfolio-value');
    const gainLossElement = document.getElementById('total-gain-loss');
    const gainLossPercentElement = document.getElementById('total-gain-loss-percent');
    totalInvestmentsElement.textContent = investments.length.toString();
    portfolioValueElement.textContent = `$${totalValue.toFixed(2)}`;
    gainLossElement.textContent = `$${gain.toFixed(2)}`;
    gainLossElement.className = gain >= 0 ? 'stat-value gain-positive' : 'stat-value gain-negative';
    gainLossPercentElement.textContent = `${gainPercentage.toFixed(2)}%`;
    gainLossPercentElement.className = gainPercentage >= 0 ? 'stat-value gain-positive' : 'stat-value gain-negative';
}
// Tab switching
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            // Hide all tabs
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            // Show selected tab
            const selectedTab = document.getElementById(tabName);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
            button.classList.add('active');
        });
    });
});
//# sourceMappingURL=dashboard.js.map