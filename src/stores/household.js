// src/stores/household.js
import { defineStore } from 'pinia';

export const useHouseholdStore = defineStore('household', {
    state: () => ({
        people: [],
        bills: [],
    }),
    persist: {
        key: 'household-data',
        storage: window.localStorage,
    },
    getters: {
        totalIncome: (state) => {
            return state.people.reduce((acc, person) => acc + Number(person.yearlySalary || 0), 0);
        },
        totalBills: (state) => {
            return state.bills.reduce((acc, bill) => acc + Number(bill.amount || 0), 0);
        },
    },
    actions: {
        addPerson(person) {
            this.people.push(person);
        },
        removePerson(index) {
            this.people.splice(index, 1);
        },
        addBill(bill) {
            this.bills.push(bill);
        },
        updateBill(index, bill) {
            this.bills[index] = bill;
        },
        removeBill(index) {
            this.bills.splice(index, 1);
        },
    },
});
