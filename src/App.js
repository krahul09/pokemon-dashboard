import React, { useState, useEffect } from 'react';


function App() {
    const [pokemonName, setPokemonName] = useState('');
    const [pokemonData, setPokemonData] = useState(null);
    const [error, setError] = useState(null);
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchPokemonList();
    }, [currentPage]);

    const fetchPokemonList = async () => {
        try {
            const offset = (currentPage - 1) * itemsPerPage;
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${itemsPerPage}`);
            const data = await response.json();
            const promises = data.results.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                return res.json();
            });
            const pokemonDetails = await Promise.all(promises);
            setPokemonList(pokemonDetails);
            setTotalPages(Math.ceil(data.count / itemsPerPage));
        } catch (error) {
            setError('Failed to fetch Pokémon list');
        }
    };

    const handleSearchChange = (e) => {
        setPokemonName(e.target.value);
    };

    const handleSearchClick = async () => {
        if (pokemonName.trim() === '') return;

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error('Pokémon not found');
            }

            setPokemonData(data);
            setError(null);
        } catch (error) {
            setError('Pokémon not found or it is not a Pokémon');
            setPokemonData(null);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
    };

    const handleHomeClick = () => {
        setPokemonData(null);
        setError(null);
        setPokemonName('');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`${darkMode ? 'dark' : ''} flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4`}>
            <div className="w-full flex justify-end mb-4">
                <button
                    onClick={toggleDarkMode}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Pokémon Search</h1>
            <div className="flex flex-col items-center mb-4">
                <input
                    type="text"
                    value={pokemonName}
                    onChange={handleSearchChange}
                    placeholder="Enter Pokémon name"
                    className="p-2 border border-gray-400 rounded mb-2"
                />
                <div className="flex">
                    <button
                        onClick={handleSearchClick}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                    >
                        Search
                    </button>
                    <button
                        onClick={handleHomeClick}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    >
                        Home
                    </button>
                </div>
            </div>
            {error && <div className="text-red-500 dark:text-red-400">{error}</div>}
            {pokemonData ? (
                <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded shadow-md">
                    <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="mt-4" />
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{pokemonData.name}</h2>
                    <p className="mb-1 text-gray-900 dark:text-gray-100">Base experience: {pokemonData.base_experience}</p>
                    <p className="mb-1 text-gray-900 dark:text-gray-100">Height: {pokemonData.height}</p>
                    <p className="mb-1 text-gray-900 dark:text-gray-100">Weight: {pokemonData.weight}</p>
                    <p className="mb-1 text-gray-900 dark:text-gray-100">Abilities: {pokemonData.abilities.map((item) => item.ability.name).join(', ')}</p>
                </div>
            ) : (
                <>
                    <div className="pokemon-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                        {pokemonList.map((pokemon) => (
                            <div key={pokemon.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md flex flex-col items-center">
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mb-4" />
                                <h2 className="text-xl font-bold mb-2 capitalize text-gray-900 dark:text-gray-100">{pokemon.name}</h2>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">Base experience: {pokemon.base_experience}</p>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">Height: {pokemon.height}</p>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">Weight: {pokemon.weight}</p>
                                <p className="mb-1 text-gray-900 dark:text-gray-100">Abilities: {pokemon.abilities.map((item) => item.ability.name).join(', ')}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-2"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-900 dark:text-gray-100">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 ml-2"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
