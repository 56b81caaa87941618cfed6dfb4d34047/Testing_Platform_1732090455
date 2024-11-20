import React, { useState } from 'react';

const Hero: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('1');

  
  return (
    <div className="bg-pink-500 py-16 text-white w-full h-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center h-full">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl font-bold mb-4 text-green-500">WEE</h1>
          <h2 className="text-3xl font-bold mb-4">Revolutionize Your Software Testing</h2>
          <p className="text-xl mb-6">Streamline your QA process with our powerful, intuitive testing platform. Catch bugs faster, release with confidence.</p>
          <div className="relative">
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <i className='bx bx-chevron-down'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Hero as component }