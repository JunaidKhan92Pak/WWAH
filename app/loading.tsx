
export default function Loading() {
  return (
    <section className="flex items-center justify-center h-screen">
    

     
      <section className="flex items-center justify-center h-screen">
        <div className="flex space-x-2">
          <div className="w-5 h-5 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-5 h-5 bg-orange-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-5 h-5 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
          <div className="w-5 h-5 bg-green-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </section>
    </section>
  );
}
