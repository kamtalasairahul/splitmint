import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Split<span className="text-green-600">Mint</span>
          </h1>
          <p className="text-2xl text-gray-600 mb-12">
            Split expenses easily with friends and groups
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Create Groups</h3>
              <p className="text-gray-600">Organize expenses with up to 4 members per group</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-gray-600">Add expenses with equal, custom, or percentage splits</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Settle Up</h3>
              <p className="text-gray-600">Smart algorithm minimizes the number of transactions</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
