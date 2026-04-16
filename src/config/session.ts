"use server";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

const SECRET = process.env.SECRET ?? "";
if (!SECRET) throw new Error("SECRET env var is missing");

const key = new TextEncoder().encode(SECRET);
const isProd = process.env.NODE_ENV === "production";


export type SessionPayload = {
    token: string,
    email: string,
    firstName: string,
    lastName: string,
    middleName?: string,
    id: string,
    phone: string,
    image?:string,
    isVerified: boolean,
    // token you want to use on the client
};

const cookieCfg = {
    name: "session_data",
    options: {
        httpOnly: true,
        secure: isProd,                     // HTTPS only in prod
        sameSite: isProd ? "none" : "lax", // cross-site allowed in prod
        path: "/",
    } as const,
    durationMs: 8 * 60 * 60 * 1000, // 8 hours
};

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(key);
}

export async function decrypt(token: string) {
    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
        return payload;
    } catch (err) {
        console.error("JWT verify failed:", err);
        return null;
    }
}

export async function createSession({ token, email, firstName, lastName, middleName, id, phone, isVerified }: SessionPayload) {
    const expires = new Date(Date.now() + cookieCfg.durationMs);
    const session = await encrypt({ token, email, firstName, lastName, middleName, id, phone, isVerified });

    // cookies() is sync
    const store = await cookies()

    store.set(cookieCfg.name, session, { ...cookieCfg.options, expires });
}

export async function deleteSession() {
    const store = await cookies();
    store.delete(cookieCfg.name); // Match the name!
}

// Optional helper if you read the cookie server-side:
export async function readSessionSync() {
    const store = await cookies()
    const token = store.get(cookieCfg.name)?.value;
    return token ?? null;
}

export async function readSessionPayload(): Promise<SessionPayload | null> {
    const token = (await cookies()).get(cookieCfg.name)?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
        const typed = payload as Partial<SessionPayload>;

        return {
            id: typed.id ?? "",
            email: typed.email ?? "",
            firstName: typed.firstName ?? "",
            lastName: typed.lastName ?? "",
            middleName: typed.middleName ?? "",
            token: typed.token ?? "",
            phone: typed.phone ?? "",
            isVerified: typed.isVerified ?? false,
            // api_access_token: typed.api_access_token, // may be undefined
        };
    } catch (err) {
        console.error("JWT verify failed:", err);
        return null;
    }

}