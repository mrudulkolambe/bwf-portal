import { Check, ChevronDown, LucideIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption = {
    value: string;
    label: string;
    subText?: string;
};

interface SelectComponentProps {
    variant: 'searchable' | 'dropdown'
    label?: string;
    placeholder?: string;
    value: string | undefined | null;
    onValueChange?: (value: string) => void;
    options?: SelectOption[];
    defaultValue?: string;
    clearable?: boolean;
    icon?: LucideIcon;
    className?: string;
    fetchOptions?: () => Promise<SelectOption[] | null>;
    loading?: boolean;
    disabled?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}


const SearchableSelect: React.FC<SelectComponentProps> = ({
    placeholder = 'Search...',
    options: staticOptions,
    value,
    onValueChange,
    defaultValue,
    clearable = true,
    icon: IconComponent,
    className,
    fetchOptions,
    loading: externalLoading = false,
    disabled = false,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
}) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = externalOpen ?? internalOpen;
    const setOpen = externalOnOpenChange ?? setInternalOpen;
    const [search, setSearch] = useState('');
    const [fetchedOptions, setFetchedOptions] = useState<SelectOption[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const currentValue = value || defaultValue;

    const options = fetchedOptions ?? staticOptions ?? [];
    const selectedOption = options.find(opt => opt.value === currentValue);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen && fetchOptions && !hasFetched && !isLoading) {
            setIsLoading(true);
            setHasFetched(true);
            fetchOptions()
                .then((fetchedOpts) => {
                    if (fetchedOpts) {
                        setFetchedOptions(fetchedOpts);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching options:', error);
                    setHasFetched(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    // Custom search filtering with useMemo for performance
    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;

        return options.filter((option) =>
            option.label.toLowerCase().includes(search.toLowerCase()) ||
            option.subText?.toLowerCase().includes(search.toLowerCase()) ||
            option.value.toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange?.('');
    };

    const handleSelect = (selectedValue: string) => {
        if (selectedValue === currentValue) {
            onValueChange?.('');
        } else {
            onValueChange?.(selectedValue);
        }
        setOpen(false);
        setSearch('');
    };

    const isLoadingState = isLoading || externalLoading;

    return (
        <Popover open={open && !disabled} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn("w-full justify-between bg-card h-11 pl-3 relative rounded-lg", className)}
                >
                    <div className={cn("flex items-center gap-2 flex-1 text-left min-w-0 font-medium", currentValue && "pr-6")}>
                        {IconComponent && (
                            <IconComponent className={cn("size-4 text-main shrink-0", selectedOption ? "text-foreground" : "text-muted-foreground")} />
                        )}
                        <span className={cn("font-normal truncate text-sm", selectedOption ? "text-foreground" : "text-muted-foreground")}>
                            {isLoadingState ? 'Loading...' : selectedOption ? selectedOption.label : placeholder}
                        </span>
                    </div>
                    {(!currentValue || !clearable) && (
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    )}
                    {clearable && currentValue && !disabled && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                            onClick={handleClear}
                        >
                            <X className="h-3 w-3 text-foreground" />
                        </Button>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-(--radix-popover-trigger-width) p-0"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Command shouldFilter={false}>
                    <CommandInput
                        className="h-11"
                        placeholder={placeholder}
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        {isLoadingState ? (
                            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                                Loading options...
                            </div>
                        ) : filteredOptions.length === 0 ? (
                            <CommandEmpty>No results found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        className='hover:bg-main/5'
                                        key={option.value}
                                        value={option.value}
                                        onSelect={() => handleSelect(option.value)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currentValue === option.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className='flex items-center gap-3 flex-1 px-1 py-1'>
                                            <div className='flex flex-col gap-0.5'>
                                                <p className='font-medium text-sm text-foreground'>{option.label}</p>
                                                {option.subText && (
                                                    <p className='text-xs text-muted-foreground'>{option.subText}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const Dropdown: React.FC<SelectComponentProps> = ({
    placeholder = 'Select an option',
    options: staticOptions,
    value,
    onValueChange,
    defaultValue,
    clearable = true,
    icon: IconComponent,
    className,
    fetchOptions,
    loading: externalLoading = false,
}) => {
    const [open, setOpen] = useState(false);
    const [fetchedOptions, setFetchedOptions] = useState<SelectOption[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const currentValue = value || defaultValue;
    const options = fetchedOptions ?? staticOptions ?? [];
    const selectedOption = options.find(opt => opt.value === currentValue);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);

        if (isOpen && fetchOptions && !hasFetched && !isLoading) {
            setIsLoading(true);
            setHasFetched(true);
            fetchOptions()
                .then((fetchedOpts) => {
                    if (fetchedOpts) {
                        setFetchedOptions(fetchedOpts);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching options:', error);
                    setHasFetched(false);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onValueChange?.('');
    };

    const isLoadingState = isLoading || externalLoading;

    return (
        <div className="relative w-full">
            <Select value={currentValue || ''} onValueChange={(val) => {
                onValueChange?.(val);
                setOpen(false);
            }} open={open} onOpenChange={handleOpenChange}>
                <SelectTrigger
                    clearable={clearable}
                    className={cn("font-medium flex items-center justify-between w-full rounded-lg bg-card", className)}
                    aria-label="Select a value"
                >
                    <div className={cn("flex items-center gap-2", currentValue ? "text-foreground" : "text-muted-foreground")}>
                        {IconComponent && !(clearable && currentValue) && (
                            <IconComponent className="size-4 text-muted-foreground" />
                        )}
                        {currentValue && selectedOption ? (
                            <span className="truncate">{selectedOption.label}</span>
                        ) : (
                            <SelectValue placeholder={isLoadingState ? 'Loading...' : placeholder} />
                        )}
                    </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                    {isLoadingState ? (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            Loading options...
                        </div>
                    ) : options.length > 0 ? (
                        options.map((option) => (
                            <SelectItem key={option.value} value={option.value} className="rounded-lg py-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold text-sm">{option.label}</span>
                                        {option.subText && (
                                            <span className="text-xs text-muted-foreground">{option.subText}</span>
                                        )}
                                    </div>
                                </div>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No options available
                        </div>
                    )}
                </SelectContent>
            </Select>
            {clearable && currentValue && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                    onClick={handleClear}
                >
                    <X className="h-3 w-3 text-foreground" />
                </Button>
            )}
        </div>
    );
};




export const AppSelect: React.FC<SelectComponentProps> = (props) => {
    let content = null;
    switch (props.variant) {
        case 'searchable':
            content = <SearchableSelect {...props} />;
            break;
        case 'dropdown':
            content = <Dropdown {...props} />;
            break;
        default:
            content = null;
    }

    if (!content) return null;

    return (
        <div className="flex flex-col gap-2 w-full">
            {props.label && (
                <p className="text-sm font-medium text-foreground/80 ml-0.5">
                    {props.label}
                </p>
            )}
            {content}
        </div>
    );
};