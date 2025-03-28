"use client";

import { useState, useEffect } from "react";
import { getCharactersByName } from "@/services/CharacterService";
import { Character } from "@/types/Character";
import Image from "next/image";
import loadingIcon from "@/../../public/loading.svg";
import "./GetCharacterComponent.scss";

export default function GetCharacterComponent() {
    const [data, setData] = useState<Character[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Check localStorage for cached data
    useEffect(() => {
        const cachedData = localStorage.getItem(search);
        if (cachedData) {
            setData(JSON.parse(cachedData));
        }
    }, [search]); // This will run when the search value changes

    async function getCharacters() {
        setLoading(true);
        setError(null);

        // Check if data is already cached
        const cachedData = localStorage.getItem(search);
        if (cachedData) {
            setData(JSON.parse(cachedData)); // Use cached data
            setLoading(false);
            return;
        }

        setData([]); // Reset data before fetching

        try {
            const characters = await getCharactersByName(search);
            setData(characters);
            // Store the fetched data in localStorage
            localStorage.setItem(search, JSON.stringify(characters));
        } catch (err) {
            setError("Failed to fetch characters.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Search Input */}
            <header className="flex gap-4 mb-6 items-center">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter character name..."
                />
                <button
                    onClick={getCharacters}
                    className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        "Search"
                    )}
                </button>
            </header>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Loading Spinner */}
            {loading && (
                <div className="flex justify-center my-6">
                    <Image id="loading" src={loadingIcon} alt="loading" width={100} height={100} />
                </div>
            )}

            {/* Character Cards */}
            {!loading && data.length > 0 && (
                <main className="flex flex-wrap justify-center gap-6">
                    {data.map((char, id) => (
                        <div
                            key={id}
                            className="flex flex-col items-center bg-white shadow-lg rounded-xl overflow-hidden w-72 transform transition-transform duration-300 hover:scale-105"
                        >
                            <img src={char.image} alt={char.name} className="w-full h-56 object-cover" />
                            <section className="p-4 text-center">
                                <h2 className="text-xl font-semibold">{char.name}</h2>
                                <p className="text-gray-600">{char.species} - {char.status}</p>
                                <p className="text-sm text-gray-500 mt-1">📍 {char.location}</p>
                            </section>
                        </div>
                    ))}
                </main>
            )}
        </div>
    );
}
