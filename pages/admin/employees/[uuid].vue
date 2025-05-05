<script setup lang="ts">
import { LucideRefreshCcw } from 'lucide-vue-next';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IEmployee, IResponse } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Xodimni tahrirlash"
});


const route = useRoute();
const { user } = useAuth();

const employee = ref<IEmployee>({
    address: "",
    birth_date: "",
    city: "",
    country: "",
    department: {
        active: true,
        id: "0",
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
const departments = ref<IDepartment[]>([]);
const dialogOpen = ref(false);
const vocations = ref<any[]>([]);


const getVocations = async () => {
    let response = await $fetch<IResponse<{}, any[]>>(apify(`employees/employee/${route.params.uuid}/vocations`), {
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });

    vocations.value = response.data;
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

const getEmployee = async () => {
    try {
        let response = await $fetch<IResponse<{}, IEmployee>>(apify(`employees/employee/${route.params.uuid}`), {
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            employee.value = response.data;
        } else {
            navigateTo({ name: "admin-employees" });
            toast({
                title: "Xatolik",
                description: "Xodim topilmadi!!!"
            });
        }
    } catch {
        navigateTo({ name: "admin-employees" });
    }
}

const editEmployee = async () => {
    let form = new FormData();
    let image = document.getElementById("image") as HTMLImageElement;
    form.append("address", employee.value.address);
    form.append("birth_data", employee.value.birth_date);
    form.append("city", employee.value.city);
    form.append("country", employee.value.country);
    form.append("department", employee.value.department.id);
    form.append("full_name", employee.value.full_name);
    form.append("gender", employee.value.gender);
    form.append("handle", employee.value.handle);
    form.append("phone", employee.value.phone);
    form.append("position", employee.value.position);
    form.append("town", employee.value.town);
    form.append("working_time", employee.value.working_time);
    form.append("image", image.src);

    try {
        let response = await $fetch<IResponse<{}, string>>(apify(`employees/employee/${route.params.uuid}/edit`), {
            method: "POST",
            body: form,
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            toast({
                title: "Ajoyib",
                description: "Xodim tahrirlandi"
            })
        }

    } catch {

    }
}

const deleteEmployee = async () => {
    try {
        let response = await $fetch<IResponse<{}, string>>(apify(`employees/employee/${employee.value.uuid}/delete`), {
            method: "POST",
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            navigateTo({ name: "admin-employees" });
            toast({
                title: "Ajoyib",
                description: "Xodim ishdan bo'shatildi"
            });
        } else {
            toast({
                title: "Xatolik",
                description: "Adminga murojat qiling"
            });
        }

    } catch {

    }
}

const v_type = ref("");
const v_start = ref("");
const v_end = ref("");


const addVocation = async () => {
    let form = new FormData();

    let file = document.getElementById("file") as HTMLInputElement;

    if (file) {
        if (file.files && file.files[0]) {
            form.append("file", file.files[0]);
        }
    }
    form.append("type", v_type.value);
    form.append("start", v_start.value);
    form.append("end", v_end.value);

    let response = await $fetch<IResponse<{}, string>>(apify(`employees/employee/${employee.value.uuid}/add_vocation`), {
        method: "POST",
        headers: {
            "Authorization": `Token ${user.value?.token}`
        },
        body: form
    });

    getVocations();
}


onMounted(() => {
    getEmployee();
    getDepartments();
    getVocations();
    const image = document.getElementById("image") as HTMLImageElement;
    document.addEventListener("paste", (event) => {
        const items = event.clipboardData?.items;
        if (items) {
            for (const item of items) {
                if (item.type.startsWith("image")) {
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function (e) {
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
                        Xodimni tahrirlash
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex justify-between">
            <div></div>
            <div class="flex gap-2">
                <Button size="sm" variant="destructive">Ta'til berish</Button>
                <Dialog v-model:open="dialogOpen">
                    <DialogTrigger>
                        <Button size="sm" variant="destructive">Ishdan bo'shatish</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Xodimni ishdan bo'shatish
                            </DialogTitle>
                        </DialogHeader>
                        {{ employee.full_name }} ni ishdan bo'shatishni bo'shatasizmi?
                        <DialogFooter>
                            <DialogClose>
                                <Button>Yoq</Button>
                            </DialogClose>
                            <Button @click="deleteEmployee" variant="destructive">Ha</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button size="sm" @click="editEmployee">Saqlash</Button>
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
                                    <LucideRefreshCcw :size="25" class="hover:bg-accent rounded p-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label>Shtat <span class="text-red-500">*</span></Label>
                        {{ employee.working_time }}
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
                        <img id="image" class="w-56 h-56 rounded" :src="$config.public.base + employee.image" alt="">
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
                                <SelectValue placeholder="Bo'limni tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="department in departments" :value="department.id">{{ department.name
                                    }}</SelectItem>
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
                                <SelectItem value="o'zbeksiton">O'zbekiston</SelectItem>
                                <SelectItem value="rossiya">Rossiya</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Viloyat</Label>
                        <Input v-model="employee.city" />
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
        <Dialog>
            <DialogTrigger as-child>
                <Button>Qo'shish</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xodimga hujjat qo'shish</DialogTitle>
                </DialogHeader>
                <Label>Nomi</Label>
                <Input v-model="v_type" placeholder="Mehnat ta'tili" />
                <Label>...dan</Label>
                <Input v-model="v_start" placeholder="2025-01-20" />
                <Label>...gacha</Label>
                <Input v-model="v_end" placeholder="2025-01-30" />
                <Label>Fayl</Label>
                <Input id="file" type="file" />
                <DialogFooter>
                    <DialogClose>
                        <Button @click="addVocation">Qoshish</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>... dan</TableHead>
                    <TableHead>... gacha</TableHead>
                    <!-- <TableHead>Faly</TableHead> -->
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow v-for="vocation in vocations">
                    <TableCell>{{ vocation.type }}</TableCell>
                    <TableCell>{{ vocation.start }}</TableCell>
                    <TableCell>{{ vocation.end }}</TableCell>
                    <!-- <TableCell>{{ vocation.file }}</TableCell> -->
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>
