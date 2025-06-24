import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-8">🎤 Word Tinder</h1>
        <p className="text-xl text-gray-400 mb-12">
          Group Showdown for Toastmasters
        </p>
        
        <div className="flex gap-6 justify-center">
          <Link
            href="/display"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Main Display
          </Link>
          <Link
            href="/play"
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Join Game
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Display: Project on main screen</p>
          <p>Join Game: Open on your mobile device</p>
        </div>
      </div>
    </div>
  );
}
