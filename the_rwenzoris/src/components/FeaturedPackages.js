import Image from 'next/image';

const FeaturedPackages = ({ packages }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Image src={pkg.image} alt={pkg.name} width={500} height={192} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-gray-700 mb-4">{pkg.description}</p>
              <p className="text-xl font-bold text-blue-600">${pkg.price}</p>
              <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default FeaturedPackages;
