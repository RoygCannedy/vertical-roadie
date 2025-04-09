// Full React component: Styled Inventory page + shared styles
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

const Inventory = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("roadie-inventory");
    return saved ? JSON.parse(saved) : [];
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
