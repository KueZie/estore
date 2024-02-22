import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector } from 'react-redux'
import logo from '../assets/logo.png'
import React from 'react'
import { RootState } from '../store'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/authSlice'
import { resetCart } from '../slices/cartSlice'
import { Navigate, useNavigate } from 'react-router'

const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems ?? [])
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)

  const [logoutServerSide] = useLogoutMutation()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      await logoutServerSide().unwrap()
      dispatch(logout()) // Remove user info from state (reset user state)
      dispatch(resetCart()) // Reset cart state

      navigate('/login')
    } catch (err) {
      console.log(`Error: ${JSON.stringify(err)}`)
    }
  }


  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>
              <img
                alt="eCommerce"
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top" />
              eCommerce
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className='ms-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>
                  <FaShoppingCart /> Cart {cartItems.length > 0 && (
                    <Badge pill bg='primary'>
                      {cartItems.length}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              {userInfo ? (<>
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link ><FaUser /> Sign In</Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header