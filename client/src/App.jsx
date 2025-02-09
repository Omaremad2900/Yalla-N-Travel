import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import SignUpGuest from './pages/SignUpGuest'
import AdminDashboard from './components/Admindashboard'
import Advertiser from './pages/Advertiser'
import AdvertiserCreate from './pages/AdvertiserCreate';
import AdvertiserRead from './pages/AdvertiserRead';
import AdvertiserUpdate from './pages/AdvertiserUpdate';
import Tourguide from './pages/CreateItineraries'
import Products from './pages/Products'
import AdminService from './services/adminService'
import advertiserService from './services/advertiserService'
import TourguideCreate from './pages/TourguideCreate'
import ActivityService from './services/activitiyService'
import Tourguideservice from './services/Tourguideservice'
import SellerService from './services/sellerService'
import SellerAddProduct from './pages/sellerAddProduct'
import SellerEditProduct from './pages/sellerEditProduct'
import SellerCreate from './pages/SellerCreate'
import sellerProfile from './pages/sellerProfile'
import SellerProfile from './pages/sellerProfile'
import SellerRead from './pages/SellerRead'
import TouristDashboard from './pages/TouristDashboard'
import touristService from './services/touristService'
import TouristProducts from './pages/TouristProducts.jsx'
import Cart from './pages/Cart.jsx'
import ProductService from './services/ProductService'
import ViewItineraries from './pages/ViewItineraries'
import tourismgovernorService from './services/tourismgovernorService'
import EditItinerary from './pages/Edititineraries'
import ManageUsers from './pages/ManageUsers'
import CreateAdmin from './pages/createAdmin'
import ManageActivityCategories from './pages/ManageActivityCategories'
import ManagePreferenceTags from './pages/ManagePreferenceTags'
import ManageGovernors from './pages/ManageGoverners'
import Advertiserview from './pages/advertiserview'
import AddPlace from './pages/AddPlace'
import Museums from './pages/museums'
import HistoricalPlaces from './pages/HistoricalPlace'
import CreateActivity from './pages/Createactivity'
import ManageActivities from './pages/ManageActivities'
import Tourguidehomepage from './pages/Tourguidehomepage'
import TourismGovernor from './pages/Tourismgoverner'
import TouristRead from './pages/TouristRead'
import TouristUpdate from './pages/TouristUpdate'
import TourguideRead from './pages/TourguideRead'
import SellerUpdate from './pages/SellerUpdate'
import Guest from './pages/Guest.jsx'
import TouristHome from './pages/TouristHome'
import MyWishList from './pages/MyWishList.jsx'
import SellerHome from './pages/SellerHome'
import AdvertiserHome from './pages/AdvertiserHome'
import TourismgovernerHome from './pages/TourismgovernerHome'
import TourguideUpdate from './pages/TourguideUpdate'
import CheckoutForm from './pages/CheckoutForm'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentService from './services/paymentService.jsx'
const stripePromise = loadStripe("pk_test_51QBCihBLdndZPbgXKd0vHHJHbjDc4qUm0YBi9rs5xz2fex6vMw0U1rBZioFk42D3DCILth4XQeO5ksaYp8Ubai4g00FkLi68wG");
import BookActivityPage from './pages/BookActivityPage'
import BookItinerary from './pages/BookItinerary.jsx'
import AttendedHistoryPage from './pages/GetHistoryPage.jsx'
import TouristComplaint from './pages/TouristComplaint'
import { ProSidebarProvider } from "react-pro-sidebar";
import ProtectedRoute from './utils/protectedRoute.jsx'
import Unauthorized from './pages/unauthorized.jsx'
import Bookflight from './pages/Bookflight.jsx'
import FlightBookingPage from './pages/Bookflight.jsx'
import RateAndCommentPage from './pages/RateAndCommentPage(IT).jsx'
import RateAndCommentPageAC from './pages/RateAndCommentPage(AC).jsx'
import BookingsPage from './pages/GetBookingsPage.jsx'
import ArchiveProduct from './pages/ArchiveProduct.jsx'
import PurchasedProduct from './pages/PurchasedProduct.jsx'
import SellerProducts from './pages/SellerProducts.jsx'
import { LoadScript } from '@react-google-maps/api';
import bookingService from '../src/services/BookingService.jsx'
import Travelerdetails from './pages/Travelerdetails.jsx'
import Createtransportation from './pages/Createtransportation.jsx'
import Booktransportation from './pages/Booktransportation.jsx'
import Viewtransportation from './pages/Viewtransportation.jsx'
import RateAndCommentTourGuidePage from './pages/RateAndCommentTourGuide.jsx'
import Createmuseum from './pages/Createmuseum.jsx'
import TouristChoosePreferences from './pages/TouristChoosePreferences.jsx'
import ManageComplaints from './pages/ManageComplaints'
import ComplaintDetails from './pages/ComplaintDetails'
import Bookhotel from './pages/Bookhotel.jsx'
import ComplaintsList from './pages/ComplaintsList.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import userService from './services/UserService.jsx';
import AdminRead from './pages/AdminRead.jsx';
import AdminViewActivities from './pages/AdminViewActivities.jsx'
import AdminViewItineraries from './pages/AdminViewItineraries.jsx'
import TourismGovernorRead from './pages/TourismGovernorRead.jsx'
import ActivityPage from './pages/Activity.jsx'
import TourGuidePage from './pages/itinerary.jsx'
import MuseumPage from './pages/museumpage.jsx'
import HistoricalPlacePage from './pages/historicalplacepage.jsx'
import tourismGovernorService from './services/tourismgovernorService'
import TourguideService from './services/Tourguideservice.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import AdminArchivedProducts from './pages/AdminArchivedProducts.jsx'
import JoinRoom from './utils/JoinRoom.jsx'
import { useSelector } from 'react-redux'
import CheckoutFormOrder from './pages/CheckoutFormOrder.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import VerifyOTP from './pages/VerifyOTP.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import PayCart from './pages/PayCart.jsx'

import MyAddress from './pages/myAddress.jsx'
import CreateAddress from './pages/Createaddress.jsx'
import ViewBookmarks from './pages/Viewbookmarks.jsx'
import SellerRevenue from './pages/Sellerrevenue.jsx'
import AdminRevenue from './pages/Adminrevenue.jsx'
import TourGuideRevenue from './pages/Tourguiderevenue.jsx'
import AdvertiserRevenue from './pages/Advertiserrevenue.jsx'
import AdminViewUserStatistics from './pages/AdminViewUserStatistics.jsx'
import TourguideViewTouristStatistics from './pages/TourguideViewTouristStatistics.jsx'
import AdvertiserViewTouristStatistics from './pages/AdvertiserViewTouristStatistics.jsx'
import OrderDetails from "./pages/OrderDetails"
import CreatePromoCode from './pages/CreatePromo'
import ViewOrders from "./pages/ViewOrders"

import AdminManage from './pages/AdminManage.jsx'
import AdminCreate from './pages/AdminCreate.jsx'
import AdminView from './pages/AdminView.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'

function App() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const id = currentUser ? currentUser._id : "";  // Fallback to an empty string if currentUser is null

  return (
    <ProSidebarProvider> {/* Wrap your application with ProSidebarProvider */}
      <BrowserRouter>
        <JoinRoom userId={id} />
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<Signin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path='/sign-up-guest' element={<SignUpGuest />} />
          <Route path="/Admin" element={<ProtectedRoute protectedRoles={["Admin"]}><AdminDashboard adminService={AdminService} /></ProtectedRoute>} />
          <Route path="/Advertiser" element={<ProtectedRoute protectedRoles={["Advertiser"]}><Advertiser advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/AdvertiserCreate" element={<ProtectedRoute protectedRoles={["Advertiser"]}><AdvertiserCreate advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/CreateMuseum" element={<ProtectedRoute protectedRoles={["Tourism Governor"]}><Createmuseum tourismgovernorService={tourismgovernorService} /></ProtectedRoute>} />
          <Route path="/AdvertiserRead" element={<ProtectedRoute protectedRoles={["Advertiser"]}><AdvertiserRead advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/AdvertiserUpdate" element={<ProtectedRoute protectedRoles={["Advertiser"]}><AdvertiserUpdate advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/Advertiserview" element={<ProtectedRoute protectedRoles={["Advertiser"]}><Advertiserview advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/TouristDashboard" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristDashboard touristService={touristService} /></ProtectedRoute>} />
          <Route path="/Guest" element={<ProtectedRoute protectedRoles={["Tourist"]}><Guest touristService={touristService} /></ProtectedRoute>} />
          <Route path="/CreateItinerary" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><Tourguide Tourguideservice={Tourguideservice} ActivityService={ActivityService} /></ProtectedRoute>} />
          <Route path="/TourguideCreate" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><TourguideCreate /></ProtectedRoute>} />
          <Route path="/TourguideRead" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><TourguideRead /></ProtectedRoute>} />
          <Route path="/Manageusers" element={<ProtectedRoute protectedRoles={["Admin"]}><ManageUsers /></ProtectedRoute>} />
          <Route path="/touristProducts" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristProducts ProductService={ProductService} /></ProtectedRoute>} />
          <Route path="/PurchasedProduct" element={<ProtectedRoute protectedRoles={["Tourist"]}><PurchasedProduct touristService={touristService} /></ProtectedRoute>} />
          <Route path="/sellerAddProduct" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerAddProduct SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/SellerProducts" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerProducts ProductService={ProductService} /></ProtectedRoute>} />
          <Route path="/sellerEditProduct/:productId" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerEditProduct SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/SellerProfile" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerProfile SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/SellerCreate" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerCreate SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/SellerRead" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerRead SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/SellerUpdate" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerUpdate SellerService={SellerService} /></ProtectedRoute>} />
          <Route path="/TouristRead" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristRead touristService={touristService} /></ProtectedRoute>} />
          <Route path="/view-itineraries" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><ViewItineraries Tourguideservice={Tourguideservice} /></ProtectedRoute>} />
          <Route path="/Tourguiderevenue" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><TourGuideRevenue Tourguideservice={Tourguideservice} /></ProtectedRoute>} />
          <Route path="/Advertiserrevenue" element={<ProtectedRoute protectedRoles={["Advertiser"]}><AdvertiserRevenue advertiserService={advertiserService} /></ProtectedRoute>} />
          {/* <Route path="/sellerEditProduct" element={<SellerEditProduct SellerService ={SellerService}/>}/> */}
          <Route path="/edit-itinerary/:id" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><EditItinerary Tourguideservice={Tourguideservice} /></ProtectedRoute>} />
          <Route path="/CreateAdmin" element={<ProtectedRoute protectedRoles={["Admin"]}><CreateAdmin /></ProtectedRoute>} />
          <Route path="/Managegoverners" element={<ProtectedRoute protectedRoles={["Admin"]}><ManageGovernors AdminService={AdminService} /></ProtectedRoute>} />
          <Route path="/add-place" element={<ProtectedRoute protectedRoles={["Tourism Governor"]}><AddPlace tourismgovernorService={tourismgovernorService} /></ProtectedRoute>} />
          <Route path="/museums" element={<ProtectedRoute protectedRoles={["Tourism Governor"]}><Museums tourismgovernorService={tourismgovernorService} /></ProtectedRoute>} />
          <Route path="/historical-places" element={<ProtectedRoute protectedRoles={["Tourism Governor"]}><HistoricalPlaces tourismgovernorService={tourismgovernorService} /></ProtectedRoute>} />
          <Route path="/Createactivity" element={<ProtectedRoute protectedRoles={["Advertiser"]}><CreateActivity advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/Manageactivities" element={<ProtectedRoute protectedRoles={["Advertiser"]}><ManageActivities advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/Createtransportation" element={<ProtectedRoute protectedRoles={["Advertiser"]}><Createtransportation advertiserService={advertiserService} /></ProtectedRoute>} />
          <Route path="/AdvertiserHome" element={<ProtectedRoute protectedRoles={["Advertiser"]}><AdvertiserHome /></ProtectedRoute>} />
          {/* <Route path="/Products" element={<Products ProductsService ={ProductService}/>}/> */}
          <Route path="/Viewbookmarks" element={<ProtectedRoute protectedRoles={["Tourist"]}><ViewBookmarks touristService={touristService} /></ProtectedRoute>} />
          <Route path="/Touristupdate" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristUpdate touristService={touristService} /></ProtectedRoute>} />
          <Route path="/TouristHome" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristHome bookingService={bookingService} /></ProtectedRoute>} />
          <Route path="/SellerHome" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerHome /></ProtectedRoute>} />
          <Route path="/TourismgovernerHome" element={<ProtectedRoute protectedRoles={["Tourism Governor"]}><TourismgovernerHome /></ProtectedRoute>} />
          <Route path="/TourguideUpdate" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><TourguideUpdate Tourguideservice={Tourguideservice} /></ProtectedRoute>} />
          <Route path="/TouristComplaint" element={<ProtectedRoute protectedRoles={["Tourist"]}><TouristComplaint /></ProtectedRoute>} />
          <Route path='/AdminProducts' element={<ProtectedRoute protectedRoles={["Admin"]}><AdminProducts ProductService={ProductService} /></ProtectedRoute>} />
          <Route path="/AdminRead" element={<ProtectedRoute protectedRoles={["Admin"]}><AdminRead adminService={AdminService} /></ProtectedRoute>} />
          <Route path='/AdminViewItineraries' element={<ProtectedRoute protectedRoles={["Admin"]}><AdminViewItineraries AdminService={AdminService} /></ProtectedRoute>} />
          <Route path='/Adminrevenue' element={<ProtectedRoute protectedRoles={["Admin"]}><AdminRevenue AdminService={AdminService} /></ProtectedRoute>} />
          <Route path='/AdminViewActivities' element={<ProtectedRoute protectedRoles={["Admin"]}><AdminViewActivities AdminService={AdminService} /></ProtectedRoute>} />
          <Route path='/AdminArchivedProducts' element={<ProtectedRoute protectedRoles={["Admin"]}><AdminArchivedProducts /></ProtectedRoute>} />
          <Route path="/ComplaintDetails/:complaintId" element={<ProtectedRoute protectedRoles={["Admin"]}><ComplaintDetails AdminService={AdminService} /></ProtectedRoute>} />
          <Route path="/OrderDetails/:orderId" element={<ProtectedRoute protectedRoles={['Tourist']}><OrderDetails touristService={touristService} /></ProtectedRoute>}/>
          <Route path="/ViewOrders" element={<ProtectedRoute protectedRoles={["Tourist"]}><ViewOrders touristService={touristService} /></ProtectedRoute>}/>
          <Route path="/AdminViewUserStatistics" element={<ProtectedRoute protectedRoles={["Admin"]}> <AdminViewUserStatistics AdminService={AdminService}/></ProtectedRoute>}/>          <Route path="/TourguideViewTouristStatistics" element={<ProtectedRoute protectedRoles={["Tour Guide"]}><TourguideViewTouristStatistics  Tourguideservice={Tourguideservice}/></ProtectedRoute>} />          <Route path="/MyWishList" element={<ProtectedRoute protectedRoles={["Tourist"]}><MyWishList touristService={touristService} /></ProtectedRoute>} />
          <Route path="/Cart" element={<ProtectedRoute protectedRoles={["Tourist"]}><Cart touristService={touristService} /></ProtectedRoute>} />
          {/* <Route path="/Cart" element={<Cart Cart={touristService}/>}/> */}
          <Route path="/myAddress" element={<ProtectedRoute protectedRoles={["Tourist"]}><MyAddress touristService={touristService} /></ProtectedRoute>} />
          <Route path="/Createaddress" element={<ProtectedRoute protectedRoles={["Tourist"]}><CreateAddress touristService={touristService} /></ProtectedRoute>} />
          <Route path="/sellerrevenue" element={<ProtectedRoute protectedRoles={["Seller"]}><SellerRevenue SellerService={SellerService} /></ProtectedRoute>} />
          <Route path='/CreatePromo' element={<ProtectedRoute protectedRoles={["Admin"]}><CreatePromoCode adminService={AdminService} /></ProtectedRoute>}/>

          <Route path="/ArchiveProduct" element={<ArchiveProduct />} />
          <Route path="/Bookflight" element={<Bookflight bookingService={bookingService} />} />  .....
          <Route path="/Tourguidehomepage" element={<Tourguidehomepage />} />
          <Route path="/Bookhotel" element={<Bookhotel bookingService={bookingService} />} />
          <Route path="/Manageactivitycategories" element={<ManageActivityCategories />} />
          <Route path="/Managepreferencetags" element={<ManagePreferenceTags />} />
          <Route path="/Checkout" element={<Elements stripe={stripePromise}><CheckoutForm PaymentService={PaymentService} /></Elements>} />
          <Route path="/Viewtransportation" element={<Viewtransportation touristService={touristService} />} />
          <Route path="/BookActivity" element={<BookActivityPage touristService={touristService} PaymentService={PaymentService} />} />
          <Route path="/BookItinerary" element={<BookItinerary touristService={touristService} PaymentService={PaymentService} />} />
          <Route path="/GetHistory" element={<AttendedHistoryPage touristService={touristService} />} />
          <Route path="/rateAndCommentItinerary" element={<RateAndCommentPage touristService={touristService} />} />
          <Route path="/rateAndCommentActivity" element={<RateAndCommentPageAC touristService={touristService} />} />
          <Route path="/Travelerdetails" element={<Travelerdetails bookingService={bookingService} />} />          <Route path="/ManageComplaints" element={<ManageComplaints AdminService={AdminService} />} />
          <Route path="/Booktransportation" element={<Booktransportation touristService={touristService} />} />
          <Route path="/GetBookings" element={<BookingsPage touristService={touristService} PaymentService={PaymentService} />} />
          <Route path="/ChangePassword" element={<ChangePassword userService={userService} />} />
          <Route path="/activity/:id" element={<ActivityPage ActivityService={ActivityService} />} />
          <Route path="/itinerary/:id" element={<TourGuidePage TourguideService={TourguideService} />} />
          <Route path="/museum/:id" element={<MuseumPage tourismGovernorService={tourismGovernorService} />} />
          <Route path="/historicalPlace/:id" element={<HistoricalPlacePage tourismGovernorService={tourismGovernorService} />} />
          <Route path="/Booktransportation" element={<Booktransportation touristService={touristService} />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/ComplaintsList" element={<ComplaintsList />} />
          <Route path="/rateAndCommentTourguide" element={<RateAndCommentTourGuidePage touristService={touristService} />} />
          <Route path='/TouristChoosePreferences' element={<TouristChoosePreferences touristService={touristService} />} />
          <Route path='/TourismGovernorRead' element={<TourismGovernorRead tourismgovernorService={tourismgovernorService} />} />
          <Route path='/PurchasedProducts' element={<PurchasedProduct touristService={touristService} />} />
          <Route path="/PayCart" element={<PayCart touristService={touristService} PaymentService={PaymentService}/>} />
          <Route path='/CheckoutOrder' element={<ProtectedRoute protectedRoles={["Tourist"]}> <Elements stripe={stripePromise}><CheckoutFormOrder PaymentService={PaymentService} /></Elements></ProtectedRoute>} />
          <Route path="/ForgotPassword" element={<ForgotPassword userService={userService} />}/>
          <Route path="/VerifyOTP" element={<VerifyOTP userService={userService} />}/>
          <Route path="/ResetPassword" element={<ResetPassword userService={userService} />}/>
          <Route path='/AdvertiserViewTouristStatistics' element={<ProtectedRoute protectedRoles={["Advertiser"]}> <AdvertiserViewTouristStatistics advertiserService={advertiserService}></AdvertiserViewTouristStatistics></ProtectedRoute>}/>
        
        <Route path='/AdminManage' element={<ProtectedRoute protectedRoles={['Admin']}><AdminManage adminService={AdminService}></AdminManage></ProtectedRoute>}/>
        <Route path='/AdminView' element={<ProtectedRoute protectedRoles={['Admin']}><AdminView adminService={AdminService}></AdminView></ProtectedRoute>}/>
        <Route path='/AdminCreate' element={<ProtectedRoute protectedRoles={['Admin']}><AdminCreate adminService={AdminService}></AdminCreate></ProtectedRoute>}/>

          <Route path="/PaymentSuccess" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </ProSidebarProvider>
  );
}

export default App;
