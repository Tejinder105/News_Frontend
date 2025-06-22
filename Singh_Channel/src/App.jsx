import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import Header from './Components/Header/Header';


// const router=createBrowserRouter([
// {
//   path:"/",
//   element:<UserLayout/>,
//   children:[
//     {
//       path:"/",
//     },
//     {
//       path:"/newsarticle/:id"
//     },
//     {
//       path:"/admin",
//       element:<AdminLayout/>,
//       children:[
//         {
//           path:"/admin",
//         }
//       ]
//     },
//     {
//       path
//     }

//   ]
// }
// ])

function App() {
  return (
    <div>

     <Header/>
    </div>
    
  );
}

export default App;
