import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'
import { ErrorType } from '@/utils/types'

export type InformationDialogType = 'info' | 'success' | 'error' | 'warning'

export interface AppState {
  showInformationDialog: boolean
  typeInformationDialog: InformationDialogType
  messageInformationDialog?: string
}

interface InitInformationDialogPayload {
  type: InformationDialogType
  message?: string
}

const initialState: AppState = {
  showInformationDialog: false,
  typeInformationDialog: 'info'
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initInformationDialog: (
      state,
      action: PayloadAction<InitInformationDialogPayload>
    ) => {
      state.typeInformationDialog = action.payload.type
      state.messageInformationDialog = action.payload.message
      state.showInformationDialog = true
    },
    initInformationDialogError: (state, action: PayloadAction<ErrorType[]>) => {
      state.typeInformationDialog = 'error'
      state.messageInformationDialog = ''

      for (const error of action.payload) {
        state.messageInformationDialog += `Status Code: ${error.statusCode}\n`

        if (error.path)
          state.messageInformationDialog += `Path: ${error.path.join(' - ')}\n`

        if (error.error)
          state.messageInformationDialog += `Error: ${error.error}\n`

        if (Array.isArray(error.message)) {
          for (const message of error.message) {
            state.messageInformationDialog += message.message + '\n'
          }
        } else {
          state.messageInformationDialog += error.message + '\n'
        }
      }

      state.showInformationDialog = true
    },
    closeInformationDialog: state => {
      state.showInformationDialog = false
    }
  }
})

export const {
  initInformationDialog,
  initInformationDialogError,
  closeInformationDialog
} = appSlice.actions
export default appSlice.reducer

export const selectShowInformationDialog = (state: RootState) =>
  state.app.showInformationDialog
export const selectTypeInformationDialog = (state: RootState) =>
  state.app.typeInformationDialog
export const selectMessageInformationDialog = (state: RootState) =>
  state.app.messageInformationDialog
