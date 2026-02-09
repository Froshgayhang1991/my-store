function GetLabel(key) {
  if (window.labels && window.labels[key]) {
    return window.labels[key];
  }
  return key;
}

function handleInputFocus() {
  const agentDetails = document.getElementById('agentDetails');
  const errorDiv = document.getElementById('codeError');
  agentDetails.style.display = 'none';
  errorDiv.style.display = 'none';
  // Removed: categoryButtons.style.display = 'none';
  // Removed: document.querySelectorAll('.category-section').forEach...
}

function validateAndFindAgent(input) {
  const code = input.value.replace(/\D/g, '');
  const errorDiv = document.getElementById('codeError');
  const agentDetails = document.getElementById('agentDetails');
  const agentSelect = document.getElementById('agentSelect');
  
  agentDetails.style.display = 'none';
  errorDiv.style.display = 'none';
  input.value = code;
  
  if (code.length < 4) {
    if (code.length > 0) {
      errorDiv.textContent = GetLabel('code_too_short');
      errorDiv.style.display = 'block';
    }
    return;
  }
  
  const options = agentSelect.options;
  let matchingAgents = [];
  
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option.value && option.dataset.lastfour === code) {
      matchingAgents.push({
        element: option,
        value: option.value,
        text: option.text,
        mobile: option.dataset.mobile,
        address: option.dataset.address
      });
    }
  }
  
  if (matchingAgents.length === 0) {
    errorDiv.textContent = GetLabel('agent_not_found');
    errorDiv.style.display = 'block';
  } else {
    errorDiv.style.display = 'none';
    showAgentConfirmation(matchingAgents[0]);
  }
}

function showAgentConfirmation(agent) {
  const agentDetails = document.getElementById('agentDetails');
  document.getElementById('confirmAgentName').textContent = agent.text;
  document.getElementById('confirmAgentMobile').textContent = agent.mobile;
  document.getElementById('confirmAgentAddress').textContent = agent.address;
  agentDetails.setAttribute('data-agent-value', agent.value);
  agentDetails.style.display = 'block';
}

function confirmAgentSelection() {
  const agentDetails = document.getElementById('agentDetails');
  const agentSelect = document.getElementById('agentSelect');
  const categoryButtons = document.getElementById('categoryButtons');
  const categoryMessage = document.getElementById('categoryMessage');
  const errorDiv = document.getElementById('codeError');
  const agentValue = agentDetails.getAttribute('data-agent-value');
  
  if (agentValue) {
    agentSelect.value = agentValue;
    errorDiv.style.display = 'none';
    agentDetails.style.display = 'none';
    categoryMessage.style.display = 'block';
    categoryButtons.style.display = 'block';
    updateAgentInfo();
  }
}

function cancelAgentSelection() {
  const agentDetails = document.getElementById('agentDetails');
  const agentSelect = document.getElementById('agentSelect');
  const input = document.getElementById('agentCode');
  const errorDiv = document.getElementById('codeError');
  agentDetails.style.display = 'none';
  agentSelect.value = '';
  input.value = '';
  errorDiv.style.display = 'none';
  document.getElementById('categoryButtons').style.display = 'none';
  document.getElementById('categoryMessage').style.display = 'none';
  document.querySelectorAll('.category-section').forEach(s => s.classList.add('hidden'));
  input.focus();
}

function updateAgentInfo() {
  const select = document.getElementById('agentSelect');
  const categoryButtons = document.getElementById('categoryButtons');
  const categoryMessage = document.getElementById('categoryMessage');
  
  if (select.value) {
    categoryMessage.style.display = 'block';
    categoryButtons.style.display = 'block';
  } else {
    categoryMessage.style.display = 'none';
    categoryButtons.style.display = 'none';
    document.querySelectorAll('.category-section').forEach(s => s.classList.add('hidden'));
  }
}

function showCategory(event, category) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  
  const categoryMessage = document.getElementById('categoryMessage');
  const backBtn = document.getElementById('backToCategoriesBtn');
  
  categoryMessage.style.display = 'none';
  
  document.querySelectorAll('.category-section').forEach(section => {
    if (section.dataset.category === category) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });
  
  setTimeout(() => {
    const productsContainer = document.getElementById('productsContainer');
    if (productsContainer) {
      window.scrollTo({ top: productsContainer.offsetTop - 20, behavior: 'smooth' });
    }
  }, 100);
  
  return false;
}

function increaseQuantity(event, btn) {
  if (event) event.stopPropagation();
  const input = btn.nextElementSibling;
  const currentValue = parseFloat(input.value) || 0;
  input.value = currentValue + 1;
  updateCart();
}

function decreaseQuantity(event, btn) {
  if (event) event.stopPropagation();
  const input = btn.previousElementSibling;
  const currentValue = parseFloat(input.value) || 0;
  if (currentValue > 0) {
    input.value = Math.max(0, currentValue - 1);
    updateCart();
  }
}

function addHalfQuantity(event, btn) {
  if (event) event.stopPropagation();
  const input = btn.previousElementSibling.previousElementSibling;
  const currentValue = parseFloat(input.value) || 0;
  input.value = currentValue + 0.5;
  updateCart();
}

function increaseInvoiceQuantity(inputId) {
  if (event) event.stopPropagation();
  const invoiceInput = document.getElementById('invoice_qty_' + inputId);
  const mainInput = document.getElementById('qty_' + inputId);
  const currentValue = parseFloat(invoiceInput.value) || 0;
  invoiceInput.value = currentValue + 1;
  mainInput.value = invoiceInput.value;
  updateInvoiceTotals();
  updateCart();
}

function decreaseInvoiceQuantity(inputId) {
  if (event) event.stopPropagation();
  const invoiceInput = document.getElementById('invoice_qty_' + inputId);
  const mainInput = document.getElementById('qty_' + inputId);
  const currentValue = parseFloat(invoiceInput.value) || 0;
  if (currentValue > 0) {
    const newValue = Math.max(0, currentValue - 1);
    invoiceInput.value = newValue;
    mainInput.value = newValue;
    updateInvoiceTotals();
    updateCart();
  }
}

function addHalfInvoiceQuantity(inputId) {
  if (event) event.stopPropagation();
  const invoiceInput = document.getElementById('invoice_qty_' + inputId);
  const mainInput = document.getElementById('qty_' + inputId);
  const currentValue = parseFloat(invoiceInput.value) || 0;
  invoiceInput.value = currentValue + 0.5;
  mainInput.value = invoiceInput.value;
  updateInvoiceTotals();
  updateCart();
}

function updateCart() {
  let total = 0;
  let totalQuantity = 0;
  document.querySelectorAll('.quantity').forEach(input => {
    const qty = parseFloat(input.value) || 0;
    const price = parseFloat(input.dataset.price) || 0;
    if (qty > 0) {
      total += qty * price;
      totalQuantity += qty;
    }
  });
  document.getElementById('cartTotalQuantity').textContent = totalQuantity;
  document.getElementById('cartTotal').textContent = total.toLocaleString();
  
  const cartSection = document.getElementById('cartSection');
  if (totalQuantity > 0) {
    cartSection.style.display = 'flex';
  } else {
    cartSection.style.display = 'none';
  }
}

function showInvoice() {
  const agentSelect = document.getElementById('agentSelect');
  if (!agentSelect || !agentSelect.value) {
    alert(GetLabel('agent_alert_msg'));
    if (document.getElementById('agentCode')) {
      document.getElementById('agentCode').focus();
    }
    return;
  }
  
  const products = [];
  let totalPrice = 0;
  let totalQty = 0;
  
  document.querySelectorAll('.quantity').forEach(input => {
    const qty = parseFloat(input.value) || 0;
    if (qty > 0) {
      const price = parseFloat(input.dataset.price) || 0;
      
      products.push({
        name: input.dataset.name,
        code: input.dataset.code,
        price: price,
        qty: qty,
        total: qty * price,
        inputId: input.id.replace('qty_', '')
      });
      totalPrice += qty * price;
      totalQty += qty;
    }
  });
  
  if (products.length === 0) {
    alert(GetLabel('cart_alert_msg'));
    return;
  }
  
  const now = new Date();
  const date = now.toLocaleDateString('en-GB');
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  document.getElementById('invoiceDateTime').textContent = date + ' - ' + time;
  
  const selectedOption = agentSelect.options[agentSelect.selectedIndex];
  document.getElementById('invoiceAgentName').textContent = selectedOption.dataset.name;
  document.getElementById('invoiceAgentMobile').textContent = selectedOption.dataset.mobile;
  document.getElementById('invoiceAgentAddress').textContent = selectedOption.dataset.address;
  
  const invoiceItems = document.getElementById('invoiceItems');
  invoiceItems.innerHTML = '';
  products.forEach((product, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'invoice-item';
    itemDiv.innerHTML = `
      <div class='invoice-item-info'>
        <strong>${product.name}</strong><br>
        <small>${GetLabel('code_label')}: ${product.code}</small><br>
        <small>${GetLabel('price_label')}: ${product.price.toLocaleString()} ${GetLabel('dinar')}</small>
      </div>
      <div class='invoice-item-controls'>
        <div class='invoice-quantity-section'>
          <div class='invoice-quantity-controls'>
            <button type='button' class='invoice-qty-btn plus' onclick='increaseInvoiceQuantity("${product.inputId}")'>+</button>
            <button type='button' class='invoice-qty-btn half' onclick='addHalfInvoiceQuantity("${product.inputId}")'>نیو کارتۆن</button>
            <input type='number' class='invoice-quantity' id='invoice_qty_${product.inputId}' value='${product.qty}' min='0' step='0.5' onchange='updateInvoiceQuantity(this, "${product.inputId}")'>
            <button type='button' class='invoice-qty-btn minus' onclick='decreaseInvoiceQuantity("${product.inputId}")'>-</button>
          </div>
        </div>
        <div class='invoice-item-total'>
        <strong>${product.total.toLocaleString()} ${GetLabel('dinar')}</strong>
        </div>
      </div>
    `;
    invoiceItems.appendChild(itemDiv);
  });
  
  updateInvoiceTotals();
  document.getElementById('invoiceModal').style.display = 'flex';
}

function updateInvoiceQuantity(input, inputId) {
  const mainInput = document.getElementById('qty_' + inputId);
  mainInput.value = input.value;
  updateInvoiceTotals();
  updateCart();
}

function updateInvoiceTotals() {
  let totalPrice = 0;
  let totalQty = 0;
  document.querySelectorAll('.invoice-quantity').forEach(input => {
    const qty = parseFloat(input.value) || 0;
    const inputId = input.id.replace('invoice_qty_', '');
    const mainInput = document.getElementById('qty_' + inputId);
    const price = parseFloat(mainInput.dataset.price) || 0;
    const itemTotal = qty * price;
    
    const itemTotalElement = input.closest('.invoice-item-controls').querySelector('.invoice-item-total strong');
    if (itemTotalElement) {
      itemTotalElement.textContent = itemTotal.toLocaleString() + ' ' + GetLabel('dinar');
    }
    
    if (qty > 0) {
      totalPrice += itemTotal;
      totalQty += qty;
    }
  });
  document.getElementById('invoiceTotalQty').textContent = totalQty;
  document.getElementById('invoiceTotalPrice').textContent = totalPrice.toLocaleString();
}

function closeInvoice() {
  document.getElementById('invoiceModal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('invoiceModal');
  if (event.target === modal) {
    closeInvoice();
  }
}

function sendToWhatsApp() {
  if (document.getElementById('invoiceModal')) {
    document.getElementById('invoiceModal').style.display = 'none';
  }
  
  const products = [];
  let totalPrice = 0;
  let totalQty = 0;
  
  document.querySelectorAll('.quantity').forEach(input => {
    const qty = parseFloat(input.value) || 0;
    if (qty > 0) {
      const price = parseFloat(input.dataset.price) || 0;
      
      products.push({
        name: input.dataset.name,
        code: input.dataset.code,
        price: price,
        qty: qty,
        total: qty * price
      });
      totalPrice += qty * price;
      totalQty += qty;
    }
  });
  
  console.log('Number of products selected:', products.length);
  
  if (products.length === 0) {
    alert('Please select at least one product');
    return;
  }
  
  const agentSelect = document.getElementById('agentSelect');
  if (!agentSelect || !agentSelect.value) {
    alert('Please select an agent first');
    document.getElementById('agentCode').focus();
    return;
  }
  
  const selectedOption = agentSelect.options[agentSelect.selectedIndex];
  const agentName = selectedOption.dataset.name;
  const agentMobile = selectedOption.dataset.mobile;
  const agentAddress = selectedOption.dataset.address;
  
  const productCount = products.length;
  const confirmMessage = GetLabel('confirm_send_order').replace('{0}', productCount.toString());
  const confirmSend = confirm(confirmMessage);
  if (!confirmSend) return;
  
  const now = new Date();
  const date = now.toLocaleDateString('en-GB');
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  let message = GetLabel('new_order') + '%0A';
  message += date + ' - ' + time + '%0A';
  message += '%0A';
  
  message += GetLabel('agent_info') + '%0A';
  message += GetLabel('name_label') + ': ' + agentName + '%0A';
  message += GetLabel('mobile_label') + ': ' + agentMobile + '%0A';
  message += GetLabel('address_label') + ': ' + agentAddress + '%0A';
  message += '%0A';
  
  message += GetLabel('product_list') + '%0A';
  
  products.forEach((product, index) => {
    const qtyDisplay = product.qty % 1 === 0 ? product.qty : product.qty;
    message += '' + (index + 1) + ' - ' + product.name + ' - ' + product.code + '%0A';
    message += '   ' + GetLabel('quantity_label') + ': (' + qtyDisplay + ') - ' +
                GetLabel('price_label') + ': ' + product.price.toLocaleString() + ' - ' +
                GetLabel('total_label') + ': ' + product.total.toLocaleString() + '%0A';
  });
  
  message += '%0A';
  message += GetLabel('total_quantity') + ': ' + totalQty + '%0A';
  message += GetLabel('total_price') + ': ' + totalPrice.toLocaleString() + ' ' + GetLabel('dinar') + '%0A';
  message += '%0A';
  message += GetLabel('thanks') + '%0A';
  
  const phoneNumber = '9647501061451';
  const whatsappURL = 'https://wa.me/' + phoneNumber + '?text=' + message;
  
  const newWindow = window.open(whatsappURL, '_blank');
  
  setTimeout(() => {
    if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
      const link = document.createElement('a');
      link.href = whatsappURL;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, 100);
}

window.addEventListener('scroll', function() {
  const backBtn = document.getElementById('backToCategoriesBtn');
  const isCategorySelected = Array.from(document.querySelectorAll('.category-section')).some(section => {
    return !section.classList.contains('hidden');
  });
  
  if (isCategorySelected && window.scrollY > 300) {
    backBtn.style.display = 'flex';
  } else {
    backBtn.style.display = 'none';
  }
});

function scrollToCategories() {
  const categoryButtons = document.getElementById('categoryButtons');
  if (categoryButtons) {
    categoryButtons.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
