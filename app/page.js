import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import {
  Grid,
  Button,
  Toolbar,
  AppBar,
  Container,
  Box,
  Typography,
} from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="100vw">
      <Head>
        <title>Memoria</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in"> Login </Button>
            <Button color="inherit" href="/sign-up"> Sign Up </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: "center",
          my: 4,
        }}
      >
        <Typography variant="h2">Welcome to Flashcard SaaS</Typography>
        <Typography variant="h5">
          The easiest way to make flashcards for your test
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>
              Create flashcards quickly by just entering your topic text.
            </Typography>
          </Grid>
          {/* Add more Grid items for additional features */}
        </Grid>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="h6">Free Mode</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: $0
              </Typography>
              <Box>
                <ul>
                  <li>Create up to 3 flashcard decks.</li>
                  <li>Basic AI-powered flashcard creation.</li>
                  <li>Access to interactive learning tools.</li>
                  <li>Limited support.</li>
                </ul>
              </Box>
              <Button variant="contained">Get Started</Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="h6">Basic Mode</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: $4.99/month
              </Typography>
              <Box>
                <ul>
                  <li>Create up to 10 flashcard decks.</li>
                  <li>Limited storage (e.g., up to 500 MB or a set number of flashcards).</li>
                  <li>Ability to export flashcards to PDF or CSV.</li>
                  <li>Email support.</li>
                </ul>
              </Box>
              <Button variant="contained">Get Started</Button>

            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
              <Typography variant="h6">Pro Mode</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Price: $9.99/month
              </Typography>
              <Box>
                <ul>
                  <li>Unlimited flashcard decks.</li>
                  <li>Unlimited storage.</li>
                  <li>Priority support and regular updates.</li>
                  <li>Sync across multiple devices.</li>
                </ul>
              </Box>
              <Button variant="contained">Get Started</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
