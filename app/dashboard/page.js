"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Head from "next/head";
import {
  Grid,
  Button,
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import {
  writeBatch,
  doc,
  collection,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../components/Navbar/Navbar";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";

export default function Dashboard() {
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [userDecks, setUserDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [selectedDeckCards, setSelectedDeckCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      const jsonData = await response.json();
  
      if (jsonData && jsonData.flashcards) {
        // getting an array of flashcards
        const parsedFlashcards = Array.isArray(jsonData.flashcards) 
          ? jsonData.flashcards 
          : JSON.parse(jsonData.flashcards).flashcards;
        
        setFlashcards(parsedFlashcards);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEditCard = (index) => {
    setEditingCard(flashcards[index]);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingCard(null);
  };

  const handleEditDialogSave = () => {
    const updatedFlashcards = flashcards.map((card) =>
      card === editingCard ? { ...editingCard } : card
    );
    setFlashcards(updatedFlashcards);
    handleEditDialogClose();
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
                      className="bg-gray-50 p-4 rounded-md relative"
                    >
                      <div
                        className={`relative w-full h-40 ${
                          flipped[index] ? "rotate-y-180" : ""
                        } transform transition-transform duration-500`}
                        onClick={() => handleCardClick(index)}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="absolute inset-0 backface-hidden">
                          <div className="w-full h-full flex items-center justify-center bg-white shadow rounded-md p-4">
                            <Typography variant="h5" component="div">
                              {flashcard.front}
                            </Typography>
                          </div>
                        </div>
                        <div 
                          className="absolute inset-0 backface-hidden"
                          style={{
                            transform: 'rotateY(180deg)',
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center bg-purple-100 shadow rounded-md p-4">
                            <Typography variant="h6" component="div">
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <IconButton
                        className="absolute top-2 right-2"
                        onClick={() => handleEditCard(index)}
                      >
                        <EditIcon />
                      </IconButton>
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
                    <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        <CardActionArea onClick={() => handleCardClick(index)}>
                            <CardContent>
                                <Box sx={{
                                    perspective: '1000px',
                                    '& > div': {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                        transform: flipped[index]
                                            ? 'rotateY(180deg)'
                                            : 'rotateY(0deg)',
                                    },
                                    '& > div > div': {
                                        position: 'absolute',
                                        width: '100%',
                                        height: '200px',
                                        backfaceVisibility: 'hidden',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 2,
                                        boxSizing: 'border-box'
                                    },
                                    '& > div > div:nth-of-type(2)': {
                                        transform: 'rotateY(180deg)'
                                    }
                                }}>
                                    <div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {flashcard.front}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h5" component="div">
                                                {flashcard.back}
                                            </Typography>
                                        </div>
                                    </div>
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
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
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Flashcard</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Front"
            type="text"
            fullWidth
            value={editingCard?.front || ''}
            onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Back"
            type="text"
            fullWidth
            value={editingCard?.back || ''}
            onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditDialogSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
