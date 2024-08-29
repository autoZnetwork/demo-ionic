<template>
    <ion-modal :is-open="open" @willDismiss="close">
        <ion-content id="cameraPreviewContent" :fullscreen="true">
            <div v-if="previewLoaded">
                <div v-if="cameraActive">
                    <div
                        v-if="videoRecording"
                        id="timer"
                        :class="{ active: videoRecording }"
                    >
                        {{ formattedTimer }}
                    </div>

                    <ion-button v-else expand="block" id="close" @click="close">
                        <ion-icon
                            slot="icon-only"
                            :icon="closeOutline"
                        ></ion-icon>
                    </ion-button>

                    <div
                        id="record"
                        :class="{ active: videoRecording }"
                        @click="toggleRecord"
                    >
                        <div class="inner"></div>
                    </div>

                    <ion-button expand="block" id="flip" @click="flip">
                        <ion-icon slot="icon-only" :icon="repeat"></ion-icon>
                    </ion-button>
                </div>
                <div v-else>
                    <div>{{ videoPath ?? 'No video path' }}</div>
                    <ion-button
                        color="danger"
                        expand="block"
                        id="cancel"
                        @click="cancel"
                    >
                        <ion-icon
                            slot="icon-only"
                            :icon="closeOutline"
                        ></ion-icon>
                    </ion-button>

                    <ion-button color="success" expand="block" id="accept">
                        <ion-icon slot="icon-only" :icon="checkmark"></ion-icon>
                    </ion-button>
                </div>
            </div>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import {
    IonContent,
    IonModal,
    IonButton,
    IonIcon,
} from '@ionic/vue'
import {checkmark, closeOutline, repeat} from 'ionicons/icons'
import {computed, ref, watch} from 'vue'
import { useCameraPreview } from '@/composables/useCameraPreview'
import { Capacitor } from '@capacitor/core'
import { useToast } from '@/composables/useToast'
import {Filesystem} from "@capacitor/filesystem";

const {
    launchCameraPreview,
    stopCameraPreview,
    startRecording,
    stopRecording,
    flipCamera,
} = useCameraPreview()

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close'])

watch(
    () => props.open,
    async (open) => {
        if (open) {
            await launchCamera()
        } else {
            resetPreview()
        }
    },
)

const previewLoaded = ref(false)
const cameraActive = ref(false)
const videoRecording = ref(false)
const recordTimeInterval = ref<any | null>(null)
const timer = ref(0)
const videoPath = ref<string | null>(null)

const formattedTimer = computed(() => {
    const hours = Math.floor(
        (timer.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((timer.value % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timer.value % (1000 * 60)) / 1000)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

async function launchCamera() {
    try {
        await launchCameraPreview()
    } catch (err: any) {
        await useToast(err.message)
    }

    cameraActive.value = true
    previewLoaded.value = true
}

async function stopCamera() {
    if (Capacitor.isNativePlatform() && videoRecording.value) {
        // force type of any because return type if incorrect
        const res: any = await stopRecording()

        console.log(res.videoUrl)
        videoPath.value = res.videoUrl

        const file = await Filesystem.stat({
            path: res.videoUrl,
        }).catch((err) => {
            console.error(err)
        })

        console.log(file)

        // const dir = await Filesystem.readdir({
        //     path: '',
        // })
        //
        // console.log(dir.files)

        videoRecording.value = false
    }

    await stopCameraPreview()
    cameraActive.value = false

    if (recordTimeInterval.value) {
        clearInterval(recordTimeInterval.value)
        timer.value = 0
    }
}

async function flip() {
    if (Capacitor.isNativePlatform()) {
        await flipCamera()
    } else {
        await useToast('Flip camera is not enabled on web.')
    }
}

async function toggleRecord() {
    console.log(videoRecording.value)

    if (!videoRecording.value) {
        await record()
    } else {
        await stopCamera()
    }
}

async function record() {
    if (Capacitor.isNativePlatform()) {
        videoRecording.value = true
        startRecordTimer()

        await startRecording()
    } else {
        await useToast('Recording video is not enabled on web.')
    }
}

function startRecordTimer() {
    recordTimeInterval.value = setInterval(() => (timer.value += 1000), 1000)
}

function resetPreview() {
    previewLoaded.value = false
    timer.value = 0
}


async function close() {
    await stopCamera()
    emit('close')
}

function cancel() {
    console.log('cancel')
}
</script>

<style scoped>
ion-content {
    --background: transparent !important;
}

#timer {
    position: absolute;
    top: var(--ion-safe-area-top, 10px);
    color: white;
    background-color: black;
    padding: 10px;
    left: calc(50% - 40px);
    border-radius: 10px;
    z-index: 99999;
}

#timer_back {
    position: absolute;
    bottom: var(--ion-safe-area-bottom, 30px);
    left: calc(50% - 175px);
    color: white;
    background-color: black;
    padding: 10px;
    border-radius: 10px;
    z-index: 99999;
}

#timer.active {
    background-color: #fd3b31;
}

#record {
    position: absolute;
    bottom: var(--ion-safe-area-bottom, 25px);
    left: calc(50% - 30px);
    width: 65px;
    height: 65px;
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    z-index: 99999;
}

.inner {
    background-color: #fd3b31;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transition: all 0.2s ease;
    transform: scale(0.94);
}

#record.active .inner {
    transform: scale(0.5);
    border-radius: 12%;
}

#flip,
#accept {
    position: absolute;
    bottom: var(--ion-safe-area-bottom, 25px);
    left: calc(50% + 125px);
    width: 50px;
    height: 50px;
    z-index: 99999;
}

#close,
#cancel {
    position: absolute;
    bottom: var(--ion-safe-area-bottom, 25px);
    left: calc(50% - 175px);
    width: 50px;
    height: 50px;
    z-index: 99999;
}

#record::part(native),
#close::part(native),
#cancel::part(native),
#flip::part(native),
#accept::part(native) {
    border-radius: 30px;
}
</style>
