function generateSparqlQuery(category){
  bounds = map.getBounds();
  switch(category) {
    case "visual_collections":
      chunk2 = `SELECT DISTINCT ?item ?itemLabel ?location ?type ?typeLabel ?pic ?url where 
      {
        wd:P1184 wdt:P1630 ?formatterurl . 
        ?item wdt:P195 wd:Q666063 ;
              wdt:P18 ?pic .
        ?item wdt:P180 ?depicts .
        ?item wdt:P31 ?type .
        ?item wdt:P1184 ?llgc .
         SERVICE wikibase:box { ?depicts wdt:P625 ?location .
          bd:serviceParam wikibase:cornerWest "Point(${bounds.getWest()} ${bounds.getNorth()})"^^geo:wktLiteral .
          bd:serviceParam wikibase:cornerEast "Point(${bounds.getEast()} ${bounds.getSouth()})"^^geo:wktLiteral . } 
        BIND(IRI(REPLACE(?llgc, '^(.+)$', ?formatterurl)) AS ?url). 
      SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang_select}" } } LIMIT 20`;
      return sparql_2 = chunk2;
      break;
        case "place_of_birth":
          chunk2 = `SELECT  ?item ?itemLabel ?location  ?pic ?url
          (GROUP_CONCAT(?occu_label;separator=' --- ') as ?occu_combined)
          where {
          wd:P1648 wdt:P1630 ?formatterurl .
            ?item wdt:P1648 ?llgc . 
            ?item wdt:P106 ?occu .
                        ?occu rdfs:label ?occu_label . 
                      FILTER (lang(?occu_label) = "${occupation_lang}") .
            ?item wdt:P19 ?birthplace .
              SERVICE wikibase:box {
               ?birthplace wdt:P625 ?location.
               bd:serviceParam wikibase:cornerWest "Point(${bounds.getWest()} ${bounds.getNorth()})"^^geo:wktLiteral .
               bd:serviceParam wikibase:cornerEast "Point(${bounds.getEast()} ${bounds.getSouth()})"^^geo:wktLiteral . 
            } 
            OPTIONAL { ?item wdt:P18 ?pic }
            BIND(IRI(REPLACE(?llgc, '^(.+)$', ?formatterurl)) AS ?url).
          FILTER (CONTAINS(str(?url),'biog')) . 
           SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang_select}". } 
          } 
          GROUP BY  ?item ?itemLabel ?location ?pic ?url
          LIMIT 200
            `;
            return sparql_2 = chunk2
            break;
            case "place_of_death":
          chunk2 = `SELECT  ?item ?itemLabel ?location  ?pic ?url
          (GROUP_CONCAT(?occu_label;separator=' --- ') as ?occu_combined)
          where {
          wd:P1648 wdt:P1630 ?formatterurl .
            ?item wdt:P1648 ?llgc . 
            ?item wdt:P106 ?occu .
                        ?occu rdfs:label ?occu_label . 
                      FILTER (lang(?occu_label) = "${occupation_lang}") .
            ?item wdt:P20 ?deathplace .
              SERVICE wikibase:box {
               ?deathplace wdt:P625 ?location.
               bd:serviceParam wikibase:cornerWest "Point(${bounds.getWest()} ${bounds.getNorth()})"^^geo:wktLiteral .
               bd:serviceParam wikibase:cornerEast "Point(${bounds.getEast()} ${bounds.getSouth()})"^^geo:wktLiteral . 
            } 
            OPTIONAL { ?item wdt:P18 ?pic }
            BIND(IRI(REPLACE(?llgc, '^(.+)$', ?formatterurl)) AS ?url).
          FILTER (CONTAINS(str(?url),'biog')) . 
           SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang_select}". } 
          } 
          GROUP BY  ?item ?itemLabel ?location ?pic ?url
            `;
            return sparql_2 = chunk2
            break;
            case "place_of_education":
              chunk2 = `SELECT  ?item ?itemLabel ?location  ?pic ?url
              (GROUP_CONCAT(?occu_label;separator=' --- ') as ?occu_combined)
              where {
              wd:P1648 wdt:P1630 ?formatterurl .
                ?item wdt:P1648 ?llgc . 
                ?item wdt:P106 ?occu .
                            ?occu rdfs:label ?occu_label . 
                          FILTER (lang(?occu_label) = "${occupation_lang}") .
                ?item wdt:P69 ?educationplace .
                  SERVICE wikibase:box {
                   ?educationplace wdt:P625 ?location.
                   bd:serviceParam wikibase:cornerWest "Point(${bounds.getWest()} ${bounds.getNorth()})"^^geo:wktLiteral .
                   bd:serviceParam wikibase:cornerEast "Point(${bounds.getEast()} ${bounds.getSouth()})"^^geo:wktLiteral . 
                } 
                OPTIONAL { ?item wdt:P18 ?pic }
                BIND(IRI(REPLACE(?llgc, '^(.+)$', ?formatterurl)) AS ?url).
              FILTER (CONTAINS(str(?url),'biog')) . 
               SERVICE wikibase:label { bd:serviceParam wikibase:language "${lang_select}". } 
              } 
              GROUP BY  ?item ?itemLabel ?location ?pic ?url`
    default:
      // Code block
 
  }
 


  

}

function generateMarkers(map_layer, marker_name){
var counter = 0;
  map_layer.clearLayers(); // Add the toilets items to the toilets overlay
        fetch("https://query.wikidata.org/sparql?query=" + encodeURIComponent(sparql_2), {
          "headers": {
            "accept": "application/sparql-results+json"
          },
          "method": "GET",
          "mode": "cors"
        }).then(a => a.json()).then(a => {
          a.results.bindings.forEach(x => {
            if (x.location.value.match(/^Point\((.+) (.+)\)$/)) {
              var lon = parseFloat(RegExp.$1);
              var lat = parseFloat(RegExp.$2);
              if(x.pic == undefined){var image_url = "images/wikidata.png"} else {var image_url = x.pic.value}
              if(x.itemLabel == undefined){var title = ""} else {var title = x.itemLabel.value}
              if(x.occu_combined == undefined){var occupation =""} else {var occupation = occupation_select + x.occu_combined.value}
              if(x.url == undefined){var link = ""} else {var link = x.url.value}
              var html =`<h3> ${title} </h3><img src="${image_url}" width = "150px"><br /> ${occupation}<br /><a href="${link}">${view_at_nlw}</a><br /><a href="${x.item.value}"${linktext2OSM}</a><br />
              `
              
             // if (title.match(/^Q[0-9]+$/)) {
               //Do not add the point to the layer
  //} else {
             L.marker([lat, lon],{icon: marker_name}).bindPopup(html).openPopup().addTo(map_layer);
             counter++;
    //        }
            } 
    
    
            
          });

if(counter > max_markers){

   if(legend_state == 0){
    dialog.open();
   /*
    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
    let div = L.DomUtil.create("div", "description");
    L.DomEvent.disableClickPropagation(div);
    const text ="<b>Too many features</b><br/>There are too many features to display. Please zoom in and search again";
    div.insertAdjacentHTML("beforeend", text);
    return div;
    };
    */
  legend_state = 1
 // legend.addTo(map);

  } else {
    //
  } 


} else {
  //
}
        }


        );

      }


