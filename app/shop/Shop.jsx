// "use client";

// import { useState, useRef, useEffect } from "react";
// import Isotope from "isotope-layout";
// import { addToCart } from "@/lib/cart.action";

// const Shop = ({ data }) => {
//   const gridRef = useRef(null);
//   const [iso, setIso] = useState(null);
//   const [filter, setFilter] = useState("*");

//   useEffect(() => {
//     if (gridRef.current) {
//       const isoInstance = new Isotope(gridRef.current, {
//         itemSelector: ".grid-item",
//         masonry: {
//           fitWidth: true,
//           gutter: 16,
//         },
//       });
//       setIso(isoInstance);
//     }
//     return () => iso?.destroy();
//   }, []);

//   useEffect(() => {
//     if (iso) {
//       const filterValue = filter === "*" ? "*" : `.${filter}`;
//       iso.arrange({ filter: filterValue });
//     }
//   }, [filter, iso]);

//   return (
//     <section className="section-shop">
//       <h1>Shop</h1>
//       <div className="filter-buttons-container">
//         {["*", "original", "fanart", "study"].map((category) => (
//           <button
//             key={category}
//             onClick={() => setFilter(category)}
//             className={filter === category ? "active" : ""}
//           >
//             {category === "*" ? "Tous" : category}
//           </button>
//         ))}
//       </div>
//       <div ref={gridRef} className="grid">
//         {data.map((illustration) => (
//           <form action={addToCart} key={illustration.id}>
//             <div className={`grid-item ${illustration.type}`}>
//               <img src={illustration.url} alt={illustration.title} />
//               <h3>{illustration.title}</h3>
//               <span className="price">{illustration.price}€</span>
//               <input type="hidden" name="id" value={illustration.id} />
//               <input type="number" name="quantity" min="1" defaultValue={1} />
//               <button type="submit">Ajouter au panier</button>
//             </div>
//           </form>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Shop;

"use client";

import { useState, useRef, useEffect } from "react";
import Isotope from "isotope-layout";
import {
  addToCart,
  getFormats,
  getSizes,
  getPriceForFormatAndSize,
} from "@/lib/cart.action";

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
        const sizesData = await getSizes();

        setFormats(formatsData);
        setSizes(sizesData);

        // Initialiser les sélections par défaut pour chaque illustration
        const defaultFormats = {};
        const defaultSizes = {};
        const initialPrices = {};

        data.forEach((illustration) => {
          if (formatsData.length > 0 && sizesData.length > 0) {
            defaultFormats[illustration.id] = formatsData[0].id;
            defaultSizes[illustration.id] = sizesData[0].id;

            // Charger le prix initial
            loadPrice(
              illustration.id,
              formatsData[0].id,
              sizesData[0].id,
              initialPrices
            );
          }
        });

        setSelectedFormats(defaultFormats);
        setSelectedSizes(defaultSizes);
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
      const price = await getPriceForFormatAndSize(formatId, sizeId);

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
  const getPrice = (illustrationId) => {
    const formatId = selectedFormats[illustrationId];
    const sizeId = selectedSizes[illustrationId];
    if (!formatId || !sizeId) return "Prix indisponible";

    const price = prices[`${illustrationId}-${formatId}-${sizeId}`];
    return price !== null && price !== undefined ? `${price}€` : "20 €";
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

              {/* Sélection du format */}
              <div className="product-options">
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

              {/* Sélection de la taille */}
              <div className="product-options">
                <label htmlFor={`size-${illustration.id}`}>Taille:</label>
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
                    Choisir une taille
                  </option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>

              <span className="price">{getPrice(illustration.id)}</span>
              <input type="hidden" name="id" value={illustration.id} />
              <input type="number" name="quantity" min="1" defaultValue={1} />
              <button type="submit">Ajouter au panier</button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
};

export default Shop;
