<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Demo</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <div id="container">
                <ion-button @click="videoPreviewModalOpen = true">Start</ion-button>
            </div>
        </ion-content>

        <VideoPreviewModal
            :open="videoPreviewModalOpen"
            @close="videoPreviewModalOpen = false"
        />
    </ion-page>
</template>

<script setup lang="ts">
import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {ref} from "vue";
import VideoPreviewModal from '@/views/VideoPreviewModal.vue'

const videoPreviewModalOpen = ref(false)
</script>

<style scoped>
#container {
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
}
</style>
