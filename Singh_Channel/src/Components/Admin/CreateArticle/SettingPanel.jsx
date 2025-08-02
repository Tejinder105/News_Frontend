import React from 'react'
import Toggle from "../../Ui/Toggle"
function SettingPanel({ register }) {
  return (
   <div className="space-y-4">
       <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
         <div>
           <h4 className="text-sm font-medium text-gray-700">Featured Article</h4>
           <p className="text-xs text-gray-500">Show on homepage</p>
         </div>
         <Toggle {...register("is_featured")} />
       </div>
   
       <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
         <div>
           <h4 className="text-sm font-medium text-gray-700">Breaking News</h4>
           <p className="text-xs text-gray-500">Mark as urgent news</p>
         </div>
         <Toggle {...register("is_breaking")} />
       </div>
     </div>
  )
}

export default SettingPanel