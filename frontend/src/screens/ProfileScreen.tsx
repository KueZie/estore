import React, { useEffect, useMemo, useState } from 'react'
import { Row, Col, Form, Table, Button, ListGroup } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { RootState } from '../store'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { setCredentials } from '../slices/authSlice'
import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useGetUserOrdersQuery } from '../slices/ordersApiSlice'
import { Order } from '../types'
import { FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa'

const ProfileScreen = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state.auth.userInfo)

  const [email, setEmail] = useState(userInfo?.email || '')
  const [name, setName] = useState(userInfo?.name || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { data: orders, isLoading, error } = useGetUserOrdersQuery()

  useEffect(() => {
    if (!userInfo) {
      // Redirect to login if not logged in
      redirect('/login')
    }
  }, [userInfo])

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Dispatch update user action
    dispatch(setCredentials({ ...userInfo, name, email }))
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    }

  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
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
              orders?.map((order: Order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.createdAt}</td>
                  <td>
                    {order.isPaid ? (
                      <FaCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <FaCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))

            )}
          </tbody>
        </Table>
      </Col>
      
          



    </Row>
  )
}

export default ProfileScreen