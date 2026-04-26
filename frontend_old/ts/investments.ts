// Investments Logic
let currentInvestments: any[] = [];

function loadInvestments(investments: any[]): void {
  currentInvestments = investments;
  const tbody = document.getElementById('investments-tbody') as HTMLElement;
  
  if (!investments || investments.length === 0) {
    tbody.innerHTML = '<tr class="empty-state"><td colspan="11">No investments yet. Add your first investment!</td></tr>';
    return;
  }
  
  tbody.innerHTML = investments.map((inv: any) => `
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

async function openInvestmentModal(): Promise<void> {
  const modal = document.getElementById('investment-modal') as HTMLElement;
  modal.style.display = 'flex';
}

function closeInvestmentModal(): void {
  const modal = document.getElementById('investment-modal') as HTMLElement;
  modal.style.display = 'none';
}

async function handleAddInvestment(e: Event): Promise<void> {
  e.preventDefault();
  
  const symbol = (document.getElementById('inv-symbol') as HTMLInputElement).value;
  const name = (document.getElementById('inv-name') as HTMLInputElement).value;
  const type = (document.getElementById('inv-type') as HTMLSelectElement).value;
  const quantity = parseFloat((document.getElementById('inv-quantity') as HTMLInputElement).value);
  const buyPrice = parseFloat((document.getElementById('inv-buy-price') as HTMLInputElement).value);
  const currentPrice = parseFloat((document.getElementById('inv-current-price') as HTMLInputElement).value) || buyPrice;
  const purchaseDate = (document.getElementById('inv-purchase-date') as HTMLInputElement).value;
  
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
    (document.getElementById('investment-form') as HTMLFormElement).reset();
    loadDashboard();
  } catch (error) {
    showAlert((error as Error).message, 'error');
  }
}

async function editInvestment(id: string): Promise<void> {
  const investment = currentInvestments.find((inv: any) => inv._id === id);
  if (!investment) return;
  
  const currentPrice = prompt('Enter new current price:', investment.currentPrice.toString());
  if (currentPrice !== null) {
    try {
      await apiClient.updateInvestment(id, { currentPrice: parseFloat(currentPrice) });
      showAlert('Investment updated successfully!', 'success');
      loadDashboard();
    } catch (error) {
      showAlert((error as Error).message, 'error');
    }
  }
}

async function deleteInvestmentHandler(id: string): Promise<void> {
  if (confirm('Are you sure you want to delete this investment?')) {
    try {
      await apiClient.deleteInvestment(id);
      showAlert('Investment deleted successfully!', 'success');
      loadDashboard();
    } catch (error) {
      showAlert((error as Error).message, 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addInvestmentBtn = document.getElementById('add-investment-btn') as HTMLElement;
  const investmentForm = document.getElementById('investment-form') as HTMLFormElement;
  const closeModal = document.querySelectorAll('.close');
  
  addInvestmentBtn?.addEventListener('click', openInvestmentModal);
  investmentForm?.addEventListener('submit', handleAddInvestment);
  
  closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
      (btn.parentElement?.parentElement as HTMLElement).style.display = 'none';
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e: MouseEvent) => {
    const modal = document.getElementById('investment-modal') as HTMLElement;
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
