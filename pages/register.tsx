import Head from 'next/head'
import SignIn from "../src/pages/register";

export default function LoginPage() {

    return (
        <>
            <SignIn/>
            <Head>
                <title>WiFeye | Sign In</title>
                <meta name="description" content="Crowd Behavior Analysis"/>
            </Head>
        </>
    )
}
