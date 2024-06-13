import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style.css"

const Blog = ({ title, subtitle, content, imageUrl, link, isImageLeft }) => {
  return (
    <div className="row items">
      {isImageLeft ? (
        <>
          <div className="col-sm-6 blog-img">
            <img
              src={imageUrl}
              alt=""
              width="800"
              height="300"
            />
          </div>
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">{title}</h4>
            <h5>{subtitle}</h5>
            <p><i><br/>{content}<br/></i></p>
            <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary-clr learn-more-button">Learn More</a>
          </div>
        </>
      ) : (
        <>
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">{title}</h4>
            <h5>{subtitle}</h5>
            <p><i><br/>{content}<br/></i></p>
            <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-primary-clr learn-more-button">Learn More</a>
          </div>
          <div className="col-sm-6 blog-img">
            <img
              src={imageUrl}
              alt=""
              width="800"
              height="300"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
