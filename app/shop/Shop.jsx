"use client";

import { useState, useRef, useEffect } from "react";
import Isotope from "isotope-layout";
import { addToCart, getFormats, getTypes, getPrice } from "@/lib/cart.action";

const Shop = ({ data }) => {
  const gridRef = useRef(null);
  const [iso, setIso] = useState(null);
  const [filter, setFilter] = useState("*");
  const [formats, setFormats] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [prices, setPrices] = useState({});

  // Charger les formats et tailles au chargement
  useEffect(() => {
    async function loadOptions() {
      try {
        const formatsData = await getFormats();
        const sizesData = await getTypes();

        setFormats(formatsData);
        setSizes(sizesData);

        // Initialiser les sélections par défaut pour chaque illustration
        const defaultFormats = {};
        const defaultSizes = {};
        const initialPrices = {};

        const pricePromises = data.map(async (illustration) => {
          if (formatsData.length > 0 && sizesData.length > 0) {
            const defaultFormatId = formatsData[0].id;
            const defaultSizeId = sizesData[0].id;

            defaultFormats[illustration.id] = defaultFormatId;
            defaultSizes[illustration.id] = defaultSizeId;

            const price = await getPrice(defaultFormatId, defaultSizeId);
            initialPrices[
              `${illustration.id}-${defaultFormatId}-${defaultSizeId}`
            ] = price;
          }
        });

        await Promise.all(pricePromises);

        setSelectedFormats(defaultFormats);
        setSelectedSizes(defaultSizes);
        setPrices(initialPrices);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des formats et tailles",
          error
        );
      }
    }

    loadOptions();
  }, [data]);

  // Initialiser Isotope
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

  // Fonction pour charger le prix
  async function loadPrice(illustrationId, formatId, sizeId, priceObj = null) {
    try {
      const price = await getPrice(formatId, sizeId);

      if (priceObj) {
        priceObj[`${illustrationId}-${formatId}-${sizeId}`] = price;
      } else {
        setPrices((prev) => ({
          ...prev,
          [`${illustrationId}-${formatId}-${sizeId}`]: price,
        }));
      }
    } catch (error) {
      console.error("Erreur lors du chargement du prix", error);
    }
  }

  // Gérer le changement de format
  const handleFormatChange = async (illustrationId, formatId) => {
    setSelectedFormats((prev) => ({
      ...prev,
      [illustrationId]: formatId,
    }));

    const sizeId = selectedSizes[illustrationId];
    if (sizeId) {
      await loadPrice(illustrationId, formatId, sizeId);
    }
  };

  // Gérer le changement de taille
  const handleSizeChange = async (illustrationId, sizeId) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [illustrationId]: sizeId,
    }));

    const formatId = selectedFormats[illustrationId];
    if (formatId) {
      await loadPrice(illustrationId, formatId, sizeId);
    }
  };

  // Récupérer le prix pour une illustration
  const getNewPrice = (illustrationId) => {
    const formatId = selectedFormats[illustrationId];
    const sizeId = selectedSizes[illustrationId];
    if (!formatId || !sizeId) return "...";

    const price = prices[`${illustrationId}-${formatId}-${sizeId}`];
    return price !== null && price !== undefined ? `${price}€` : "...";
  };

  return (
    <section className="section-shop">
      <div className="filter-buttons-container">
        {["*", "original", "fanart"].map((category) => (
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
          <form action={addToCart} key={illustration.id}>
            <div className={`grid-item ${illustration.type}`}>
              <img src={illustration.url} alt={illustration.title} />
              <h3>{illustration.title}</h3>

              <div className="options-container">
                {/* Sélection du format */}
                <div className="option">
                  <label htmlFor={`format-${illustration.id}`}>Format:</label>
                  <select
                    id={`format-${illustration.id}`}
                    name="formatId"
                    value={selectedFormats[illustration.id] || ""}
                    onChange={(e) =>
                      handleFormatChange(illustration.id, e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      Choisir un format
                    </option>
                    {formats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Sélection du type (renommé de taille) */}
                <div className="option">
                  <label htmlFor={`size-${illustration.id}`}>Type:</label>
                  <select
                    id={`size-${illustration.id}`}
                    name="sizeId"
                    value={selectedSizes[illustration.id] || ""}
                    onChange={(e) =>
                      handleSizeChange(illustration.id, e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      Choisir un type
                    </option>
                    {sizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="price">{getNewPrice(illustration.id)}</span>
              <input type="hidden" name="id" value={illustration.id} />
              <label htmlFor="quantity">Quantité:</label>
              <input
                type="number"
                name="quantity"
                min="1"
                defaultValue={1}
                className="quantity"
              />
              <button type="submit">Ajouter au panier</button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
};

export default Shop;
