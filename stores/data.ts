import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
    state: (): { handle: string } => ({
        handle: useCookie("handle", {
            sameSite: "lax",
        }).value || ""
    }),
    actions: {
        setHandle(handle: string) {
            this.handle = handle;
            const handleCookie = useCookie("handle", {
                sameSite: "lax",
            });
            handleCookie.value = handle;
            console.log(handle);
            console.log(handleCookie.value);
        }
    }
});
