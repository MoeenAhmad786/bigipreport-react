import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
// importing styles
// import "./assets/css/bigipreportstyle.css"
//  import "./assets/css/pace.css"
//  import "./assets/css/sh_style.css"
// // import "./assets/css/buttons.dataTables.min.css"
//  //import "./assets/css/jquery.dataTables.min.css"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
