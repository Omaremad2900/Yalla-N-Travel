import { createContainer, asClass } from 'awilix';
import UserService from '../services/user.service.js';
import TouristService from '../services/tourist.service.js';
import AdminService from '../services/admin.service.js';
import TourGuideService from '../services/tourGuide.service.js';
import TagService from '../services/tag.service.js';
import HistoricalPlaceService from '../services/historicalPlace.service.js';
import MuseumService from '../services/museum.service.js';
import ItineraryService from '../services/itinerary.service.js';
import SellerService from '../services/seller.service.js';
import ActivityCategoryService from '../services/activityCategory.service.js';
import PreferenceTagService from '../services/preferenceTag.service.js';
import ProductService from '../services/product.service.js';
import ActivityService from '../services/activity.service.js';
import AdvertiserService from '../services/advertiser.service.js';
import TicketService from '../services/ticket.service.js';
import PaymentService from '../services/payment.service.js';
import ShareService from '../services/shareService.js';
import ReviewService from '../services/review.service.js';
import transportationService from '../services/transportation.service.js';
import OrderService from '../services/order.service.js';
import AddressService from '../services/address.service.js';
import BookMarkService from '../services/bookmark.service.js'
import EventService from '../services/event.service.js';


// Create DI container
const container = createContainer();

// Register services with DI
container.register({
  userService: asClass(UserService).scoped(),
  touristService: asClass(TouristService).scoped(),
  adminService: asClass(AdminService).scoped(),
  tourGuideService: asClass(TourGuideService).scoped(),
  tagService: asClass(TagService).scoped(),
  historicalPlaceService: asClass(HistoricalPlaceService).scoped(),
  museumService: asClass(MuseumService).scoped(),
  itineraryService: asClass(ItineraryService).scoped(),
  sellerService: asClass(SellerService).scoped(),
  activityCategoryService: asClass(ActivityCategoryService).scoped(),
  preferenceTagService: asClass(PreferenceTagService).scoped(),
  productService: asClass(ProductService).scoped(),
  activityService: asClass(ActivityService).scoped(),
  advertiserService: asClass(AdvertiserService).scoped(),
  ticketService: asClass(TicketService).scoped(),
  paymentService: asClass(PaymentService).scoped(),
  shareService: asClass(ShareService).scoped(),  // Register the ShareService
  transportationService: asClass(transportationService).scoped(),  // Register the transportationService
  orderService: asClass(OrderService).scoped(),
  reviewService : asClass(ReviewService).scoped(),
  addressService: asClass(AddressService).scoped(),
  bookmarkService: asClass(BookMarkService).scoped(),
  eventService: asClass(EventService).scoped(),
});

export default container;

