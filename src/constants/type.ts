
export interface SessionPayload {
    firstname: string,
    lastname: string,
    middlename?: string,
    isVerified: boolean,
    role: string
}

export interface ILoading {
    login?: boolean,
    resendVerification?: boolean,
    register?: boolean,
    service?: boolean,
    plan?: boolean,
    payment?: boolean,
}