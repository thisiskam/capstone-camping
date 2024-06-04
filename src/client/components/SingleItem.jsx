// import stuff

import { useNavigate } from "react-router-dom";

// the main page stuff
export default function SingleItem() {
  const navigate = useNavigate()
  console.log("hello world!");
  return (
    <>
      <div className="App">
        <div className="home-content">
          <div class="left-container" id="left-container-single-item" >
            <h5 className="item-category"><b>Category:</b> Backpacks</h5>
            <div className="review-overview">
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>12</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>9</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>3</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>1</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>0</h6>
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/')}>Back to all items</button>
          </div>
          <div className="center-container" id="center-container-single-item">
              <h2>Kelty Backpack</h2>
              <div className="item-description">
                <h4>Description</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tristique tempus mauris, et placerat tellus mattis ac. Duis erat purus, pellentesque in lectus vel, fermentum gravida est. Donec metus est, viverra a tristique rhoncus, porta vel purus. Curabitur commodo aliquet orci, sed vehicula ligula sagittis a. Morbi neque dolor, egestas id tortor ut, rutrum convallis leo. Aliquam erat volutpat. Vestibulum ornare ante quis mauris auctor laoreet. Praesent eget tellus augue. Donec egestas arcu id tortor egestas auctor. Pellentesque a dui nec mi commodo varius. Nullam quis arcu orci. Vivamus luctus odio quis vestibulum iaculis. Aenean eu ornare magna, cursus dapibus.</p>
              </div>
              <div className="item-reviews">
                <h4>Reviews</h4>
                  <div className="review">
                    <div className="first-line-review">
                      <h6>username</h6>
                      <p>4</p>
                      <img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/>
                    </div>
                    <h5>Review Title</h5>
                    <p className="review-p">gittis a. Morbi neque dolor, egestas id tortor ut, rutrum convallis leo. Aliquam erat volutpat. Vestibulum ornare ante quis mauris auctor laoreet. Praesent eget tellus augue. Donec egestas arcu id tortor egestas auct</p>
                    <div className="item-comments">
                      <h5>Comments</h5>
                      <div className="comment">
                        <h6>username</h6>
                        <p>auctor laoreet. Praesent eget tellus augue. Donec</p>
                      </div>
                      <div className="comment">
                        <h6>username</h6>
                        <p>t, consectetur adipiscing elit. Quisque tristique tempus mauris, et placerat tellus mattis ac. Duis erat purus, pellentesque in lectus vel, fermentum gravida est. Donec metus est, viverra a tristique rhoncus, porta vel purus. Curabitur com</p>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
          <div className="right-container">
            <img src="/src/client/assets/backpacks/bp1.png"/>
          </div>
        </div>
      </div>
    </>
  );
}
