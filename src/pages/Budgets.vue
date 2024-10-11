<template>
    <v-container>
        <div v-for="(budget, index) in budgets" :key="index">
            <h3>Budget Splits for {{ budget.name }}</h3>
            <v-data-table :headers="headers" :items="budget.regularCycle" class="mt-4" :hide-default-footer="true">
                <!-- Customize Header Cells -->
                <template v-slot:header.name="{ column }">
                    <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                    <span v-if="!mobile">{{ column.text }}</span>
                </template>
                <template v-slot:header.perPayContribution="{ column }">
                    <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                    <span v-if="!mobile">{{ column.text }}</span>
                </template>
                <template v-slot:header.monthlyContribution="{ column }">
                    <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                    <span v-if="!mobile">{{ column.text }}</span>
                </template>

                <!-- Customize Item Cells -->
                <template v-slot:item.perPayContribution="{ item }">
                    {{ formatCurrency(item.perPayContribution) }}
                </template>
                <template v-slot:item.monthlyContribution="{ item }">
                    {{ formatCurrency(item.monthlyContribution) }}
                </template>

                <!-- Footer Slot for Totals -->
                <template v-slot:body.append>
                    <tr class="font-weight-bold">
                        <td>Total</td>
                        <td>{{ formatCurrency(budget.perPayTotal) }}</td>
                        <td>{{ formatCurrency(budget.monthlyTotal) }}</td>
                    </tr>
                </template>
            </v-data-table>
            <div v-if="index < budgets.length - 1" class="my-4"></div>
        </div>
    </v-container>
</template>

<script>
import { computed } from 'vue';
import { useHouseholdStore } from '@/stores/household';
import { useDisplay } from 'vuetify';

export default {
    name: 'Budgets',
    setup() {
        const householdStore = useHouseholdStore();
        const { mobile } = useDisplay();

        const totalIncome = computed(() => householdStore.totalIncome);

        const calculateContribution = (bill, person) => {
            let contribution = 0;
            let adjustedAmount = Number(bill.amount);

            switch (bill.frequency) {
                case 'yearly':
                    adjustedAmount /= 12;
                    break;
                case 'twice-yearly':
                    adjustedAmount /= 6;
                    break;
                case 'quarterly':
                    adjustedAmount /= 3;
                    break;
                case 'bi-weekly':
                    adjustedAmount *= 2;
                    break;
                case 'weekly':
                    adjustedAmount *= 4;
                    break;
                default:
                    break;
            }

            if (totalIncome.value === 0) return 0;

            if (bill.splitOption === 'equitably') {
                contribution =
                    (Number(person.yearlySalary) / totalIncome.value) * adjustedAmount;
            } else if (bill.splitOption === 'evenly') {
                contribution = adjustedAmount / householdStore.people.length;
            }

            return contribution;
        };

        const getBudgetForPerson = (person) => {
            const budget = {
                name: person.name,
                regularCycle: [],
                monthlyTotal: 0,
                perPayTotal: 0,
            };

            householdStore.bills.forEach((bill) => {
                const contribution = calculateContribution(bill, person);
                budget.regularCycle.push({
                    name: bill.name,
                    perPayContribution: (contribution / 2).toFixed(2),
                    monthlyContribution: contribution.toFixed(2),
                });

                budget.monthlyTotal += contribution;
                budget.perPayTotal += contribution / 2;
            });

            budget.monthlyTotal = budget.monthlyTotal.toFixed(2);
            budget.perPayTotal = budget.perPayTotal.toFixed(2);
            return budget;
        };

        const budgets = computed(() =>
            householdStore.people.map((person) => getBudgetForPerson(person))
        );

        const headers = [
            {
                text: 'Bill Name',
                value: 'name',
                icon: 'mdi-file-document-outline',
                sortable: false,
            },
            {
                text: 'Per-Pay',
                value: 'perPayContribution',
                icon: 'mdi-currency-usd',
                sortable: false,
            },
            {
                text: 'Monthly',
                value: 'monthlyContribution',
                icon: 'mdi-calendar-month',
                sortable: false,
            },
        ];

        const currencyFormatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        const formatCurrency = (value) => {
            return currencyFormatter.format(value);
        };

        return {
            budgets,
            headers,
            formatCurrency,
            mobile,
        };
    },
};
</script>

<style scoped>
.font-weight-bold {
    font-weight: bold;
}
</style>