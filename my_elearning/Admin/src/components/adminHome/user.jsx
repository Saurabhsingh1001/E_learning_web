import { useEffect, useState, useRef } from 'react';
import DashSidebar from './DashSidebar';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
const UserProfile = () => {
  const [users, setUsers] = useState([]);
  
  const [limit, setLimit] =useState(2);
  const [pageCount, setPageCount] = useState();
  const currentPage = useRef();
  useEffect(() => {
    //fetchData();
    currentPage.current = 1
    getPaginatedUsers();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/userList');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };
 
  const onConfirmDelete = async (userId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this user?');
 
    if (shouldDelete) {
      try {
        await axios.delete(`http://localhost:8000/deleteUser/${userId}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handlePageClick = async (e)=>{
    console.log(e);
    currentPage.current = e.selected + 1;
    getPaginatedUsers();
    
  }

  // const getPaginatedUsers = async () =>{
  //   try {
  //     const response = await axios.get(`http://localhost:8000/paginatedUsers?page=${currentPage.current}&limit=${limit}`);
  //     setUsers(response.result);
  //     console.log(response.result)
  //     setPageCount(response.pageCount)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  function getPaginatedUsers(){
    fetch(`http://localhost:8000/paginatedUsers?page=${currentPage.current}&limit=${limit}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        setPageCount(data.pageCount);
        setUsers(data.result)
        
       
      });

  }
 
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center" style={{backgroundColor:""}}>
      <DashSidebar />
      <div className=' bg-white rounded p-5'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><button className="bg-slate-400" onClick={() => onConfirmDelete(user._id)} style={{borderRadius:"5px",fontSize:"18px",padding:"3px",color:"white"}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          containerClassName="pagination justify-content-center"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
          forcePage={currentPage.current-1}
        />
      </div>
    </div>
  );
}
 
export default UserProfile;