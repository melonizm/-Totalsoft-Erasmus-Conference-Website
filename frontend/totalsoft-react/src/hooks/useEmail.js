import { useApolloLocalStorage } from "./apolloLocalStorage"
import { emailKey } from "apollo/cacheKeyFunctions"
import { useCallback } from "react"

export const useEmail = () => {
    const [{ email }, setEmailValue] = useApolloLocalStorage(emailKey)
    const setEmail = useCallback((emailValue) => setEmailValue({ email: emailValue }), [setEmailValue])

    return [email, setEmail]
}