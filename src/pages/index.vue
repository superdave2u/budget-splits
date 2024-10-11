<!-- src/components/Home.vue -->
<template>
  <v-container>
    <h2>Household Members</h2>
    <v-data-table :headers="headers" :items="peopleBudgets" class="mt-4" :hide-default-footer="true">
      <!-- Customize Header Cells -->
      <template v-slot:header.name="{ column }">
        <v-icon small class="mr-1">{{ column.icon }}</v-icon>
        <span v-if="!mobile">{{ column.text }}</span>
      </template>
      <template v-slot:header.weeklyTotal="{ column }">
        <v-icon small class="mr-1">{{ column.icon }}</v-icon>
        <span v-if="!mobile">{{ column.text }}</span>
      </template>
      <template v-slot:header.monthlyTotal="{ column }">
        <v-icon small class="mr-1">{{ column.icon }}</v-icon>
        <span v-if="!mobile">{{ column.text }}</span>
      </template>

      <!-- Customize Item Cells -->
      <template v-slot:item.name="{ item }">
        <strong>{{ item.name }}</strong>
      </template>
      <template v-slot:item.weeklyTotal="{ item }">
        {{ formatCurrency(item.weeklyTotal) }}
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
import { useDisplay } from 'vuetify';

export default {
  name: 'Home',
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

    const getTotalsForPerson = (person) => {
      let monthlyTotal = 0;
      let weeklyTotal = 0;

      householdStore.bills.forEach((bill) => {
        const contribution = calculateContribution(bill, person);
        monthlyTotal += contribution;
        weeklyTotal += contribution / 4; // Assuming 4 weeks in a month
      });

      return {
        id: person.id,
        name: person.name,
        weeklyTotal: weeklyTotal.toFixed(2),
        monthlyTotal: monthlyTotal.toFixed(2),
      };
    };

    const peopleBudgets = computed(() =>
      householdStore.people.map((person) => getTotalsForPerson(person))
    );

    const headers = [
      {
        text: 'Name',
        value: 'name',
        icon: 'mdi-account',
        sortable: false,
      },
      {
        text: 'Weekly',
        value: 'weeklyTotal',
        icon: 'mdi-calendar-week',
        sortable: false,
      },
      {
        text: 'Monthly',
        value: 'monthlyTotal',
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
      peopleBudgets,
      headers,
      formatCurrency,
      mobile,
    };
  },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>
