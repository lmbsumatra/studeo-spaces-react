import React from 'react';
import Blog from './Blog';
import FlowStateImage from '../../assets/images/blogs/FlowState.png';
import KeyBenefitsImage from '../../assets/images/blogs/KeyBenefits.png';

const Blogs = () => {
  return (
    <section className="container items">
      <h1 className="fs-700 ff-serif text-center">Blogs</h1>

      <Blog
        title="Study Flow State"
        subtitle="A Beginner’s Guide To Understanding Flow State In Studying"
        content="Delves into the intricacies of this powerful psychological state, where individuals experience heightened focus and immersion in their tasks, free from distractions and time awareness. Through an engaging exploration of what characterizes the flow state and practical tips on how to achieve it, the article offers invaluable insights for students and lifelong learners alike."
        imageUrl={FlowStateImage}
        link="https://studeospaces.com/a-beginners-guide-to-understanding-flow-state-in-studying/?fbclid=IwZXh0bgNhZW0CMTEAAR0AeGvV21ozBYMzQzk14KXUl3D5fqoazjOQTuQfQzRH7-sb7dsm_G3OluM_aem_Ab2jFYB2N8LcnddO2-9iZOXQbgJzaWFpWdA8c9gnpGNF2AwhlYVXDcc-ud6_oZ6ctoQcXcjUdvPpLraLl-0ktJ3:"
        isImageLeft={true}
      />

      <hr />
      <Blog
        title="Study Hub in Manila"
        subtitle="Key Benefits of Joining a Study Hub in Manila"
        content="Have you ever wondered how you can optimize your study habits and significantly enhance your academic performance? In an era of ubiquitous distractions, finding a space that fosters concentration and productivity is more critical than ever. For students in Manila, study hubs are becoming increasingly popular as a solution to these challenges. This article explores the key benefits of joining a study hub in Manila and how it can transform your study sessions from ordinary to extraordinary."
        imageUrl={KeyBenefitsImage}
        link="https://studeospaces.com/key-benefits-of-joining-a-study-hub-in-manila/"
        isImageLeft={false}
      />
    </section>
  );
};

export default Blogs;
