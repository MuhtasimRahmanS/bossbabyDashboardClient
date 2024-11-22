import { useRef } from "react";

const PrintInvoice = ({ order }) => {
  const invoiceRef = useRef();

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              width: 80mm; /* 3-inch width */
              margin: 0;
              padding: 10px;
            }
            .invoice-header {
              text-align: center;
              margin-bottom: 10px;
            }
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
            }
            .invoice-table th, .invoice-table td {
              border: 1px solid #ddd;
              padding: 5px;
              text-align: left;
            }
            .invoice-footer {
              margin-top: 10px;
            }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <button
        onClick={handlePrint}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Print Invoice
      </button>

      <div ref={invoiceRef} style={{ display: "none" }}>
        <div className="invoice-header">
          <h2>Invoice</h2>
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
        </div>
        <div>
          <p>
            <strong>Customer Name:</strong> {order.name}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
        </div>
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.cart.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.selectedSize}</td>
                <td>{item.quantity}</td>
                <td>{item.price} TK</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="invoice-footer">
          <p>
            <strong>Subtotal:</strong>{" "}
            {order.cart.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}{" "}
            TK
          </p>
          <p>
            <strong>Delivery Charge:</strong> {order.deliveryCharge} TK
          </p>
          <p>
            <strong>Total Price:</strong> {order.totalPrice} TK
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;
