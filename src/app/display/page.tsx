export default function DisplayPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4 h-screen flex">
        {/* Left Half - Word Card */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="bg-blue-600 rounded-2xl p-16 w-full max-w-2xl text-center shadow-2xl">
            <h1 className="text-8xl font-bold mb-8 text-white">Innovation</h1>
            <div className="text-2xl text-blue-100 mb-12">
              <p>Keywords: Technology, Future, Progress, Change</p>
            </div>
            <div className="text-3xl text-blue-200 font-semibold">
              Time remaining: 8 seconds
            </div>
          </div>
        </div>

        {/* Right Half - Teams */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Teams</h2>
            
            {/* Team A */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-red-400">Team A (2 points)</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-green-400 text-lg">✓ Alice</span>
                  <span className="text-sm text-gray-400 ml-3">Available</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-red-400 text-lg">⏱ Bob</span>
                  <span className="text-sm text-gray-400 ml-3">Cooldown: 2:30</span>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Team B (1 point)</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-green-400 text-lg">✓ Charlie</span>
                  <span className="text-sm text-gray-400 ml-3">Available</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-green-400 text-lg">✓ Diana</span>
                  <span className="text-sm text-gray-400 ml-3">Available</span>
                </div>
              </div>
            </div>

            {/* Team C */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-green-400">Team C (3 points)</h3>
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-green-400 text-lg">✓ Eve</span>
                  <span className="text-sm text-gray-400 ml-3">Available</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <span className="text-yellow-400 text-lg">🎤 Frank</span>
                  <span className="text-sm text-gray-400 ml-3">Speaking: 0:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}