import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import Badge from 'react-bootstrap/esm/Badge';
import CartScreen from './Screens/CartScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogInScreen from './Screens/LogInScreen';
import SignUpScreen from './Screens/SignUpScreen';
import ShippingScreen from './Screens/ShippingScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderDetails from './Screens/OrderDetails';
import OrderHistory from './Screens/OrderHistory';
import ProfileScreen from './Screens/ProfileScreen';
import axios from 'axios';
import { getError } from './utils';
import { ListGroup } from 'react-bootstrap';
import SearchBox from './components/SearchBox';
import SearchScreen from './Screens/SearchScreen';
import AdminRoutes from './components/AdminRoutes';
import DashboardScreen from './Screens/DashboardScreen';
import AdminProductScreen from './Screens/AdminProductScreen';
import AdminProductEditScreen from './Screens/AdminProductEditScreen';
import AdminCreateProduct from './Screens/AdminCreateProduct';
import AdminUserList from './Screens/AdminUserList';
import AdminUserEditScreen from './Screens/AdminUserEditScreen';
import SellerRoutes from './components/SellerRoutes';
import SellerOrderDetails from './Screens/SellerOrderDetails';
import SellerAddCategoryScreen from './Screens/SellerAddCategoryScreen';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const { userInfo } = state;

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
  };
  return (
    <BrowserRouter>
      <div>
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>E-Mart</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll">
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: '100px' }}
                  navbarScroll
                >
                  <Nav>
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </Nav>
                  <Nav>
                    <Link to="/cart" className="nav-link">
                      Cart
                      {cart.cartItems.length > 0 && (
                        <Badge pill bg="danger">
                          {cart.cartItems.length}
                        </Badge>
                      )}
                    </Link>
                  </Nav>
                  <Nav.Link to="" disabled>
                    Welcome
                  </Nav.Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Nav>
                      <Link to="/login" className="nav-link">
                        LogIn
                      </Link>
                    </Nav>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin Menu" id="basic-nav-dropdown">
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>User Details</NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Divider />
                      <Link to="/admin/dashboard" className="dropdown-item">
                        Dashboard
                      </Link>
                    </NavDropdown>
                  )}
                  {userInfo && userInfo.isSeller && (
                    <NavDropdown title="Inventory Menu" id="basic-nav-dropdown">
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products Details</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link to="/admin/orderdetails" className="dropdown-item">
                        Order Details
                      </Link>
                    </NavDropdown>
                  )}
                </Nav>
                <SearchBox />
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div
            className={
              sidebarIsOpen
                ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
                : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
            }
          >
            <ListGroup className=" p-3">
              <ListGroup.Item>
                <strong>
                  <h4>Categories</h4>
                </strong>
              </ListGroup.Item>

              {categories.map((category) => (
                <ListGroup.Item key={category}>
                  <LinkContainer
                    to={`/search?category=${category}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>{category}</Nav.Link>
                  </LinkContainer>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:_id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/login" element={<LogInScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoutes>
                    <DashboardScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/user/:userId"
                element={
                  <AdminRoutes>
                    <AdminUserEditScreen />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoutes>
                    <AdminUserList />
                  </AdminRoutes>
                }
              ></Route>
              <Route
                path="/admin/products/addcategory"
                element={
                  <SellerRoutes>
                    <SellerAddCategoryScreen />
                  </SellerRoutes>
                }
              ></Route>
              <Route
                path="/admin/orderdetails"
                element={
                  <SellerRoutes>
                    <SellerOrderDetails />
                  </SellerRoutes>
                }
              ></Route>
              <Route
                path="/admin/products/createproduct"
                element={
                  <SellerRoutes>
                    <AdminCreateProduct />
                  </SellerRoutes>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <SellerRoutes>
                    <AdminProductScreen />
                  </SellerRoutes>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <SellerRoutes>
                    <AdminProductEditScreen />
                  </SellerRoutes>
                }
              ></Route>

              <Route
                path="/orderdetails/:order_id"
                element={<OrderDetails />}
              />
            </Routes>
          </Container>
        </main>
        <footer>
          <hr />
          Copyright 2022 &#174;
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
