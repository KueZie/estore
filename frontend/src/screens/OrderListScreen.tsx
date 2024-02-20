import React from 'react'
import { Table, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useGetOrdersQuery } from '../slices/ordersApiSlice'
import { Order } from '../types'

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery()

  console.log(orders)

  return (
    <>
      <h2>Order List</h2>
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Total</th>
            <th>Date</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            orders?.map((order: Required<Order>, index: number) => (
              <tr key={index}>
                <td>{order._id}</td>
                <td>{order.user._id}</td>
                <td>{order.user.name}</td>
                <td>${order.totalPrice}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))
          )}
          </tbody>
      </Table>
    </>
  )
}

export default OrderListScreen