import { Character } from "@/types/Character";
import api from "@/api/axios";

export const getCharactersByName = async (name: string): Promise<Character[]> => {
    try {
        const response = await api.get(`/?name=${name}`);
        const characters = response.data.results;


        const filteredCharacters: Character[] = characters.map((char: any) => ({
            name: char.name,
            image: char.image,
            status: char.status,
            species: char.species,
            location: char.location.name,
        }));
        console.log(filteredCharacters);

        return filteredCharacters;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
