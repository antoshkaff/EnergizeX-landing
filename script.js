import Dropdown from "./modules/Dropdown.js"
import SearchForm from "./modules/SearchForm.js"
import Modal from "./modules/Modal.js"
import Slider from "./modules/Slider.js"
import Notification from "./modules/Notification.js"
import Tab from "./modules/Tab.js"
import Wish from "./modules/Wish.js"
import CartService from "./modules/CartService.js"
import Cart from "./modules/Cart.js"
import CartLocalStorage from "./modules/CartLocalStorage.js"
import Timer from "./modules/Timer.js"

new Dropdown()
new SearchForm()
new Modal()
new Slider()
new Notification()
new Tab()
new Wish()

CartLocalStorage.loadFromLocalStorage()
new CartService()
new Cart()

new Timer(2 * 24 * 60 * 60 + 12 * 60 * 60 + 45 * 60 + 5)