"use client";

import { useState, useRef, useEffect } from "react";
import Isotope from "isotope-layout";

export default function MasonryGrid({ data }) {
  const gridRef = useRef(null);
  const [iso, setIso] = useState(null);
  const [filter, setFilter] = useState("*");

  useEffect(() => {
    if (gridRef.current) {
      const isoInstance = new Isotope(gridRef.current, {
        itemSelector: ".grid-item",
        layoutMode: "fitRows",
      });
      setIso(isoInstance);
    }
    return () => iso?.destroy();
  }, []);

  useEffect(() => {
    if (iso) {
      // Ajout du point pour la sélection de classe CSS
      const filterValue = filter === "*" ? "*" : `.${filter}`;
      iso.arrange({ filter: filterValue });
    }
  }, [filter, iso]);

  return (
    <>
      <div className="galleryContainer">
        <div className="filterButtons">
          {["*", "original", "fanart", "study"].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={filter === category ? "active" : ""}
            >
              {category === "*" ? "Tous" : category}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="grid">
          {data.map((illustration) => (
            <div
              key={illustration.id}
              className={`grid-item ${illustration.type}`}
            >
              <h2>{illustration.title}</h2>
              <img src={illustration.url} alt={illustration.title} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
