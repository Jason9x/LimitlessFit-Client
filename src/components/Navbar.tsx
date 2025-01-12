import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDumbbell } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
    <nav className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between">
          <div>
            <FontAwesomeIcon icon={faDumbbell} className="text-2xl text-text" />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
