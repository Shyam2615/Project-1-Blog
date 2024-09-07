import React, { useEffect, useState } from 'react';
import { fetchBlogs, getBlogById } from '../../api/blogService';
import { FaSearch } from 'react-icons/fa';
import BlogDetails from '../blog/Blogdetails';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const blogsPerPage = 6;

  const fetchUserData = async (blogsData) => {
    const updatedBlogs = await Promise.all(
      blogsData.map(async (blog) => {
        try {
          const response = await fetch(`/api/auth/get-user-by-id/${blog.created_by}`);
          const userData = await response.json();
          console.log(userData);//this log data is comming but not updating in blog
          return {
            ...blog,
            user: {
              username: userData.message.username || 'Unknown', // Ensure there's a fallback for the username
              profile_picture: userData.message.profile_picture || 'default-pic-url' // Provide a fallback image
            }
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
          return {
            ...blog,
            user: { username: 'Unknown', profile_picture: 'default-pic-url' } // Fallback for error cases
          };
        }
      })
    );
    setBlogs(updatedBlogs); // Update state only after fetching all users
    console.log('Updated Blogs with User Data:', updatedBlogs); // Debugging
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const blogsData = await fetchBlogs();
        await fetchUserData(blogsData); // Fetch user data after blogs are loaded
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handleBlogClick = async (id) => {
    try {
      const blogData = await getBlogById(id);
      setSelectedBlog(blogData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBackToBlogs = () => {
    setSelectedBlog(null);
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto flex">
        {/* Left Sidebar for Search and Categories */}
        <div className="w-1/4 pr-1">
          {/* Search Bar */}
          <div className="mb-6 flex flex-row justify-center items-center w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500">
            <input
              type="text"
              placeholder="Search blogs..."
              className="focus:outline-none"
            />
            <button>
              <FaSearch />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 mb-2 pt-2 font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <button className="w-full text-left p-2 text-red-600 font-bold">
                  Technology
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600   font-bold">
                  Health
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600  font-bold">
                  Finance
                </button>
              </li>
              <li>
                <button className="w-full text-left p-2 text-red-600  font-bold">
                  Education
                </button>
              </li>
            </ul>
          </div>

          {/* Top Posts */}
          <div className="mb-6 rounded-lg bg-gray-100 pl-3">
            <h3 className="text-xl text-blue-700 font-semibold mb-2 pt-2">Top Posts</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-red-600 ">Post Title 1</span>
              </li>
              <li>
                <span className="text-red-600 ">Post Title 2</span>
              </li>
              <li>
                <span className="text-red-600 ">Post Title 3</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-3/5">
          {selectedBlog ? (
            <BlogDetails selectedBlog={selectedBlog} handleBackToBlogs={handleBackToBlogs} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {currentBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    onClick={() => handleBlogClick(blog._id)}
                    className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={`data:image/jpeg;base64,${blog.image}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                      <div className="flex items-center m-4 mb-0 justify-between">
                        <div className="flex">
                        <img
                          src={`data:image/jpeg;base64,${blog.user.profile_picture}`}
                          alt={blog.user?.username || 'Unknown'}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <p>{blog.user?.username || 'Unknown'}</p>
                        </div>
                        <div className=''>
                        <p className="text-gray-500 text-sm">
                        <em>Created on: {new Date(blog.created_at).toLocaleDateString()}</em>
                        </p>
                        </div>
                      </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-red-600">{blog.title}</h2>
                      <p className="text-gray-700 mb-4">{blog.description.slice(0, 100)}...</p>
                      
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-3 mb-10 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`px-4 py-2 border-2 border-blue-800 rounded-md hover:bg-blue-900 hover:text-white transition ${
                      currentPage === index + 1 ? 'bg-blue-900 text-white' : 'bg-white text-blue-500'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
