import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LoadingFallback from './Components/Loading.tsx'
import './index.css'
import Routers from './Routers'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './Store/store.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          {
              Routers.map((router, index) => (
                <Route  
                  key={index}
                  path={router.path}
                  element={<router.component />}
                />
              ))
            }
          </Routes>
        </Suspense>
      </Router>
    </PersistGate>
  </Provider>
</React.StrictMode>,
)
