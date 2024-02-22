import React from 'react'
import { useGetUsersQuery } from '../slices/usersApiSlice'
import { Button, Table } from 'react-bootstrap'
import Loader from '../components/Loader'
import { LinkContainer } from 'react-router-bootstrap'
import { FaCheck, FaEdit } from 'react-icons/fa'

const UsersListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()

  console.log(users)

  return (
    <>
      <div>UsersListScreen</div>
      {isLoading ? <Loader /> : 
            error ? <p>{error.toString()}</p> : 
      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
            {users?.map((user: any) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><LinkContainer to={`mailto:${user.email}`}><p>{user.email}</p></LinkContainer></td>
              <td>
                <FaCheck color={user.isAdmin ? 'green' : 'red'} />
              </td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button className='btn-sm' variant='light'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
              </td>
            </tr>))}
        </tbody>
      </Table>
          }
    </>
  )
}

export default UsersListScreen