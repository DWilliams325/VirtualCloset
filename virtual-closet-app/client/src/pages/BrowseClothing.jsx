import "../styles/browse.css";

const ITEMS = Array.from({ length: 30 }, (_, i) => {
  const id = 1001 + i;
  const size = ["S", "M", "L", "XL"][i % 4];
  const status = i % 7 === 2 ? "Unavailable" : "Available"; // every 7th a red badge
  return {
    id,
    name: ["Black Blazer","Leather Bag","Green Blazer","White Shirt","Dress Pants","Oxfords"][i % 6],
    size,
    img: `https://picsum.photos/seed/closet${i + 1}/1200/900`,
    status,
  };
});

export default function Browse() {
  const year = new Date().getFullYear();

  return (
    <>
      <header className="navbar" role="navigation" aria-label="Main">
        <div className="inner">
          <a className="brand" href="index.html" aria-label="Career Closet Home">
            <img className="brand-logo" src="pfw-Logo.svg" alt="Purdue Fort Wayne logo" />
            <span>Career Closet</span>
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="index.html">Home</a>
            <a href="browse.html">Browse Closet</a>
            <a href="appointments.html">Appointments</a>
            <a href="outfit.html">Build Outfit</a>
            <a href="about.html">About</a>
            <a href="sign-in.html">Sign In</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="section-head">
          <h1>Browse Available Clothing</h1>
          <p className="section-sub">
            Explore our collection of professional attire. Items marked as unavailable are currently being used by other students.
          </p>
        </div>

        {/* Search + Filters (still static UI) */}
        <div className="controls">
          <label className="search" htmlFor="q">
            <input id="q" placeholder="Search clothing items…" />
          </label>
          <select aria-label="Category" defaultValue="All Categories">
            <option>All Categories</option>
            <option>Blazers</option>
            <option>Shirts</option>
            <option>Pants</option>
            <option>Skirts</option>
            <option>Shoes</option>
          </select>
          <select aria-label="Availability" defaultValue="All Items">
            <option>All Items</option>
            <option>Available</option>
            <option>Unavailable</option>
          </select>
        </div>

        {/* Grid fed by ITEMS */}
        <div className="browse-grid">
          {ITEMS.map((it) => (
            <article className="card item-card" key={it.id}>
              <div style={{ position: "relative" }}>
                <img className="item-thumb-img" src={it.img} alt={`${it.name}, size ${it.size}`} />
                <span className={`badge-chip ${it.status === "Unavailable" ? "unavailable" : ""}`}>
                  {it.status}
                </span>
              </div>
              <div className="item-body">
                <h3 className="item-title">{it.name}</h3>
                <p className="meta">Size {it.size} · #{it.id}</p>
                <div className="btn-row">
                  <a className="btn" href="appointments.html">Reserve</a>
                  <a className="btn-outline" href="outfit.html">Add to Outfit</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="footer">© {year} Career Closet · Built with Purdue pride 🖤💛</footer>
    </>
  );
}
