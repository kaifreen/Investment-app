"use strict";
// Investments Logic
let currentInvestments = [];
function loadInvestments(investments) {
    currentInvestments = investments;
    const tbody = document.getElementById('investments-tbody');
    if (!investments || investments.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="11">No investments yet. Add your first investment!</td></tr>';
        return;
    }
    tbody.innerHTML = investments.map((inv) => `
    <tr>
      <td>${inv.symbol}</td>
      <td>${inv.name}</td>
      <td>${inv.type}</td>
      <td>${inv.quantity}</td>
      <td>$${inv.buyPrice.toFixed(2)}</td>
      <td>$${inv.currentPrice.toFixed(2)}</td>
      <td>$${inv.totalCost.toFixed(2)}</td>
      <td>$${inv.currentValue.toFixed(2)}</td>
      <td class="${inv.gain >= 0 ? 'gain-positive' : 'gain-negative'}">$${inv.gain.toFixed(2)}</td>
      <td class="${inv.gainPercentage >= 0 ? 'gain-positive' : 'gain-negative'}">${inv.gainPercentage.toFixed(2)}%</td>
      <td>
        <button class="btn btn-edit" onclick="editInvestment('${inv._id}')">Edit</button>
        <button class="btn btn-delete" onclick="deleteInvestmentHandler('${inv._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}
async function openInvestmentModal() {
    const modal = document.getElementById('investment-modal');
    modal.style.display = 'flex';
}
function closeInvestmentModal() {
    const modal = document.getElementById('investment-modal');
    modal.style.display = 'none';
}
async function handleAddInvestment(e) {
    e.preventDefault();
    const symbol = document.getElementById('inv-symbol').value;
    const name = document.getElementById('inv-name').value;
    const type = document.getElementById('inv-type').value;
    const quantity = parseFloat(document.getElementById('inv-quantity').value);
    const buyPrice = parseFloat(document.getElementById('inv-buy-price').value);
    const currentPrice = parseFloat(document.getElementById('inv-current-price').value) || buyPrice;
    const purchaseDate = document.getElementById('inv-purchase-date').value;
    try {
        await apiClient.createInvestment({
            symbol,
            name,
            type,
            quantity,
            buyPrice,
            currentPrice,
            purchaseDate
        });
        showAlert('Investment added successfully!', 'success');
        closeInvestmentModal();
        document.getElementById('investment-form').reset();
        loadDashboard();
    }
    catch (error) {
        showAlert(error.message, 'error');
    }
}
async function editInvestment(id) {
    const investment = currentInvestments.find((inv) => inv._id === id);
    if (!investment)
        return;
    const currentPrice = prompt('Enter new current price:', investment.currentPrice.toString());
    if (currentPrice !== null) {
        try {
            await apiClient.updateInvestment(id, { currentPrice: parseFloat(currentPrice) });
            showAlert('Investment updated successfully!', 'success');
            loadDashboard();
        }
        catch (error) {
            showAlert(error.message, 'error');
        }
    }
}
async function deleteInvestmentHandler(id) {
    if (confirm('Are you sure you want to delete this investment?')) {
        try {
            await apiClient.deleteInvestment(id);
            showAlert('Investment deleted successfully!', 'success');
            loadDashboard();
        }
        catch (error) {
            showAlert(error.message, 'error');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const addInvestmentBtn = document.getElementById('add-investment-btn');
    const investmentForm = document.getElementById('investment-form');
    const closeModal = document.querySelectorAll('.close');
    addInvestmentBtn?.addEventListener('click', openInvestmentModal);
    investmentForm?.addEventListener('submit', handleAddInvestment);
    closeModal.forEach(btn => {
        btn.addEventListener('click', () => {
            (btn.parentElement?.parentElement).style.display = 'none';
        });
    });
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('investment-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
//# sourceMappingURL=investments.js.map