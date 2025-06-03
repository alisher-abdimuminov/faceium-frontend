<script setup lang="ts">
import { LucideArrowRight, LucideBan, LucideCheckCheck, LucideCheckCircle, LucideFileWarning, LucideLoader, LucideLock, LucideMapPin, LucideRefreshCcw, LucideScanFace, LucideShield, LucideUserSearch } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useDataStore } from "~/stores/data";

definePageMeta({
    layout: "empty"
});

useHead({
    title: "Faceium"
});

const dataStore = useDataStore();

const { handle } = storeToRefs(dataStore);

const latitude = ref(0);
const longitude = ref(0);
const isLoading = ref(true);
const state = ref<"location" | "handle" | "faceid">("location");



const name = ref("");
const login = ref(false);
const locationStatus = ref<"waiting" | "success" | "not_in_area" | "cannot_get">("waiting");
const handleStatus = ref<"waiting" | "not_found" | "success">("waiting");


const success = async (position: GeolocationPosition) => {
    isLoading.value = true;
    longitude.value = position.coords.longitude;
    latitude.value = position.coords.latitude;
    let response = await $fetch<{ status: "success" | "error", code: string, data: object }>(apify("location"), {
        method: "POST",
        body: JSON.stringify({
            // longitude: longitude.value,
            // latitude: latitude.value,
            latitude: "39.671982",
            longitude: "66.921843",
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response);
    if (response.code === "200") {
        login.value = true;
        locationStatus.value = 'success';
    } else {
        locationStatus.value = 'not_in_area';
    }
    isLoading.value = false;
}

const error = (err: GeolocationPositionError) => {
    locationStatus.value = "cannot_get";
    isLoading.value = false;
}

const checkHandle = async () => {
    isLoading.value = true;
    let response = await $fetch<{ status: "success" | "error", code: string, data: string }>(apify("handle"), {
        method: "POST",
        body: JSON.stringify({
            handle: handle.value
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response);
    if (response.status === "success") {
        if (response.code === "200") {
            name.value = response.data;
            handleStatus.value = "success";
            dataStore.setHandle(handle.value);
        }
    } else {
        handleStatus.value = "not_found";
    }
    isLoading.value = false;
}

onMounted(() => {
    navigator.geolocation.getCurrentPosition(success, error);
});

</script>

<template>
    <div class="h-screen w-full flex items-center justify-center">
        <div class="flex items-center gap-3 p-5 w-96">
            <div class="h-full w-10 flex flex-col items-center justify-center gap-5">
                <div :class="{ 'border-green-500 text-green-500': locationStatus === 'success', 'border-red-500 text-red-500': locationStatus === 'cannot_get' || locationStatus === 'not_in_area' }"
                    class="w-12 h-12 flex items-center justify-center rounded-full border">
                    <LucideLoader v-if="isLoading && state === 'location'" class="animate-spin duration-1000" />
                    <LucideMapPin v-else :size="20" />
                </div>
                <Separator orientation="vertical" class="h-10" />
                <div :class="{ 'border-green-500 text-green-500': handleStatus === 'success', 'border-red-500 text-red-500': handleStatus === 'not_found' }"
                    class="w-12 h-12 flex items-center justify-center rounded-full border">
                    <LucideLoader v-if="isLoading && state === 'handle'" class="animate-spin duration-1000" />
                    <LucideLock :size="20" />
                </div>
                <Separator orientation="vertical" class="h-10" />
                <div class="w-12 h-12 flex items-center justify-center rounded-full border">
                    <LucideScanFace :size="20" />
                </div>
            </div>
            <div v-if="state === 'location'" class="flex-1 grid gap-5">
                <div v-if="locationStatus === 'waiting' || isLoading"
                    class="w-64 flex flex-col gap-3 items-center justify-center">
                    <LucideLoader class="animate-spin" />
                    <span>Joylashuvingiz olinmoqda...</span>
                </div>
                <Alert v-if="locationStatus === 'success'" class="text-green-500 border-green-500">
                    <LucideCheckCheck :size="20" class="text-green-500" />
                    <AlertTitle>
                        <span>Ajoyib</span>
                    </AlertTitle>
                    <AlertDescription>
                        Siz institut hududidasiz. Davom etishingiz mumkin.
                    </AlertDescription>
                </Alert>
                <Alert v-else-if="locationStatus === 'cannot_get' || locationStatus === 'not_in_area'"
                    variant="destructive">
                    <LucideBan />
                    <AlertTitle>
                        <span>Xatolik</span>
                    </AlertTitle>
                    <AlertDescription>
                        <span v-if="locationStatus === 'cannot_get'">Joylashuvingizni ola olmadik. <b>"Joylashuv"</b> ni
                            yoqib qaytadan urinib koring.</span>
                        <span v-else>Siz institut hududida emassiz. Institut hududiga kelib qaytadan urinib ko'ring.
                            (Joylashuvingizni tekshirib koring)</span>
                    </AlertDescription>
                </Alert>
                <Button @click="state = 'handle'" v-if="locationStatus === 'success'">Davom etish
                    <LucideArrowRight />
                </Button>
            </div>
            <div v-if="state === 'handle'" class="w-full grid gap-3">
                <Label>ID</Label>
                <Input v-model="handle" />
                <p v-if="name">{{ name }}</p>
                <Alert v-if="handleStatus === 'not_found'" variant="destructive">
                    <LucideBan />
                    <AlertTitle>
                        <span>Xatolik</span>
                    </AlertTitle>
                    <AlertDescription>
                        <span>Xodim topilmadi. Qaytadan urinib ko'ring. Yoki xodimlar bo'limiga murojat qiling.</span>
                    </AlertDescription>
                </Alert>
                <Button v-if="handleStatus === 'waiting' || handleStatus === 'not_found'" @click="checkHandle">
                    <LucideUserSearch /> Tekshirish
                </Button>
                <Button @click="navigateTo({ name: 'faceid' })" v-else>Davom etish
                    <LucideArrowRight />
                </Button>
            </div>
        </div>
    </div>
</template>