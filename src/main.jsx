import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { EditformProvider } from './context/EditformContext.jsx'
import App from './App.jsx'
import { PieDataContextProvider } from './context/getPieData.jsx'
import { GenerateTimeContextProvider } from './context/generateTimeContext.jsx'
import { ScheduleContextProvider } from './context/ScheduleContext.jsx'
import { LoadingContextProvider } from './context/loadingContext.jsx'
import { AddScheduleContextProvider } from './context/AddScheduleContext.jsx'
import { GetCredentialsContextProvider } from './context/getCredentialsContext.jsx'
import { ModalLogoutContextProvider } from './context/ModalContext.jsx'
import { DropDownContextProvider } from './context/DropDownContext.jsx'
createRoot(document.getElementById('root')).render(
<DropDownContextProvider>
<ModalLogoutContextProvider>
  <GetCredentialsContextProvider>
    <AddScheduleContextProvider>
      <LoadingContextProvider>
        <ScheduleContextProvider>
          <GenerateTimeContextProvider>
            <PieDataContextProvider>
              <EditformProvider>
                <App />
              </EditformProvider>
            </PieDataContextProvider>
          </GenerateTimeContextProvider>  
        </ScheduleContextProvider>
      </LoadingContextProvider>
    </AddScheduleContextProvider>
  </GetCredentialsContextProvider>
</ModalLogoutContextProvider>
</DropDownContextProvider>
)
