import React, {useEffect} from "react";
import {useRouter} from "next/router";
import useAuth from "../lib/useAuth";
import Link from "next/link";

const Index = () => {
    const auth = useAuth();
    const {push} = useRouter();

    useEffect(() => {
        if (!auth.loading && !auth.user) {
            push("/auth/signup")
        }
    }, [push, auth])

    return (
        <div>
            See <Link href="/docs">
            <a>documentation</a>
        </Link>
        </div>
    )
}
export default Index;
