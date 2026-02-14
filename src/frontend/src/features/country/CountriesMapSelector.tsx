import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRIES } from './countries';

interface CountriesMapSelectorProps {
  value?: string;
  onChange: (countryCode: string) => void;
  disabled?: boolean;
}

export function CountriesMapSelector({ value, onChange, disabled }: CountriesMapSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === value);
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="country-select">Select Your Country</Label>
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
                    value={`${country.name} ${country.code}`}
                    keywords={[country.name, country.code]}
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
  );
}
