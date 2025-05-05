<script setup lang="ts">
import { LucideRefreshCcw } from 'lucide-vue-next';
import Select from '~/components/ui/select/Select.vue';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IEmployee, IResponse } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Xodim qo'shish"
});

const { user } = useAuth();

const isLoading = ref(false);
const departments = ref<IDepartment[]>([]);
const employee = ref<IEmployee>({
    address: "",
    birth_date: "",
    city: "",
    country: "",
    department: {
        active: true,
        id: "",
        name: "",
        employees: 0
    },
    full_name: "",
    gender: "male",
    handle: "",
    image: "",
    phone: "",
    position: "",
    town: "",
    uuid: "",
    working_time: ""
});
const citiesList = ref([
    "Andijon",
    "Buxoro",
    "Farg'ona",
    "Jizzax",
    "Namangan",
    "Navoiy",
    "Qashqadaryo",
    "Qoraqalpog'iston Respublikasi",
    "Samarqand",
    "Sirdaryo",
    "Surxondaryo",
    "Toshkent",
    "Toshkent shahri",
    "Xorazm",
]);
const countries = ref([
    {
        "name": "O'zbekiston",
        "flag": "🇺🇿",
    },
    {
        "name": "Rossiya",
        "flag": "🇷🇺",
    },
    {
        "name": "Qozog'iston",
        "flag": "🇰🇿"
    },
    {
        "name": "Tojikiston",
        "flag": "🇹🇯",
    }
]);


onMounted(() => {
    getDepartments();
    const image = document.getElementById("image") as HTMLImageElement;
    document.addEventListener("paste", (event) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (const item of items) {
                if (item.type.startsWith("image")) {
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (e.target && e.target.result) {
                            image.src = e.target.result.toString();
                        }
                    }
                    if (blob) {
                        reader.readAsDataURL(blob);
                    }
                }
            }
        }
    });
});

const genPassword = () => {
    employee.value.handle = usePassword();
}

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


const addEmployee = async () => {
    let form = new FormData();
    let image = document.getElementById("image") as HTMLImageElement;
    let e = employee.value;
    form.append("address", e.address);
    form.append("birth_date", `${e.birth_date.split(".").at(-1)}-${e.birth_date.split(".").at(1)}-${e.birth_date.split(".").at(0)}`);
    form.append("city", e.city);
    form.append("country", e.country);
    form.append("department", e.department.id);
    form.append("full_name", e.full_name);
    form.append("gender", e.gender);
    form.append("handle", e.handle);
    form.append("phone", e.phone);
    form.append("position", e.position);
    form.append("town", e.town);
    form.append("working_time", e.working_time);
    form.append("image", image.src);

    try {
        isLoading.value = true;
        let response = await $fetch<IResponse<{}, null>>(apify("employees/add"), {
            method: "POST",
            body: form,
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });
        if (response.status === "success") {
            toast({
                title: "Ajoyib",
                description: "Xodim qo'shildi",
            });
            navigateTo({ name: "admin-employees" });
        } else {
            toast({
                title: "Xatolik",
                description: "Majburiy madonlarni to'diring",
            });
        }
        isLoading.value = false;
    } catch {

    }
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
                    <BreadcrumbLink>
                        <NuxtLink :to="{ name: 'admin-employees' }">Xodimlar</NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        Xodim qo'shish
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex justify-between">
            <div></div>
            <div>
                <Button @click="addEmployee">Qo'shish</Button>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-3">
            <Card class="bg-muted/10 flex-1">
                <CardHeader>
                    <CardTitle>Ma'lumotlar</CardTitle>
                </CardHeader>
                <CardContent class="space-y-5">
                    <div>
                        <Label>Familiya Ism Sharifi <span class="text-red-500">*</span> </Label>
                        <Input v-model="employee.full_name" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <Label>Jinsi <span class="text-red-500">*</span></Label>
                            <Select default-value="male" v-model="employee.gender">
                                <SelectTrigger>
                                    <SelectValue placeholder="Jinsini tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Erkak</SelectItem>
                                    <SelectItem value="female">Ayol</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Tug'ilgan sanasi <span class="text-red-500">*</span></Label>
                            <Input v-model="employee.birth_date" />
                        </div>
                        <div>
                            <Label>ID <span class="text-red-500">*</span></Label>
                            <div class="relative">
                                <Input v-model="employee.handle" />
                                <div class="absolute flex items-center justify-center w-8 h-8 top-0 right-0">
                                    <LucideRefreshCcw @click="genPassword" :size="25" class="hover:bg-accent rounded p-1" /> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label>Shtat <span class="text-red-500">*</span></Label>
                        <Select default-value="male" v-model="employee.working_time">
                            <SelectTrigger>
                                <SelectValue placeholder="Shtatni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">1 shtat</SelectItem>
                                <SelectItem value="0.5">0.5 shtat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            <Card class="bg-muted/10 w-64">
                <CardHeader>
                    <CardTitle>Rasmi <span class="text-red-500">*</span></CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-col gap-3">
                        <img id="image" class="w-56 h-56 rounded" src="" alt="">
                    </div>
                </CardContent>
            </Card>
        </div>
        <Card class="bg-muted/10">
            <CardHeader>
                <CardTitle>Qo'shimcha ma'lumotlar</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label>Bo'lim <span class="text-red-500">*</span></Label>
                        <Select v-model="employee.department.id">
                            <SelectTrigger>
                                <SelectValue placeholder="Bo'limni tanlang"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="department in departments" :value="department.id">{{ department.name }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Lavozimi <span class="text-red-500">*</span></Label>
                        <Input v-model="employee.position" />
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label>Telefon raqami</Label>
                        <Input v-model="employee.phone" />
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card class="bg-muted/10">
            <CardHeader>
                <CardTitle>Manzili</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label>Davlat</Label>
                        <Select default-value="o'zbekiston" v-model="employee.country">
                            <SelectTrigger>
                                <SelectValue placeholder="Davlatni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="country in countries" :value="country.name">{{ country.flag }} {{ country.name }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Viloyat</Label>
                        <Select v-model="employee.city">
                            <SelectTrigger>
                                <SelectValue placeholder="Viloyatni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="city in citiesList" :value="city">{{ city }}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <Label>Tuman</Label>
                        <Input v-model="employee.town" />
                    </div>
                    <div>
                        <Label>Manzil</Label>
                        <Input v-model="employee.address" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>
