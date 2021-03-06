import React, { Component } from 'react';
import Carousel from 'react-slick';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import personalActions from '../../actions/personalActions.js';
import { setBentoId } from '../../actions/appActions.js';


let userId = 1;

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: 'Personal',
    }

    if (this.props.userId !== 'guest') {
      userId = this.props.userId;
    }

    this.props.fetchUser(userId);
  }

  render() {
    const settings = {
      accessibility: true,
      autoplay: false,
      className: 'slick-margin',
      dotsClass: 'slick-dots slick-thumb',
      focusOnSelect: true,
      responsive: [ { breakpoint: 550, settings: { slidesToShow: 1 } }, { breakpoint: 1100, settings: { slidesToShow: 2 } }, { breakpoint: 1500, settings: { slidesToShow: 3 } }],
      touchMove: true,
      swipe: true,
      swipeToSlide: true,
      infinite: true,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,
      touchMove: true
    };
    
    return (
      <div>
        <div className='row center-block'>
          <div className='create-title'>
            <h1 className='default-font'>{this.props.category} Bentos:</h1>
          </div>
          <div className='row buttonSection'>
            <label>Categories:</label>
            <button type='button' className='btn btn-success' onClick={() => this.props.fetchUser(userId)}>Personal</button>
            <button type='button' className='btn btn-success' onClick={() => this.props.fetchFavorites(userId)}>Favorites</button>
            <button type='button' className='btn btn-success' onClick={this.props.fetchPopular}>Popular</button>
          </div>
          <div className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-10'>
                
                {
                  this.props.bentos&&(this.props.bentos.length > 0 ) ? 

                  (<Carousel {...settings}> 
                  {this.props.bentos.map((bento, index) => (
                    <div className='thumbnail' key={index}>
                      <img src={bento.img_url ? bento.img_url : 'img/no_image.jpg'} />
                      <div className='caption'>
                        <h3>{bento.name}</h3>
                        <p className='ellipsis'>{bento.description}</p>
                        <p><label>View Count:</label> {bento.visit_count} </p>
                        <p><Link className='btn btn-primary' to={'/display'} onClick={() => this.props.setBentoId(bento.id)}>View</Link><span>   </span><Link className='btn btn-default' to={'/edit'} onClick={() => this.props.handleFetchBentoForEdit(this.props.bento, bento.id, userId)}>Edit</Link></p>
                      </div>
                    </div>
                  ))}
                  </Carousel>)
                  : (<div><h1 className='center-block'>No bentos have been made yet for this category. Go start creating!</h1></div>)
                }
              
            </div>
            <div className='col-xs-1'></div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    userId: state.appReducer.userId,
    bento: state.editBentoInfo,
    bentos: state.personalReducer.bentos,
    category: state.personalReducer.category
  }
}

export default connect(mapStateToProps, { ...personalActions, setBentoId })(User);