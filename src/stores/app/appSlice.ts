import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from '../index'

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
      state.showInformationDialog = true
      state.typeInformationDialog = action.payload.type
      state.messageInformationDialog = action.payload.message
    },
    closeInformationDialog: state => {
      state.showInformationDialog = false
    }
  }
})

export const { initInformationDialog, closeInformationDialog } =
  appSlice.actions
export default appSlice.reducer

export const selectShowInformationDialog = (state: RootState) =>
  state.app.showInformationDialog
export const selectTypeInformationDialog = (state: RootState) =>
  state.app.typeInformationDialog
export const selectMessageInformationDialog = (state: RootState) =>
  state.app.messageInformationDialog
