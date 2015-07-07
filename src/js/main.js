var mapView = (function(){
  return {
    init : function(){
      var self=this,
          origins= ['510 Victoria, Venice, CA'],
          destinations=['Times Square, Manhattan, NY',
            '13000 S Dakota 244, Keystone, SD 57751',
            '1600 Pennsylvania Ave NW, Washington, DC 20500',
            'Golden Gate Bridge, San Francisco, CA 94129',
            'Stonehenge, A344, Amesbury, Wiltshire SP4 7DE, United Kingdom',
            'Great Wall of China',
            'Hollywood Sign, Los Angeles, CA'],
          service = new google.maps.DistanceMatrixService();

          service.getDistanceMatrix({
            origins: origins,
            destinations: destinations,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
          }, this.parseData.bind(self));
    },
    /**
     * Loops through the response arrays to get the distance between the Origin and destination address
     * @param  {[type]} response [description]
     * @param  {[type]} status   []
     * @return {[type]}          [description]
     */
     parseData : function(response, status){
      var self=this,
          dataArr=[],
          sortedArr=[],
          origins,
          destinations,
          rows,
          distance,
          element;

      if(status=== 'OK' && response){
        origins = response.originAddresses; //This will be 1 since we only have one origin
        destinations=response.destinationAddresses; //Array of destination addresses
        rows=response.rows;
        //For each orgin, there will be a row
        for(var i=0; i<origins.length; i++){
          //Loop through each destinnation for the current row/origin
          for(var x=0; x<destinations.length;  x++){
            element=rows[i].elements[x];
            //Add only the elements that have a valid address
            if(element.status === 'OK'){
              distance=element.distance;
              dataArr.push({
                 name:destinations[x],
                 text: distance.text,
                 value: distance.value
              });
            }

          }
        }
        //Sort the data with shortest distance to the origin
        sortedArr=dataArr.sort(this.sortData.bind(this));

        //Render distance to canvas
        self.renderData(origins, sortedArr);
      }
    },

    /**
     * Sort an object by it's property, 'value'
     */
    sortData : function (a, b) {
      if(a.value>b.value){
        return 1;
      }else if(a.value < b.value){
        return -1;
      }
      return 0;
    },

    /**
     * Add horizontal strokes to show the distance between origin and the destination
     * @param  {[type]} origin       [description]
     * @param  {[type]} destinations [description]
     * @return {[type]}              [description]
     */
    renderData: function (origin, destinations) {
      var canvas=document.getElementById('canvas');

      if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),
            x=0,
            width,
            y,
            height,
            text;

        for(var i=0; i<destinations.length; i++){
            y=(i+10)*20;
            width=destinations[i].value/10000;
            ctx.font="12px sans-serif";
            ctx.strokeStyle='#05BC9D';
            ctx.lineWidth='5';
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(width, y);
            ctx.stroke();
            text=destinations[i].name + ' ('+ destinations[i].text + ')';
            ctx.fillText(text ,10, (i+9.8)*20); //Add text to each stroke
        }
      }
    }
  };
}());
