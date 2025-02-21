import React, { useState } from 'react';

const BFHLApp = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(['alphabets', 'numbers', 'highest_alphabet']);
  const [loading, setLoading] = useState(false);

  // Update document title
  React.useEffect(() => {
    document.title = "12345678"; // Replace with your roll number
  }, []);

  const validateAndParseJSON = (input) => {
    try {
      const parsed = JSON.parse(input);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Input must contain a "data" array');
      }
      return parsed;
    } catch (e) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    
    try {
      setLoading(true);
      const parsedData = validateAndParseJSON(jsonInput);
      
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:3000/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { label: 'Alphabets', value: 'alphabets' },
    { label: 'Numbers', value: 'numbers' },
    { label: 'Highest alphabet', value: 'highest_alphabet' }
  ];

  const handleFilterChange = (value) => {
    if (selectedFilters.includes(value)) {
      setSelectedFilters(selectedFilters.filter(f => f !== value));
    } else {
      setSelectedFilters([...selectedFilters, value]);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const results = [];
    
    if (selectedFilters.includes('numbers')) {
      results.push(
        <div key="numbers" className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Numbers</h3>
          <div className="flex flex-wrap gap-2">
            {response.numbers.map((num, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 rounded-full">{num}</span>
            ))}
          </div>
        </div>
      );
    }

    if (selectedFilters.includes('alphabets')) {
      results.push(
        <div key="alphabets" className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Alphabets</h3>
          <div className="flex flex-wrap gap-2">
            {response.alphabets.map((alpha, idx) => (
              <span key={idx} className="px-3 py-1 bg-green-100 rounded-full">{alpha}</span>
            ))}
          </div>
        </div>
      );
    }

    if (selectedFilters.includes('highest_alphabet')) {
      results.push(
        <div key="highest" className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Highest Alphabet</h3>
          <span className="px-3 py-1 bg-purple-100 rounded-full">
            {response.highest_alphabet}
          </span>
        </div>
      );
    }

    return results;
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter JSON Input
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder='{"data": ["A","C","z"]}'
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="text-red-700">Error: {error}</div>
          </div>
        )}

        {response && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="text-green-700">Data processed successfully</div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Filters</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md ${
                      selectedFilters.includes(option.value)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              {renderFilteredResponse()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BFHLApp;