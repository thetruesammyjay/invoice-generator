import React, { useState, useRef } from 'react';

// Currency options with symbols and codes
const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' }
];

// Mock exchange rates (in a real app, these would come from an API)
const EXCHANGE_RATES = {
    USD: { EUR: 0.85, GBP: 0.73, JPY: 110, CAD: 1.25, AUD: 1.35, CHF: 0.92, CNY: 6.45, INR: 74.5, BRL: 5.2, MXN: 20.1, SGD: 1.35, HKD: 7.8, KRW: 1180, THB: 33.5, MYR: 4.15, PHP: 50.5, IDR: 14250, VND: 23050, SEK: 8.6, NOK: 8.5, DKK: 6.35, PLN: 3.9, CZK: 21.5, HUF: 295, RUB: 74, ZAR: 14.5, NZD: 1.42, TRY: 8.4, ILS: 3.25 },
    EUR: { USD: 1.18, GBP: 0.86, JPY: 129, CAD: 1.47, AUD: 1.59, CHF: 1.08, CNY: 7.59, INR: 87.7, BRL: 6.12, MXN: 23.7, SGD: 1.59, HKD: 9.18, KRW: 1391, THB: 39.5, MYR: 4.89, PHP: 59.5, IDR: 16795, VND: 27159, SEK: 10.1, NOK: 10.0, DKK: 7.48, PLN: 4.59, CZK: 25.3, HUF: 347, RUB: 87.2, ZAR: 17.1, NZD: 1.67, TRY: 9.9, ILS: 3.83 },
    GBP: { USD: 1.37, EUR: 1.16, JPY: 151, CAD: 1.71, AUD: 1.85, CHF: 1.26, CNY: 8.84, INR: 102, BRL: 7.13, MXN: 27.5, SGD: 1.85, HKD: 10.7, KRW: 1619, THB: 46.0, MYR: 5.69, PHP: 69.2, IDR: 19543, VND: 31608, SEK: 11.8, NOK: 11.6, DKK: 8.71, PLN: 5.34, CZK: 29.5, HUF: 404, RUB: 101, ZAR: 19.9, NZD: 1.95, TRY: 11.5, ILS: 4.46 }
};

// Main App component for the Invoice Generator
const App = () => {
    // State to manage company details
    const [company, setCompany] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        logo: null,
        logoPreview: null
    });

    // State to manage invoice details
    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        invoiceDate: '',
        dueDate: '',
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        items: [],
        taxRate: 0,
        discount: 0,
        primaryCurrency: 'USD',
        secondaryCurrencies: [],
        showMultipleCurrencies: false,
    });

    // State for managing a new item before adding it to the invoice
    const [newItem, setNewItem] = useState({
        description: '',
        quantity: 1,
        unitPrice: 0,
    });

    // Ref for the invoice content area, used for printing
    const invoiceContentRef = useRef(null);
    // Ref for logo file input
    const logoInputRef = useRef(null);

    // Get currency symbol for a specific currency
    const getCurrencySymbol = (currencyCode = invoice.primaryCurrency) => {
        const currency = CURRENCIES.find(c => c.code === currencyCode);
        return currency ? currency.symbol : '$';
    };

    // Convert amount from primary currency to target currency
    const convertCurrency = (amount, fromCurrency, toCurrency) => {
        if (fromCurrency === toCurrency) return amount;
        
        try {
            // Convert to USD first if needed, then to target currency
            let usdAmount = amount;
            if (fromCurrency !== 'USD') {
                const toUsdRate = EXCHANGE_RATES[fromCurrency] && EXCHANGE_RATES[fromCurrency]['USD'] ? EXCHANGE_RATES[fromCurrency]['USD'] : 1;
                usdAmount = amount * toUsdRate;
            }
            
            if (toCurrency === 'USD') return usdAmount;
            
            const rate = EXCHANGE_RATES['USD'] && EXCHANGE_RATES['USD'][toCurrency] ? EXCHANGE_RATES['USD'][toCurrency] : 1;
            return usdAmount * rate;
        } catch (error) {
            console.error('Currency conversion error:', error);
            return amount; // Return original amount if conversion fails
        }
    };

    // Format amount with currency symbol for specific currency
    const formatAmount = (amount, currencyCode = invoice.primaryCurrency) => {
        try {
            const symbol = getCurrencySymbol(currencyCode);
            
            // Handle special formatting for certain currencies
            if (currencyCode === 'EUR') {
                return `${amount.toFixed(2)} ${symbol}`;
            } else if (['JPY', 'KRW', 'VND', 'IDR'].includes(currencyCode)) {
                // Currencies that don't use decimal places
                return `${symbol}${Math.round(amount)}`;
            } else {
                return `${symbol}${amount.toFixed(2)}`;
            }
        } catch (error) {
            console.error('Format amount error:', error);
            return `$${amount.toFixed(2)}`;
        }
    };

    // Calculate totals whenever invoice items, tax rate, or discount changes
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount - invoice.discount;

    // Handle changes in company input fields
    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompany(prevCompany => ({
            ...prevCompany,
            [name]: value
        }));
    };

    // Handle logo file selection
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if file is an image
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setCompany(prevCompany => ({
                        ...prevCompany,
                        logo: file,
                        logoPreview: e.target.result
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file (PNG, JPG, JPEG, GIF, SVG)');
            }
        }
    };

    // Remove logo
    const handleRemoveLogo = () => {
        setCompany(prevCompany => ({
            ...prevCompany,
            logo: null,
            logoPreview: null
        }));
        if (logoInputRef.current) {
            logoInputRef.current.value = '';
        }
    };

    // Handle changes in general invoice input fields
    const handleInvoiceChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'number' ? parseFloat(value) || 0 : value;
        
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            [name]: newValue
        }));
    };

    // Handle changes in new item input fields
    const handleNewItemChange = (e) => {
        const { name, value, type } = e.target;
        setNewItem(prevItem => ({
            ...prevItem,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    // Add a new item to the invoice
    const handleAddItem = () => {
        if (newItem.description && newItem.quantity > 0 && newItem.unitPrice >= 0) {
            setInvoice(prevInvoice => ({
                ...prevInvoice,
                items: [...prevInvoice.items, { ...newItem, id: Date.now() }]
            }));
            setNewItem({ description: '', quantity: 1, unitPrice: 0 });
        }
    };

    // Remove an item from the invoice by its ID
    const handleRemoveItem = (id) => {
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            items: prevInvoice.items.filter(item => item.id !== id)
        }));
    };

    // Handle changes for existing invoice items
    const handleItemChange = (id, e) => {
        const { name, value, type } = e.target;
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            items: prevInvoice.items.map(item =>
                item.id === id ? { ...item, [name]: type === 'number' ? parseFloat(value) || 0 : value } : item
            )
        }));
    };

    // Add a secondary currency
    const addSecondaryCurrency = (currencyCode) => {
        if (currencyCode && currencyCode !== invoice.primaryCurrency && !invoice.secondaryCurrencies.includes(currencyCode)) {
            setInvoice(prevInvoice => ({
                ...prevInvoice,
                secondaryCurrencies: [...prevInvoice.secondaryCurrencies, currencyCode]
            }));
        }
    };

    // Remove a secondary currency
    const removeSecondaryCurrency = (currencyCode) => {
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            secondaryCurrencies: prevInvoice.secondaryCurrencies.filter(code => code !== currencyCode)
        }));
    };

    // Toggle multi-currency display
    const toggleMultiCurrency = () => {
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            showMultipleCurrencies: !prevInvoice.showMultipleCurrencies
        }));
    };

    // Format amount with multi-currency display
    const formatMultiCurrencyAmount = (amount) => {
        if (!invoice.showMultipleCurrencies || invoice.secondaryCurrencies.length === 0) {
            return formatAmount(amount, invoice.primaryCurrency);
        }

        return (
            <div className="multi-currency-amount">
                <div className="primary-amount">{formatAmount(amount, invoice.primaryCurrency)}</div>
                {invoice.secondaryCurrencies.map((currencyCode) => {
                    try {
                        const convertedAmount = convertCurrency(amount, invoice.primaryCurrency, currencyCode);
                        return (
                            <div key={currencyCode} className="secondary-amount">
                                ≈ {formatAmount(convertedAmount, currencyCode)}
                            </div>
                        );
                    } catch (error) {
                        console.error('Multi-currency format error:', error);
                        return null;
                    }
                })}
            </div>
        );
    };

    // Function to handle printing the invoice
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=800');
        printWindow.document.write('<html><head><title>Invoice</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            :root {
                --primary-blue: #01015C;
                --accent-orange: #FFA200;
                --background-white: #FFFFFF;
                --text-gray: #374151;
                --border-gray: #D1D5DB;
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--text-gray); background: var(--background-white); }
            .print-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
            .print-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
            .print-title { font-size: 2.5rem; font-weight: bold; color: var(--primary-blue); margin-bottom: 0.5rem; }
            .print-logo { width: 64px; height: 64px; background: var(--accent-orange); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--background-white); font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem; }
            .print-logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
            .company-info { text-align: right; }
            .company-info h2 { font-size: 1.5rem; color: var(--primary-blue); margin-bottom: 0.5rem; }
            .invoice-details { margin-bottom: 2rem; }
            .bill-to { margin-bottom: 2rem; }
            .bill-to h3 { font-size: 1.125rem; font-weight: 600; border-bottom: 1px solid var(--border-gray); padding-bottom: 0.5rem; margin-bottom: 1rem; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
            .items-table th { background: #F9FAFB; padding: 0.75rem 1rem; text-align: left; font-size: 0.75rem; font-weight: 500; text-transform: uppercase; color: #6B7280; border-bottom: 1px solid var(--border-gray); }
            .items-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-gray); }
            .items-table tr:nth-child(even) { background: #F9FAFB; }
            .totals-section { display: flex; justify-content: flex-end; }
            .totals-table { width: 300px; }
            .totals-table tr { display: flex; justify-content: space-between; padding: 0.5rem 0; }
            .total-final { font-size: 1.5rem; font-weight: bold; color: var(--primary-blue); border-top: 1px solid var(--border-gray); padding-top: 1rem; }
            .footer-message { text-align: center; margin-top: 3rem; color: #6B7280; font-size: 0.875rem; }
            @media print { body { -webkit-print-color-adjust: exact; } }
        `);
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(invoiceContentRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="app-container">
            <div className="invoice-wrapper">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-content">
                        <div className="logo-placeholder">
                            {company.logoPreview ? (
                                <img src={company.logoPreview} alt="Company Logo" style={{width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px'}} />
                            ) : (
                                <span>L</span>
                            )}
                        </div>
                        <div className="header-text">
                            <h1>{company.name || 'Invoice Generator'}</h1>
                            <p>{company.name ? 'Professional Invoice Management' : 'Create professional invoices with ease'}</p>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    {/* Company Details Input Section */}
                    <div className="input-section">
                        <h2 className="section-title">Company Information</h2>
                        <div className="form-group">
                            <label htmlFor="companyName">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="name"
                                value={company.name}
                                onChange={handleCompanyChange}
                                placeholder="Your Company Name"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="companyAddress">Company Address</label>
                            <textarea
                                id="companyAddress"
                                name="address"
                                value={company.address}
                                onChange={handleCompanyChange}
                                rows="3"
                                placeholder="123 Business St, City, State, ZIP"
                                className="form-textarea"
                            ></textarea>
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="companyEmail">Company Email</label>
                                <input
                                    type="email"
                                    id="companyEmail"
                                    name="email"
                                    value={company.email}
                                    onChange={handleCompanyChange}
                                    placeholder="contact@company.com"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="companyPhone">Company Phone</label>
                                <input
                                    type="tel"
                                    id="companyPhone"
                                    name="phone"
                                    value={company.phone}
                                    onChange={handleCompanyChange}
                                    placeholder="+1 (555) 123-4567"
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        {/* Logo Upload Section */}
                        <div className="form-group">
                            <label htmlFor="companyLogo">Company Logo</label>
                            <div className="logo-upload-container">
                                <input
                                    type="file"
                                    id="companyLogo"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    ref={logoInputRef}
                                    className="logo-input"
                                />
                                <label htmlFor="companyLogo" className="logo-upload-btn">
                                    📁 Choose Logo Image
                                </label>
                                {company.logoPreview && (
                                    <div className="logo-preview-container">
                                        <img src={company.logoPreview} alt="Logo Preview" className="logo-preview" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            className="remove-logo-btn"
                                            title="Remove Logo"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                            <small className="logo-help-text">Upload PNG, JPG, JPEG, GIF, or SVG. Recommended size: 200x200px</small>
                        </div>

                        <h2 className="section-title">Invoice Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="invoiceNumber">Invoice Number</label>
                                <input
                                    type="text"
                                    id="invoiceNumber"
                                    name="invoiceNumber"
                                    value={invoice.invoiceNumber}
                                    onChange={handleInvoiceChange}
                                    placeholder="INV-2024-001"
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="invoiceDate">Invoice Date</label>
                                <input
                                    type="date"
                                    id="invoiceDate"
                                    name="invoiceDate"
                                    value={invoice.invoiceDate}
                                    onChange={handleInvoiceChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dueDate">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={invoice.dueDate}
                                    onChange={handleInvoiceChange}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <h2 className="section-title">Client Details</h2>
                        <div className="form-group">
                            <label htmlFor="clientName">Client Name</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={invoice.clientName}
                                onChange={handleInvoiceChange}
                                placeholder="Acme Corp."
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientAddress">Client Address</label>
                            <textarea
                                id="clientAddress"
                                name="clientAddress"
                                value={invoice.clientAddress}
                                onChange={handleInvoiceChange}
                                rows="3"
                                placeholder="123 Main St, Anytown, USA"
                                className="form-textarea"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label htmlFor="clientEmail">Client Email</label>
                            <input
                                type="email"
                                id="clientEmail"
                                name="clientEmail"
                                value={invoice.clientEmail}
                                onChange={handleInvoiceChange}
                                placeholder="client@example.com"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Line Items Input Section */}
                    <div className="items-section">
                        <h2 className="section-title">Line Items</h2>
                        
                        {/* Display existing items */}
                        {invoice.items.length === 0 ? (
                            <p className="no-items-message">No items added yet. Add your first item below!</p>
                        ) : (
                            <div className="items-table-container">
                                <table className="items-table">
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Qty</th>
                                            <th>Unit Price</th>
                                            <th>Amount</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoice.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        name="description"
                                                        value={item.description}
                                                        onChange={(e) => handleItemChange(item.id, e)}
                                                        className="table-input"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(item.id, e)}
                                                        className="table-input small"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        name="unitPrice"
                                                        value={item.unitPrice}
                                                        onChange={(e) => handleItemChange(item.id, e)}
                                                        className="table-input small"
                                                    />
                                                </td>
                                                <td className="amount-cell">
                                                    {formatMultiCurrencyAmount(item.quantity * item.unitPrice)}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="remove-btn"
                                                        title="Remove Item"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Add New Item Form */}
                        <div className="add-item-form">
                            <h3>Add New Item</h3>
                            <div className="add-item-grid">
                                <input
                                    type="text"
                                    name="description"
                                    value={newItem.description}
                                    onChange={handleNewItemChange}
                                    placeholder="Item Description"
                                    className="form-input description-input"
                                />
                                <input
                                    type="number"
                                    name="quantity"
                                    value={newItem.quantity}
                                    onChange={handleNewItemChange}
                                    min="1"
                                    placeholder="Qty"
                                    className="form-input"
                                />
                                <input
                                    type="number"
                                    name="unitPrice"
                                    value={newItem.unitPrice}
                                    onChange={handleNewItemChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Unit Price"
                                    className="form-input"
                                />
                            </div>
                            <button onClick={handleAddItem} className="add-item-btn">
                                Add Item
                            </button>
                        </div>

                        {/* Summary and Totals */}
                        <div className="summary-section">
                            <h3>Summary</h3>
                            
                            {/* Primary Currency Selection */}
                            <div className="summary-row">
                                <label htmlFor="primaryCurrency">Primary Currency:</label>
                                <select
                                    id="primaryCurrency"
                                    name="primaryCurrency"
                                    value={invoice.primaryCurrency}
                                    onChange={handleInvoiceChange}
                                    className="currency-select"
                                >
                                    {CURRENCIES.map(currency => (
                                        <option key={currency.code} value={currency.code}>
                                            {currency.symbol} {currency.code} - {currency.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Multi-Currency Toggle */}
                            <div className="summary-row">
                                <label htmlFor="multiCurrency">Show Multiple Currencies:</label>
                                <label className="toggle-switch">
                                    <input
                                        type="checkbox"
                                        id="multiCurrency"
                                        checked={invoice.showMultipleCurrencies}
                                        onChange={toggleMultiCurrency}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            {/* Secondary Currencies Selection */}
                            {invoice.showMultipleCurrencies && (
                                <div className="secondary-currencies-section">
                                    <div className="summary-row">
                                        <label>Additional Currencies:</label>
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    addSecondaryCurrency(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="currency-select"
                                            defaultValue=""
                                        >
                                            <option value="">Add Currency...</option>
                                            {CURRENCIES
                                                .filter(currency => 
                                                    currency.code !== invoice.primaryCurrency && 
                                                    !invoice.secondaryCurrencies.includes(currency.code)
                                                )
                                                .map(currency => (
                                                    <option key={currency.code} value={currency.code}>
                                                        {currency.symbol} {currency.code} - {currency.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    
                                    {/* Display selected secondary currencies */}
                                    {invoice.secondaryCurrencies.length > 0 && (
                                        <div className="selected-currencies">
                                            {invoice.secondaryCurrencies.map(currencyCode => {
                                                const currency = CURRENCIES.find(c => c.code === currencyCode);
                                                return (
                                                    <div key={currencyCode} className="currency-tag">
                                                        <span>{currency?.symbol} {currency?.code}</span>
                                                        <button
                                                            onClick={() => removeSecondaryCurrency(currencyCode)}
                                                            className="remove-currency-btn"
                                                            title="Remove Currency"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span className="amount">{formatMultiCurrencyAmount(subtotal)}</span>
                            </div>
                            <div className="summary-row">
                                <label htmlFor="taxRate">Tax Rate (%):</label>
                                <input
                                    type="number"
                                    id="taxRate"
                                    name="taxRate"
                                    value={invoice.taxRate}
                                    onChange={handleInvoiceChange}
                                    min="0"
                                    step="0.01"
                                    className="summary-input"
                                />
                            </div>
                            <div className="summary-row">
                                <span>Tax Amount:</span>
                                <span className="amount">{formatMultiCurrencyAmount(taxAmount)}</span>
                            </div>
                            <div className="summary-row">
                                <label htmlFor="discount">Discount ({getCurrencySymbol(invoice.primaryCurrency)}):</label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={invoice.discount}
                                    onChange={handleInvoiceChange}
                                    min="0"
                                    step="0.01"
                                    className="summary-input"
                                />
                            </div>
                            <div className="summary-row total-row">
                                <span>Total:</span>
                                <span className="total-amount">{formatMultiCurrencyAmount(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Printable Invoice View (hidden by default, shown for print) */}
                <div className="print-content" ref={invoiceContentRef}>
                    <div className="print-container">
                        <div className="print-header">
                            <div>
                                <h1 className="print-title">INVOICE</h1>
                                <p>Invoice #{invoice.invoiceNumber || 'N/A'}</p>
                                <p>Date: {invoice.invoiceDate || 'N/A'}</p>
                                <p>Due Date: {invoice.dueDate || 'N/A'}</p>
                            </div>
                            <div className="company-info">
                                <div className="print-logo">
                                    {company.logoPreview ? (
                                        <img src={company.logoPreview} alt="Company Logo" />
                                    ) : (
                                        <span>L</span>
                                    )}
                                </div>
                                <h2>{company.name || 'Your Company Name'}</h2>
                                <p style={{whiteSpace: 'pre-line'}}>{company.address || 'Your Address, City, Zip'}</p>
                                <p>{company.email || 'your.email@example.com'}</p>
                                <p>{company.phone || 'Your Phone Number'}</p>
                            </div>
                        </div>

                        <div className="bill-to">
                            <h3>Bill To:</h3>
                            <p><strong>{invoice.clientName || 'Client Name'}</strong></p>
                            <p style={{whiteSpace: 'pre-line'}}>{invoice.clientAddress || 'Client Address'}</p>
                            <p>{invoice.clientEmail || 'Client Email'}</p>
                        </div>

                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th style={{textAlign: 'right'}}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatAmount(item.unitPrice, invoice.primaryCurrency)}</td>
                                        <td style={{textAlign: 'right'}}>
                                            <div>
                                                {formatAmount(item.quantity * item.unitPrice, invoice.primaryCurrency)}
                                                {invoice.showMultipleCurrencies && invoice.secondaryCurrencies.map(currencyCode => (
                                                    <div key={currencyCode} style={{fontSize: '0.8em', color: '#6B7280'}}>
                                                        ≈ {formatAmount(convertCurrency(item.quantity * item.unitPrice, invoice.primaryCurrency, currencyCode), currencyCode)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="totals-section">
                            <div className="totals-table">
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Subtotal:</span>
                                    <div style={{textAlign: 'right'}}>
                                        <div>{formatAmount(subtotal, invoice.primaryCurrency)}</div>
                                        {invoice.showMultipleCurrencies && invoice.secondaryCurrencies.map(currencyCode => (
                                            <div key={currencyCode} style={{fontSize: '0.8em', color: '#6B7280'}}>
                                                ≈ {formatAmount(convertCurrency(subtotal, invoice.primaryCurrency, currencyCode), currencyCode)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Tax ({invoice.taxRate}%):</span>
                                    <div style={{textAlign: 'right'}}>
                                        <div>{formatAmount(taxAmount, invoice.primaryCurrency)}</div>
                                        {invoice.showMultipleCurrencies && invoice.secondaryCurrencies.map(currencyCode => (
                                            <div key={currencyCode} style={{fontSize: '0.8em', color: '#6B7280'}}>
                                                ≈ {formatAmount(convertCurrency(taxAmount, invoice.primaryCurrency, currencyCode), currencyCode)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Discount:</span>
                                    <div style={{textAlign: 'right'}}>
                                        <div>-{formatAmount(invoice.discount, invoice.primaryCurrency)}</div>
                                        {invoice.showMultipleCurrencies && invoice.secondaryCurrencies.map(currencyCode => (
                                            <div key={currencyCode} style={{fontSize: '0.8em', color: '#6B7280'}}>
                                                ≈ -{formatAmount(convertCurrency(invoice.discount, invoice.primaryCurrency, currencyCode), currencyCode)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="total-final" style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #D1D5DB', fontSize: '1.5rem', fontWeight: 'bold', color: '#01015C'}}>
                                    <span>TOTAL ({invoice.primaryCurrency}):</span>
                                    <div style={{textAlign: 'right'}}>
                                        <div>{formatAmount(total, invoice.primaryCurrency)}</div>
                                        {invoice.showMultipleCurrencies && invoice.secondaryCurrencies.map(currencyCode => (
                                            <div key={currencyCode} style={{fontSize: '0.7em', color: '#6B7280', fontWeight: 'normal'}}>
                                                ≈ {formatAmount(convertCurrency(total, invoice.primaryCurrency, currencyCode), currencyCode)}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="footer-message">
                            <p>Thank you for your business!</p>
                            <p>Please make payment by the due date.</p>
                        </div>
                    </div>
                </div>

                {/* Footer and Actions */}
                <div className="footer-section">
                    <button onClick={handlePrint} className="print-btn">
                        <span>🖨</span>
                        <span>Generate & Print Invoice</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default App;
