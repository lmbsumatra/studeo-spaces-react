import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../components/blogs/style.css"
import Footer from "../components/Footer";
import FlowStateImage from '../assets/images/blogs/FlowState.png';
import KeyBenefitsImage from  '../assets/images/blogs/KeyBenefits.png';

const Blog = () => {
  return (
    <div>
      <section className="container items">
        <h1 className="fs-700 ff-serif text-center">Blogs</h1>
        
        <div className="row items">
          <div className="col-sm-6 blog-img">
            <img
              src={FlowStateImage}
              alt="Flow State"
              width="800"
              height="300"
            />
          </div>
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">Study Flow State</h4>
            <h5>
              A Beginner’s Guide To Understanding Flow State In Studying
            </h5>
            <p><i><br/> delves into the intricacies of this powerful psychological state, where individuals experience heightened focus and immersion in their tasks, free from distractions and time awareness. Through an engaging exploration of what characterizes the flow state and practical tips on how to achieve it, the article offers invaluable insights for students and lifelong learners alike.<br/></i></p>
            <a href="https://studeospaces.com/a-beginners-guide-to-understanding-flow-state-in-studying/?fbclid=IwZXh0bgNhZW0CMTEAAR0AeGvV21ozBYMzQzk14KXUl3D5fqoazjOQTuQfQzRH7-sb7dsm_G3OluM_aem_Ab2jFYB2N8LcnddO2-9iZOXQbgJzaWFpWdA8c9gnpGNF2AwhlYVXDcc-ud6_oZ6ctoQcXcjUdvPpLraLl-0ktJ3:" target="_blank" rel="noopener noreferrer" className="btn btn-primary-clr learn-more-button">Learn More</a>
          </div>
        </div>
        
        <hr />
        
        <div className="row items">
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">Study Hub in Manila</h4>
            <h5>
              Key Benefits of Joining a Study Hub in Manila
              <br/>
            </h5>
            <p><i><br/>Have you ever wondered how you can optimize your study habits and significantly enhance your academic performance? In an era of ubiquitous distractions, finding a space that fosters concentration and productivity is more critical than ever. For students in Manila, study hubs are becoming increasingly popular as a solution to these challenges. This article explores the key benefits of joining a study hub in Manila and how it can transform your study sessions from ordinary to extraordinary.</i></p>
            <a href="https://studeospaces.com/key-benefits-of-joining-a-study-hub-in-manila/" target="_blank" rel="noopener noreferrer" className="btn btn-primary-clr learn-more-button">Learn More</a>
          </div>
          <div className="col-sm-6 blog-img">
            <img
              src={KeyBenefitsImage}
              alt="Key Benefits"
              width="800"
              height="300"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
