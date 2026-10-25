import React, { useState, useEffect } from 'react';

const INITIAL_CATEGORIES = [
  {
    name: 'Pizza',
    items: [
      { id: 'p1', name: 'Margherita Pizza', price: 180 },
      { id: 'p2', name: 'Farmhouse Pizza', price: 240 },
      { id: 'p3', name: 'Paneer Tikka Pizza', price: 260 }
    ]
  },
  {
    name: 'Burger',
    items: [
      { id: 'b1', name: 'Classic Veg Burger', price: 120 },
      { id: 'b2', name: 'Crispy Chicken Burger', price: 160 },
      { id: 'b3', name: 'Cheese Burst Burger', price: 190 }
    ]
  },
  {
    name: 'Wraps',
    items: [
      { id: 'w1', name: 'Paneer Wrap', price: 140 },
      { id: 'w2', name: 'Spicy Chicken Wrap', price: 170 }
    ]
  },
  {
    name: 'Milkshakes',
    items: [
      { id: 'm1', name: 'Chocolate Oreo Shake', price: 150 },
      { id: 'm2', name: 'Strawberry Blast', price: 140 },
      { id: 'm3', name: 'KitKat Shake', price: 160 }
    ]
  },
  {
    name: 'Mojitos',
    items: [
      { id: 'mj1', name: 'Virgin Mint Mojito', price: 110 },
      { id: 'mj2', name: 'Blue Lagoon', price: 130 }
    ]
  },
  {
    name: 'Fingers',
    items: [
      { id: 'f1', name: 'French Fries', price: 90 },
      { id: 'f2', name: 'Peri Peri Fries', price: 110 },
      { id: 'f3', name: 'Chicken Nuggets', price: 150 }
    ]
  },
  {
    name: 'Waffles',
    items: [
      { id: 'wf1', name: 'Classic Honey Waffle', price: 160 },
      { id: 'wf2', name: 'Nutella Chocolate Waffle', price: 210 }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Table');

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('moon_light_menu');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [tableOrders, setTableOrders] = useState(() => {
    const saved = localStorage.getItem('moon_light_table_orders');
    return saved ? JSON.parse(saved) : { 1: { items: [] }, 2: { items: [] }, 3: { items: [] }, 4: { items: [] } };
  });

  const [takeawayItems, setTakeawayItems] = useState(() => {
    const saved = localStorage.getItem('moon_light_takeaway_current');
    return saved ? JSON.parse(saved) : [];
  });

  const [billsHistory, setBillsHistory] = useState(() => {
    const saved = localStorage.getItem('moon_light_bills_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    localStorage.setItem('moon_light_menu', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('moon_light_table_orders', JSON.stringify(tableOrders));
  }, [tableOrders]);

  useEffect(() => {
    localStorage.setItem('moon_light_takeaway_current', JSON.stringify(takeawayItems));
  }, [takeawayItems]);

  useEffect(() => {
    localStorage.setItem('moon_light_bills_history', JSON.stringify(billsHistory));
  }, [billsHistory]);

  const generateOrderId = (type) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `${type === 'Table' ? 'TBL' : 'TAW'}-${dateStr}-${randomNum}`;
  };

  const printReceipt = (orderData) => {
    const printWindow = window.open('', '_blank', 'width=400,height=600');
    if (!printWindow) {
      alert('Please allow popups to print receipts.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${orderData.orderId}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace; font-size: 14px; padding: 20px; color: #000; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
          th, td { text-align: left; padding: 4px 0; border-bottom: 1px dashed #ccc; font-size: 13px; }
          .total-section { margin-top: 10px; border-top: 2px solid #000; padding-top: 5px; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 18px;">SRI GAYATHRI MOON LIGHT CAFE</div>
        <div class="center" style="font-size: 12px;">Open Air & Indoor Dining</div>
        <hr style="border: 1px dashed #000; margin: 10px 0;" />
        <div><strong>Order ID:</strong> ${orderData.orderId}</div>
        <div><strong>Type:</strong> ${orderData.type} ${orderData.tableNo ? `(Table ${orderData.tableNo})` : ''}</div>
        <div><strong>Date/Time:</strong> ${orderData.date} ${orderData.time}</div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(i => `
              <tr>
                <td>${i.name}</td>
                <td>${i.quantity}</td>
                <td>₹${i.price}</td>
                <td>₹${i.price * i.quantity}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total-section">
          <div style="display: flex; justify-content: space-between;" class="bold">
            <span>Grand Total:</span>
            <span>₹${orderData.totalAmount}</span>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for visiting!<br/>Please come again! ☕</p>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const saveTableOrder = (tableNo) => {
    const current = tableOrders[tableNo];
    if (!current || !current.items || current.items.length === 0) {
      alert('No items in this table order to save.');
      return;
    }
    const now = new Date();
    const newBill = {
      orderId: generateOrderId(`Table-${tableNo}`),
      type: 'Table Order',
      tableNo: tableNo,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      items: current.items,
      totalAmount: current.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };

    setBillsHistory([newBill, ...billsHistory]);
    setTableOrders({
      ...tableOrders,
      [tableNo]: { items: [] }
    });
    setSelectedTable(null);
    alert(`Table ${tableNo} order saved permanently and bill generated!`);
  };

  const saveTakeawayOrder = () => {
    if (takeawayItems.length === 0) {
      alert('No items in takeaway order.');
      return;
    }
    const now = new Date();
    const newBill = {
      orderId: generateOrderId('Takeaway'),
      type: 'Takeaway',
      tableNo: null,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      items: takeawayItems,
      totalAmount: takeawayItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };

    setBillsHistory([newBill, ...billsHistory]);
    setTakeawayItems([]);
    alert('Takeaway order saved successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌙☕</span>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Sri Gayathri Moon Light Cafe</h1>
              <p className="text-xs text-slate-400">POS & Billing Management System</p>
            </div>
          </div>
          
          <nav className="flex flex-wrap gap-2 justify-center">
            {['Table', 'Takeaway', 'Total', 'History', 'Edit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'Table' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Table Management</h2>
              <p className="text-sm text-slate-500">Select a table corner below to manage orders and billing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[450px] relative p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
              {[1, 2, 3, 4].map((tblNo) => {
                const itemCount = tableOrders[tblNo]?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
                const totalAmt = tableOrders[tblNo]?.items?.reduce((s, i) => s + (i.price * i.quantity), 0) || 0;
                
                return (
                  <div
                    key={tblNo}
                    onClick={() => setSelectedTable(tblNo)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md ${
                      itemCount > 0 ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">🪑</span>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Table {tblNo}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${itemCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                            {itemCount > 0 ? `${itemCount} items added` : 'Available'}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">Corner {tblNo}</span>
                    </div>

                    <div className="mt-6 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-500">Current Total</p>
                        <p className="text-xl font-black text-slate-900">₹{totalAmt}</p>
                      </div>
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800">
                        Open Order →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Takeaway' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Takeaway Menu</h2>
                <div className="space-y-6">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3">{cat.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {cat.items.map((item) => (
                          <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center hover:border-slate-300">
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-500 font-bold">₹{item.price}</p>
                            </div>
                            <button
                              onClick={() => {
                                const existing = takeawayItems.find(i => i.id === item.id);
                                if (existing) {
                                  setTakeawayItems(takeawayItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                                } else {
                                  setTakeawayItems([...takeawayItems, { ...item, quantity: 1 }]);
                                }
                              }}
                              className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400"
                            >
                              + Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-fit sticky top-20">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Takeaway Order Summary</h3>
                {takeawayItems.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">No items added to takeaway yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {takeawayItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                setTakeawayItems(takeawayItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
                              } else {
                                setTakeawayItems(takeawayItems.filter(i => i.id !== item.id));
                              }
                            }}
                            className="w-6 h-6 bg-slate-200 rounded font-bold text-xs flex items-center justify-center hover:bg-slate-300"
                          >-</button>
                          <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => {
                              setTakeawayItems(takeawayItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
                            }}
                            className="w-6 h-6 bg-slate-200 rounded font-bold text-xs flex items-center justify-center hover:bg-slate-300"
                          >+</button>
                          <button
                            onClick={() => setTakeawayItems(takeawayItems.filter(i => i.id !== item.id))}
                            className="text-red-500 hover:text-red-700 ml-1 text-xs font-bold px-1"
                          >🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-600">Total Amount:</span>
                  <span className="text-xl font-black text-slate-900">
                    ₹{takeawayItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setTakeawayItems([])}
                    className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Close (Temp)
                  </button>
                  <button
                    onClick={saveTakeawayOrder}
                    className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                  >
                    Save & Close
                  </button>
                </div>
                {takeawayItems.length > 0 && (
                  <button
                    onClick={() => printReceipt({
                      orderId: 'TAW-PREVIEW',
                      type: 'Takeaway',
                      date: new Date().toLocaleDateString(),
                      time: new Date().toLocaleTimeString(),
                      items: takeawayItems,
                      totalAmount: takeawayItems.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                    })}
                    className="w-full mt-2 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400"
                  >
                    🖨 Print Bill / Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Total' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Today's Orders & Summary</h2>
                <p className="text-sm text-slate-500">Overview of all table orders and takeaway orders recorded today.</p>
              </div>
              <button
                onClick={() => {
                  const today = new Date().toLocaleDateString();
                  const todaysBills = billsHistory.filter(b => b.date === today);
                  printReceipt({
                    orderId: `SUMMARY-${today.replace(/\//g, '')}`,
                    type: "Daily Summary Report",
                    date: today,
                    time: new Date().toLocaleTimeString(),
                    items: todaysBills.flatMap(b => b.items),
                    totalAmount: todaysBills.reduce((s, b) => s + b.totalAmount, 0)
                  });
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow"
              >
                📥 Download/Print Day Report (PDF)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
                    <span>Table Orders</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                      Total: ₹{billsHistory.filter(b => b.type === 'Table Order').reduce((s, b) => s + b.totalAmount, 0)}
                    </span>
                  </h3>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {billsHistory.filter(b => b.type === 'Table Order').length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-6">No table orders recorded yet.</p>
                    ) : (
                      billsHistory.filter(b => b.type === 'Table Order').map((bill) => (
                        <div key={bill.orderId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-xs text-slate-900">{bill.orderId}</span>
                              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-bold">Table {bill.tableNo}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{bill.items.length} items • {bill.time}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-slate-900 text-sm">₹{bill.totalAmount}</span>
                            <button
                              onClick={() => printReceipt(bill)}
                              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                            >
                              🖨 Print
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
                    <span>Takeaway Orders</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                      Total: ₹{billsHistory.filter(b => b.type === 'Takeaway').reduce((s, b) => s + b.totalAmount, 0)}
                    </span>
                  </h3>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {billsHistory.filter(b => b.type === 'Takeaway').length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-6">No takeaway orders recorded yet.</p>
                    ) : (
                      billsHistory.filter(b => b.type === 'Takeaway').map((bill) => (
                        <div key={bill.orderId} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <span className="font-bold text-xs text-slate-900">{bill.orderId}</span>
                            <p className="text-xs text-slate-500 mt-1">{bill.items.length} items • {bill.time}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-black text-slate-900 text-sm">₹{bill.totalAmount}</span>
                            <button
                              onClick={() => printReceipt(bill)}
                              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                            >
                              🖨 Print
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Grand Total (Tables + Takeaways)</p>
                <p className="text-2xl font-black mt-1">₹{billsHistory.reduce((s, b) => s + b.totalAmount, 0)}</p>
              </div>
              <button
                onClick={() => {
                  printReceipt({
                    orderId: 'ALL-BILLS-SUMMARY',
                    type: 'All Orders Combined',
                    date: new Date().toLocaleDateString(),
                    time: new Date().toLocaleTimeString(),
                    items: billsHistory.flatMap(b => b.items),
                    totalAmount: billsHistory.reduce((s, b) => s + b.totalAmount, 0)
                  });
                }}
                className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400"
              >
                🖨 Print Complete Report
              </button>
            </div>
          </div>
        )}

        {activeTab === 'History' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Billing History</h2>
                <p className="text-sm text-slate-500">View and print bills sorted by date.</p>
              </div>
              <button
                onClick={() => {
                  printReceipt({
                    orderId: 'FULL-HISTORY-ARCHIVE',
                    type: 'Complete History Archive',
                    date: 'All Time',
                    time: new Date().toLocaleTimeString(),
                    items: billsHistory.flatMap(b => b.items),
                    totalAmount: billsHistory.reduce((s, b) => s + b.totalAmount, 0)
                  });
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow"
              >
                📥 Download/Print All History (PDF)
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              {billsHistory.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-12">No bill history available.</p>
              ) : (
                <div className="space-y-4">
                  {billsHistory.map((bill) => (
                    <div key={bill.orderId} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{bill.orderId}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${bill.type === 'Table Order' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {bill.type} {bill.tableNo ? `(Table ${bill.tableNo})` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{bill.date} at {bill.time} • {bill.items.length} items</p>
                      </div>
                      <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-base font-black text-slate-900">₹{bill.totalAmount}</span>
                        <button
                          onClick={() => printReceipt(bill)}
                          className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                        >
                          🖨 Print Bill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Edit' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Menu Customization</h2>
              <p className="text-sm text-slate-500">Add, edit, or remove menu categories and items.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat, catIdx) => (
                <div key={cat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-bold text-slate-800">{cat.name}</h3>
                    <button
                      onClick={() => {
                        const newName = prompt('Enter new item name:');
                        const newPrice = prompt('Enter item price (₹):');
                        if (newName && newPrice) {
                          const updated = [...categories];
                          updated[catIdx].items.push({
                            id: 'item_' + Date.now(),
                            name: newName,
                            price: Number(newPrice)
                          });
                          setCategories(updated);
                        }
                      }}
                      className="px-3 py-1 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cat.items.map((item, itemIdx) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">₹{item.price}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              const p = prompt('New price:', item.price);
                              if (p) {
                                const updated = [...categories];
                                updated[catIdx].items[itemIdx].price = Number(p);
                                setCategories(updated);
                              }
                            }}
                            className="px-2 py-1 bg-slate-200 rounded text-xs font-bold hover:bg-slate-300"
                          >
                            Edit Price
                          </button>
                          <button
                            onClick={() => {
                              const updated = [...categories];
                              updated[catIdx].items.splice(itemIdx, 1);
                              setCategories(updated);
                            }}
                            className="text-red-500 hover:text-red-700 font-bold text-xs px-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {selectedTable !== null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Table {selectedTable} Order Management</h3>
                <p className="text-xs text-slate-400">Add items or finalize billing</p>
              </div>
              <button
                onClick={() => setSelectedTable(null)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider">Select Menu Items</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div key={cat.name}>
                      <span className="text-[11px] font-bold text-slate-400">{cat.name}</span>
                      {cat.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-500">₹{item.price}</p>
                          </div>
                          <button
                            onClick={() => {
                              const currentItems = tableOrders[selectedTable]?.items || [];
                              const existing = currentItems.find(i => i.id === item.id);
                              let updated;
                              if (existing) {
                                updated = currentItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
                              } else {
                                updated = [...currentItems, { ...item, quantity: 1 }];
                              }
                              setTableOrders({
                                ...tableOrders,
                                [selectedTable]: { items: updated }
                              });
                            }}
                            className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs hover:bg-amber-400"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Table {selectedTable} Items</h4>
                  {(!tableOrders[selectedTable]?.items || tableOrders[selectedTable].items.length === 0) ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No items added to this table yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {tableOrders[selectedTable].items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-500">₹{item.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                const currentItems = tableOrders[selectedTable].items;
                                let updated;
                                if (item.quantity > 1) {
                                  updated = currentItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i);
                                } else {
                                  updated = currentItems.filter(i => i.id !== item.id);
                                }
                                setTableOrders({ ...tableOrders, [selectedTable]: { items: updated } });
                              }}
                              className="w-5 h-5 bg-slate-200 rounded text-xs font-bold flex items-center justify-center"
                            >-</button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => {
                                const currentItems = tableOrders[selectedTable].items;
                                const updated = currentItems.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
                                setTableOrders({ ...tableOrders, [selectedTable]: { items: updated } });
                              }}
                              className="w-5 h-5 bg-slate-200 rounded text-xs font-bold flex items-center justify-center"
                            >+</button>
                            <button
                              onClick={() => {
                                const currentItems = tableOrders[selectedTable].items;
                                const updated = currentItems.filter(i => i.id !== item.id);
                                setTableOrders({ ...tableOrders, [selectedTable]: { items: updated } });
                              }}
                              className="text-red-500 text-xs font-bold px-1"
                            >🗑</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-slate-600">Total:</span>
                    <span className="text-base font-black text-slate-900">
                      ₹{tableOrders[selectedTable]?.items?.reduce((sum, i) => sum + (i.price * i.quantity), 0) || 0}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTable(null)}
                      className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => saveTableOrder(selectedTable)}
                      className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
                    >
                      Save & Close
                    </button>
                  </div>
                  {(tableOrders[selectedTable]?.items?.length > 0) && (
                    <button
                      onClick={() => printReceipt({
                        orderId: `TBL-${selectedTable}-PREVIEW`,
                        type: 'Table Order',
                        tableNo: selectedTable,
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString(),
                        items: tableOrders[selectedTable].items,
                        totalAmount: tableOrders[selectedTable].items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                      })}
                      className="w-full mt-2 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400"
                    >
                      🖨 Print Bill / Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}