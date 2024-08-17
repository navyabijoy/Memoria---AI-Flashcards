"use client";
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
  Paper,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/HeroSection/HeroSection";
import PricingSection from "./components/HeroSection/pricing";
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const Content = () => {
    return (
      <div className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center gap-12 z-10">
        <h1
          className={`${urbanist.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-semibold text-center bg-clip-text text-transparent`}
          style={{
            background: "radial-gradient(circle, purple, white)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        ></h1>
      </div>
    );
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ overflow: "hidden" }}>
      <Head>
        <title>Memoria</title>
        <meta name="description" content="Create flashcards from your text" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <HeroSection />

      <Box
      sx={{
        my: { xs: 4, md: 8 },
        position: 'relative',
        zIndex: 1,
        borderRadius: '16px', // Rounded corners for the parent box
        padding: { xs: 2, sm: 4, md: 6 }, // Adjust padding for responsiveness
      }}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontFamily: 'Urbanist, sans-serif',
          fontWeight: 600,
          background: 'black',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          px: 2,
        }}
      > Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[
          {
            title: "Intelligent Personalization",
            description:
              "Our platform leverages innovative AI to generate flashcards rapidly. The user can then customize it to their preference.",
            image: "/assests/image.png",
          },
          {
            title: "Secure and Reliable Storage",
            description:
              "Never lose your flashcards. All your decks are securely stored in Firebase, ensuring your data is safe and accessible anytime, anywhere.",
            image: "/assests/feature2.png",
          },
          {
            title: "Get Started for Free",
            description:
              "Create up to three flashcard decks with our free plan. Experience the power of AI in learning without any upfront cost.",
            image: "/assests/feature3.png",
          },
        ].map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                height: '325px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
                width: 'fit', // Ensure the child box takes full width of the Grid item
              }}
            >
              <Image
                src={feature.image}
                alt={feature.title}
                width={300}
                height={200}
                style={{
                  objectFit: 'cover',
                  marginBottom: '1rem',
                  borderRadius: '4px',
                }}
              />
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
              >
                {feature.title}
              </Typography>
              <Typography sx={{ textAlign: 'center' }}>
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>

      <Box
        sx={{ my: { xs: 8, md: 16 }, position: "relative", overflow: "hidden" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            textAlign: "center",
            // Optional: Add media queries if needed for specific layout changes
          }}
        >
          <Typography
            variant={isMobile ? "h4" : "h3"}
            component="h3"
            sx={{
              mb: 2,
              fontFamily: "Urbanist, sans-serif",
              fontWeight: 600,
              background: "linear-gradient(45deg, #8B5CF6, #D946EF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              px: 2,
              display: "inline-block",
              // Adjust font size for responsive design
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
            }}
          >
            Interactive Learning Experience
          </Typography>
        </Box>
        <Typography
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth:'900px',
            textAlign: "center",
            margin: "auto",
            px: { xs: 2, sm: 4, md: 6 }, // Responsive padding
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" }, // Responsive font size
          }}
        >
          Engage with your flashcards in a user-friendly and interactive
          environment. Customize your study sessions with ease and optimize your
          learning with intuitive tools designed to enhance retention and
          understanding.
        </Typography>
      </Box>

      <PricingSection />

      <Box component="footer" sx={{ py: 4, mt: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4} >
            <Typography variant="body1" color={'gray'}>
              Designed by <b>Navya Bijoy</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container justifyContent="flex-end">
                            <IconButton href="https://twitter.com/yourtwitterhandle" target="_blank" rel="noopener noreferrer" color="inherit">
                                <TwitterIcon />
                            </IconButton>
                            <IconButton href="https://www.linkedin.com/in/navya-bijoy-883a35249/" target="_blank" rel="noopener noreferrer" color="inherit">
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton href="mailto:navyabijoy14@gmail.com" target="_blank" rel="noopener noreferrer" color="inherit">
                                <MailIcon />
                            </IconButton>
                        </Grid>
        </Grid>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ pt: 4 }}
        >
          © 2023 Memoria. All rights reserved.
        </Typography>
      </Container>
    </Box>
    </Container>
  );
}
