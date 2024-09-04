function MainPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Hello :D
        </h2>
        <p className="mt-6 text-center text-xl font-bold leading-9 tracking-tight">
          <a href="/api" className="underline hover:text-blue-500">
            API Docs
          </a>
        </p>
      </div>
    </div>
  );
}

export default MainPage;
