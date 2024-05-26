import React, { useEffect } from "react";

const DesignSystem = () => {
  useEffect(() => {
    document.title = "Design System";
  }, []);

  return (
    <div className="">
      <div className="container">
        <h1>Design System</h1>

        <div class="bg-accent text-dark">Light blue bg with dark text</div>
        <div class="bg-white text-dark">white bg with dark text</div>
        <div class="example text-white">
          Light blue bg with a 20% alpha and white text
        </div>

        <section id="colors">
          <h2 className="numbered-title">
            <span className="text-light">01</span> Colors
          </h2>
          <div className="flex text-white">
            <div className="bg-dark text-white">
              <div
                style={{ padding: "3rem 1rem 1rem", border: "1px solid white" }}
              >
                #080D17
              </div>
              <p>
                <span className="text-accent">RGB</span> 11, 13, 12
              </p>
              <p>
                <span className="text-accent">HSL</span> 230, 35%, 7%
              </p>
            </div>

            <div>
              <div
                style={{ padding: "3rem 1rem 1rem", border: "1px solid white" }}
                className="bg-accent text-dark"
              >
                #080D17
              </div>
              <p>
                <span className="text-accent">RGB</span> 11, 13, 12
              </p>
              <p>
                <span className="text-accent">HSL</span> 230, 35%, 7%
              </p>
            </div>

            <div>
              <div
                style={{ padding: "3rem 1rem 1rem", border: "1px solid white" }}
                className="bg-white text-dark"
              >
                #080D17
              </div>
              <p>
                <span className="text-accent">RGB</span> 11, 13, 12
              </p>
              <p>
                <span className="text-accent">HSL</span> 230, 35%, 7%
              </p>
            </div>
          </div>
        </section>

        <section id="typography" style={{ margin: "4rem 0" }}>
          <h2 className="numbered-title">
            <span className="text-light">02</span> Typography
          </h2>
          <div className="flex">
            <div
              className="flow"
              style={{ flexBasis: "100%", "--flow-space": "4rem" }}
            >
              <div>
                <p className="text-accent">
                  Heading 1 - Bellefair Regular - 150px
                </p>
                <p className="fs-900 ff-serif uppercase">Earth</p>
              </div>
              <div>
                <p className="text-accent">
                  Heading 2 - Bellefair Regular - 100px
                </p>
                <p className="fs-800 ff-serif uppercase">Venus</p>
              </div>
              <div>
                <p className="text-accent">
                  Heading 3 - Bellefair Regular - 56px
                </p>
                <p className="fs-700 ff-serif uppercase">Jupiter & Saturn</p>
              </div>
              <div>
                <p className="text-accent">
                  Heading 4 - Bellefair Regular - 32px
                </p>
                <p className="fs-600 ff-serif uppercase">
                  Uranus, Neptune, & Pluto
                </p>
              </div>
              <div>
                <p className="text-accent">
                  Heading 5 - Barlow Condensed Regular - 28px - 4.75 Character
                  Space
                </p>
                <p className="fs-500 ff-sans-cond text-accent letter-spacing-1 uppercase">
                  So, you want to travel space
                </p>
              </div>
            </div>

            <div
              className="flow"
              style={{ flexBasis: "100%", flowSpace: "4rem" }}
            >
              <div>
                <p className="text-accent">
                  Subheading 1 - Bellefair Regular - 28px
                </p>
                <p className="fs-500 ff-serif uppercase">384,400 km</p>
              </div>
              <div>
                <p className="text-accent">
                  Subheading 2 - Barlow Condensed Regular - 14px - 2.35
                  Character Space
                </p>
                <p className="fs-200 ff-sans-cond uppercase letter-spacing-3">
                  Ave. Distance
                </p>
              </div>
              <div>
                <p className="text-accent">
                  Nav Text - Barlow Condensed Regular - 16px - 2.7 Character
                  Space
                </p>
                <p className="fs-300 ff-sans-cond uppercase letter-spacing-2">
                  Europa
                </p>
              </div>
              <div>
                <p className="text-accent">Body Text</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Repellendus unde odio, esse eaque natus eum quaerat maxime eos
                  qui possimus similique ex laborum, quidem excepturi amet quia
                  numquam, libero ducimus quibusdam corporis hic quam. Dolor
                  veritatis aperiam a? Voluptates fuga sequi, distinctio aliquid
                  animi qui soluta, aperiam, quas odio ducimus minima possimus
                  eos non praesentium debitis. Quis distinctio sit minima facere
                  placeat corrupti in. Perferendis quis culpa soluta amet,
                  corrupti quod natus voluptatum quam officiis vel, totam
                  maiores illo? Veniam labore, dolore ab distinctio porro
                  architecto non autem? Perspiciatis sunt eligendi quia aut
                  aliquid totam eius harum atque minus omnis.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flow" id="interactive-elements">
          <h2 className="numbered-title">
            <span>03</span> Interactive Elements
          </h2>

          {/* <!-- navigation --> */}
          <div>
            <nav>
              <ul
                className="primary-navigation underline-indicators flex"
                style={{ "--gap": "4rem" }}
              >
                <li className="active">
                  <a href="#" className="uppercase text-white letter-spacing-2">
                    <span>01</span>Active
                  </a>
                </li>
                <li>
                  <a href="#" className="uppercase text-white letter-spacing-2">
                    <span>02</span>Hovered
                  </a>
                </li>
                <li>
                  <a href="#" className="uppercase text-white letter-spacing-2">
                    <span>03</span>Idle
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex">
            <div>
              {/* <!--  explore button --> */}
              <a
                href="#"
                className="large-button uppercase ff-serif fs-600 text-dark bg-white"
              >
                Explore
              </a>
            </div>

            <div
              className="flow"
              style={{ marginBottom: "50vh", "--flow-space": "4rem" }}
            >
              {/* <!-- tabs --> */}
              <div className="tab-list underline-indicators flex">
                <button
                  aria-selected="true"
                  className="uppercase text-accent bg-dark ff-sans-cond letter-spacing-2"
                >
                  Moon
                </button>
                <button
                  aria-selected="false"
                  className="uppercase text-accent bg-dark ff-sans-cond letter-spacing-2"
                >
                  Mars
                </button>
                <button
                  aria-selected="false"
                  className="uppercase text-accent bg-dark ff-sans-cond letter-spacing-2"
                >
                  Europa
                </button>
              </div>

              {/* <!-- dots --> */}
              <div className="dot-indicators flex">
                <button aria-selected="true">
                  <span className="sr-only">Slide Title</span>
                </button>
                <button aria-selected="false">
                  <span className="sr-only">Slide Title</span>
                </button>
                <button aria-selected="false">
                  <span className="sr-only">Slide Title</span>
                </button>
              </div>

              {/* <!-- numbers --> */}
              <div class="number-indicators flex">
                <button aria-selected="true">1</button>
                <button aria-selected="false">2</button>
                <button aria-selected="false">3</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem;
