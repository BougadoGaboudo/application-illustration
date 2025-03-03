"use client";

import { useState, useRef, useEffect } from "react";
import Isotope from "isotope-layout";

export default function GalleryGrid({ data }) {
  const gridRef = useRef(null);
  const [iso, setIso] = useState(null);
  const [filter, setFilter] = useState("*");

  useEffect(() => {
    if (gridRef.current) {
      const isoInstance = new Isotope(gridRef.current, {
        itemSelector: ".grid-item",
        masonry: {
          fitWidth: true,
          gutter: 16,
        },
      });
      setIso(isoInstance);
    }
    return () => iso?.destroy();
  }, []);

  useEffect(() => {
    if (iso) {
      const filterValue = filter === "*" ? "*" : `.${filter}`;
      iso.arrange({ filter: filterValue });
    }
  }, [filter, iso]);

  return (
    <>
      <section className="section-gallery">
        <div className="filter-buttons-container">
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
              {/* <h2>{illustration.title}</h2> */}
              <img src={illustration.url} alt={illustration.title} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
