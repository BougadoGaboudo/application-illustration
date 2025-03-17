export function translateStatus(status) {
    const statusTranslations = {
      pending: "En attente",
      in_progress: "En cours",
      completed: "Terminée",
      rejected: "Refusée"
    }
    return statusTranslations[status] || status;
  }
  