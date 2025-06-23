import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import Header from './Components/Header/Header';
import AdsCard from './Components/Ui/Carousel';


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

     <AdsCard/>
    </div>
    
  );
}

export default App;
