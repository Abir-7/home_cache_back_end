export interface ProviderFilter {
  min_rating?: number;
  type?: string;
  service_range?: "30days" | "90days" | "1year" | "2year";
  search?: string;
}
