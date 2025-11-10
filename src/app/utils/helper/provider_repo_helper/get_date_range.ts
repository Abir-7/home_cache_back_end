import { ProviderFilter } from "../../../types/prodiver_repository.interface";

export const getDateRange = (range: ProviderFilter["service_range"]) => {
  const now = new Date();
  const date = new Date();

  switch (range) {
    case "30days":
      date.setDate(now.getDate() - 30);
      break;
    case "90days":
      date.setDate(now.getDate() - 90);
      break;
    case "1year":
      date.setFullYear(now.getFullYear() - 1);
      break;
    case "2year":
      date.setFullYear(now.getFullYear() - 2);
      break;
    default:
      return null;
  }

  return date;
};
