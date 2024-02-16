import React from 'react'
import { Col, Row, Image } from 'react-bootstrap'
import { useParams } from 'react-router'
import { RootState } from '../store'
import { useSelector } from 'react-redux'
import { CartItem } from '../types'
import { useGetOrderDetailsByIdQuery } from '../slices/ordersApiSlice'

const OrderScreen = () => {
  const { id: orderId } = useParams()

  const { data: order, isLoading, error } = useGetOrderDetailsByIdQuery(orderId ?? '', { skip: !orderId })
  const { shippingAddress, paymentMethod, orderItems, isDelivered, isPayed, payedAt, deliveredAt } = order ?? {}

  console.log(order)

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
                  {shippingAddress?.address ?? ''}, {shippingAddress?.city ?? ''}{' '}
                  {shippingAddress?.postalCode ?? ''}, {shippingAddress?.country ?? ''}
                </p>
                {isDelivered ? <p>Delivered on {order?.deliveredAt}</p> : <p className='text-info'>Not delivered</p>}
              </Row>
              <Row>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {paymentMethod}
                </p>
                {isPayed ? <p>Paid on {order?.payedAt}</p> : <p className='text-info'>Not paid</p>}
              </Row>
              <Row>
                <h2>Order Items</h2>
                {orderItems?.length === 0 ? <p>Order is empty</p> : (
                  <>
                    {orderItems?.map((item: { name: string, productId: string, image: string, price: number, qty: number }) => (
                      <Row key={item.productId}>
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
                      </Row>
                    ))}
                  </>
                )}
              </Row>
            </Col>
            <Col md={4}>
              <h2>Order Summary</h2>
              <Row>
                <Col>Subtotal</Col>
                <Col>${order?.itemsPrice}</Col>
              </Row>
              <Row>
                <Col>Shipping</Col>
                <Col>${order?.shippingPrice}</Col>
              </Row>
              <Row>
                <Col>Tax</Col>
                <Col>${order?.taxPrice}</Col>
              </Row>
              <Row>
                <Col>Total</Col>
                <Col>${order?.totalPrice}</Col>
              </Row>
            </Col>
          </Row>
        </>)}
    </>
  )
}

export default OrderScreen