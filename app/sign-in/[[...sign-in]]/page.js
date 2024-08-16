import {AppBar, Box, Button, Container, Toolbar, Typography} from '@mui/material'
import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
// import Navbar from './components/Navbar/Navbar';
export default function SignUpPage() {
    return <Container maxWidth='100vw'>
        {/* <Navbar /> */}
        {/* <AppBar position="static" sx= {{backgroundColor: "#3f51b5"}}>
            <Toolbar>
                <Typography vairant="h6" sx={{ flexGrow: 1,}}>
                    Flascard SaaS
                </Typography>
                <Button variant="inherit">
                    <Link href="/sign-in" passHref> Login
                    </Link>
                </Button>
                <Button variant="inherit">
                    <Link href="/sign-up" passHref> Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar> */}
        <Box
        display="flex" flexDirection="column" alignItems="center" justifyContent>
            <Typography vairnat="h4">Sign In</Typography>
            <SignIn />
        </Box>
    </Container>
}