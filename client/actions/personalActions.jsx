import axios from 'axios';
import { browserHistory } from 'react-router';
import {push} from 'react-router-redux';

import { FETCH_USER_BENTOS, FETCH_FAVORITE_BENTOS, FETCH_POPULAR_BENTOS, HANDLE_FETCH_BENTO_FOR_EDIT } from './actionTypes.js';

const personalActions = {
  handleFetchBentoForEdit: function (bento, bentoId, userId) {
  console.log(bento, bentoId, userId)
  return function(dispatch) {
    axios.get('/api/bentos', {params: {id: bentoId, user_id: userId}})
    .then((response)=>{
      console.log('line 11', response)
      var data = response.data[0];
      bento.name = data.name;
      bento.description = data.description;
      bento.bento_id = bentoId;
      bento.user_id = userId;
    })
    .then(() => {
      axios.get('/api/bentos_noris', {params: {bento_id: bentoId}})
      .then((response) => {
        console.log(response.data)
        return response.data.map((data) => {return data.nori_id})
      })
      .then((arrayNorisId) => {
        console.log(arrayNorisId)
        axios.get('/api/noris', {params: {id: arrayNorisId}})
        .then((response) => {
          var savedNorisArray = response.data.map(function(nori){
            var newNori = {Front: {image: null, text:null, soundFile: null}, Back: {image: null, text:null, soundFile: null}}
            newNori.Front.text = nori.text_front;
            newNori.Back.text = nori.text_back;
            newNori.Front.soundFile = nori.audio_url_front;
            newNori.Back.soundFile = nori.audio_url_back;
            return newNori
          })
          bento.noris = savedNorisArray;
        })
        .then(() => {
            dispatch({type: HANDLE_FETCH_BENTO_FOR_EDIT, payload: bento});
            dispatch(push('/edit'))
        })
      })
    })
  }},
  
    fetchUser: function(someData, someMoreData) {
      return function(dispatch) {
        var bentoData = [];
        var idArray = [];
        var imgArray = [];
        console.log('Calling api from userBentos with:', someData);
        // gets all bentos with particular user_id
        axios.get('/api/bentos', {
          params: { user_id: someData }
        })
        // stores all bento_ids belonging to user for use in fetchThumbnails
        .then(response => storeBentoIds(response, idArray, bentoData, true))
        // gets the thumbnails and then finally dispatch
        .then(() => fetchThumbnails(idArray, imgArray, bentoData, dispatch, 'User'));
      }
    },

    fetchFavorites: function(someData, someMoreData) {
      return function(dispatch) {
        var bentoData = [];
        var idArray = [];
        var imgArray = [];
        console.log('Calling api from favoriteBentos with:', someData);
        // get all bento_ids that are user's favorites
        axios.get('/api/labels', {
          params: {
            favorite: true,
            user_id: someData
          }
        })
        // get bento data
        .then(response => {
          console.log('getting bentos with bento_ids:', response.data);
          if (response.data.length === 0) {
            dispatch({
              type: FETCH_FAVORITE_BENTOS,
              payload: []
            });
          } else {
            return axios.get('/api/bentos', {
              params: {
                id: response.data
              }
            });
          }
        })
        // pushes bento_ids into an array for fetchThumbnails to use
        .then(response => storeBentoIds(response, idArray, bentoData))
        // gets the thumbnails and then finally dispatch
        .then(() => fetchThumbnails(idArray, imgArray, bentoData, dispatch, 'Favorites'));
      }
    },

    fetchPopular: function(someData, someMoreData) {
      return function(dispatch) {
        var bentoData = [];
        var idArray = [];
        var imgArray = [];
        console.log('Calling api from popularBentos with:', someData);
        // gets first 10 bentos with descending order of visit count
        axios.get('/api/popular')
        // pushes bento_ids into an array for fetchThumbnails to use
        .then(response => storeBentoIds(response, idArray, bentoData))
        // gets the thumbnails and then finally dispatch
        .then(() => fetchThumbnails(idArray, imgArray, bentoData, dispatch, 'Popular'));
      }
    }

}

function storeBentoIds(response, idArray, bentoData, personal) {
  if (!response) return;
  console.log('storeBentoIds has repsonse.data:', response.data);
  for (var i = 0; i < response.data.length; i++ ) {
    if (personal) {
      bentoData.push(response.data[i]);
      idArray.push(response.data[i].id);
    } else if (!response.data[i].private) {
      bentoData.push(response.data[i]);
      idArray.push(response.data[i].id);
    }
  }
  console.log('bentoData in storeBentoIds is now:', bentoData);
  console.log('idArray in storeBentoIds is now:', idArray);
}

function fetchThumbnails(idArray, imgArray, bentoData, dispatch, type) {
  console.log('idArray in fetchThumbnails:', idArray);
  console.log('bentoData in fetchThumbnails:', bentoData);
  if (idArray.length === 0) return;
  return axios.get('/api/thumbnails', {
    params: { bento_id: idArray }
  })
  .then(function(response) {
    var imgData = response.data;
    // populate the ones with images
    for (var i = 0; i < bentoData.length; i++) {
      for (var j = 0; j < imgData.length; j++) {
        if (imgData[j].bento_id === bentoData[i].id) {
          bentoData[i].img_url = imgData[j].url;
        }
      }
    }
    // dispatch to proper reducer
    if (type === 'User') {
      console.log('fetched thumbnails for Users:', bentoData);
      dispatch({
        type: FETCH_USER_BENTOS,
        payload: bentoData
      });
    } else if (type === 'Favorites') {
      dispatch({
        type: FETCH_FAVORITE_BENTOS,
        payload: bentoData
      });
    } else if (type === 'Popular') {
      dispatch({
        type: FETCH_POPULAR_BENTOS,
        payload: bentoData
      });
    } else {
      console.log('Invalid dispatch in personalActions:', type);
    }
  });
}

export default personalActions;