import React from 'react'
import BlogCard from './BlogCard'

const Blogs = () => {
  return (
    <div className='container'>
    <div className="d-flex justify-content-start pt-2">
        <a href="#" className='btn btn-success'>Create</a>
    </div>
    
    <div className='row pt-5'>
        
           <BlogCard />
           <BlogCard />
           <BlogCard />
           <BlogCard />
           <BlogCard />
           <BlogCard />
           <BlogCard />
           <BlogCard />

        </div>
    </div> 


  )
}

export default Blogs
