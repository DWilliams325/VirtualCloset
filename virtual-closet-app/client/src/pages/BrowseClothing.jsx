import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/buildOutfit.css";

export default function BuildOutfit() {
  const [selectedItems, setSelectedItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("tops");

  const categories = [
    { id: "outerwear", label: "Blazers & Jackets" },
    { id: "tops", label: "Shirts & Blouses" },
    { id: "bottoms", label: "Pants & Skirts" },
    { id: "shoes", label: "Shoes" },
    { id: "accessories", label: "Accessories" },
  ];

  const items = [
    { id: 1, category: "tops", name: "White Blouse", image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400" },
    { id: 2, category: "bottoms", name: "Black Slacks", image: "https://images.unsplash.com/photo-1583744946564-b52f370d4f28?w=400" },
    { id: 3, category: "shoes", name: "Brown Oxfords", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" },
  ];

  const filteredItems = items.filter(item => item.category === activeCategory);

  const handleSelect = (category, item) => {
    setSelectedItems(prev => ({ ...prev, [category]: item }));
  };

  const clearOutfit = () => setSelectedItems({});

  return (
    <div>
      <Navbar />
      <div className="buildOutfitContainer">
        {/* LEFT PANEL */}
        <div className="leftPanel">
          <h1>Build Your Outfit</h1>
          <h4>Create and preview professional outfit combinations before your appointment.</h4>

          <div className="categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`categoryBtn ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="itemGrid">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`itemCard ${selectedItems[activeCategory]?.id === item.id ? "selected" : ""}`}
                  onClick={() => handleSelect(activeCategory, item)}
                >
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                </div>
              ))
            ) : (
              <p className="emptyMessage">No items available in this category.</p>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Right Panel + Tips Box) */}
        <div className="rightSide">
          <div className="rightPanel">
            <h2>Your Outfit</h2>
            {Object.keys(selectedItems).length === 0 ? (
              <p className="emptyMessage">No items selected yet.</p>
            ) : (
              <div className="selectedList">
                {Object.values(selectedItems).map((item) => (
                  <div key={item.id} className="selectedItem">
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="clearBtn" onClick={clearOutfit}>
              Clear Outfit
            </button>
          </div>

          <div className="tipsBox">
            <h3>Styling Tips</h3>
            <p>Dark blazer + light shirt = confident & professional.</p>
            <p>Accessories add personality to your look!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
