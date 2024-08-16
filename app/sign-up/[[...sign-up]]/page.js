import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import Navbar from './components/Navbar/Navbar';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <Container maxWidth="100vw">
            <Navbar />
            {/* <AppBar position="static" sx={{ backgroundColor: "#3f51b5" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard SaaS
                    </Typography>
                    <Button color="inherit">
                        <Link href="/sign-in" passHref>
                            <Typography variant="button" component="a">Login</Typography>
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/sign-up" passHref>
                            <Typography variant="button" component="a">Sign Up</Typography>
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar> */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
            >
                <Typography variant="h4">Sign Up</Typography>
                <SignUp />
            </Box>
        </Container>
    );
}
