import React, { Component } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slide from "./Slide";
class ImageSlider extends Component {
  constructor() {
    super();
    this.state = {
      loaded_images: 0,
      index:0
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  componentDidMount(){
    window.addEventListener('resize', this.updateSize);
    this.updateSize()
  }
  updateSize = () => {
    const {touchMove} = this.state
    let width = window.innerWidth
      if(width <= 650 && !touchMove){
        this.setState({
          touchMove:true
        })
      }
      if(width > 650 && touchMove){
        this.setState({
          touchMove:false
        })
      }

  }
  next(val) {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }

  submitLoadingDone = () => {
    const { loaded_images } = this.state;
    const {list} = this.props
    let loaded = loaded_images + 1
     this.setState({
      loaded_images:loaded
     })
     console.log(loaded, list.length)
    this.props.loadingStatus(loaded === list.length)
  };

  subtractLoaded = () => {
    const { loaded_images } = this.state;
    this.setState({
      loaded_images:loaded_images - 1
     })
  }


  afterChange = (index) => {
      this.setState({
        index
      })
  }

  render() {
    const {
      to_show,
      to_scroll,
      dots,
      infinite,
      list,
      property_name,
      className,
      limit,
      loadingStatus,
      loader,
      handleActions,
      rerender
    } = this.props;
    const {index, touchMove} = this.state
    var settings = {
      dots: dots,
      infinite: infinite,
      speed: 300,
      slidesToShow: to_show,
      slidesToScroll: to_scroll,
      touchMove: touchMove,
    };
 
    return (
      <div className={`images__slider ${className}`}>
        {list.length > limit ? (
          <button

        
            type="button"
            onClick={() => this.previous()}
            id="prev__btn"
            className={index == 0 ? 'images__slider__btn flex__center prev__btn--hidden' : "images__slider__btn flex__center"}
          >
            <figure></figure>
          </button>
        ) : (
          ""
        )}
        {console.log(list.length)}
        <Slider
        afterChange = {this.afterChange}
        ref={(c) => (this.slider = c)} {...settings}>
          {list && list.length > 0
            ? list.map((m, i) => {
                return (
                  <Slide 
                  subtractLoaded = {this.subtractLoaded}
                  handleActions = {handleActions}
                  loader = {loader}
                  submitLoadingDone = {loadingStatus ? this.submitLoadingDone : ''}
                  key = {m._id ? m._id  : i}
                  rerender = {rerender}
                  index = {i}
                  slide={m} property_name={property_name} />
                );
              })
            : ""}
        </Slider>
        {list.length > limit   ? (
          <button
            type="button"
            onClick={() => this.next()}
            id="next__btn"
            className={index + 1  >= list.length  ? 'images__slider__btn flex__center next__btn--hidden' : "images__slider__btn flex__center"}
          >
            <figure></figure>
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default ImageSlider;
