import { useState } from "react"; 
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
    { id: 1, category: "tops", name: "White Blouse", image: "/whiteBlouse.jpg" }, 
    { id: 2, category: "bottoms", name: "Tan Slacks", image: "/trousers.jpg" }, 
    { id: 3, category: "shoes", name: "Black Heel", image: "shoe.jpg" }, 
    {id: 4, category: "outerwear", name: "Blazer", image: "/blazer.jpg"},
    {id: 5, category: "accessories", name: "Tie", image: "/tie.jpg"},
  ]; 

  const filteredItems = items.filter(item => item.category === activeCategory); 

  const handleSelect = (category, item) => { 
    setSelectedItems(prev => ({ ...prev, [category]: item })); 
  }; 

  const clearOutfit = () => setSelectedItems({}); 

  return ( 
    <div> 
      <h1>Build Your Outfit</h1> 
      <h4>Create and preview professional outfit combinations before your appointment.</h4> 
      <br /><br /> 

      <div className="buildOutfitContainer"> 
        {/* LEFT PANEL */} 
        <div className="leftPanel"> 
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
