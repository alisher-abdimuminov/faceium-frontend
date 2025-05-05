<script setup lang="ts">
import { toast } from '~/components/ui/toast';
import type { IResponse, IUser, TLoginError } from '~/types';


definePageMeta({
    layout: "auth",
    middleware: ["is-not-auth"],
});
useHead({
    title: "Kirish"
});

const { login } = useAuth();

const username = ref("");
const password = ref("");
const isLoading = ref(false);

const loginHandler = async () => {
    isLoading.value = true;
    try {
        let response = await $fetch<IResponse<TLoginError, IUser>>(apify("auth/login"), {
            method: "POST",
            body: JSON.stringify({
                "username": username.value,
                "password": password.value
            })
        });

        if (response.status === "success") {
            login(response.data);
            navigateTo({ name: 'admin' });
        } else {
            if (response.code === "invalid_password") {
                toast({
                    title: "Xatolik",
                    description: "Parol xato. Qaytadan urinib ko'ring",
                });
            } else if (response.code === "username_not_found") {
                toast({
                    title: "Xatolik",
                    description: "Foydalanuvchi nomi topilmadi. Qaytadan urinib ko'ring",
                });
            }
        }
    } catch {
        toast({
            title: "Xatolik",
            description: "500 - Internal Server Error"
        });
    }
    isLoading.value = false;
}
</script>

<template>
    <div class="w-96 grid gap-3">
        <p class="text-center">Kirish</p>
        <div>
            <Label>Foydalanuvchi nomi</Label>
            <Input :disabled="isLoading" v-model="username" />
        </div>

        <div>
            <Label>Parol</Label>
            <Input type="password" :disabled="isLoading" v-model="password" />
        </div>

        <Button :disabled="isLoading" @click="loginHandler">Kirish</Button>
    </div>
</template>
