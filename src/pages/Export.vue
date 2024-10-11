<!-- src/components/Export.vue -->
<template>
    <v-container>
        <h3>Export Data</h3>
        <v-textarea :value="jsonOutput" rows="20" readonly></v-textarea>
    </v-container>
</template>

<script>
import { computed } from 'vue';
import { useHouseholdStore } from '@/stores/household';

export default {
    name: 'Export',
    setup() {
        const householdStore = useHouseholdStore();

        const jsonOutput = computed(() => {
            return JSON.stringify(
                {
                    people: householdStore.people,
                    bills: householdStore.bills,
                },
                null,
                2
            );
        });

        return {
            jsonOutput,
        };
    },
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>