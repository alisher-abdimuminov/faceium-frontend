<script setup lang="ts">
import { LucideBell, LucideBookOpenText, LucideHome, LucideLayoutDashboard, LucideLayoutList, LucideLogOut, LucideMapPin, LucideMoon, LucideScanFace, LucideSun, LucideUser, LucideUser2, LucideUsers2 } from 'lucide-vue-next';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IEmployee, IResponse } from '~/types';

const route = useRoute();
const { user, logout } = useAuth();
const colorMode = useColorMode();

const departments = ref<IDepartment[]>([]);
const birthDates = ref<IEmployee[]>([]);
const now = ref<Date>(new Date());


const getDepartments = async () => {
    try {
        let response = await $fetch<IResponse<{}, IDepartment[]>>(apify("employees/departments"), {
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            departments.value = response.data;
        } else {
            toast({
                title: "Xatolik",
                description: "Adminga murojat qiling"
            });
        }
    } catch {
        toast({
            title: "Xatolik",
            description: "Adminga murojat qiling"
        });
    }
}

const getBirthDates = async () => {
    try {
        let response = await $fetch<IResponse<{}, IEmployee[]>>(apify("employees/birth_dates"), {
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            birthDates.value = response.data;
        } else {
            toast({
                title: "Xatolik",
                description: "Adminga murojat qiling. [bd500]"
            });
        }
    } catch {

    }
}


onMounted(() => {
    getDepartments();
    getBirthDates();
});
</script>

<template>
    <div class="h-screen flex">
        <div class="w-14 md:w-64 border-r p-2">
            <div class="border-b flex items-center justify-center md:justify-start gap-1 p-2">
                <LucideScanFace :size="30" />
                <p class="text-xl font-bold hidden md:block">
                    FaceControl
                    <sup class="text-sm">TM</sup> 
                </p>
            </div>
            <ScrollArea class="h-[calc(100%-3rem)] md:p-1">
                <div class="p-2 flex flex-col items-center md:items-start gap-y-2">
                    <div class="hidden md:flex items-center w-full gap-2">
                        <p class="text-start text-muted-foreground text-sm font-semibold leading-6">Asosiy</p>
                        <Separator class="w-full"/>
                    </div>
                    <NuxtLink :to="{ name: 'admin' }" class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" :class="route.name === 'admin' ? 'bg-accent text-sky-500' : ''">
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideHome :size="20" />
                            <span class="w-40 truncate hidden md:block">Bosh sahifa</span>
                        </div>
                        <div></div>
                    </NuxtLink>
                    <NuxtLink :to="{ name: 'admin-departments' }" class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" :class="route.name === 'admin-departments' ? 'bg-accent text-sky-500' : ''">
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideLayoutDashboard :size="20" />
                            <span class="w-40 truncate hidden md:block">Bo'limlar</span>
                        </div>
                        <div></div>
                    </NuxtLink>
                    <NuxtLink :to="{ name: 'admin-employees' }" class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" :class="route.name?.toString().includes('employees')  ? 'bg-accent text-sky-500' : ''">
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideUsers2 :size="20" />
                            <span class="w-40 truncate hidden md:block">Xodimlar</span>
                        </div>
                        <div></div>
                    </NuxtLink>
                    <NuxtLink :to="{ name: 'admin-reports' }" class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" :class="route.name === 'admin-reports' ? 'bg-accent text-sky-500' : ''">
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideBookOpenText :size="20" />
                            <span class="w-40 truncate hidden md:block">Hisobotlar</span>
                        </div>
                        <div></div>
                    </NuxtLink>
                    <NuxtLink :to="{ name: 'admin-areas' }" class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" :class="route.name === 'admin-areas' ? 'bg-accent text-sky-500' : ''">
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideMapPin :size="20" />
                            <span class="w-40 truncate hidden md:block">Hududlar</span>
                        </div>
                        <div></div>
                    </NuxtLink>
                </div>
                <Separator class="block md:hidden" />
                <div class="p-2 flex flex-col items-center md:items-start gap-y-2">
                    <div class="hidden md:flex items-center w-full gap-2">
                        <p class="text-start text-muted-foreground text-sm font-semibold leading-6">Bo'limlar</p>
                        <Separator class="w-full"/>
                    </div>
                    <NuxtLink 
                        :to="{ name: 'admin-reports-slug', params: { slug: department.id } }" v-for="department in departments" 
                        class="w-full flex items-center justify-between hover:bg-accent rounded-md p-1 group" 
                        :class="route.name === `admin-reports-slug` && route.params.slug === `${department.id}` ? 'bg-accent text-sky-500' : ''"
                    >
                        <div class="flex items-center gap-1 group-hover:text-sky-500">
                            <LucideLayoutList :size="20" />
                            <span class="w-40 truncate hidden md:block">{{ department.name }}</span>
                        </div>
                        <div class="hidden md:block border border-sky-500 text-sky-500 rounded-full py-px px-1 text-xs font-semibold bg-sky-500/20">{{ department.employees }}</div>
                    </NuxtLink>
                </div>
            </ScrollArea>
        </div>
        <div class="flex-1">
            <div class="h-[3rem] border-b flex items-center justify-between p-2 m-1.5">
                <div>
                    <p class="text-xl font-bold">{{ now.getDate() }} {{ now.toLocaleDateString('default', { month: 'long' }) }} {{ now.getFullYear() }}</p>
                </div>
                <div>
                    <ClientOnly>
                        <Popover>
                            <PopoverTrigger>
                                <Button variant="ghost" size="icon" class="relative">
                                    <LucideBell />
                                    <div class="absolute top-0 right-0 rounded-full bg-red-500 px-1.5">
                                        {{ birthDates.length }}
                                    </div>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-96">
                                <div class="flex flex-col gap-2 divide-y">
                                    <div v-for="birthDate in birthDates" class="flex items-center justify-between w-full p-1">
                                        <div class="flex items-center w-full flex-1 gap-2">
                                            <img class="w-8 h-8 rounded-full" :src="$config.public.base + birthDate.image" alt="">
                                            <div>
                                                <p class="w-56 truncate text-sm">{{ birthDate.full_name }}</p>
                                                <p class="w-56 truncate text-xs text-muted-foreground">{{ birthDate.department.name }}</p>
                                            </div>
                                        </div>
                                        <div class="flex flex-col items-end w-fit gap-1">
                                            <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <p class="text-sm">{{ birthDate.birth_date }}</p>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="ghost" size="icon">
                                <LucideUser />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-64">
                            <DropdownMenuLabel>Hisob</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <LucideUser2 :size="16" />
                                    <span>{{ user?.first_name }} {{ user?.last_name }}</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Mavzu</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                <DropdownMenuItem @click="colorMode.preference = 'light'">
                                    <LucideSun :size="16" />
                                    <span>Yorqin</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="colorMode.preference = 'dark'">
                                    <LucideMoon :size="16" />
                                    <span>Qorong'u</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem class="text-red-500" @click="logout">
                                <LucideLogOut :size="16" />
                                <span>Chiqish</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ClientOnly>
                </div>
            </div>
            <ScrollArea class="h-[calc(100%-4rem)]">
                <slot />
            </ScrollArea>
        </div>
    </div>
</template>
