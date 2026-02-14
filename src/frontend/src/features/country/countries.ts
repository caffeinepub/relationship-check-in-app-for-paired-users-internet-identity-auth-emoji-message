import { ISO_3166_ALPHA_2, type CountryData } from './iso3166Alpha2';

// Re-export the interface
export interface Country {
  code: string;
  name: string;
}

// Build the complete country list from ISO dataset
// Ensure uniqueness by code, non-empty names, and alphabetical sort
const buildCountryList = (): Country[] => {
  const uniqueMap = new Map<string, Country>();
  
  for (const country of ISO_3166_ALPHA_2) {
    if (country.code && country.name && country.name.trim()) {
      uniqueMap.set(country.code, {
        code: country.code,
        name: country.name.trim(),
      });
    }
  }
  
  return Array.from(uniqueMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

export const COUNTRIES: Country[] = buildCountryList();

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}
