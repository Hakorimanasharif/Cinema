export default function Footer() {
  return (
    <footer className="bg-black/90 border-t border-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">TV</h3>
            <ul className="space-y-2">
              <li>
                <a href="/tv" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Shows
                </a>
              </li>
              <li>
                <a href="/tv" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Episodes
                </a>
              </li>
              <li>
                <a href="/tv" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  TV Schedule
                </a>
              </li>
              <li>
                <a href="/premium" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Premium
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Movies</h3>
            <ul className="space-y-2">
              <li>
                <a href="/movies" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="/movies" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  New Releases
                </a>
              </li>
              <li>
                <a
                  href="/category/animation"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Animation
                </a>
              </li>
              <li>
                <a
                  href="/category/rwandan"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Rwandan Movies
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/support/faq"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/support/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/support/devices"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Devices
                </a>
              </li>
              <li>
                <a
                  href="/support/terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <a href="/account" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                  My Account
                </a>
              </li>
              <li>
                <a
                  href="/account/subscription"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Subscription
                </a>
              </li>
              <li>
                <a
                  href="/account/settings"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="/account/watchlist"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Watch List
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 Cinemax. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Facebook
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Twitter
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

