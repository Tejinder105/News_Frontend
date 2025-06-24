import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './Layouts/UserLayout';
import AdminLayout from './Layouts/AdminLayout';
import Header from './Components/Header/Header';
import AdsCard from './Components/Ui/AdsCard';
import Weather from './Components/Ui/Weather';
import Footer from './Components/Footer/Footer';


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
      <AdsCard />
      <Footer/>
    </div>
    
  );
}

export default App;
