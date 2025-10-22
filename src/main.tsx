//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setConfig } from '@alxgrn/prose-editor'

setConfig({
  api_url: 'https://dailytelefrag.ru/api/files'
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  //<React.StrictMode>
    <App />
  //</React.StrictMode>,
)
