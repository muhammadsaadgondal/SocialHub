
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <Image src="/images/login/Logo.png" alt="Logo" width={40} height={40} />
          <nav className="hidden md:flex space-x-4">
            <Link href="#" className="hover:text-purple-500">Explore</Link>
            <Link href="#" className="hover:text-purple-500">Stats</Link>
            <Link href="#" className="hover:text-purple-500">Drops</Link>
            <Link href="#" className="hover:text-purple-500">Activity</Link>
          </nav>
        </div>
        {/* Search Bar */}
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search items, collections, and accounts"
            className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Image src="/search-icon.svg" alt="Search" width={24} height={24} />
          </div>
        </div>
        {/* Actions */}
        <div className="flex space-x-4">
          <Link href="/login" className="hidden md:inline-block text-gray-800 hover:text-purple-500">Sign In</Link>
          <Link href="/create" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">Create</Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="py-12 px-4">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-8 rounded-lg flex flex-col items-start justify-center text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Explore and chose your Infuencer</h1>
            <p className="mb-6">Our marketplace is the world first and largest Influencer market for independent creators worldwide.</p>
            <Link href="#" className="bg-white text-purple-600 px-6 py-3 rounded-full hover:bg-gray-100">See 340,590 items</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Image src="/images/landing/1.jpg" alt="NFT 1" width={250} height={250} className="rounded-lg" />
            <Image src="/images/landing/2.jpg" alt="NFT 2" width={250} height={250} className="rounded-lg" />
            <Image src="/images/landing/3.jpg" alt="NFT 3" width={250} height={250} className="rounded-lg" />
            <Image src="/images/landing/4.jpg" alt="NFT 4" width={250} height={250} className="rounded-lg" />
          </div>
        </section>

        {/* Running Auctions */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">Running auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Each auction item */}
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <Image src="/images/landing/1.jpg" alt="NFT 1" width={300} height={200} className="rounded-lg" />
              <h3 className="text-lg font-bold mt-4">Right Messages and Memes</h3>
              <p className="text-gray-500">Price: 1.90 ETH</p>
            </div>
            {/* Add more NFT cards similarly */}
          </div>
        </section>

        {/* Top Collections */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">Top collections</h2>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <li className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-lg font-bold">Bored Ape Yacht Club</h3>
              <p className="text-green-500">10,450.00 ETH</p>
            </li>
            {/* Add more collections */}
          </ul>
        </section>

        {/* Trending Items */}
        <section className="my-12">
          <h2 className="text-2xl font-semibold mb-6">Trending items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <Image src="/images/landing/1.jpg" alt="Trending NFT 1" width={300} height={200} className="rounded-lg" />
              <h3 className="text-lg font-bold mt-4">May Bring Back</h3>
              <p className="text-gray-500">From 0.45 Flow</p>
            </div>
            {/* Add more trending items similarly */}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-lg font-bold mb-4">Subscribe to updates</h4>
            <input type="email" placeholder="Enter your e-mail" className="w-full px-4 py-2 rounded-lg text-black" />
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Marketplace</h4>
            <ul>
              <li><Link href="#" className="hover:underline">Explore</Link></li>
              <li><Link href="#" className="hover:underline">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Community</h4>
            <ul>
              <li><Link href="#" className="hover:underline">Profile</Link></li>
              <li><Link href="#" className="hover:underline">Favorites</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center">&copy; 2024 All rights reserved.</p>
      </footer>
    </div>
  );
}
