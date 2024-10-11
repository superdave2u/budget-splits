<!-- src/components/Home.vue -->
<template>
  <v-container>
    <h2>Household Members</h2>
    <v-data-table :headers="headers" :items="peopleBudgets" class="mt-4" :hide-default-footer="true">
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:item.perPayTotal="{ item }">
        {{ formatCurrency(item.perPayTotal) }}
      </template>
      <template v-slot:item.monthlyTotal="{ item }">
        {{ formatCurrency(item.monthlyTotal) }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import { useHouseholdStore } from '@/stores/household';

export default {
  name: 'Home',
  setup() {
    const householdStore = useHouseholdStore();

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

    const getTotalsForPerson = (person) => {
      let monthlyTotal = 0;
      let perPayTotal = 0;

      householdStore.bills.forEach((bill) => {
        const contribution = calculateContribution(bill, person);
        monthlyTotal += contribution;
        perPayTotal += contribution / 2;
      });

      return {
        id: person.id,
        name: person.name,
        perPayTotal: perPayTotal.toFixed(2),
        monthlyTotal: monthlyTotal.toFixed(2),
      };
    };

    const peopleBudgets = computed(() =>
      householdStore.people.map((person) => getTotalsForPerson(person))
    );

    const headers = [
      { text: 'Name', value: 'name', sortable: false },
      { text: 'Per-Pay Total', value: 'perPayTotal', sortable: false },
      { text: 'Monthly Total', value: 'monthlyTotal', sortable: false },
    ];

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const formatCurrency = (value) => {
      return currencyFormatter.format(value);
    };

    return {
      peopleBudgets,
      headers,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
