<!-- src/layouts/DefaultLayout.vue -->
<template>
  <v-app>
    <!-- Navigation -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Household Budget</v-toolbar-title>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" :permanent="!mobile" :temporary="mobile">
      <Sidebar />
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <AppFooter />
  </v-app>
</template>

<script>
import { ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {
  name: 'DefaultLayout',
  components: {
    Sidebar,
    AppFooter,
  },
  setup() {
    const { mobile } = useDisplay();
    const drawer = ref(!mobile.value);
    const router = useRouter();

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    // Close drawer on navigation if on mobile
    watch(
      () => router.currentRoute.value.fullPath,
      () => {
        if (mobile.value) {
          drawer.value = false;
        }
      }
    );

    // Update drawer state when device type changes
    watch(
      mobile,
      (isMobile) => {
        if (isMobile) {
          drawer.value = false; // Close drawer on mobile devices
        } else {
          drawer.value = true; // Keep drawer open on non-mobile devices
        }
      },
      { immediate: true }
    );

    return {
      drawer,
      mobile,
      toggleDrawer,
    };
  },
};
</script>

<style>
@media print {

  .v-navigation-drawer,
  .v-app-bar,
  .v-btn,
  textarea {
    display: none;
  }
}
</style>
