'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { writeBatch, doc, collection, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path to your firebase config
import Navbar from '../components/Navbar/Navbar';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';

export default function Dashboard() {
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDecks, setFilteredDecks] = useState([]);
    const [editingCard, setEditingCard] = useState(null);
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if (user) {
            fetchUserDecks();
        }
    }, [user]);

    const fetchUserDecks = async () => {
        if (!user) return;
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            setFilteredDecks(collections);
        }
    };

    const handleSubmit = async () => {
        setIsGenerating(true);
        try {
            const flash = await fetch('api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
    
            const jsonData = await flash.json();
    
            if (jsonData && jsonData.flashcards) {
                const parsedFlashcards = JSON.parse(jsonData.flashcards).flashcards;
                setFlashcards(parsedFlashcards);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsGenerating(false);
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }
    
    const viewDeck = async (deckName) => {
        router.push(`/flashcards/${deckName}`);
    };

    const handleEdit = (index) => {
        setEditingCard(index);
    };

    const handleSaveEdit = (index) => {
        setEditingCard(null);
        // Save changes to the database if needed
    };

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for your deck');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert('A deck with this name already exists');
                return;
            } else {
                collections.push({ name });
                batch.set(userDocRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        setName('');
        setText('');
        setFlashcards([]);
        fetchUserDecks();
    }

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = filteredDecks.filter(deck => deck.name.toLowerCase().includes(term));
        setFilteredDecks(filtered);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <SignedIn>
                    <div className="px-4 py-6 sm:px-0">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Memoria</h1>
                        
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate New Flashcards</h2>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter text or topic"
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                rows="4"
                            />
                            <button 
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generating...' : 'Generate Flashcards'}
                            </button>
                        </div>

                        {flashcards.length > 0 && (
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcards Preview</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {flashcards.map((flashcard, index) => (
                                        <div 
                                            key={index} 
                                            className="bg-gray-50 p-4 rounded-md"
                                        >
                                            <div className={`relative w-full h-40 ${flipped[index] ? 'rotate-y-180' : ''} transform transition-transform duration-500`}>
                                                <div className="absolute inset-0 backface-hidden">
                                                    <div className="w-full h-full flex items-center justify-center bg-white shadow rounded-md p-4">
                                                        {editingCard === index ? (
                                                            <textarea
                                                                value={flashcard.front}
                                                                onChange={(e) => {
                                                                    const newFlashcards = [...flashcards];
                                                                    newFlashcards[index].front = e.target.value;
                                                                    setFlashcards(newFlashcards);
                                                                }}
                                                                className="w-full h-full p-2 border border-gray-300 rounded-md"
                                                            />
                                                        ) : (
                                                            <p className="text-center" onClick={() => handleCardClick(index)}>{flashcard.front}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="absolute inset-0 backface-hidden rotate-y-180">
                                                    <div className="w-full h-full flex items-center justify-center bg-purple-100 shadow rounded-md p-4">
                                                        {editingCard === index ? (
                                                            <textarea
                                                                value={flashcard.back}
                                                                onChange={(e) => {
                                                                    const newFlashcards = [...flashcards];
                                                                    newFlashcards[index].back = e.target.value;
                                                                    setFlashcards(newFlashcards);
                                                                }}
                                                                className="w-full h-full p-2 border border-gray-300 rounded-md"
                                                            />
                                                        ) : (
                                                            <p className="text-center" onClick={() => handleCardClick(index)}>{flashcard.back}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex justify-end">
                                                {editingCard === index ? (
                                                    <button 
                                                        onClick={() => handleSaveEdit(index)}
                                                        className="px-2 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                                                    >
                                                        Save
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleEdit(index)}
                                                        className="px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter deck name"
                                        className="w-full p-2 border border-gray-300 rounded-md mb-4"
                                    />
                                    <button 
                                        onClick={saveFlashcards}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                    >
                                        Save Deck
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Decks</h2>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search decks..."
                                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {filteredDecks.map((deck, index) => (
                                    <div
                                        key={index}
                                        onClick={() => viewDeck(deck.name)}
                                        className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                    >
                                        <Typography variant="h6">{deck.name}</Typography>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SignedIn>
                <SignedOut>
                    <div className="text-center py-10">
                        <p className="text-lg font-semibold">You are not signed in</p>
                        <Link href="/signin" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </SignedOut>
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <Container maxWidth="md">
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <IconButton href="https://twitter.com/yourtwitterhandle" target="_blank" rel="noopener noreferrer">
                                <TwitterIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton href="https://linkedin.com/in/yourlinkedinprofile" target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton href="mailto:navyabijoy14@gmail.com" target="_blank" rel="noopener noreferrer">
                                <MailIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Container>
            </footer>
        </div>
    );
}
