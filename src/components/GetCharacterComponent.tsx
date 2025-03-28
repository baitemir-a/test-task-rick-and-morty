"use client";

import { useState, useEffect, useCallback } from "react";
import { getCharactersByName } from "@/services/CharacterService";
import { Character } from "@/types/Character";
import Image from "next/image";
import loadingIcon from "@/../../public/loading.svg";
import "./GetCharacterComponent.scss";

const CHARACTER_CACHE_KEY_PREFIX = "character_search_";

export default function GetCharacterComponent() {
    const [data, setData] = useState<Character[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const cachedData = localStorage.getItem(`${CHARACTER_CACHE_KEY_PREFIX}${search}`);
        if (cachedData) {
            setData(JSON.parse(cachedData));
        } else {
            setData([]);
        }
    }, [search]);


    const debouncedGetCharacters = useCallback(async () => {
        if (!search.trim()) {
            setData([]);
            setError(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        const cacheKey = `${CHARACTER_CACHE_KEY_PREFIX}${search}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            setData(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        try {
            const characters = await getCharactersByName(search);
            setData(characters);
            localStorage.setItem(cacheKey, JSON.stringify(characters));
        } catch (err) {
            setError("Failed to fetch characters.");
            console.error("Error fetching characters:", err);
        } finally {
            setLoading(false);
        }
    }, [search]);


    useEffect(() => {
        const timeoutId = setTimeout(debouncedGetCharacters, 300);
        return () => clearTimeout(timeoutId);
    }, [search, debouncedGetCharacters]);

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

    };

    return (
        <div className="get-character-component p-6 max-w-5xl mx-auto">
            <header className="flex gap-4 mb-6 items-center">
                <input
                    type="text"
                    value={search}
                    onChange={handleSearchInputChange}
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter character name..."
                />
                <button
                    onClick={debouncedGetCharacters}
                    className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !search.trim()}
                >
                    {loading ? (
                        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Search"
                    )}
                </button>
            </header>

            {error && <p className="error-message text-red-500 text-center">{error}</p>}

            {loading && (
                <div className="loading-container flex justify-center my-6">
                    <Image id="loading-icon" src={loadingIcon} alt="loading" width={100} height={100} />
                </div>
            )}

            {!loading && data.length > 0 && (
                <main className="character-grid flex flex-wrap justify-center gap-6">
                    {data.map((char) => (
                        <div
                            key={char.id}
                            className="character-card flex flex-col items-center bg-white shadow-lg rounded-xl overflow-hidden w-72 transform transition-transform duration-300 hover:scale-105"
                        >
                            <Image src={char.image} alt={char.name} className="w-full h-56 object-cover" width={288} height={224} />
                            <section className="character-info p-4 text-center">
                                <h2 className="character-name text-xl font-semibold">{char.name}</h2>
                                <p className="character-details text-gray-600">{char.species} - {char.status}</p>
                                <p className="character-location text-sm text-gray-500 mt-1">📍 {char.location}</p>
                            </section>
                        </div>
                    ))}
                </main>
            )}

            {!loading && data.length === 0 && search.trim() && !error && (
                <p className="text-gray-500 text-center mt-6">No characters found for "{search}".</p>
            )}
        </div>
    );
}