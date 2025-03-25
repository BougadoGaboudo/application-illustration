"use client";

import { useState, useRef, useEffect } from "react";
import Isotope from "isotope-layout";
import Select from "react-select";

export default function GalleryGrid({ data }) {
  const gridRef = useRef(null);
  const [iso, setIso] = useState(null);
  const [filter, setFilter] = useState("*");
  const [selectedTags, setSelectedTags] = useState([]);
  const [hoverInfo, setHoverInfo] = useState({
    visible: false,
    tags: [],
    x: 0,
    y: 0,
  });

  // Normaliser le nom du tag pour l'utiliser comme classe CSS
  const normalizeTagName = (tagName) => {
    return tagName.replace(/\s+/g, "-");
  };

  // Extraire tous les tags uniques des illustrations
  const allTags = Array.from(
    new Set(
      data.flatMap(
        (illustration) => illustration.tags?.map((t) => t.tag.name) || []
      )
    )
  ).sort();

  // Formater les tags pour react-select
  const tagOptions = allTags.map((tag) => ({
    value: tag,
    label: tag,
  }));

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
      let filterValue = filter === "*" ? "*" : `.${filter}`;

      // Si des tags sont sélectionnés
      if (selectedTags.length > 0) {
        // On veut les éléments qui ont TOUS les tags sélectionnés
        selectedTags.forEach((tag) => {
          filterValue += `.tag-${normalizeTagName(tag.value)}`;
        });
      }

      iso.arrange({ filter: filterValue });
    }
  }, [filter, selectedTags, iso]);

  // Gérer le changement de sélection de tags
  const handleTagSelection = (selectedOptions) => {
    setSelectedTags(selectedOptions || []);
  };

  const handleMouseMove = (e, tags) => {
    // Mettre à jour la position du tooltip
    setHoverInfo({
      visible: true,
      tags: tags,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo({ ...hoverInfo, visible: false });
  };

  // Style personnalisé pour react-select
  const customStyles = {
    control: (base) => ({
      ...base,
      borderRadius: "4px",
      borderColor: "#ddd",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#aaa",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#4a9eff",
      color: "white",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      "&:hover": {
        backgroundColor: "#3a8eff",
        color: "white",
      },
    }),
  };

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

        {/* Filtre par tags avec react-select */}
        {allTags.length > 0 && (
          <div className="tag-filters">
            <h4>Filtrer par tags:</h4>
            <div className="select-container">
              <Select
                isMulti
                name="tags"
                options={tagOptions}
                className="tag-multi-select"
                classNamePrefix="select"
                placeholder="Sélectionnez des tags..."
                noOptionsMessage={() => "Aucun tag disponible"}
                onChange={handleTagSelection}
                value={selectedTags}
                styles={customStyles}
              />
              {selectedTags.length > 0 && (
                <div className="selected-tags-info">
                  <span>{selectedTags.length} tag(s) sélectionné(s)</span>
                  <button
                    className="clear-tags-btn"
                    onClick={() => setSelectedTags([])}
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={gridRef} className="grid">
          {data.map((illustration) => {
            // Préparer les classes CSS pour le filtrage
            const classes = [`grid-item ${illustration.type}`];

            // Ajouter une classe pour chaque tag de l'illustration
            illustration.tags?.forEach((t) => {
              classes.push(`tag-${normalizeTagName(t.tag.name)}`);
            });

            return (
              <div
                key={illustration.id}
                className={classes.join(" ")}
                onMouseMove={(e) =>
                  handleMouseMove(
                    e,
                    illustration.tags?.map((t) => t.tag.name) || []
                  )
                }
                onMouseLeave={handleMouseLeave}
              >
                <img src={illustration.url} alt={illustration.title} />
              </div>
            );
          })}
        </div>

        {/* Tooltip pour afficher les tags au survol */}
        {hoverInfo.visible && hoverInfo.tags.length > 0 && (
          <div
            className="tag-tooltip"
            style={{
              left: `${hoverInfo.x + 15}px`,
              top: `${hoverInfo.y + 10}px`,
            }}
          >
            {hoverInfo.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
