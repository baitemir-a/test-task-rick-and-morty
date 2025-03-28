"use client";

import { useState } from "react";
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

    async function getCharacters() {
        setLoading(true);
        setError(null);
        setData([]);
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
        <div className="p-6 max-w-5xl mx-auto">
            {/* Search Input */}
            <div className="flex gap-4 mb-6 items-center">
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
            </div>

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
                <div className="flex flex-wrap justify-center gap-6">
                    {data.map((char) => (
                        <div
                            key={char.name}
                            className="flex flex-col items-center bg-white shadow-lg rounded-xl overflow-hidden w-72 transform transition-transform duration-300 hover:scale-105"
                        >
                            <img src={char.image} alt={char.name} className="w-full h-56 object-cover" />
                            <div className="p-4 text-center">
                                <h2 className="text-xl font-semibold">{char.name}</h2>
                                <p className="text-gray-600">{char.species} - {char.status}</p>
                                <p className="text-sm text-gray-500 mt-1">📍 {char.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
