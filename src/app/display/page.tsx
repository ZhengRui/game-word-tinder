export default function DisplayPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 h-screen flex">
        {/* Left Half - Word Card */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-blue-600 rounded-lg p-8 max-w-md w-full text-center">
            <h1 className="text-4xl font-bold mb-4">Innovation</h1>
            <div className="text-lg text-blue-200">
              <p>Keywords: Technology, Future, Progress, Change</p>
            </div>
            <div className="mt-6 text-sm text-blue-300">
              Time remaining: 8 seconds
            </div>
          </div>
        </div>

        {/* Right Half - Teams */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Teams</h2>
          
          {/* Team A */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-red-400">Team A (2 points)</h3>
            <div className="space-y-2">
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-green-400">✓ Alice</span>
                <span className="text-xs text-gray-400 ml-2">Available</span>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-red-400">⏱ Bob</span>
                <span className="text-xs text-gray-400 ml-2">Cooldown: 2:30</span>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-blue-400">Team B (1 point)</h3>
            <div className="space-y-2">
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-green-400">✓ Charlie</span>
                <span className="text-xs text-gray-400 ml-2">Available</span>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-green-400">✓ Diana</span>
                <span className="text-xs text-gray-400 ml-2">Available</span>
              </div>
            </div>
          </div>

          {/* Team C */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-green-400">Team C (3 points)</h3>
            <div className="space-y-2">
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-green-400">✓ Eve</span>
                <span className="text-xs text-gray-400 ml-2">Available</span>
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <span className="text-yellow-400">🎤 Frank</span>
                <span className="text-xs text-gray-400 ml-2">Speaking: 0:45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}