"use client";

import { useEffect, useState } from "react";
import {getCharactersByName} from "@/services/CharacterService";
import {Character} from "@/types/Character";

export default function GetCharacterComponent() {
    const [data, setData] = useState<Character[]>([]);
    async function getCharacters() {
        const data = await getCharactersByName("Rick");
        setData(data);
    }
    useEffect(() => {
       getCharacters();
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}