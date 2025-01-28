const LoadingSpinner = () => (
  <div className="w-screen h-screen flex justify-center items-center">
    <div
      className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-solid
                 border-gray-200 border-t-red-500 rounded-full absolute top-[50%]"
      role="status"
    />
  </div>
)

export default LoadingSpinner
