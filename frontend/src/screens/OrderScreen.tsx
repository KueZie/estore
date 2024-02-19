import React, { useEffect } from 'react'
import { Col, Row, Image, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useParams } from 'react-router'

import {
  useGetOrderDetailsByIdQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation
} from '../slices/ordersApiSlice'
import {
  usePayPalScriptReducer,
  PayPalButtons,
  SCRIPT_LOADING_STATE
} from '@paypal/react-paypal-js'

import {
  CreateOrderData,
  OnApproveData,
  CreateOrderActions,
  OnApproveActions,
  OrderResponseBody
} from '@paypal/paypal-js'
import { Order } from '../types'
import { toast } from 'react-toastify'

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, isLoading, error } = useGetOrderDetailsByIdQuery(orderId ?? '', { skip: !orderId })

  const { data: paypal, isLoading: isClientIdLoading, error: errorClientId } = useGetPaypalClientIdQuery()
  const [payOrder, { isLoading: loadingPayOrder }] = usePayOrderMutation()

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    if (actions.order) {
      actions.order.capture().then((details: OrderResponseBody) => {
        console.log('Transaction completed by ' + (details.payer.name?.given_name ?? 'Unknown'))
        // Call server to save the transaction
        payOrder({ orderId: orderId as string, details })
        toast.success('Order paid successfully.')
      })
    } else {
      console.error('Order not found')
      throw new Error('Order not found')
    }
  }

  const onApproveTest = async () => {
    await payOrder({
      orderId: orderId as string,
      details: {
        id: '',
        status: 'COMPLETED',
        links: [],
        payer: {},
        create_time: '',
        update_time: '',
        intent: 'AUTHORIZE',
        purchase_units: []
      }
    })
    toast.success('Order paid successfully.')
  }


  const createOrder = async (data: CreateOrderData, actions: CreateOrderActions) => {
    if (!order) throw new Error('Order not found')

    const orderId = await actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (order as Order).totalPrice
          }
        }
      ]
    })
    return orderId
  }



  useEffect(() => {
    console.log('paypal.clientId', paypal?.clientId)
    if (!errorClientId && !isClientIdLoading && paypal?.clientId) {
      const loadPaypalScript = async () => paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': paypal?.clientId,
          'currency': 'USD'
        }
      }) // Set the PayPal client id
      paypalDispatch({ type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING }) // Set the loading status to pending

      // If we have an order and the order is not payed, load the PayPal script
      if (order && !order.isPaid) {
        if (!window.paypal) { // If the PayPal script is not loaded, load it
          loadPaypalScript()
        }
      }
    }
    if (errorClientId) {
      console.error(errorClientId)
      toast.error('Failed to load PayPal script')
    }
  }, [paypal, isClientIdLoading, errorClientId, paypalDispatch])

  return (
    <>
      {isLoading ? <p>Loading...</p> : error ? <p>Error: Failed to fetch order</p> : order === undefined ? <p>Order not found</p> : (
        <>
          <h2>Order {orderId}</h2>
          <Row>
            <Col md={8}>
              <Row>
                <h2>Shipping</h2>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress?.address ?? ''}, {order.shippingAddress?.city ?? ''}{' '}
                  {order.shippingAddress?.postalCode ?? ''}, {order.shippingAddress?.country ?? ''}
                </p>
                {order.isDelivered ? <p>Delivered on {order.deliveredAt}</p> : <p className='text-info'>Not delivered</p>}
              </Row>
              <Row>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid ? <p>Paid on {order.paidAt}</p> : <p className='text-info'>Not paid</p>}
              </Row>
              <ListGroup>
                <h2>Order Items</h2>
                {order.orderItems?.length === 0 ? <p>Order is empty</p> : (
                  <>
                    {order.orderItems?.map((item: { name: string, productId: string, image: string, price: number, qty: number }, index) => (
                      <ListGroup.Item key={index}>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Row>
                            <Col>
                              <p>{item.name}</p>
                            </Col>
                            <Col>
                              <p>
                                {item.qty} x ${item.price} = ${item.qty * item.price}
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </ListGroup.Item>
                    ))}
                  </>
                )}
              </ListGroup>
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <h2>Order Summary</h2>
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal</Col>
                    <Col>${order?.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order?.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order?.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order?.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    style={{ marginBottom: '10px' }}
                    onClick={onApproveTest}
                  >
                    Test Pay Order
                  </Button>
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    ></PayPalButtons>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>)
      }
    </>
  )
}

export default OrderScreen