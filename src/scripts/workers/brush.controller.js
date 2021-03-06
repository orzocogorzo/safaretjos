import BaseController from './base-controller';
import * as _ from 'lodash';

const BrushController = (function(){

  // private code block

  let event;

  function onMouseDown( evt ) {
    // console.log( 'mousedown', evt );
    event = evt;
    _state.down = true;
    _state.up = false;

    if ( this.collection ) {
      currentFeature = this.genFeature( 'LineString' );
      index++;
    } else {
      this.genCollection();
      this.genLayer();
      currentFeature = this.genFeature( 'LineString' );
      index++;
    }
    // currentFeature = this.genFeature( 'LineString' );
    // index++;
  }

  function onMouseMove( evt ) {
    if ( _state.down ) {
      if ( !this.mapCoords ) {
        return
      }
      currentFeature.geometry.coordinates.push([ this.mapCoords.lng, this.mapCoords.lat ]);
      
      if ( index != len ) {
        this.collection.features.push( currentFeature );
        len++;
      }

      this.layer.clearLayers();
      this.layer.addData( this.collection );

    }
  }

  function onTouchMove( evt ) {
    map.dispatchEvent( new MouseEvent('mousemove', evt.touches["0"]) );
    onMouseMove.call( this );
  }

  function onMouseUp( evt ) {
    // console.log( 'mouseUp', evt );
    _state.down = false;
    _state.up = true;
    currentFeature = undefined;
  }

  const _state = {
    down: false,
    up: true
  }

  let currentFeature;
  let index = 0;
  let len = 0;

  class BrushController extends BaseController {

    constructor( options ) {
      super( options || {} );

      this.eventsCallbacks = options.eventsCallbacks || {
        "touchmove": _.throttle(( e ) => onTouchMove.bind( this )( e ), 50 ),
        "mousemove": _.throttle(( e ) => onMouseMove.bind( this )( e ), 50 ),
        "mousedown": onMouseDown.bind( this ),
        "touchstart": onMouseDown.bind( this ),
        "mouseup": onMouseUp.bind( this ),
        "touchend": onMouseUp.bind( this )
      };

      this.layerStyle = {
        "lineJoin": true,
        "weight": 10,
        "color": this.color,
        "opacity": 0.7
      }

      return this;
    }

    // unbind( ) {
    //   result = super.unbind( );
    //   // setTimeout(() => this.collection = undefined, 0);
    //   // return this.collection;
    // }

    static id() {
      return "brush-controller";
    }

  };

  return BrushController;

})();

export default BrushController;