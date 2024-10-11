<!-- src/components/Export.vue -->
<template>
    <v-container>
        <h2>Export Data</h2>
        <v-textarea label="Exported Data" v-model="exportData" readonly rows="10"></v-textarea>
        <v-btn color="primary" @click="copyToClipboard">Copy to Clipboard</v-btn>

        <h2 class="mt-8">Import Data</h2>
        <v-textarea label="Paste Exported Data Here" v-model="importData" rows="10"></v-textarea>
        <v-btn color="primary" @click="importState">Import</v-btn>

        <v-snackbar v-model="snackbar.visible" :timeout="snackbar.timeout" :color="snackbar.color">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn text @click="snackbar.visible = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script>
import { ref } from 'vue';
import { useHouseholdStore } from '@/stores/household';
import pako from 'pako';

export default {
    name: 'Export',
    setup() {
        const householdStore = useHouseholdStore();
        const exportData = ref('');
        const importData = ref('');

        const snackbar = ref({
            visible: false,
            text: '',
            color: '',
            timeout: 3000,
        });

        function uint8ArrayToString(uint8Array) {
            let binaryString = '';
            for (let i = 0; i < uint8Array.length; i++) {
                binaryString += String.fromCharCode(uint8Array[i]);
            }
            return binaryString;
        }

        function stringToUint8Array(binaryString) {
            const uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }
            return uint8Array;
        }

        const generateExportData = () => {
            const state = {
                people: householdStore.people,
                bills: householdStore.bills,
            };

            const jsonString = JSON.stringify(state);

            const compressed = pako.deflate(jsonString);

            const compressedString = uint8ArrayToString(compressed);

            exportData.value = btoa(compressedString);
        };

        generateExportData();

        const copyToClipboard = () => {
            navigator.clipboard.writeText(exportData.value).then(
                () => {
                    snackbar.value.text = 'Export data copied to clipboard.';
                    snackbar.value.color = 'success';
                    snackbar.value.visible = true;
                },
                (err) => {
                    snackbar.value.text = 'Failed to copy export data: ' + err;
                    snackbar.value.color = 'error';
                    snackbar.value.visible = true;
                }
            );
        };

        const importState = () => {
            if (!importData.value) {
                snackbar.value.text = 'Please paste the exported data to import.';
                snackbar.value.color = 'warning';
                snackbar.value.visible = true;
                return;
            }

            try {
                const compressedString = atob(importData.value);

                const compressed = stringToUint8Array(compressedString);

                const jsonString = pako.inflate(compressed, { to: 'string' });

                const state = JSON.parse(jsonString);

                householdStore.$patch({
                    people: state.people,
                    bills: state.bills,
                });

                generateExportData();

                snackbar.value.text = 'Data imported successfully.';
                snackbar.value.color = 'success';
                snackbar.value.visible = true;
            } catch (error) {
                console.error('Import Error:', error);
                snackbar.value.text =
                    'Failed to import data: ' + (error.message || error.toString());
                snackbar.value.color = 'error';
                snackbar.value.visible = true;
            }
        };

        return {
            exportData,
            importData,
            copyToClipboard,
            importState,
            snackbar,
        };
    },
};
</script>

<style scoped>
.mt-8 {
    margin-top: 2rem;
}
</style>