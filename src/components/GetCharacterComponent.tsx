"use client";

import { useState } from "react";
import { getCharactersByName } from "@/services/CharacterService";
import { Character } from "@/types/Character";

export default function GetCharacterComponent() {
    const [data, setData] = useState<Character[]>([]);
    const [search, setSearch] = useState<string>("Rick");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    async function getCharacters() {
        setLoading(true);
        setError(null);
        try {
            const characters = await getCharactersByName(search);
            setData(characters);
        } catch (err) {
            setError("Failed to fetch characters.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter character name..."
                />
                <button
                    onClick={getCharacters}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Search"
                    )}
                </button>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center my-4">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full">Loading</div>
                </div>
            )}

            {/* Character Cards */}
            {!loading && data.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.map((char) => (
                        <div key={char.name} className="bg-white shadow-md rounded-lg overflow-hidden">
                            <img src={char.image} alt={char.name} className="w-full h-48 object-cover" />
                            <div className="p-3">
                                <h2 className="text-lg font-bold">{char.name}</h2>
                                <p className="text-gray-600">{char.species} - {char.status}</p>
                                <p className="text-sm text-gray-500">📍 {char.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
