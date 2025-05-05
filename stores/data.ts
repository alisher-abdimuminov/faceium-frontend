import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
    state: (): { handle: string } => ({
        handle: ""
    }),
    actions: {
        setHandle(handle: string) {
            this.handle = handle;
        }
    }
});
