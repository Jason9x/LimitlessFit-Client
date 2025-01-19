import React from 'react'

const LoadingSpinner = () => (
  <div className="fixed w-screen h-screen flex justify-center items-center">
    <div
      className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid border-gray-200 border-t-blue-500 rounded-full"
      role="status"
    />
  </div>
)

export default LoadingSpinner
