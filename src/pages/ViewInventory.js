import { useEffect, useState } from "react";
import "../index.css";

function ViewInventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCase, setSelectedCase] = useState("All");
  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("roadie-inventory");
    setItems(saved ? JSON.parse(saved) : []);
  }, []);

  const uniqueCases = ["All", ...new Set(items.map(item => item.case))];

  const filtered = items
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCase === "All" || item.case === selectedCase)
    )
    .sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.name.localeCompare(b.name);
    });

  const grouped = filtered.reduce((acc, item) => {
    const key = `${item.case}__${item.section}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleExport = () => {
    const csv = ["Name,Quantity,Case,Section"];
    items.forEach(item => {
      csv.push(`${item.name},${item.quantity},${item.case},${item.section}`);
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadie-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper relative">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 View Inventory</h2>

      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full border border-gray-300 rounded px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCase}
          onChange={(e) => setSelectedCase(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        >
          {uniqueCases.map((c) => (
            <option key={c} value={c}>{c} Case</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExport}
        className="absolute top-4 right-4 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        📁 Export
      </button>

      {Object.entries(grouped).map(([key, items]) => {
        const [caseName, section] = key.split("__");
        const groupKey = `${caseName}-${section}`;
        const isCollapsed = collapsed[groupKey];

        return (
          <div key={key} className="mb-6">
            <div
              className="cursor-pointer text-lg font-semibold mb-2 text-blue-700"
              onClick={() => setCollapsed(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))}
            >
              {caseName} Case - {section} {isCollapsed ? "▼" : "▲"}
            </div>
            {!isCollapsed && (
              <div className="grid gap-3">
                {items.map(item => (
                  <div
                    key={item.id}
                    className="card flex justify-between items-center"
                  >
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ViewInventory;