import React, { useEffect } from 'react'
import { Button, Col, Form, ListGroup, Row, Image } from 'react-bootstrap'
import { FormContainer } from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useCreateOrderMutation } from '../slices/ordersApiSlice'
import { CartItem, Order, OrderSubmit } from '../types'
import { resetCart } from '../slices/cartSlice'
import Message from '../components/Message'
import { Link } from 'react-router-dom'

const PlaceOrderScreen = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress, paymentMethod, cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // Dissallow access to this route if shipping address or payment method are not set aka
  // if the user tries to access this route directly via the URL without having been through
  // the previous steps of the checkout process
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const order: OrderSubmit = {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      };
      console.log(`order: ${JSON.stringify(order, null, 2)}`)
      const res = await createOrder(order).unwrap();
      console.log(`res: ${JSON.stringify(res)}`);

      dispatch(resetCart());
      navigate(`/order/${res._id}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1>Place Order</h1>
      {
        cartItems && cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>) : (
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Address: </strong>
                    {shippingAddress.address}, {shippingAddress.city}{' '}
                    {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <strong>Method: </strong>
                  {paymentMethod}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {cartItems.map((item: CartItem, index: number) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.productId}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                
                {error && <ListGroup.Item>
                <Message variant='danger'>{error}</Message>
                </ListGroup.Item>}
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn-block'
                    disabled={cartItems.length === 0}
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        )
      }
    </>
  )
}


export default PlaceOrderScreen