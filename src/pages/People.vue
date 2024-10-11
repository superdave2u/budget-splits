<!-- src/components/People.vue -->
<template>
    <v-container>
        <h3>Add Person</h3>
        <v-form @submit.prevent="addPerson">
            <v-text-field label="Name" v-model="newPerson.name" required></v-text-field>
            <v-text-field label="Yearly Salary" v-model="newPerson.yearlySalary" type="number" required></v-text-field>
            <v-btn type="submit" color="primary">Add</v-btn>
        </v-form>

        <v-data-table :headers="headers" :items="householdStore.people" class="mt-4" :hide-default-footer="true">
            <!-- Customize Header Cells -->
            <template v-slot:header.name="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.income="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.actions="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>

            <!-- Customize Item Cells -->
            <template v-slot:item.income="{ item }">
                {{ formatCurrency(item.yearlySalary) }}
                ({{ getIncomePercent(item.yearlySalary) }}%)
            </template>
            <template v-slot:item.actions="{ item, index }">
                <v-btn icon @click="removePerson(index)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>

            <!-- Footer Slot for Totals -->
            <template v-slot:body.append>
                <tr class="font-weight-bold">
                    <td>Total</td>
                    <td>{{ formatCurrency(householdStore.totalIncome) }}</td>
                    <td></td>
                </tr>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import { ref } from 'vue';
import { useHouseholdStore } from '@/stores/household';
import { useDisplay } from 'vuetify';

export default {
    name: 'People',
    setup() {
        const householdStore = useHouseholdStore();
        const { mobile } = useDisplay();

        const newPerson = ref({
            name: '',
            yearlySalary: null,
        });

        const addPerson = () => {
            if (newPerson.value.name && newPerson.value.yearlySalary > 0) {
                householdStore.addPerson({ ...newPerson.value });
                newPerson.value = { name: '', yearlySalary: null };
            }
        };

        const removePerson = (index) => {
            householdStore.removePerson(index);
        };

        const getIncomePercent = (salary) => {
            const total = householdStore.totalIncome;
            return total > 0 ? ((salary / total) * 100).toFixed(2) : '0.00';
        };

        const formatCurrency = (value) => {
            if (!value) return '';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        };

        const headers = [
            {
                text: 'Name',
                value: 'name',
                icon: 'mdi-account',
                sortable: false,
            },
            {
                text: 'Income',
                value: 'income',
                icon: 'mdi-currency-usd',
                sortable: false,
            },
            {
                text: 'Actions',
                value: 'actions',
                icon: 'mdi-tools',
                sortable: false,
            },
        ];

        return {
            newPerson,
            addPerson,
            removePerson,
            householdStore,
            getIncomePercent,
            formatCurrency,
            headers,
            mobile,
        };
    },
};
</script>

<style scoped>
.mt-8 {
    margin-top: 2rem;
}

.font-weight-bold {
    font-weight: bold;
}
</style>