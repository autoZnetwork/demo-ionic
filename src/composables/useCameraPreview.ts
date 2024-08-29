import { CameraPreview, CameraPreviewOptions } from '@capgo/camera-preview'

export function useCameraPreview() {
    const launchCameraPreview = async (
        element: string = 'cameraPreviewContent',
    ) => {
        const cameraPreviewOptions: CameraPreviewOptions = {
            parent: element,
            width: window.innerWidth,
            height: window.innerHeight - 100,
            toBack: true,
        }

        await CameraPreview.start(cameraPreviewOptions)
    }

    const stopCameraPreview = async () => {
        await CameraPreview.stop()
    }

    const flipCamera = async () => {
        await CameraPreview.flip()
    }

    const startRecording = async () => {
        // const cameraPreviewOptions: CameraPreviewOptions = {
        //     parent: element,
        //     width: window.innerWidth,
        //     height: window.innerHeight - 150,
        //     toBack: true,
        // }

        await CameraPreview.startRecordVideo({})
    }

    const stopRecording = async () => {
        return await CameraPreview.stopRecordVideo()
    }

    return {
        launchCameraPreview,
        stopCameraPreview,
        flipCamera,
        startRecording,
        stopRecording,
    }
}

export interface UserVideo {
    filepath: string
    webviewPath?: string
    id?: number | null
    local?: boolean
    uploadData?: Record<string, any> | undefined
    uploadComplete?: boolean
}
