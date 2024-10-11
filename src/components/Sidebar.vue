<!-- src/components/Sidebar.vue -->
<template>
    <v-list>
        <v-list-item link :to="{ path: '/' }">
            <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/budgets' }">
            <v-list-item-title>Budgets</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/bills' }">
            <v-list-item-title>Bills</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/people' }">
            <v-list-item-title>People</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{ path: '/export' }">
            <v-list-item-title>Export</v-list-item-title>
        </v-list-item>
    </v-list>
</template>

<script>
export default {
    name: 'Sidebar',
};
</script>

<style scoped>
/* Add any styles if necessary */
</style>