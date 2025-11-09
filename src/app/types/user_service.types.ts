export type LastServiceData = {
  type: string;
  lastservice: string; // ISO date string
  note: string;
};

export type UserHomeDataPayload = {
  home_type: string;
  home_address: string;
  home_power_type: string[];
  home_water_supply_type: string[];
  // home_utilities?: string[]; // optional
  home_heating_type: string[];
  home_heating_power: string;
  home_cooling_type: string[];
  responsible_for: string[];
  want_to_track: string[];
  last_service_data: LastServiceData;
};
