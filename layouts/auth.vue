<script setup lang="ts">

</script>

<template>
    <div class="h-screen w-full flex">
        <div class="hidden md:block w-full">
            <img class="h-full w-full" src="/assets/images/login_background.webp" alt="">
        </div>
        <div class="w-full flex items-center justify-center">
            <slot />
        </div>
    </div>
</template>