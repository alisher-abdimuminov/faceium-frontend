
<script setup lang="ts">
import type { DateRange } from 'radix-vue'
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
import type { IEmployee, IReport, IReports, IResponse } from '~/types';



definePageMeta({
    middleware: ["is-auth"]
});
useHead({
    title: "Hisobot"
});

const { user } = useAuth();
const route = useRoute();

const employees = ref<IEmployee[]>([]);
const reports = ref<IReports>({});
const end = today(getLocalTimeZone());
const start = end.subtract({ days: 7 });
const value = ref({
    start,
    end,
}) as Ref<DateRange>


const getEmployees = async (department: string) => {
    // isLoading.value = true;
    let response = await $fetch<IResponse<{}, IEmployee[]>>(apify("employees") + `?department=${department}`, {
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });
    if (response.status === "success") {
        employees.value = response.data;
    }
    // isLoading.value = false;
}

const getReports = async (start: DateValue, end: DateValue) => {
    let response = await $fetch<IResponse<string, IReports>>(apify("employees/reports"), {
        method: "POST",
        body: JSON.stringify({
            "start_day": start.day,
            "start_month": start.month,
            "start_year": start.year,

            "end_day": end.day,
            "end_month": end.month,
            "end_year": end.year,

            "department": route.params.slug.toString()
        }),
        headers: {
            "Authorization": `Token ${user.value?.token}`
        }
    });

    if (response.status === "success") {
        reports.value = response.data;
    }
}

const handleUpdate = () => {
    if (value.value.start && value.value.end) {
        console.log(value.value.start?.day);
        console.log(value.value.end?.day);
        getReports(value.value.start, value.value.end);
    }
}

const downloadReports = () => {
    if (value.value.start && value.value.end) {
        navigateTo({ path: apify("employees/reports/xlsx"), query: { department: route.params.slug.toString(), start_day: value.value.start.day, start_month: value.value.start.month, start_year: value.value.start.year, end_day: value.value.end.day, end_month: value.value.end.month, end_year: value.value.end.year } }, { external: true });
    }
}

onMounted(() => {
    getEmployees(route.params.slug.toString());
    if (value.value.start && value.value.end) {
        getReports(value.value.start, value.value.end);
    }
});
</script>

<template>
    <div class="grid gap-3 p-5 md:p-10">
        <ClientOnly>
            <div class="flex justify-between items-center">
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
                <Button @click="downloadReports">Yuklab olish</Button>
            </div>
            <RangeCalendar v-model="value" class="rounded-md border" @update:model-value="handleUpdate" />
            <div class="relative overflow-x-auto">
                <table class="border-separate border-spacing-0 whitespace-nowrap table-fixed">
                    <thead class="">
                        <tr class="border">
                            <th class="sticky text-start p-2 border left-0 bg-background">Familiya, Ism va Sharifi</th>
                            <th class="z-[-1] text-start p-2 border" v-for="_, date in reports">{{ date }}</th>
                        </tr>
                    </thead>
                    <tbody class="relative">
                        <tr class="border hover:bg-accent/90" v-for="employee, index in employees">
                            <td class="p-2 border sticky left-0 bg-background w-32 truncate">{{ employee.full_name }}</td>
                            <td class="p-2 border text-center font-bold" v-for="report, date in reports">
                                <p class="text-green-500" v-if="report[index].attendance_access === 'arrived'">
                                    {{ report[index].attendance_access_time }}
                                </p>
                                <p class="text-orange-500" v-else-if="report[index].attendance_access === 'late'">
                                    {{ report[index].attendance_access_time }}
                                </p>
                                <p class="text-blue-500" v-else-if="report[index].attendance_access === 'in_vocation'">{{ report[index].vocation[0].type }}</p>
                                <p v-else class="text-red-500">-</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </ClientOnly>
    </div>
</template>
