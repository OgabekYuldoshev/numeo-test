import { Flex, Select, TextInput } from "@mantine/core";
import { useDidUpdate } from "@mantine/hooks";
import { useState } from "react";

interface UserFilterProps {
    searchQuery: string
    onSearchQueryChange: (query: string) => void
    filter: Record<string, unknown>
    onFilterChange: (filter: Record<string, unknown>) => void
}

export function UserFilter({ searchQuery, onSearchQueryChange, filter, onFilterChange }: UserFilterProps) {
    const [ageRange, setAgeRange] = useState<string>("")

    useDidUpdate(() => {
        onFilterChange({ ...filter, ageRange })
    }, [ageRange])

    return (
        <Flex gap="sm">
            <TextInput
                style={{ flex: 1 }}
                placeholder="Search by name or email (debounced 500ms)"
                value={searchQuery}
                onChange={(event) => onSearchQueryChange(event.target.value)} />
            <Select
                clearable
                placeholder="Filter by age range"
                w={200}
                data={[
                    { label: "18-25", value: "18-25" },
                    { label: "26-35", value: "26-35" },
                    { label: "36-45", value: "36-45" },
                    { label: "46-55", value: "46-55" },
                    { label: "56-65", value: "56-65" },
                ]}
                value={ageRange}
                onChange={(value) => setAgeRange(value ?? "")}
            />
        </Flex>
    )
}
