import { toastController } from '@ionic/vue'

export const useToast = async (message: string, params: ToastParams = {}) => {
    const toast = await toastController.create({
        message,
        duration: params.duration ?? 1500,
        position: params.position ?? 'bottom',
    })

    await toast.present()
}

export interface ToastParams {
    duration?: number
    position?: 'bottom' | 'top' | 'middle' | undefined
}
