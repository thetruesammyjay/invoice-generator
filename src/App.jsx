import React, { useState, useRef } from 'react';

// Main App component for the Invoice Generator
const App = () => {
    // State to manage invoice details
    const [invoice, setInvoice] = useState({
        invoiceNumber: '',
        invoiceDate: '',
        dueDate: '',
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        items: [], // Array to hold line items
        taxRate: 0, // Percentage, e.g., 10 for 10%
        discount: 0, // Flat discount amount
    });

    // State for managing a new item before adding it to the invoice
    const [newItem, setNewItem] = useState({
        description: '',
        quantity: 1,
        unitPrice: 0,
    });

    // Ref for the invoice content area, used for printing
    const invoiceContentRef = useRef(null);

    // Calculate totals whenever invoice items, tax rate, or discount changes
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (invoice.taxRate / 100);
    const total = subtotal + taxAmount - invoice.discount;

    // Handle changes in general invoice input fields
    const handleInvoiceChange = (e) => {
        const { name, value } = e.target;
        setInvoice(prevInvoice => ({
            ...prevInvoice,
            [name]: value
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
                items: [...prevInvoice.items, { ...newItem, id: Date.now() }] // Add unique ID
            }));
            setNewItem({ description: '', quantity: 1, unitPrice: 0 }); // Reset new item form
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
                            <span>L</span>
                        </div>
                        <div className="header-text">
                            <h1>Invoice Generator</h1>
                            <p>Create professional invoices with ease</p>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    {/* Invoice Details Input Section */}
                    <div className="input-section">
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
                                                    ${(item.quantity * item.unitPrice).toFixed(2)}
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
                            <div className="summary-row">
                                <span>Subtotal:</span>
                                <span className="amount">${subtotal.toFixed(2)}</span>
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
                                <span className="amount">${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <label htmlFor="discount">Discount ($):</label>
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
                                <span className="total-amount">${total.toFixed(2)}</span>
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
                            <div style={{textAlign: 'right'}}>
                                <div className="print-logo">
                                    <span>L</span>
                                </div>
                                <h2>Your Company Name</h2>
                                <p>Your Address, City, Zip</p>
                                <p>your.email@example.com</p>
                                <p>Your Phone Number</p>
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
                                        <td>${item.unitPrice.toFixed(2)}</td>
                                        <td style={{textAlign: 'right'}}>${(item.quantity * item.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="totals-section">
                            <div className="totals-table">
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Tax ({invoice.taxRate}%):</span>
                                    <span>${taxAmount.toFixed(2)}</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0'}}>
                                    <span>Discount:</span>
                                    <span>-${invoice.discount.toFixed(2)}</span>
                                </div>
                                <div className="total-final" style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #D1D5DB', fontSize: '1.5rem', fontWeight: 'bold', color: '#01015C'}}>
                                    <span>TOTAL:</span>
                                    <span>${total.toFixed(2)}</span>
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