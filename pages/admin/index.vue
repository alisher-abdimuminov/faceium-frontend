<script setup lang="ts">
import { LucideLayoutDashboard, LucideUsers2 } from 'lucide-vue-next';
import { BarChart } from '~/components/ui/chart-bar';
import { toast } from '~/components/ui/toast';
import type { IDepartment, IEmployee, IResponse, IStatistic } from '~/types';


definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Bosh sahifa"
});

const { user } = useAuth();

const departments = ref<IDepartment[]>([]);
const employees = ref<IEmployee[]>([]);
const isLoading = ref(false);
const statistics = ref<IStatistic[]>([]);


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

const getStatistics = async () => {
    isLoading.value = true;
    let response = await $fetch<IResponse<string, IStatistic[]>>(apify("employees/statistics"), {
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    if (response.status === "error") {

    } else {
        statistics.value = response.data;
    }
    isLoading.value = false;
}

onMounted(() => {
    getEmployees("0");
    getDepartments();
    getStatistics();
});
</script>

<template>
    <div class="grid gap-5 p-5 md:p-10">
        <Card>
            <CardHeader>
                <CardTitle>Xodimlar</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="flex justify-between">
                    <p class="text-xl">{{ employees.length }}</p>
                    <LucideUsers2 />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Bo'limlar</CardTitle>
            </CardHeader>
            <CardContent>
                <div class="flex justify-between">
                    <p class="text-xl">{{ departments.length }}</p>
                    <LucideLayoutDashboard />
                </div>
            </CardContent>
        </Card>
        <BarChart :data="statistics" index="department" :categories="['all', 'arrived', 'late', 'didnotcome']" />
    </div>
</template>
