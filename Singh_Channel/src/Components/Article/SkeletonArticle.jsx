import React from 'react';

const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index} 
          className="bg-gray-200 rounded animate-pulse"
          style={{ height: '1em' }}
        />
      ))}
    </div>
  );
};


 const SkeletonArticle = () => (
  <div className="min-h-screen bg-gray-100 p-4">
    <div className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SkeletonText lines={1} className="mb-4 h-10 w-3/4" />
          <SkeletonText lines={1} className="mb-6 h-6 w-1/2" />
          <div className="mb-8 aspect-video animate-pulse rounded-lg bg-gray-200" />
          <SkeletonText lines={15} className="mb-4 h-5" />
        </div>
        <div className="lg:col-span-4">
          <SkeletonText lines={5} className="mb-4 h-5" />
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonArticle;