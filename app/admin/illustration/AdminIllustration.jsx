"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

// Import dynamique de CreatableSelect avec option ssr: false
const CreatableSelect = dynamic(() => import("react-select/creatable"), {
  ssr: false,
});

export default function AdminIllustration({
  createIllustration,
  existingTags = [],
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est complètement monté avant de rendre le select
  useEffect(() => {
    setMounted(true);
  }, []);

  // Transformer les tags existants au format attendu par react-select
  const tagOptions = useMemo(() => {
    return existingTags.map((tag) => ({
      value: tag.name,
      label: tag.name,
    }));
  }, [existingTags]);

  // Fonction pour gérer l'envoi du formulaire
  const handleSubmit = async (formData) => {
    // Transformer les tags sélectionnés en chaîne séparée par des virgules
    const tagString = selectedTags.map((tag) => tag.value).join(",");

    // Ajouter les tags au formData
    formData.append("tags", tagString);

    // Appeler la fonction createIllustration
    return createIllustration(formData);
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
    <section className="section-admin-illus">
      <h1>Gestion des illustrations</h1>
      <br />
      <form action={handleSubmit}>
        <label htmlFor="title">Titre</label>
        <input type="text" name="title" id="title" required />

        <label htmlFor="file">Fichier</label>
        <input type="file" name="file" id="file" accept="image/*" required />

        <label htmlFor="type">Type</label>
        <select name="type" id="type" required>
          <option value="original">Original</option>
          <option value="fanart">Fanart</option>
          <option value="study">Study</option>
        </select>

        <label htmlFor="tags">Tags</label>
        {mounted ? (
          <CreatableSelect
            isMulti
            options={tagOptions}
            className="tag-multi-select"
            classNamePrefix="select"
            placeholder="Sélectionnez ou créez des tags..."
            noOptionsMessage={() => "Commencez à écrire pour créer un tag"}
            onChange={setSelectedTags}
            value={selectedTags}
            styles={customStyles}
            formatCreateLabel={(inputValue) => `Créer le tag "${inputValue}"`}
          />
        ) : (
          <div className="select-placeholder">
            Chargement du sélecteur de tags...
          </div>
        )}

        <button type="submit">Ajouter</button>
      </form>
    </section>
  );
}
