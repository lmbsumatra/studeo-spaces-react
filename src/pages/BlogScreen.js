import Footer from "../components/Footer";
const Blog = () => {
  return (
    <div>
      <section className="container items">
        <h1 className="fs-700 ff-serif text-center">Blogs</h1>

        <div className="row items">
          <div className="col-sm-6 blog-img">
            <img
              src="./assets/images/img_1.jpg"
              alt=""
              width="100"
              height="100"
            />
          </div>
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">Blogs</h4>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
              distinctio. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Fugiat, distinctio.
            </p>
            <button className="btn btn-primary-clr">Learn More</button>
          </div>
        </div>

        <hr />

        <div className="row items">
          <div className="col-sm-6 blog-details">
            <h4 className="fs-500 ff-serif">Blogs</h4>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugiat,
              distinctio. Lorem ipsum dolor, sit amet consectetur adipisicing
              elit. Fugiat, distinctio.
            </p>
            <button className="btn btn-primary-clr">Learn More</button>
          </div>
          <div className="col-sm-6 blog-img">
            <img
              src="./assets/images/img_1.jpg"
              alt=""
              width="100"
              height="100"
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Blog;
