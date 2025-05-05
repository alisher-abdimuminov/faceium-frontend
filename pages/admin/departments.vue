<script setup lang="ts">
import { LucideEdit, LucideListPlus, LucideTrash } from 'lucide-vue-next';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IResponse } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Bo'limlar"
});

const { user } = useAuth();

const department = ref<IDepartment>({
    active: true,
    id: "",
    name: "",
    employees: 0
});
const departments = ref<IDepartment[]>([]);
const dialogOpen = ref(false);


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

const editDepartment = async (department: IDepartment) => {
    try {
        let response = await $fetch(apify(`employees/departments/department/${department.id}/edit`), {
            method: "POST",
            body: JSON.stringify({
                "name": department.name
            }),
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });
    } catch {

    }
}

const addDepartment = async () => {
    try {
        let response = await $fetch(apify("employees/departments/add"), {
           method: "POST",
           body: JSON.stringify({
            "name": department.value.name
           }),
           headers: {
            "Authorization": `Token ${user.value?.token}`
            }
        });
        dialogOpen.value  = false;
        getDepartments();
    } catch {

    }
}


onMounted(() => {
    getDepartments();
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
                    <BreadcrumbPage>
                        Bo'limlar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex items-center justify-between">
            <div></div>
            <div>
                <Dialog v-model:open="dialogOpen">
                    <DialogTrigger>
                        <Button size="sm" variant="ghost">
                            <LucideListPlus :size="16" />
                            <span>Qo'shish</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Bo'lim qo'shish</DialogTitle>
                            <DialogDescription>Yangi bo'lim qo'shish</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Label>Bo'lim nomi <sup class="text-red-500 font-bold">*</sup></Label>
                            <Input v-model="department.name" />
                            <Label>Bo'lim ikonkasi</Label>
                            <Input value="lucide:layout-list" />
                            <Label>Bo'lim tartibi</Label>
                            <Select default-value="last">
                                <SelectTrigger>
                                    <SelectValue placeholder="Tanlang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="last">Oxirida</SelectItem>
                                    <SelectItem value="first">Boshida</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <DialogClose>
                                <Button variant="destructive">Yopish</Button>
                            </DialogClose>
                            <Button @click="addDepartment">Qo'shish</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
        
        <div class="w-full border rounded-md overflow-x-auto">
            <Table class="whitespace-nowrap overflow-x-auto">
                <TableHeader class="border-b">
                    <TableHead class="w-4">#</TableHead>
                    <TableHead>Bo'lim nomi</TableHead>
                    <TableHead>Xodimlar soni</TableHead>
                    <TableHead>Tahrirlash</TableHead>
                    <TableHead>O'chirish</TableHead>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="department, index in departments">
                        <TableCell>{{ index+1 }}</TableCell>
                        <TableCell>{{ department.name }}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{{ department.employees }}</Badge>
                        </TableCell>
                        <TableCell class="w-10">
                            <Sheet>
                                <SheetTrigger>
                                    <Button size="icon" variant="default">
                                        <LucideEdit :size="16" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>{{ department.name }}</SheetTitle>
                                    </SheetHeader>
                                    <Label>Nomi</Label>
                                    <Input v-model="department.name" />
                                    <Button @click="editDepartment(department)">Saqlash</Button>
                                </SheetContent>
                            </Sheet>
                        </TableCell>
                        <TableCell class="w-10">
                            <Button size="icon" variant="destructive">
                                <LucideTrash :size="16" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>
