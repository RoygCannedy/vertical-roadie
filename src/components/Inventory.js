// Updated Inventory component with default gear list preload + reset button
import { useState, useEffect } from "react";
import "../index.css";

const CASES = {
  Blue: ["Power"],
  Green: ["Quarter Inch", "XLR", "Ethernet", "Media"],
  "Tall Black": ["Stands"],
  Black: ["Tape", "DI Boxes", "Mics", "Tools"],
  Consol: ["Consol"],
  "Lackey's Bin": ["Misc"],
  ECT: ["Misc"]
};

const DEFAULT_ITEMS = [
  { name: "Quarter inches xlrs", quantity: 1, case: "Green", section: "Quarter Inch" },
  { name: "XLRs 1ft", quantity: 1, case: "Green", section: "XLR" },
  { name: "XLRs 3ft", quantity: 1, case: "Green", section: "XLR" },
  { name: "XLRs 6ft", quantity: 1, case: "Green", section: "XLR" },
  { name: "XLRs 25ft", quantity: 1, case: "Green", section: "XLR" },
  { name: "XLRs 50ft", quantity: 1, case: "Green", section: "XLR" },
  { name: "Ethernet cables", quantity: 1, case: "Green", section: "Ethernet" },
  { name: "HDMI cable", quantity: 1, case: "Green", section: "Media" },
  { name: "Power cables", quantity: 1, case: "Blue", section: "Power" },
  { name: "Extension cord", quantity: 1, case: "Blue", section: "Power" },
  { name: "Power strip", quantity: 1, case: "Blue", section: "Power" },
  { name: "Long power strip", quantity: 1, case: "Blue", section: "Power" },
  { name: "Tape", quantity: 1, case: "Black", section: "Tape" },
  { name: "SM57 drums mic", quantity: 1, case: "Black", section: "Mics" },
  { name: "SM58 kick mic", quantity: 1, case: "Black", section: "Mics" },
  { name: "Battery", quantity: 1, case: "Black", section: "Mics" },
  { name: "Beta 58", quantity: 1, case: "Black", section: "Mics" },
  { name: "1-channel DI box", quantity: 1, case: "Black", section: "DI Boxes" },
  { name: "2-channel DI box", quantity: 1, case: "Black", section: "DI Boxes" },
  { name: "Small clip", quantity: 1, case: "Black", section: "Tools" },
  { name: "Medium clip", quantity: 1, case: "Black", section: "Tools" },
  { name: "Large clip", quantity: 1, case: "Black", section: "Tools" },
  { name: "Clip mics", quantity: 1, case: "Black", section: "Mics" },
  { name: "Bad SM58", quantity: 1, case: "Black", section: "Mics" },
  { name: "P16", quantity: 1, case: "Consol", section: "Consol" },
  { name: "Tall stand", quantity: 1, case: "Tall Black", section: "Stands" },
  { name: "Boom stand", quantity: 1, case: "Tall Black", section: "Stands" },
];

const Inventory = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("roadie-inventory");
    return saved ? JSON.parse(saved) : DEFAULT_ITEMS.map((item, i) => ({ ...item, id: Date.now() + i }));
  });

  const [newItem, setNewItem] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [selectedCase, setSelectedCase] = useState("Blue");
  const [selectedSection, setSelectedSection] = useState(CASES["Blue"][0]);

  const [filterCase, setFilterCase] = useState("All");
  const [filterSection, setFilterSection] = useState("All");

  const [editingNameId, setEditingNameId] = useState(null);
  const [editingNameValue, setEditingNameValue] = useState("");

  useEffect(() => {
    localStorage.setItem("roadie-inventory", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    setSelectedSection(CASES[selectedCase][0]);
  }, [selectedCase]);

  const addItem = () => {
    if (!newItem.trim() || newQuantity < 1) return;
    const item = {
      name: newItem,
      quantity: newQuantity,
      case: selectedCase,
      section: selectedSection,
      id: Date.now(),
    };
    setItems([...items, item]);
    setNewItem("");
    setNewQuantity(1);
    setSelectedCase("Blue");
    setSelectedSection(CASES["Blue"][0]);
  };

  const resetInventory = () => {
    const defaultWithIds = DEFAULT_ITEMS.map((item, i) => ({ ...item, id: Date.now() + i }));
    setItems(defaultWithIds);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const startEditingName = (id, currentName) => {
    setEditingNameId(id);
    setEditingNameValue(currentName);
  };

  const saveEditedName = (id) => {
    if (!editingNameValue.trim()) return;
    setItems(items.map(item =>
      item.id === id ? { ...item, name: editingNameValue } : item
    ));
    setEditingNameId(null);
    setEditingNameValue("");
  };

  const filteredItems = items.filter(item => {
    const matchesCase = filterCase === "All" || item.case === filterCase;
    const matchesSection = filterSection === "All" || item.section === filterSection;
    return matchesCase && matchesSection;
  });

  return (
    <div className="page-wrapper">
      <h2 className="text-2xl font-bold mb-6 text-center">🎚️ Roadie Inventory</h2>

      <div className="text-right mb-4">
        <button onClick={resetInventory} className="btn">🔁 Reset Inventory</button>
      </div>

      <div className="grid md:grid-cols-5 gap-4 card">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Item name (e.g., XLR Cable)"
        />
        <input
          type="number"
          min="1"
          value={newQuantity}
          onChange={e => setNewQuantity(parseInt(e.target.value))}
        />
        <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)}>
          {Object.keys(CASES).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)}>
          {CASES[selectedCase].map((section) => (
            <option key={section} value={section}>{section}</option>
          ))}
        </select>
        <button onClick={addItem} className="btn">Add Item</button>
      </div>

      <div className="flex flex-wrap gap-4 my-6">
        <select
          value={filterCase}
          onChange={e => {
            setFilterCase(e.target.value);
            setFilterSection("All");
          }}
        >
          <option value="All">All Cases</option>
          {Object.keys(CASES).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filterSection}
          onChange={e => setFilterSection(e.target.value)}
          disabled={filterCase === "All"}
        >
          <option value="All">All Sections</option>
          {filterCase !== "All" &&
            CASES[filterCase].map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="card flex justify-between items-center"
          >
            <div>
              {editingNameId === item.id ? (
                <input
                  type="text"
                  value={editingNameValue}
                  onChange={e => setEditingNameValue(e.target.value)}
                  onBlur={() => saveEditedName(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditedName(item.id);
                  }}
                  className="item-name-input"
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => startEditingName(item.id, item.name)}
                  className="text-lg font-semibold cursor-pointer hover:underline"
                >
                  {item.name}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Case: <strong>{item.case}</strong> / Section: <strong>{item.section}</strong>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={item.quantity}
                min="1"
                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                className="border rounded px-3 py-1 w-20 text-center"
              />
              <button
                onClick={() => deleteItem(item.id)}
                className="remove-button"
              >
                ✖ Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
