import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDumbbell, faSun, faGlobe } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav className="bg-secondary text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button className="flex items-center text-text-primary font-bold">
            <FontAwesomeIcon
              icon={faDumbbell}
              className="sm:text-sm md:text-xl lg:text-xl xl:text-xl 2xl:text-xl"
            />

            <span
              className="ml-3 uppercase sm:text-md md:text-xl lg:text-xl xl:text-2xl
              2xl:text-3xl text-shadow text-shadow-x-0 text-shadow-y-4 text-shadow-blur-10 
              text-shadow-text-primary"
            >
              LimitlessFit
            </span>
          </button>

          <div className="sm:text-md md:text-lg lg:text-lg xl:text-lg 2xl:text-lg">
            <button>
              <FontAwesomeIcon icon={faGlobe} className="text-text-primary" />
            </button>

            <button className="ml-5">
              <FontAwesomeIcon icon={faSun} className="text-text-primary" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
