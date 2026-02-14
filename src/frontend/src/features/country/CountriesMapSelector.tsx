import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES, type Country } from './countries';
import { COUNTRY_PATHS } from './worldMapPaths';

interface CountriesMapSelectorProps {
  value?: string;
  onChange: (countryCode: string) => void;
  disabled?: boolean;
}

export function CountriesMapSelector({ value, onChange, disabled }: CountriesMapSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === value);
  }, [value]);

  const handleMapClick = (countryCode: string) => {
    onChange(countryCode);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Your Country</Label>
        <p className="text-sm text-muted-foreground">
          Click on the map or use the dropdown below
        </p>
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            World Map
          </CardTitle>
          <CardDescription>Click on your country</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full"
              style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
            >
              {/* Ocean background */}
              <rect width="1000" height="500" fill="oklch(0.85 0.02 220)" />
              
              {/* Country paths */}
              {COUNTRY_PATHS.map((country) => {
                const isSelected = value === country.code;
                const isHovered = hoveredCountry === country.code;
                
                return (
                  <g key={country.code}>
                    <path
                      d={country.path}
                      fill={
                        isSelected
                          ? 'oklch(0.65 0.15 25)'
                          : isHovered
                          ? 'oklch(0.75 0.10 25)'
                          : 'oklch(0.85 0.05 25)'
                      }
                      stroke="oklch(0.95 0.01 25)"
                      strokeWidth="1"
                      onClick={() => !disabled && handleMapClick(country.code)}
                      onMouseEnter={() => !disabled && setHoveredCountry(country.code)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      style={{
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        transition: 'fill 0.2s ease',
                      }}
                    />
                    {(isSelected || isHovered) && (
                      <text
                        x={country.center.x}
                        y={country.center.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="oklch(0.2 0.02 25)"
                        fontSize="12"
                        fontWeight="600"
                        pointerEvents="none"
                      >
                        {country.code}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          {selectedCountry && (
            <p className="text-sm text-center mt-3 font-medium text-primary">
              Selected: {selectedCountry.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Searchable Dropdown Fallback */}
      <div className="space-y-2">
        <Label htmlFor="country-select">Or search for your country</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="country-select"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={disabled}
            >
              {selectedCountry ? selectedCountry.name : 'Select country...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {COUNTRIES.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={country.name}
                      onSelect={() => {
                        onChange(country.code);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === country.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {country.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
