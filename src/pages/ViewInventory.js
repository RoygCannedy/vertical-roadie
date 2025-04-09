import { useEffect, useState } from "react";
import "../components/Inventory.css";

function ViewInventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("roadie-inventory");
    setItems(saved ? JSON.parse(saved) : []);
  }, []);

  return (
    <div className="inventory-wrapper">
      <h2 className="inventory-title">📋 View-Only Inventory</h2>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="inventory-card flex justify-between items-center">
            <div>
              <div className="text-lg font-semibold">{item.name}</div>
              <div className="text-sm text-gray-500">
                Case: <strong>{item.case}</strong> / Section: <strong>{item.section}</strong>
              </div>
            </div>
            <div className="text-sm font-medium text-right">
              Quantity: {item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewInventory;
