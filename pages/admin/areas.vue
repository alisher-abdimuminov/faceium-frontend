<script setup lang="ts">
import { LucideListPlus, LucideMapPin, LucideTrash } from 'lucide-vue-next';
import type { IArea, ICoordinate, IResponse } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Hududlar"
});

const { user } = useAuth();

const areaDialog = ref(false);
const areas = ref<IArea[]>([]);
const coordinates = ref<ICoordinate[]>([{ latitude: "", longitude: "" }, { latitude: "", longitude: "" }, { latitude: "", longitude: "" }, { latitude: "", longitude: "" }]);
const area = ref<IArea>({
    id: "",
    name: "",
    coordinates: coordinates.value
});
const isLoading = ref(false);


onMounted(() => {
    getAreas();
});

const getAreas = async () => {
    isLoading.value = true;
    let response = await $fetch<IResponse<"", IArea[]>>(apify("employees/areas"), {
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    areas.value = response.data;
    isLoading.value = false;
}

const addCoordinate = () => {
    coordinates.value.push({
        latitude: "",
        longitude: ""
    });
}

const deleteCoordinate = (coordinate: ICoordinate) => {
    coordinates.value = coordinates.value.filter(coord => coord !== coordinate);
}

const createArea = async () => {
    isLoading.value = true;
    let response = await $fetch(apify("employees/areas/add"), {
        method: "POST",
        body: JSON.stringify({
            "name": area.value.name,
            "coordinates": coordinates.value.map(coord => `${coord.latitude}|${coord.longitude}`).join(","),
        }),
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    areaDialog.value = false;
    getAreas();
    isLoading.value = false;
}

const deleteArea = async (area: IArea) => {
    isLoading.value = true;
    console.log(area);
    let response = await $fetch(apify("employees/areas/delete"), {
        method: "POST",
        body: JSON.stringify({
            "id": area.id,
        }),
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    getAreas();
    isLoading.value = false;
}
</script>

<template>
    <div class="grid gap-3 p-5 md:p-10">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>
                        <NuxtLink :to="{ name: 'admin' }">Bosh sahifa</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Hududlar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex items-center justify-between">
            <div></div>
            <div>
                <Dialog v-model:open="areaDialog">
                    <DialogTrigger>
                        <Button size="sm" variant="ghost">
                            <LucideListPlus :size="16" />
                            <span>Qo'shish</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hudud qo'shish</DialogTitle>
                            <DialogDescription>Yangi hudud qo'shish</DialogDescription>
                        </DialogHeader>
                        <div class="flex flex-col gap-2">
                            <Label>Hudud nomi <sup class="text-red-500 font-bold">*</sup></Label>
                            <Input v-model="area.name" />
                            <Label>Joylashuvlar</Label>
                            <div class="border rounded-md">
                                <Table>
                                    <TableHeader class="border-b">
                                        <TableHead>#</TableHead>
                                        <TableHead>Latitude</TableHead>
                                        <TableHead>Longitude</TableHead>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow v-for="coordinate, index in coordinates">
                                            <TableCell>{{ index+1 }}</TableCell>
                                            <TableCell>
                                                <Input v-model="coordinate.latitude"/>
                                            </TableCell>
                                            <TableCell>
                                                <Input v-model="coordinate.longitude"/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                            <!-- <div class="flex justify-end">
                                <Button @click="addCoordinate">Joylashuv qo'shish</Button>
                            </div> -->
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant="destructive">Yopish</Button>
                            </DialogClose>
                            <Button @click="createArea">Qo'shish</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        
        <div class="w-full border rounded-md overflow-x-auto">
            <Table class="whitespace-nowrap overflow-x-auto">
                <TableHeader class="border-b">
                    <TableHead class="w-4">#</TableHead>
                    <TableHead>Hudud nomi</TableHead>
                    <TableHead>Joylashuvlar</TableHead>
                    <TableHead>O'chirish</TableHead>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="area, index in areas">
                        <TableCell>{{ index+1 }}</TableCell>
                        <TableCell>{{ area.name }}</TableCell>
                        <TableCell class="min-w-32 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div v-for="coordinate in area.coordinates" class="bg-muted/50 border rounded-md p-2 flex items-center gap-2">
                                <LucideMapPin />
                                <div class="flex items-end justify-end flex-col w-full gap-1">
                                    <p class="rounded-sm text-green-500">{{ coordinate.latitude }}</p>
                                    <p class="rounded-sm text-sky-500">{{ coordinate.longitude }}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell class="text-center">
                            <Button @click="deleteArea(area)" size="icon" variant="destructive">
                                <LucideTrash :size="16" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>
