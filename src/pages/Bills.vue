<template>
    <v-container>
        <h3>Add Bill</h3>
        <v-form @submit.prevent="addBill">
            <v-text-field label="Bill Name" v-model="newBill.name" required></v-text-field>
            <v-text-field label="Amount" v-model="newBill.amount" type="number" required></v-text-field>
            <v-select label="Frequency" v-model="newBill.frequency" :items="frequencies" required></v-select>
            <v-select label="Split Option" v-model="newBill.splitOption" :items="splitOptions" required></v-select>
            <v-btn type="submit" color="primary">Add</v-btn>
        </v-form>

        <v-data-table :headers="headers" :items="householdStore.bills" :sort-by.sync="sortBy" class="mt-4">
            <!-- Customize Header Cells -->
            <template v-slot:header.name="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.amount="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.frequency="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.splitOption="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>
            <template v-slot:header.actions="{ column }">
                <v-icon small class="mr-1">{{ column.icon }}</v-icon>
                <span v-if="!mobile">{{ column.text }}</span>
            </template>

            <!-- Format Amount -->
            <template v-slot:item.amount="{ item }">
                {{ formatCurrency(item.amount) }}
            </template>

            <!-- Actions -->
            <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editBill(item.id)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="removeBill(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <!-- Edit Bill Dialog -->
        <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
                <v-card-title>Edit Bill</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field label="Bill Name" v-model="editingBill.name" required></v-text-field>
                        <v-text-field label="Amount" v-model="editingBill.amount" type="number" required></v-text-field>
                        <v-select label="Frequency" v-model="editingBill.frequency" :items="frequencies"
                            required></v-select>
                        <v-select label="Split Option" v-model="editingBill.splitOption" :items="splitOptions"
                            required></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="cancelEdit">Cancel</v-btn>
                    <v-btn text @click="saveEdit">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { ref } from 'vue';
import { useHouseholdStore } from '@/stores/household';
import { useDisplay } from 'vuetify';

export default {
    name: 'Bills',
    setup() {
        const householdStore = useHouseholdStore();
        const { mobile } = useDisplay();

        const frequencies = [
            'weekly',
            'bi-weekly',
            'monthly',
            'quarterly',
            'twice-yearly',
            'yearly',
        ];

        const splitOptions = ['evenly', 'equitably'];

        const newBill = ref({
            id: Date.now(),
            name: '',
            amount: null,
            frequency: 'monthly',
            splitOption: 'evenly',
        });

        const addBill = () => {
            if (newBill.value.name && newBill.value.amount > 0) {
                householdStore.addBill({ ...newBill.value, id: Date.now() });
                newBill.value = {
                    id: Date.now(),
                    name: '',
                    amount: null,
                    frequency: 'monthly',
                    splitOption: 'evenly',
                };
            }
        };

        const editDialog = ref(false);
        const editingIndex = ref(null);
        const editingBill = ref({});

        const removeBill = (id) => {
            const index = householdStore.bills.findIndex((bill) => bill.id === id);
            if (index !== -1) {
                householdStore.removeBill(index);
            }
        };

        const editBill = (id) => {
            const index = householdStore.bills.findIndex((bill) => bill.id === id);
            if (index !== -1) {
                editingIndex.value = index;
                editingBill.value = { ...householdStore.bills[index] };
                editDialog.value = true;
            }
        };


        const saveEdit = () => {
            householdStore.updateBill(editingIndex.value, editingBill.value);
            editDialog.value = false;
        };

        const cancelEdit = () => {
            editDialog.value = false;
        };

        const headers = [
            {
                text: 'Bill Name',
                value: 'name',
                icon: 'mdi-file-document-outline',
                sortable: true,
            },
            {
                text: 'Amount',
                value: 'amount',
                icon: 'mdi-currency-usd',
                sortable: true,
            },
            {
                text: 'Frequency',
                value: 'frequency',
                icon: 'mdi-calendar-sync-outline',
                sortable: true,
            },
            {
                text: 'Split Option',
                value: 'splitOption',
                icon: 'mdi-account-group',
                sortable: true,
            },
            {
                text: 'Actions',
                value: 'actions',
                icon: 'mdi-tools',
                sortable: false,
            },
        ];

        const sortBy = ref([{ key: 'name', order: 'asc' }]);

        const formatCurrency = (value) => {
            if (!value) return '';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        };

        return {
            householdStore,
            frequencies,
            splitOptions,
            newBill,
            addBill,
            removeBill,
            editDialog,
            editingBill,
            editBill,
            saveEdit,
            cancelEdit,
            headers,
            sortBy,
            formatCurrency,
            mobile,
        };
    },
};
</script>
