import { useState } from "react";
import Inventory from "../components/Inventory";

function EditableInventory() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const PASSWORD = "vertical123"; // You can change this

  const handleLogin = () => {
    if (passwordInput === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto mt-16 text-center p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Enter Password to Edit Inventory</h2>
        <input
          type="password"
          className="border p-2 rounded w-full mb-2"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Password"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Unlock
        </button>
      </div>
    );
  }

  return <Inventory />;
}

export default EditableInventory;
