import React from 'react'
import { useGetUsersQuery } from '../slices/usersApiSlice'
import { Button, Table } from 'react-bootstrap'
import Loader from '../components/Loader'
import { LinkContainer } from 'react-router-bootstrap'
import { FaCheck, FaEdit, FaTrash } from 'react-icons/fa'
import { useDeleteUserMutation } from '../slices/usersApiSlice'
import { toast } from 'react-toastify'

const UsersListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [deleteUser] = useDeleteUserMutation()

  const deleteHandler = async (id: string) => {
    if (!window.confirm('Are you sure?')) {
      return
    }

    try {
      const payload = await deleteUser(id).unwrap()
      toast.success('User deleted')
    } catch (error) {
      toast.error('Error deleting user')
      console.error(error)
    }
  }

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
              <td>
                <Button className='btn-sm' variant='danger' onClick={() => deleteHandler(user._id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>))}
        </tbody>
      </Table>
          }
    </>
  )
}

export default UsersListScreen