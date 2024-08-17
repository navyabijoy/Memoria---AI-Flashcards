"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";

import {
  writeBatch,
  doc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to your firebase config
import Navbar from "../components/Navbar/Navbar";
import { Container, Grid, Typography, IconButton } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";

export default function Dashboard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userDecks, setUserDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedDeckCards, setSelectedDeckCards] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchUserDecks();
    }
  }, [user]);

  const fetchUserDecks = async () => {
    if (!user) return;
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      setUserDecks(collections);
    }
  };

  const handleSubmit = async () => {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            body: text,
            headers: {
                'Content-Type': 'text/plain', // Ensure this matches the backend
            },
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const rawData = await response.json(); // Directly parse JSON
        console.log('Parsed Data:', rawData);

        if (!rawData.flashcards || !Array.isArray(rawData.flashcards)) {
            throw new Error('Invalid response format');
        }

        setFlashcards(rawData.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
    }
}


const handleCardClick = (index) => {
    setFlipped((prevFlipped) => ({
      ...prevFlipped,
      [index]: !prevFlipped[index]
    }));
  };

  const viewDeck = async (deckName) => {
    setSelectedDeck(deckName);
    const userDocRef = doc(collection(db, "users"), user.id);
    const deckRef = collection(userDocRef, deckName);
    const querySnapshot = await getDocs(deckRef);
    const cards = querySnapshot.docs.map((doc) => doc.data());
    setSelectedDeckCards(cards);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name for your deck");
      return;
    }

    if (userDecks.length >= 3) {
      alert("You can only have up to 3 flashcard decks");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("A deck with this name already exists");
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
    setName("");
    setText("");
    setFlashcards([]);
    fetchUserDecks();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Head>
        <title>Memoria</title>
        <meta name="description" content="Create flashcards from your text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <SignedIn>
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Memoria
            </h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Generate New Flashcards
              </h2>
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
                {isGenerating ? "Generating..." : "Generate Flashcards"}
              </button>
            </div>

            {flashcards.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Flashcards Preview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {flashcards.map((flashcard, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-md"
                      onClick={() => handleCardClick(index)}
                    >
                      <div
                        className={`relative w-full h-40 ${
                          flipped[index] ? "rotate-y-180" : ""
                        } transform transition-transform duration-500`}
                      >
                        <div className="absolute inset-0 backface-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-white shadow rounded-md p-4">
                            <p className="text-center">{flashcard.front}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180">
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 shadow rounded-md p-4">
                            <p className="text-center">{flashcard.back}</p>
                          </div>
                        </div>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Decks
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userDecks.map((deck, index) => (
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

            {selectedDeck && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedDeck} Preview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedDeckCards.map((flashcard, index) => (
                    <div
                      key={index} // Use the original index for the card within the selected deck
                      onClick={() => handleCardClick(`selected-${index}`)} // Generate the key for the flipped state
                      className="bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`relative w-full h-40 ${
                          flipped[`selected-${index}`] ? "rotate-y-180" : "" // Use the generated key for flipping
                        } transform transition-transform duration-500`}
                      >
                        <div className="absolute inset-0 backface-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-white shadow rounded-md p-4">
                            <p className="text-center">{flashcard.front}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 backface-hidden rotate-y-180">
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 shadow rounded-md p-4">
                            <p className="text-center">{flashcard.back}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="text-center py-10">
            <p className="text-lg font-semibold">You are not signed in</p>
            <Link
              href="/signin"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </SignedOut>
      </main>

      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <Container maxWidth="md">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                Designed by <b>Navya Bijoy</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} container justifyContent="flex-end">
              <IconButton
                href="https://twitter.com/navyabijoy"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                href="https://www.linkedin.com/in/navya-bijoy-883a35249/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                href="mailto:navyabijoy14@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
              >
                <MailIcon />
              </IconButton>
            </Grid>
            
          </Grid>
        </Container>
      </footer>
    </div>
  );
}
