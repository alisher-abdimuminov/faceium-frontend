<script setup lang="ts">
import { LucideCog, LucideListPlus, LucideTrash, LucideUserRoundPen } from 'lucide-vue-next';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IEmployee, IResponse } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Xodimlar"
});

const config = useRuntimeConfig();
const { user } = useAuth(); 

const employees = ref<IEmployee[]>([]);
const departments = ref<IDepartment[]>([]);
const department = ref("0");
const isLoading = ref(false);


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

const getEmployees = async (department: string) => {
    isLoading.value = true;
    let response = await $fetch<IResponse<{}, IEmployee[]>>(apify("employees") + `?department=${department}`, {
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    if (response.status === "success") {
        employees.value = response.data;
    }
    isLoading.value = false;
}

const deleteEmployee = async (employee: IEmployee) => {
    try {
        let response = await $fetch<IResponse<{}, string>>(apify(`employees/employee/${employee.uuid}/delete`), {
            method: "POST",
            headers: {
                "Authorization": `Token ${user.value?.token}`
            }
        });

        if (response.status === "success") {
            getEmployees(department.value);
            toast({
                title: "Ajoyib",
                description: "Xodim o'chirildi"
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


onMounted(() => {
    getEmployees(department.value);
    getDepartments();
});

watch(department, () => {
    getEmployees(department.value);
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
                        Xodimlar
                    </BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
        <div class="flex items-center justify-between gap-2">
            <div class="flex-1">
                <Select default-value="0" v-model="department">
                    <SelectTrigger>
                        <SelectValue placeholder="Select department"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Barcha bo'limlar</SelectItem>
                        <SelectItem v-for="department in departments" :value="department.id">{{ department.name }}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Button size="sm" variant="ghost" @click="navigateTo({ name: 'admin-employees-add' })">
                    <LucideListPlus :size="16" />
                    <span>Qo'shish</span>
                </Button>
            </div>
        </div>
        <div class="w-full border rounded-md overflow-x-auto">
            <Table class="whitespace-nowrap overflow-x-auto">
                <TableHeader class="border-b">
                    <TableHead class="w-4">#</TableHead>
                    <TableHead>Familiya, Ism, Sharifi</TableHead>
                    <TableHead>Bo'limi</TableHead>
                    <TableHead>Lavozimi</TableHead>
                    <TableHead>IDsi</TableHead>
                    <TableHead>Tug'ilgan sanasi</TableHead>
                    <TableHead>Rasmi</TableHead>
                    <TableHead>Harakatlar</TableHead>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="employee, index in employees">
                        <TableCell>{{ index+1 }}</TableCell>
                        <TableCell @click="navigateTo({ name: 'admin-employees-uuid', params: { uuid: employee.uuid } })">{{ employee.full_name }}</TableCell>
                        <TableCell>{{ employee.department.name }}</TableCell>
                        <TableCell>{{ employee.position }}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">{{ employee.handle }}</Badge>
                        </TableCell>
                        <TableCell>{{ employee.birth_date }}</TableCell>
                        <TableCell>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <img class="w-6 h-6 rounded-full" :src="`${config.public.base}${employee.image}`" alt="">
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    <div>
                                        <img class="w-64 h-64 rounded-md" :src="`${config.public.base}${employee.image}`" alt="">
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button size="icon" variant="outline">
                                        <LucideCog :size="16" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="left">
                                    <DropdownMenuItem @click="navigateTo({ name: 'admin-employees-uuid', params: { uuid: employee.uuid } })">
                                        <LucideUserRoundPen :size="16"/>
                                        <span>Tahrirlash</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click="deleteEmployee(employee)">
                                        <LucideTrash :size="16"/>
                                        <span>O'chirish</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

    </div>
</template>
