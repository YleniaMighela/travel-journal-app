import { useState } from "react";

function PostFilter({ onFilterChange, onSortChange }) {
    const [searchText, setSearchText] = useState("");
    const [mood, setMood] = useState("");
    const [sortBy, setSortBy] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        onFilterChange({ searchText: value, mood });
    };

    const handleMoodChange = (e) => {
        const value = e.target.value;
        setMood(value);
        onFilterChange({ searchText, mood: value });
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        onSortChange(value);
    };

    return (
        <div className="post-filter">
            <input
                type="text"
                placeholder="Cerca titolo, luogo o descrizione..."
                value={searchText}
                onChange={handleSearchChange}
            />

            <select value={mood} onChange={handleMoodChange}>
                <option value="">Stato d'animo</option>
                <option value="felice">Felice</option>
                <option value="triste">Triste</option>
                <option value="rilassato">Rilassato</option>
                <option value="stressato">Stressato</option>
            </select>

            <select value={sortBy} onChange={handleSortChange}>
                <option value="">Ordina per...</option>
                <option value="expense">Spesa economica</option>
                <option value="created_at">Data</option>
                <option value="physical_effort">Impegno fisico</option>
            </select>
        </div>
    );
}

export default PostFilter;
