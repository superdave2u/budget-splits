<!-- src/components/People.vue -->
<template>
    <v-container>
        <h3>Add Person</h3>
        <v-form @submit.prevent="addPerson">
            <v-text-field label="Name" v-model="newPerson.name" required></v-text-field>
            <v-text-field label="Yearly Salary" v-model="newPerson.yearlySalary" type="number" required></v-text-field>
            <v-btn type="submit" color="primary">Add</v-btn>
        </v-form>

        <v-simple-table class="mt-4">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Income</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(person, index) in householdStore.people" :key="index">
                    <td>{{ person.name }}</td>
                    <td>
                        ${{ person.yearlySalary }} ({{ getIncomePercent(person.yearlySalary) }}%)
                    </td>
                    <td class="text-right">
                        <v-btn icon @click="removePerson(index)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="font-weight-bold">
                    <td>Total</td>
                    <td>${{ householdStore.totalIncome }}</td>
                    <td></td>
                </tr>
            </tfoot>
        </v-simple-table>
    </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useHouseholdStore } from '@/stores/household';

export default {
    name: 'People',
    setup() {
        const householdStore = useHouseholdStore();

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

        return {
            newPerson,
            addPerson,
            removePerson,
            householdStore,
            getIncomePercent,
        };
    },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>