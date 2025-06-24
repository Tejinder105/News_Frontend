import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import Header from './Components/Header/Header';
import AdsCard from './Components/Ui/Carousel';
import Weather from './Components/Ui/Weather';


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
    <div className='bg-slate-100  p-2'>
      <Weather />
    </div>
    
  );
}

export default App;
